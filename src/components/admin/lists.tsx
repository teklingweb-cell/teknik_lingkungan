'use client';

import type { Mitra, Pencapaian, Penelitian, Staff } from '@/lib/types';
import AdminList, { Badge, type Column } from './AdminList';

const muted: React.CSSProperties = { color: 'var(--muted)' };

function truncate(s: string | null, n: number): string {
  const v = String(s ?? '');
  return v.length > n ? `${v.substring(0, n)}…` : v;
}

function initialOf(name: string | null): string {
  return (name || '?')[0].toUpperCase();
}

/* ─────────────────────────── Pencapaian ─────────────────────────── */

const PENCAPAIAN_COLORS: Record<string, string> = {
  Riset: '#2563eb',
  Akreditasi: '#16a34a',
  Prestasi: '#d97706',
  Hibah: '#9333ea',
  Ranking: '#0891b2',
  Lainnya: '#6b7a6c',
};

export function PencapaianList({ flash }: { flash?: string }) {
  const columns: Column<Pencapaian>[] = [
    {
      header: '',
      headerStyle: { width: 44 },
      cellStyle: { width: 44 },
      cell: (item) => {
        const color = PENCAPAIAN_COLORS[item.category] ?? '#6b7a6c';
        return (
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: 8,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: `${color}18`,
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke={color}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="8" r="6" />
              <path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11" />
            </svg>
          </div>
        );
      },
    },
    {
      header: 'Judul',
      cell: (item) => (
        <>
          <div style={{ fontWeight: 500, color: 'var(--navy)', maxWidth: 300 }}>{item.title}</div>
          <div style={{ fontSize: '0.75rem', ...muted, marginTop: 2, maxWidth: 300 }}>
            {truncate(item.description, 80)}
          </div>
        </>
      ),
    },
    {
      header: 'Kategori',
      hideMobile: true,
      cell: (item) => (
        <Badge color={PENCAPAIAN_COLORS[item.category] ?? '#6b7a6c'}>{item.category}</Badge>
      ),
    },
    {
      header: 'Tahun',
      hideMobile: true,
      cellStyle: { ...muted, fontWeight: 500 },
      cell: (item) => item.year,
    },
  ];

  return (
    <AdminList<Pencapaian>
      table="pencapaian"
      title="Manajemen Pencapaian"
      cardTitle="Daftar Pencapaian"
      addHref="/admin/pencapaian-form"
      addLabel="Tambah Pencapaian"
      editHref={(row) => `/admin/pencapaian-form?edit=${row.id}`}
      orderBy={{ column: 'year', ascending: false }}
      columns={columns}
      searchFields={(item) => [item.title, item.description, item.category, item.year]}
      searchPlaceholder="Cari judul, deskripsi, kategori…"
      labelOf={(item) => item.title}
      deleteTitle="Hapus Pencapaian?"
      emptyTitle="Belum ada pencapaian"
      flash={flash}
      flashMessages={{
        added: '✓ Pencapaian berhasil ditambahkan.',
        updated: '✓ Pencapaian berhasil diperbarui.',
      }}
    />
  );
}

/* ─────────────────────────── Penelitian ─────────────────────────── */

const PENELITIAN_COLORS: Record<string, string> = {
  'Sains & Teknologi': '#2563eb',
  Lingkungan: '#16a34a',
  Kesehatan: '#dc2626',
  'Sosial & Humaniora': '#9333ea',
  Ekonomi: '#d97706',
};

