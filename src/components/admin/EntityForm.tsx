'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { createSupabaseBrowserClient } from '@/lib/supabase/client';
import AdminShell from './AdminShell';
import FormCard, { ErrorList } from './FormCard';
import GDriveField from './GDriveField';
import { uniqueSlug } from './uniqueSlug';
import { slugOf, parsePeople } from '@/lib/utils';
import { revalidatePublic, type RevalidateEntity } from './revalidate';

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
  /** Satu nama dosen/staf, dipilih dari tabel staff. */
  | { kind: 'person'; name: string; label: React.ReactNode; required?: boolean }
  /** Beberapa nama dosen/staf sekaligus, disimpan dipisah koma. */
  | { kind: 'people'; name: string; label: React.ReactNode; hint?: string }
  | { kind: 'row'; fields: FieldDef[] };

export type EntityFormProps = {
  table: RevalidateEntity;
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
  /**
   * Field whose value becomes the row's URL slug. When set, a unique slug is
   * generated and merged into the payload on every save, so the public route
   * can address the row by name instead of by id.
   */
  slugFrom?: { field: string; table: 'news' | 'penelitian'; fallback?: string };
};

function Field({
  def,
  values,
  set,
  staff,
}: {
  def: FieldDef;
  values: Values;
  set: (name: string, value: string) => void;
  /** Nama dosen & staf terdaftar, untuk field 'person' dan 'people'. */
  staff: string[];
}) {
  if (def.kind === 'row') {
    return (
      <div className="field-row">
        {def.fields.map((f) => (
          <Field
            key={'name' in f ? f.name : Math.random()}
            def={f}
            values={values}
            set={set}
            staff={staff}
          />
        ))}
      </div>
    );
  }

  // Satu nama, dipilih dari daftar — bukan diketik ulang. Mengetik manual
  // menghasilkan ejaan gelar yang berbeda-beda ("S.T., M.T." vs "ST. MT."),
  // dan situs lalu menganggapnya dua orang berbeda.
  if (def.kind === 'person') {
    const current = values[def.name] ?? '';
    const known = current && staff.includes(current);
    return (
      <div className="field">
        <label htmlFor={`f_${def.name}`}>
          {def.label} {def.required && <span className="req">*</span>}
        </label>
        <select
          id={`f_${def.name}`}
          value={known ? current : ''}
          onChange={(e) => set(def.name, e.target.value)}
        >
          <option value="">— Pilih dosen —</option>
          {staff.map((n) => (
            <option key={n} value={n}>
              {n}
            </option>
          ))}
        </select>
        {current && !known && (
          <span className="form-hint">
            Tersimpan: “{current}” — nama ini tidak ada di daftar staf. Pilih penggantinya, atau
            tambahkan orangnya lewat menu Staf &amp; Alumni.
          </span>
        )}
      </div>
    );
  }

  // Beberapa nama sekaligus. Disimpan sebagai satu string dipisah koma, sama
  // seperti sebelumnya, jadi data lama tetap terbaca.
  if (def.kind === 'people') {
    // parsePeople, bukan split(','): nama dosen mengandung koma di dalam
    // gelarnya ("Dr. Rizki Purnaini, S.T., M.T."), sedangkan penyimpanannya
    // juga dipisah koma. Memecah mentah membuat satu nama jadi tiga potongan,
    // sehingga tidak ada kapsul yang pernah tampak terpilih dan klik kedua
    // tidak bisa membatalkannya.
    const chosen = parsePeople(values[def.name]);

    const toggle = (name: string) => {
      const next = chosen.includes(name)
        ? chosen.filter((n) => n !== name)
        : [...chosen, name];
      set(def.name, next.join(', '));
    };

    return (
      <div className="field">
        <label>
          {def.label}
          {chosen.length > 0 && <span className="people-count">{chosen.length} dipilih</span>}
        </label>
        <div className="people-picker">
          {staff.map((n) => {
            const on = chosen.includes(n);
            return (
              <button
                type="button"
                key={n}
                className={`people-chip${on ? ' on' : ''}`}
                aria-pressed={on}
                title={on ? 'Klik untuk melepas' : 'Klik untuk menambah'}
                onClick={() => toggle(n)}
              >
                {on && <span className="people-chip-tick">✓</span>}
                {n}
              </button>
            );
          })}
        </div>
        {chosen.filter((n) => !staff.includes(n)).length > 0 && (
          <span className="form-hint">
            Tersimpan di luar daftar staf: {chosen.filter((n) => !staff.includes(n)).join(', ')}
          </span>
        )}
        {def.hint && <span className="form-hint">{def.hint}</span>}
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
  slugFrom,
}: EntityFormProps) {
  const router = useRouter();
  const supabase = useMemo(() => createSupabaseBrowserClient(), []);

  const [values, setValues] = useState<Values>(initialValues);
  const [errors, setErrors] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(editId !== null);

  /**
   * Nama dosen & staf terdaftar, untuk field 'person' dan 'people'.
   * Diambil sekali per form, dan hanya kalau ada field yang memakainya.
   */
  const [staff, setStaff] = useState<string[]>([]);

  /** Slug the row had when the form opened, so a rename can purge it too. */
  const previousSlug = useRef<string>('');

  const set = useCallback((name: string, value: string) => {
    // Bail out when nothing changed so repeat writes (e.g. the GDrive field
    // re-reporting the same resolved URL) don't trigger another render.
    setValues((v) => (v[name] === value ? v : { ...v, [name]: value }));
  }, []);

  const needsStaff = useMemo(() => {
    const walk = (defs: FieldDef[]): boolean =>
      defs.some((d) =>
        d.kind === 'row' ? walk(d.fields) : d.kind === 'person' || d.kind === 'people'
      );
    return walk(fields);
  }, [fields]);

  useEffect(() => {
    if (!needsStaff) return;

    let cancelled = false;
    (async () => {
      // Alumni tidak ikut: yang meneliti atas nama prodi hanya dosen dan staf.
      const { data } = await supabase
        .from('staff')
        .select('name, type')
        .in('type', ['dosen', 'staf'])
        .order('name', { ascending: true });

      if (cancelled) return;
      setStaff(
        (data ?? [])
          .map((r: { name: string | null }) => (r.name ?? '').trim())
          .filter(Boolean)
      );
    })();

    return () => {
      cancelled = true;
    };
  }, [needsStaff, supabase]);

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
      const row = data as Record<string, unknown>;
      if (slugFrom && typeof row.title === 'string') {
        previousSlug.current = slugOf({
          id: Number(row.id),
          title: row.title,
          slug: typeof row.slug === 'string' ? row.slug : null,
        });
      }
      setValues(fromRow(row));
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

    if (slugFrom) {
      payload.slug = await uniqueSlug(
        supabase,
        slugFrom.table,
        values[slugFrom.field] ?? '',
        editId,
        slugFrom.fallback
      );
    }
    const { error } =
      editId !== null
        ? await supabase.from(table).update(payload).eq('id', editId)
        : await supabase.from(table).insert([payload]);

    if (error) {
      setSaving(false);
      setErrors(['Gagal menyimpan: ' + error.message]);
      return;
    }

    // Drop the cached public pages so the change is live immediately rather
    // than after the 60-second ISR window. When the row has a detail page, its
    // own address is named too — both the new slug and, on a rename, the one
    // it used to answer on.
    const detail: string[] = [];
    if (slugFrom && typeof payload.slug === 'string') {
      detail.push(`/${slugFrom.table === 'news' ? 'berita' : 'penelitian'}/${payload.slug}`);
      if (previousSlug.current && previousSlug.current !== payload.slug) {
        detail.push(
          `/${slugFrom.table === 'news' ? 'berita' : 'penelitian'}/${previousSlug.current}`
        );
      }
    }
    await revalidatePublic(table, detail);

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
            <Field
              key={'name' in def ? def.name : `row-${i}`}
              def={def}
              values={values}
              set={set}
              staff={staff}
            />
          ))}
        </FormCard>
      </form>
    </AdminShell>
  );
}
