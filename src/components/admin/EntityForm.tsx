'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { createSupabaseBrowserClient } from '@/lib/supabase/client';
import AdminShell from './AdminShell';
import FormCard, { ErrorList } from './FormCard';
import GDriveField from './GDriveField';

export type Values = Record<string, string>;

export type FieldDef =
  | {
      kind: 'text' | 'url' | 'email';
      name: string;
      label: React.ReactNode;
      required?: boolean;
      placeholder?: string;
      maxLength?: number;
    }
  | {
      kind: 'textarea';
      name: string;
      label: React.ReactNode;
      required?: boolean;
      placeholder?: string;
      maxLength?: number;
    }
  | {
      kind: 'number';
      name: string;
      label: React.ReactNode;
      required?: boolean;
      placeholder?: string;
      min?: number;
      max?: number;
    }
  | {
      kind: 'select';
      name: string;
      label: React.ReactNode;
      required?: boolean;
      options: { value: string; label: string }[];
    }
  | { kind: 'gdrive'; name: string; label: string }
  | { kind: 'row'; fields: FieldDef[] };

export type EntityFormProps = {
  table: string;
  /** Topbar heading, e.g. "Tambah Penelitian". */
  titles: { create: string; edit: string };
  /** Heading inside the form card. */
  cardTitles: { create: string; edit: string };
  backHref: string;
  fields: FieldDef[];
  editId: number | null;
  /** Initial values for a fresh form. */
  initialValues: Values;
  /** Map a database row onto form values. */
  fromRow: (row: Record<string, unknown>) => Values;
  /** Map form values onto the insert/update payload. */
  toPayload: (values: Values) => Record<string, unknown>;
  validate: (values: Values) => string[];
  /**
   * Runs after validation and before writing. Return an error string to abort.
   * Used for the staff NIM/NIP uniqueness check.
   */
  beforeSave?: (values: Values, editId: number | null) => Promise<string | null>;
};

function Field({
  def,
  values,
  set,
}: {
  def: FieldDef;
  values: Values;
  set: (name: string, value: string) => void;
}) {
  if (def.kind === 'row') {
    return (
      <div className="field-row">
        {def.fields.map((f) => (
          <Field key={'name' in f ? f.name : Math.random()} def={f} values={values} set={set} />
        ))}
      </div>
    );
  }

  if (def.kind === 'gdrive') {
    return (
      <GDriveField
        label={def.label}
        value={values[`${def.name}_raw`] ?? ''}
        onChange={(raw) => set(`${def.name}_raw`, raw)}
        onResolved={(direct) => set(def.name, direct ?? '')}
      />
    );
  }

  const id = `f_${def.name}`;
  const label = (
    <label htmlFor={id}>
      {def.label} {def.required && <span className="req">*</span>}
    </label>
  );

  if (def.kind === 'textarea') {
    return (
      <div className="field">
        {label}
        <textarea
          id={id}
          placeholder={def.placeholder}
          maxLength={def.maxLength}
          value={values[def.name] ?? ''}
          onChange={(e) => set(def.name, e.target.value)}
        />
      </div>
    );
  }

  if (def.kind === 'select') {
    return (
      <div className="field">
        {label}
        <select
          id={id}
          value={values[def.name] ?? ''}
          onChange={(e) => set(def.name, e.target.value)}
        >
          {def.options.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </div>
    );
  }

  return (
    <div className="field">
      {label}
      <input
        id={id}
        type={def.kind === 'number' ? 'number' : def.kind === 'url' ? 'url' : def.kind}
        placeholder={def.placeholder}
        maxLength={'maxLength' in def ? def.maxLength : undefined}
        min={def.kind === 'number' ? def.min : undefined}
        max={def.kind === 'number' ? def.max : undefined}
        autoComplete="off"
        value={values[def.name] ?? ''}
        onChange={(e) => set(def.name, e.target.value)}
      />
    </div>
  );
}

/**
 * Shared create/edit form for the admin CRUD tables. Entities differ only in
 * their fields and payload mapping, so those are passed in rather than
 * duplicated across four near-identical pages.
 */
export default function EntityForm({
  table,
  titles,
  cardTitles,
  backHref,
  fields,
  editId,
  initialValues,
  fromRow,
  toPayload,
  validate,
  beforeSave,
}: EntityFormProps) {
  const router = useRouter();
  const supabase = useMemo(() => createSupabaseBrowserClient(), []);

  const [values, setValues] = useState<Values>(initialValues);
  const [errors, setErrors] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(editId !== null);

  const set = useCallback((name: string, value: string) => {
    // Bail out when nothing changed so repeat writes (e.g. the GDrive field
    // re-reporting the same resolved URL) don't trigger another render.
    setValues((v) => (v[name] === value ? v : { ...v, [name]: value }));
  }, []);

  useEffect(() => {
    if (editId === null) return;

    let cancelled = false;
    (async () => {
      const { data, error } = await supabase.from(table).select('*').eq('id', editId).single();
      if (cancelled) return;

      if (error || !data) {
        router.replace(backHref);
        return;
      }
      setValues(fromRow(data as Record<string, unknown>));
      setLoading(false);
    })();

    return () => {
      cancelled = true;
    };
    // fromRow is defined inline by callers; re-running on identity changes
    // would refetch on every render, so it is intentionally not a dependency.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editId, table, supabase, router, backHref]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const problems = validate(values);
    if (problems.length) {
      setErrors(problems);
      return;
    }

    setErrors([]);
    setSaving(true);

    if (beforeSave) {
      const message = await beforeSave(values, editId);
      if (message) {
        setSaving(false);
        setErrors([message]);
        return;
      }
    }

    const payload = toPayload(values);
    const { error } =
      editId !== null
        ? await supabase.from(table).update(payload).eq('id', editId)
        : await supabase.from(table).insert([payload]);

    if (error) {
      setSaving(false);
      setErrors(['Gagal menyimpan: ' + error.message]);
      return;
    }

    router.push(`${backHref}?msg=${editId !== null ? 'updated' : 'added'}`);
    router.refresh();
  }

  const isEdit = editId !== null;

  return (
    <AdminShell
      title={isEdit ? titles.edit : titles.create}
      actions={
        <Link href={backHref} className="btn btn-ghost">
          ← Kembali
        </Link>
      }
    >
      <ErrorList errors={errors} />

      <form onSubmit={handleSubmit}>
        <FormCard
          title={isEdit ? cardTitles.edit : cardTitles.create}
          footer={
            <>
              <Link href={backHref} className="btn btn-ghost">
                Batal
              </Link>
              <button className="btn btn-green" type="submit" disabled={saving || loading}>
                {saving ? 'Menyimpan…' : 'Simpan'}
              </button>
            </>
          }
        >
          {fields.map((def, i) => (
            <Field key={'name' in def ? def.name : `row-${i}`} def={def} values={values} set={set} />
          ))}
        </FormCard>
      </form>
    </AdminShell>
  );
}