export function PenelitianAdminList({ flash }: { flash?: string }) {
  const columns: Column<Penelitian>[] = [
    {
      header: 'Judul / Peneliti',
      cell: (item) => (
        <>
          <div style={{ fontWeight: 500, color: 'var(--navy)', maxWidth: 280 }}>{item.title}</div>
          <div style={{ fontSize: '0.75rem', ...muted, marginTop: 2 }}>{item.author}</div>
        </>
      ),
    },
    {
      header: 'Kategori',
      hideMobile: true,
      cell: (item) => (
        <Badge color={PENELITIAN_COLORS[item.category] ?? '#6b7a6c'}>{item.category}</Badge>
      ),
    },
    { header: 'Tahun', hideMobile: true, cellStyle: muted, cell: (item) => item.year },
    {
      header: 'Dana',
      hideMobile: true,
      cellStyle: { fontWeight: 500 },
      cell: (item) => item.funding || '–',
    },
    {
      header: 'Status',
      hideMobile: true,
      cell: (item) => {
        const active = item.status === 'Aktif';
        return (
          <span
            className="badge"
            style={{
              background: active ? '#f0fdf4' : '#fffbeb',
              color: active ? '#16a34a' : '#d97706',
            }}
          >
            {item.status}
          </span>
        );
      },
    },
  ];

  return (
    <AdminList<Penelitian>
      table="penelitian"
      title="Manajemen Penelitian"
      cardTitle="Daftar Penelitian"
      addHref="/admin/penelitian-form"
      addLabel="Tambah Penelitian"
      editHref={(row) => `/admin/penelitian-form?edit=${row.id}`}
      orderBy={{ column: 'year', ascending: false }}
      columns={columns}
      searchFields={(item) => [
        item.title,
        item.author,
        item.category,
        item.status,
        item.funding,
        item.year,
      ]}
      searchPlaceholder="Cari judul, peneliti, kategori…"
      labelOf={(item) => item.title}
      deleteTitle="Hapus Penelitian?"
      emptyTitle="Belum ada penelitian"
      flash={flash}
      flashMessages={{
        added: '✓ Penelitian berhasil ditambahkan.',
        updated: '✓ Penelitian berhasil diperbarui.',
      }}
    />
  );
}

/* ───────────────────────────── Mitra ───────────────────────────── */

const MITRA_COLORS: Record<string, string> = {
  Industri: '#2563eb',
  Akademik: '#16a34a',
  Pemerintah: '#d97706',
  Internasional: '#9333ea',
};

export function MitraAdminList({ flash }: { flash?: string }) {
  const columns: Column<Mitra>[] = [
    {
      header: 'Nama',
      cell: (item) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div className="partner-avatar">{initialOf(item.name)}</div>
          <div>
            <div style={{ fontWeight: 500, color: 'var(--navy)' }}>{item.name}</div>
            <div style={{ fontSize: '0.75rem', ...muted, maxWidth: 280 }}>
              {truncate(item.description, 60)}
            </div>
          </div>
        </div>
      ),
    },
    {
      header: 'Kategori',
      hideMobile: true,
      cell: (item) => <Badge color={MITRA_COLORS[item.category] ?? '#6b7a6c'}>{item.category}</Badge>,
    },
    {
      header: 'Sejak',
      hideMobile: true,
      cellStyle: muted,
      cell: (item) => `Sejak ${item.since_year ?? '–'}`,
    },
    {
      header: 'Website',
      hideMobile: true,
      cell: (item) =>
        item.website_url ? (
          <a
            href={item.website_url}
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: 'var(--green)', fontSize: '0.78rem' }}
          >
            Website →
          </a>
        ) : (
          <span style={muted}>–</span>
        ),
    },
  ];

  return (
    <AdminList<Mitra>
      table="mitra"
      title="Manajemen Mitra"
      cardTitle="Daftar Mitra"
      addHref="/admin/mitra-form"
      addLabel="Tambah Mitra"
      editHref={(row) => `/admin/mitra-form?edit=${row.id}`}
      orderBy={{ column: 'since_year', ascending: true }}
      columns={columns}
      searchFields={(item) => [
        item.name,
        item.category,
        item.description,
        item.since_year,
        item.website_url,
      ]}
      searchPlaceholder="Cari nama, kategori, deskripsi…"
      labelOf={(item) => item.name}
      deleteTitle="Hapus Mitra?"
      emptyTitle="Belum ada mitra"
      flash={flash}
      flashMessages={{
        added: '✓ Mitra berhasil ditambahkan.',
        updated: '✓ Mitra berhasil diperbarui.',
      }}
    />
  );
}

