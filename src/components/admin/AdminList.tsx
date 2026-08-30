'use client';

import Link from 'next/link';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { createSupabaseBrowserClient } from '@/lib/supabase/client';
import AdminShell from './AdminShell';
import DeleteModal from './DeleteModal';
import EmptyState from './EmptyState';
import SearchBox from './SearchBox';
import { AlertBox, useAlert } from './useAlert';
import { revalidatePublic, type RevalidateEntity } from './revalidate';
import { slugOf } from '@/lib/utils';

export type Column<T> = {
  header: React.ReactNode;
  cell: (row: T) => React.ReactNode;
  hideMobile?: boolean;
  headerStyle?: React.CSSProperties;
  cellStyle?: React.CSSProperties;
};

export type Filter = { value: string; label: string };

type Row = { id: number | string };

export type AdminListProps<T extends Row> = {
  /** Supabase table name. Narrowed so the cache purge below cannot be
      handed a table with no public pages. */
  table: RevalidateEntity;
  /** Topbar heading. */
  title: string;
  /** Heading inside the card. */
  cardTitle: string;
  addHref: string;
  addLabel: string;
  editHref: (row: T) => string;
  orderBy: { column: string; ascending: boolean };
  columns: Column<T>[];
  /** Values searched by the search box. */
  searchFields: (row: T) => unknown[];
  searchPlaceholder?: string;
  /** Human label for a row, used in the delete confirmation. */
  labelOf: (row: T) => string;
  deleteTitle: string;
  emptyTitle: string;
  emptySub?: string;
  /** Optional chip filter shown above the table. */
  filterChips?: { options: Filter[]; matches: (row: T, value: string) => boolean };
  /** ?msg= value carried back from the form pages. */
  flash?: string;
  flashMessages?: { added: string; updated: string };
};

const DEFAULT_FLASH = {
  added: '✓ Data berhasil ditambahkan.',
  updated: '✓ Data berhasil diperbarui.',
};

/**
 * Shared list screen for the admin CRUD tables. Each entity differs only in its
 * columns, ordering and search fields, so those are passed in rather than
 * duplicated — the static site had five near-identical copies of this page.
 */
