'use client';

import type { Mitra, Pencapaian, Penelitian, Staff } from '@/lib/types';
import { formatDateShort } from '@/lib/utils';
import {
  MITRA_CATEGORY_COLORS,
  MITRA_JENIS_COLORS,
  isAktif,
  jenisLabel,
} from '@/lib/mitra';
import { PENCAPAIAN_COLORS, TINGKAT_COLORS } from '@/lib/pencapaian';
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
          <div style={{ fontWeight: 500, color: 'var(--navy)', maxWidth: 320 }}>{item.title}</div>
          <div style={{ fontSize: '0.75rem', ...muted, marginTop: 2, maxWidth: 320 }}>
            {[item.hasil, item.nama_pelaku].filter(Boolean).join(' · ') ||
              truncate(item.description, 80)}
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
      header: 'Pelaku',
      hideMobile: true,
      cellStyle: muted,
      cell: (item) => [item.pelaku, item.jenis].filter(Boolean).join(' · ') || '–',
    },
    {
      header: 'Tingkat',
      hideMobile: true,
      cell: (item) =>
        item.tingkat ? (
          <Badge color={TINGKAT_COLORS[item.tingkat] ?? '#6b7a6c'}>{item.tingkat}</Badge>
        ) : (
          <span style={muted}>–</span>
        ),
    },
    {
      header: 'Waktu',
      cellStyle: { ...muted, fontWeight: 500 },
      // Sheet 4j tidak punya tanggal, hanya tahun — jadi tahun yang jadi
      // pengganti, bukan tanda pisah kosong.
      cell: (item) => (item.tanggal ? formatDateShort(item.tanggal) : item.year),
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
      searchFields={(item) => [
        item.title,
        item.description,
        item.category,
        item.hasil,
        item.pelaku,
        item.jenis,
        item.tingkat,
        item.nama_pelaku,
        item.bidang,
        item.year,
      ]}
      searchPlaceholder="Cari judul, hasil, nama dosen, tingkat…"
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

export function MitraAdminList({ flash }: { flash?: string }) {
  const columns: Column<Mitra>[] = [
    {
      header: 'Lembaga Mitra',
      cell: (item) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div className="partner-avatar">{initialOf(item.name)}</div>
          <div>
            <div style={{ fontWeight: 500, color: 'var(--navy)' }}>{item.name}</div>
            <div style={{ fontSize: '0.75rem', ...muted, maxWidth: 320 }}>
              {truncate(item.judul_kegiatan ?? item.description, 70)}
            </div>
          </div>
        </div>
      ),
    },
    {
      header: 'Jenis',
      hideMobile: true,
      cell: (item) =>
        item.jenis_kerjasama ? (
          <Badge color={MITRA_JENIS_COLORS[item.jenis_kerjasama] ?? '#6b7a6c'}>
            {jenisLabel(item.jenis_kerjasama)}
          </Badge>
        ) : (
          <span style={muted}>–</span>
        ),
    },
    {
      header: 'Kategori',
      hideMobile: true,
      cell: (item) => (
        <Badge color={MITRA_CATEGORY_COLORS[item.category] ?? '#6b7a6c'}>{item.category}</Badge>
      ),
    },
    {
      header: 'Tingkat',
      hideMobile: true,
      cellStyle: muted,
      cell: (item) => item.tingkat ?? '–',
    },
    {
      header: 'Periode',
      hideMobile: true,
      cellStyle: muted,
      cell: (item) =>
        item.tanggal_awal
          ? `${formatDateShort(item.tanggal_awal)} – ${formatDateShort(item.tanggal_akhir)}`
          : '–',
    },
    {
      // Berlaku/berakhir dihitung dari tanggal, bukan dari kolom "Status
      // Kerjasama" Excel — kolom itu menandai keabsahan bukti, bukan masa aktif.
      header: 'Status',
      cell: (item) =>
        isAktif(item) ? (
          <Badge color="#16a34a">Berlaku</Badge>
        ) : (
          <Badge color="#94a3b8">Berakhir</Badge>
        ),
    },
  ];

  return (
    <AdminList<Mitra>
      table="mitra"
      title="Manajemen Kerja Sama & Mitra"
      cardTitle="Daftar Kerja Sama"
      addHref="/admin/mitra-form"
      addLabel="Tambah Kerja Sama"
      editHref={(row) => `/admin/mitra-form?edit=${row.id}`}
      orderBy={{ column: 'tanggal_akhir', ascending: false }}
      columns={columns}
      searchFields={(item) => [
        item.name,
        item.category,
        item.jenis_kerjasama,
        item.tingkat,
        item.judul_kegiatan,
        item.manfaat,
        item.tanggal_awal,
        item.tanggal_akhir,
        item.website_url,
      ]}
      searchPlaceholder="Cari lembaga, kegiatan, jenis, tingkat…"
      labelOf={(item) => item.name}
      deleteTitle="Hapus Kerja Sama?"
      emptyTitle="Belum ada kerja sama"
      flash={flash}
      flashMessages={{
        added: '✓ Kerja sama berhasil ditambahkan.',
        updated: '✓ Kerja sama berhasil diperbarui.',
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
  rektor: { label: 'Ketua Jurusan', color: '#1a2e1e' },
  wakil: { label: 'Koord. Prodi', color: '#2d6a40' },
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