/* ───────────────────────────── Staff ───────────────────────────── */

const TYPE_COLORS: Record<string, string> = {
  dosen: '#2563eb',
  alumni: '#16a34a',
  staf: '#9333ea',
};

const TYPE_LABELS: Record<string, string> = {
  dosen: 'Dosen',
  alumni: 'Alumni',
  staf: 'Staf',
};

const ORG_LEVELS: Record<string, { label: string; color: string }> = {
  rektor: { label: 'Rektor', color: '#1a2e1e' },
  wakil: { label: 'Wakil Rektor', color: '#2d6a40' },
  dekan: { label: 'Dekan', color: '#4e8c5a' },
  dosen: { label: 'Dosen/Prof.', color: '#2563eb' },
  staf: { label: 'Staf Admin', color: '#9333ea' },
};

export function StaffAdminList({ flash }: { flash?: string }) {
  const columns: Column<Staff>[] = [
    {
      header: 'Nama',
      cell: (item) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div className="avatar-circle">{initialOf(item.name)}</div>
          <div>
            <div style={{ fontWeight: 500, color: 'var(--navy)' }}>{item.name}</div>
            <div style={{ fontSize: '0.75rem', ...muted }}>
              {item.position} · {item.bidang}
            </div>
          </div>
        </div>
      ),
    },
    {
      header: 'Tipe',
      hideMobile: true,
      cell: (item) => (
        <Badge color={TYPE_COLORS[item.type] ?? '#6b7a6c'}>
          {TYPE_LABELS[item.type] ?? item.type}
        </Badge>
      ),
    },
    {
      header: 'NIP / NIM',
      hideMobile: true,
      cellStyle: { ...muted, fontSize: '0.78rem', fontFamily: 'monospace' },
      cell: (item) => item.nim_nip || '–',
    },
    {
      header: (
        <a
          href="/admin/struktur"
          style={{ color: 'var(--green)', textDecoration: 'none', fontSize: '0.68rem' }}
          title="Kelola di halaman Struktur Organisasi"
        >
          Bagan Org ↗
        </a>
      ),
      hideMobile: true,
      cell: (item) => {
        const level = item.org_level ? ORG_LEVELS[item.org_level] : undefined;
        if (!level) {
          return <span style={{ ...muted, fontSize: '0.72rem' }}>—</span>;
        }
        return <Badge color={level.color}>{level.label}</Badge>;
      },
    },
    {
      header: 'Publikasi',
      hideMobile: true,
      cellStyle: muted,
      cell: (item) => `${item.publications_count ?? 0} pub`,
    },
    {
      header: 'Email',
      hideMobile: true,
      cellStyle: { ...muted, fontSize: '0.78rem' },
      cell: (item) => item.email || '–',
    },
  ];

  return (
    <AdminList<Staff>
      table="staff"
      title="Manajemen Staf & Alumni"
      cardTitle="Daftar Staf & Alumni"
      addHref="/admin/staff-form"
      addLabel="Tambah Data"
      editHref={(row) => `/admin/staff-form?edit=${row.id}`}
      orderBy={{ column: 'created_at', ascending: false }}
      columns={columns}
      searchFields={(item) => [
        item.name,
        item.position,
        item.bidang,
        item.type,
        item.email,
        item.nim_nip,
        item.org_level,
        item.graduation_year,
      ]}
      searchPlaceholder="Cari nama, posisi, NIP/NIM…"
      labelOf={(item) => item.name}
      deleteTitle="Hapus Data?"
      emptyTitle="Belum ada data staf"
      filterChips={{
        options: [
          { value: 'all', label: 'Semua' },
          { value: 'dosen', label: 'Dosen' },
          { value: 'alumni', label: 'Alumni' },
          { value: 'staf', label: 'Staf' },
        ],
        matches: (row, value) => value === 'all' || row.type === value,
      }}
      flash={flash}
    />
  );
}