export default function AdminList<T extends Row>({
  table,
  title,
  cardTitle,
  addHref,
  addLabel,
  editHref,
  orderBy,
  columns,
  searchFields,
  searchPlaceholder = 'Cari…',
  labelOf,
  deleteTitle,
  emptyTitle,
  emptySub,
  filterChips,
  flash,
  flashMessages = DEFAULT_FLASH,
}: AdminListProps<T>) {
  const supabase = useMemo(() => createSupabaseBrowserClient(), []);
  const { alert, show } = useAlert();

  const [rows, setRows] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [chip, setChip] = useState(filterChips?.options[0]?.value ?? 'all');
  const [deleteTarget, setDeleteTarget] = useState<T | null>(null);
  const [deleting, setDeleting] = useState(false);

  const load = useCallback(async () => {
    const { data, error } = await supabase
      .from(table)
      .select('*')
      .order(orderBy.column, { ascending: orderBy.ascending });

    if (error) {
      show('error', 'Gagal memuat data: ' + error.message);
      setLoading(false);
      return;
    }
    setRows((data ?? []) as T[]);
    setLoading(false);
  }, [supabase, table, orderBy.column, orderBy.ascending, show]);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    if (flash === 'added') show('success', flashMessages.added);
    if (flash === 'updated') show('success', flashMessages.updated);
  }, [flash, flashMessages, show]);

  const q = query.trim().toLowerCase();
  const view = rows
    .filter((row) => (filterChips ? filterChips.matches(row, chip) : true))
    .filter((row) =>
      !q ? true : searchFields(row).some((v) => String(v ?? '').toLowerCase().includes(q))
    );

  async function handleDelete() {
    if (!deleteTarget) return;
    const deleted = deleteTarget;
    setDeleting(true);

    // .select() makes Supabase return the deleted rows. Without it an RLS
    // denial is indistinguishable from success: DELETE filters non-permitted
    // rows out rather than raising, so zero rows would go by unnoticed.
    const { data, error } = await supabase
      .from(table)
      .delete()
      .eq('id', deleteTarget.id)
      .select();

    setDeleting(false);
    setDeleteTarget(null);

    if (error) {
      show('error', 'Gagal menghapus: ' + error.message);
      return;
    }
    if (!data?.length) {
      show('error', 'Gagal menghapus: tidak punya izin atau data sudah terhapus.');
      return;
    }

    show('success', '✓ Berhasil dihapus.');
    // Drop the cached public pages so the row disappears from the site now,
    // not up to a minute later. Penelitian also has a detail page, named here
    // so it stops resolving immediately.
    const detail =
      table === 'penelitian' && 'title' in deleted
        ? [`/penelitian/${slugOf(deleted as { id: number; title: string; slug?: string | null })}`]
        : [];
    await revalidatePublic(table, detail);
    await load();
  }

  return (
    <AdminShell
      title={title}
      actions={
        <Link href={addHref} className="btn btn-green">
          <svg
            width="14"
            height="14"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            viewBox="0 0 24 24"
          >
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          {addLabel}
        </Link>
      }
    >
      <AlertBox alert={alert} />

      {filterChips && (
        <div className="filter-bar">
          {filterChips.options.map((f) => (
            <button
              key={f.value}
              className={`filter-chip${chip === f.value ? ' active' : ''}`}
              onClick={() => setChip(f.value)}
            >
              {f.label}
            </button>
          ))}
        </div>
      )}

      <div className="card">
        <div className="card-header">
          <span className="card-title">{cardTitle}</span>
          <SearchBox value={query} onChange={setQuery} placeholder={searchPlaceholder} />
          <span className="card-count">
            {loading
              ? 'memuat…'
              : q || (filterChips && chip !== filterChips.options[0]?.value)
                ? `${view.length} dari ${rows.length} item`
                : `${rows.length} item`}
          </span>
        </div>

        {loading ? (
          <div style={{ padding: 24 }}>
            <div className="skeleton" style={{ height: 44, marginBottom: 8 }} />
            <div className="skeleton" style={{ height: 44, marginBottom: 8 }} />
            <div className="skeleton" style={{ height: 44 }} />
          </div>
        ) : !rows.length ? (
          <EmptyState title={emptyTitle} sub={emptySub} />
        ) : !view.length ? (
          <EmptyState
            icon="🔍"
            title={q ? `Tidak ada hasil untuk “${query}”` : 'Tidak ada hasil'}
          />
        ) : (
          <div style={{ overflowX: 'auto', borderRadius: '0 0 14px 14px' }}>
            <table>
              <thead>
                <tr>
                  {columns.map((col, i) => (
                    <th
                      key={i}
                      className={col.hideMobile ? 'hide-mobile' : undefined}
                      style={col.headerStyle}
                    >
                      {col.header}
                    </th>
                  ))}
                  <th style={{ textAlign: 'right' }}>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {view.map((row) => (
                  <tr key={row.id}>
                    {columns.map((col, i) => (
                      <td
                        key={i}
                        className={col.hideMobile ? 'hide-mobile' : undefined}
                        style={col.cellStyle}
                      >
                        {col.cell(row)}
                      </td>
                    ))}
                    <td>
                      <div className="actions-cell">
                        <Link href={editHref(row)} className="btn btn-ghost btn-sm">
                          Edit
                        </Link>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => setDeleteTarget(row)}
                        >
                          Hapus
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <DeleteModal
        open={!!deleteTarget}
        title={deleteTitle}
        body={deleteTarget ? `Hapus "${labelOf(deleteTarget)}"?` : ''}
        busy={deleting}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
      />
    </AdminShell>
  );
}

/** Small coloured pill used across the admin tables. */
export function Badge({ color, children }: { color: string; children: React.ReactNode }) {
  return (
    <span className="badge" style={{ background: `${color}18`, color }}>
      {children}
    </span>
  );
}
