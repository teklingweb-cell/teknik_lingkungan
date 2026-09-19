'use client';

import type { HomePoster } from '@/lib/types';
import AdminList, { type Column } from './AdminList';
import EntityForm, { type FieldDef } from './EntityForm';

export function PosterAdminList({ flash }: { flash?: string }) {
  const columns: Column<HomePoster>[] = [
    {
      header: 'Poster',
      cell: (item) => (
        /* eslint-disable-next-line @next/next/no-img-element */
        <img src={item.image_url} alt="" style={{ width: 92, height: 48, objectFit: 'cover', borderRadius: 6 }} />
      ),
    },
    { header: 'Judul / Alt', cell: (item) => item.title || 'Poster beranda' },
    {
      header: 'Tautan', hideMobile: true,
      cell: (item) => <a href={item.link_url} target="_blank" rel="noopener noreferrer" className="btn btn-ghost btn-sm">Buka tautan</a>,
    },
  ];
  return <AdminList<HomePoster> table="home_posters" title="Poster Beranda" cardTitle="Carousel Poster" addHref="/admin/poster-form" addLabel="Tambah Poster" editHref={(row) => `/admin/poster-form?edit=${row.id}`} orderBy={{ column: 'created_at', ascending: false }} columns={columns} searchFields={(item) => [item.title, item.link_url]} searchPlaceholder="Cari judul atau tautan…" labelOf={(item) => item.title || 'poster ini'} deleteTitle="Hapus Poster?" emptyTitle="Belum ada poster" emptySub="Tambahkan poster untuk menampilkannya di beranda." flash={flash} />;
}

export function PosterForm({ editId }: { editId: number | null }) {
  const fields: FieldDef[] = [
    { kind: 'gdrive', name: 'image_url', label: 'Gambar Poster', folder: 'posters' },
    { kind: 'url', name: 'link_url', label: 'Tautan Tujuan', required: true, maxLength: 500 },
    { kind: 'text', name: 'title', label: 'Judul / teks alternatif', maxLength: 160 },
  ];
  return <EntityForm table="home_posters" titles={{ create: 'Tambah Poster', edit: 'Edit Poster' }} cardTitles={{ create: 'Poster Beranda', edit: 'Poster Beranda' }} backHref="/admin/posters" editId={editId} fields={fields} initialValues={{ image_url: '', image_url_raw: '', link_url: '', title: '' }} fromRow={(row) => ({ image_url: String(row.image_url ?? ''), image_url_raw: String(row.image_url ?? ''), link_url: String(row.link_url ?? ''), title: String(row.title ?? '') })} toPayload={(v) => ({ image_url: v.image_url.trim(), link_url: v.link_url.trim(), title: v.title.trim() || null })} validate={(v) => { const errors: string[] = []; if (!v.image_url.trim()) errors.push('Gambar poster wajib dipilih atau diberi tautan.'); if (!v.link_url.trim()) errors.push('Tautan tujuan wajib diisi.'); return errors; }} />;
}
