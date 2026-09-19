'use client';

import type { KalenderAkademik, Kurikulum, MataKuliah, Mitra, MitraKategori, Pencapaian, Staff } from '@/lib/types';
import { formatDateShort } from '@/lib/utils';
import {
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

/* ─────────────────────────── Akademik ─────────────────────────── */

export function KalenderAkademikAdminList({ flash }: { flash?: string }) {
  const columns: Column<KalenderAkademik>[] = [
    { header: 'Kegiatan', cell: (item) => <><div style={{ fontWeight: 500, color: 'var(--navy)' }}>{item.title}</div><div style={{ fontSize: '0.75rem', ...muted }}>{item.academic_year}{item.semester ? ` · ${item.semester}` : ''}</div></> },
    { header: 'Periode', hideMobile: true, cellStyle: muted, cell: (item) => `${formatDateShort(item.start_date)}${item.end_date ? ` – ${formatDateShort(item.end_date)}` : ''}` },
    { header: 'Kategori', hideMobile: true, cell: (item) => item.category ? <Badge color="#2563eb">{item.category}</Badge> : '–' },
  ];
  return <AdminList<KalenderAkademik> table="kalender_akademik" title="Manajemen Kalender Akademik" cardTitle="Daftar Kegiatan Akademik" addHref="/admin/kalender-akademik-form" addLabel="Tambah Kegiatan" editHref={(row) => `/admin/kalender-akademik-form?edit=${row.id}`} orderBy={{ column: 'start_date', ascending: false }} columns={columns} searchFields={(item) => [item.title, item.academic_year, item.semester, item.category, item.description]} searchPlaceholder="Cari kegiatan atau tahun akademik…" labelOf={(item) => item.title} deleteTitle="Hapus Kegiatan?" emptyTitle="Belum ada kegiatan akademik" flash={flash} />;
}

export function KurikulumAdminList({ flash }: { flash?: string }) {
  const columns: Column<Kurikulum>[] = [
    { header: 'Nama Kurikulum', cell: (item) => <><div style={{ fontWeight: 500, color: 'var(--navy)' }}>{item.name}</div><div style={{ fontSize: '0.75rem', ...muted }}>{item.academic_year || 'Tahun belum diisi'}</div></> },
    { header: 'Status', hideMobile: true, cell: (item) => <Badge color={item.is_active ? '#16a34a' : '#6b7a6c'}>{item.is_active ? 'Aktif' : 'Arsip'}</Badge> },
    { header: 'Dokumen', hideMobile: true, cell: (item) => item.document_url ? <a className="btn btn-ghost btn-sm" href={item.document_url} target="_blank" rel="noopener noreferrer">Buka</a> : '–' },
  ];
  return <AdminList<Kurikulum> table="kurikulum" title="Manajemen Kurikulum" cardTitle="Daftar Kurikulum" addHref="/admin/kurikulum-form" addLabel="Tambah Kurikulum" editHref={(row) => `/admin/kurikulum-form?edit=${row.id}`} orderBy={{ column: 'created_at', ascending: false }} columns={columns} searchFields={(item) => [item.name, item.academic_year, item.description]} searchPlaceholder="Cari nama atau tahun kurikulum…" labelOf={(item) => item.name} deleteTitle="Hapus Kurikulum?" emptyTitle="Belum ada kurikulum" flash={flash} />;
}

export function MataKuliahAdminList({ flash }: { flash?: string }) {
  const columns: Column<MataKuliah>[] = [
    { header: 'Mata Kuliah', cell: (item) => <><div style={{ fontWeight: 500, color: 'var(--navy)' }}>{item.name}</div><div style={{ fontSize: '0.75rem', ...muted, fontFamily: 'monospace' }}>{item.code}</div></> },
    { header: 'Semester', hideMobile: true, cellStyle: muted, cell: (item) => item.semester },
    { header: 'SKS', hideMobile: true, cellStyle: muted, cell: (item) => item.credits },
    { header: 'Kelompok', hideMobile: true, cell: (item) => item.category ? <Badge color="#9333ea">{item.category}</Badge> : '–' },
  ];
  return <AdminList<MataKuliah> table="mata_kuliah" title="Manajemen Mata Kuliah" cardTitle="Daftar Mata Kuliah" addHref="/admin/mata-kuliah-form" addLabel="Tambah Mata Kuliah" editHref={(row) => `/admin/mata-kuliah-form?edit=${row.id}`} orderBy={{ column: 'semester', ascending: true }} columns={columns} searchFields={(item) => [item.code, item.name, item.semester, item.credits, item.category, item.description]} searchPlaceholder="Cari kode, nama, atau kelompok…" labelOf={(item) => item.name} deleteTitle="Hapus Mata Kuliah?" emptyTitle="Belum ada mata kuliah" flash={flash} />;
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
        <Badge color="#6b7a6c">{item.category}</Badge>
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

/* ───────────────────────── Kategori Mitra ───────────────────────── */

export function MitraKategoriAdminList({ flash }: { flash?: string }) {
  const columns: Column<MitraKategori>[] = [
    {
      header: 'Kategori',
      cell: (item) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span
            aria-hidden="true"
            style={{ width: 14, height: 14, borderRadius: 99, background: item.color || '#6b7a6c' }}
          />
          <span style={{ fontWeight: 500, color: 'var(--navy)' }}>{item.name}</span>
        </div>
      ),
    },
    {
      header: 'Warna',
      hideMobile: true,
      cellStyle: { ...muted, fontFamily: 'monospace' },
      cell: (item) => item.color || '–',
    },
  ];

  return (
    <AdminList<MitraKategori>
      table="mitra_kategori"
      title="Kategori Mitra"
      cardTitle="Daftar Kategori Mitra"
      addHref="/admin/mitra-kategori-form"
      addLabel="Tambah Kategori"
      editHref={(row) => `/admin/mitra-kategori-form?edit=${row.id}`}
      orderBy={{ column: 'name', ascending: true }}
      columns={columns}
      searchFields={(item) => [item.name, item.color]}
      searchPlaceholder="Cari kategori…"
      labelOf={(item) => item.name}
      deleteTitle="Hapus Kategori Mitra?"
      emptyTitle="Belum ada kategori mitra"
      emptySub="Tambahkan kategori sebelum membuat data kerja sama."
      flash={flash}
      flashMessages={{
        added: '✓ Kategori mitra berhasil ditambahkan.',
        updated: '✓ Kategori mitra berhasil diperbarui.',
      }}
    />
  );
}

/* ───────────────────────────── Staff ───────────────────────────── */

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
      header: 'Email',
      hideMobile: true,
      cellStyle: { ...muted, fontSize: '0.78rem' },
      cell: (item) => item.email || '–',
    },
  ];

  return (
    <AdminList<Staff>
      table="staff"
      title="Manajemen Staf"
      cardTitle="Daftar Staf"
      addHref="/admin/staff-form"
      addLabel="Tambah Staf"
      editHref={(row) => `/admin/staff-form?edit=${row.id}`}
      orderBy={{ column: 'created_at', ascending: false }}
      columns={columns}
      rowFilter={(row) => row.type === 'staf'}
      searchFields={(item) => [item.name, item.position, item.email]}
      searchPlaceholder="Cari nama atau jabatan…"
      labelOf={(item) => item.name}
      deleteTitle="Hapus Staf?"
      emptyTitle="Belum ada data staf"
      flash={flash}
    />
  );
}

export function AlumniAdminList({ flash }: { flash?: string }) {
  const columns: Column<Staff>[] = [
    {
      header: 'Nama Alumni',
      cell: (item) => <span style={{ fontWeight: 500, color: 'var(--navy)' }}>{item.name}</span>,
    },
    {
      header: 'Tahun Lulus',
      cellStyle: muted,
      cell: (item) => item.graduation_year ?? '–',
    },
  ];

  return (
    <AdminList<Staff>
      table="staff"
      title="Manajemen Alumni"
      cardTitle="Daftar Alumni"
      addHref="/admin/alumni-form"
      addLabel="Tambah Alumni"
      editHref={(row) => `/admin/alumni-form?edit=${row.id}`}
      orderBy={{ column: 'graduation_year', ascending: false }}
      columns={columns}
      rowFilter={(row) => row.type === 'alumni'}
      searchFields={(item) => [item.name, item.graduation_year]}
      searchPlaceholder="Cari nama atau tahun lulus…"
      labelOf={(item) => item.name}
      deleteTitle="Hapus Alumni?"
      emptyTitle="Belum ada data alumni"
      flash={flash}
    />
  );
}

export function DosenAdminList({ flash }: { flash?: string }) {
  const columns: Column<Staff>[] = [
    {
      header: 'Nama & Gelar',
      cell: (item) => <span style={{ fontWeight: 500, color: 'var(--navy)' }}>{item.name}</span>,
    },
    {
      header: 'NIP',
      hideMobile: true,
      cellStyle: { ...muted, fontFamily: 'monospace', fontSize: '0.78rem' },
      cell: (item) => item.nim_nip || '–',
    },
    { header: 'KBK', hideMobile: true, cellStyle: muted, cell: (item) => item.bidang || '–' },
    {
      header: 'SINTA',
      hideMobile: true,
      cell: (item) =>
        item.link_sinta ? (
          <a href={item.link_sinta} target="_blank" rel="noopener noreferrer" className="btn btn-ghost btn-sm">
            Buka SINTA
          </a>
        ) : (
          '–'
        ),
    },
  ];

  return (
    <AdminList<Staff>
      table="staff"
      title="Manajemen Dosen"
      cardTitle="Daftar Dosen"
      addHref="/admin/dosen-form"
      addLabel="Tambah Dosen"
      editHref={(row) => `/admin/dosen-form?edit=${row.id}`}
      orderBy={{ column: 'nim_nip', ascending: true }}
      columns={columns}
      rowFilter={(row) => row.type === 'dosen'}
      searchFields={(item) => [item.name, item.nim_nip, item.bidang]}
      searchPlaceholder="Cari nama, NIP, atau KBK…"
      labelOf={(item) => item.name}
      deleteTitle="Hapus Dosen?"
      emptyTitle="Belum ada data dosen"
      flash={flash}
    />
  );
}
