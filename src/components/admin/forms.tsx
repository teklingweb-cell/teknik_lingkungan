'use client';

import { createSupabaseBrowserClient } from '@/lib/supabase/client';
import {
  MITRA_BUKTI,
  MITRA_CATEGORIES,
  MITRA_JENIS,
  MITRA_STATUS,
  MITRA_TINGKAT,
} from '@/lib/mitra';
import EntityForm, { type FieldDef, type Values } from './EntityForm';

const str = (v: unknown) => (v === null || v === undefined ? '' : String(v));
const orNull = (v: string) => (v.trim() ? v.trim() : null);
const intOrNull = (v: string) => (v.trim() ? parseInt(v, 10) : null);

/** Tahun dari tanggal ISO "YYYY-MM-DD". */
const yearOf = (iso: string) => (/^\d{4}-/.test(iso) ? parseInt(iso.slice(0, 4), 10) : null);

/**
 * Durasi kerja sama dalam tahun penuh, seperti kolom "Durasi" di LKPS:
 * dibulatkan ke bawah, jadi kerja sama enam bulan tercatat 0.
 */
function durasiTahun(awal: string, akhir: string): number | null {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(awal) || !/^\d{4}-\d{2}-\d{2}$/.test(akhir)) return null;
  let years = Number(akhir.slice(0, 4)) - Number(awal.slice(0, 4));
  // Belum genap ulang tahunnya pada tanggal akhir → kurangi satu.
  if (akhir.slice(5) < awal.slice(5)) years -= 1;
  return Math.max(0, years);
}

/* ─────────────────────────── Pencapaian ─────────────────────────── */

const PENCAPAIAN_CATEGORIES = ['Riset', 'Akreditasi', 'Prestasi', 'Hibah', 'Ranking', 'Lainnya'];

export function PencapaianForm({ editId }: { editId: number | null }) {
  const fields: FieldDef[] = [
    {
      kind: 'text',
      name: 'title',
      label: 'Judul Pencapaian',
      required: true,
      placeholder: 'cth: Penghargaan Kampus Inovatif Terbaik 2024',
      maxLength: 300,
    },
    {
      kind: 'textarea',
      name: 'description',
      label: 'Deskripsi',
      required: true,
      placeholder: 'Deskripsi singkat pencapaian ini...',
    },
    {
      kind: 'row',
      fields: [
        {
          kind: 'select',
          name: 'category',
          label: 'Kategori',
          required: true,
          options: [
            { value: '', label: 'Pilih kategori…' },
            ...PENCAPAIAN_CATEGORIES.map((c) => ({ value: c, label: c })),
          ],
        },
        {
          kind: 'number',
          name: 'year',
          label: 'Tahun',
          required: true,
          placeholder: '2024',
          min: 1900,
          max: 2100,
        },
      ],
    },
  ];

  return (
    <EntityForm
      table="pencapaian"
      titles={{ create: 'Tambah Pencapaian', edit: 'Edit Pencapaian' }}
      cardTitles={{ create: 'Pencapaian Baru', edit: 'Edit Pencapaian' }}
      backHref="/admin/pencapaian"
      editId={editId}
      fields={fields}
      initialValues={{ title: '', description: '', category: '', year: '' }}
      fromRow={(row) => ({
        title: str(row.title),
        description: str(row.description),
        category: str(row.category),
        year: str(row.year),
      })}
      // `icon` is deliberately omitted: the old form always sent null, which
      // overrode the column's '🏆' default. Nothing renders it, so leaving it
      // out lets the default stand.
      toPayload={(v) => ({
        title: v.title.trim(),
        description: v.description.trim(),
        category: v.category,
        year: intOrNull(v.year),
      })}
      validate={(v) => {
        const errors: string[] = [];
        if (!v.title.trim()) errors.push('Judul wajib diisi.');
        if (!v.description.trim()) errors.push('Deskripsi wajib diisi.');
        if (!v.category) errors.push('Kategori wajib dipilih.');
        if (!v.year.trim()) errors.push('Tahun wajib diisi.');
        return errors;
      }}
    />
  );
}

/* ─────────────────────────── Penelitian ─────────────────────────── */

const PENELITIAN_CATEGORIES = [
  'Sains & Teknologi',
  'Lingkungan',
  'Kesehatan',
  'Sosial & Humaniora',
  'Ekonomi',
];

export function PenelitianForm({ editId }: { editId: number | null }) {
  const fields: FieldDef[] = [
    {
      kind: 'text',
      name: 'title',
      label: 'Judul Penelitian',
      required: true,
      placeholder: 'Judul lengkap penelitian...',
      maxLength: 300,
    },
    { kind: 'person', name: 'author', label: 'Peneliti Utama', required: true },
    {
      kind: 'row',
      fields: [
        {
          kind: 'select',
          name: 'category',
          label: 'Kategori',
          required: true,
          options: [
            { value: '', label: 'Pilih kategori…' },
            ...PENELITIAN_CATEGORIES.map((c) => ({ value: c, label: c })),
          ],
        },
        {
          kind: 'number',
          name: 'year',
          label: 'Tahun',
          required: true,
          placeholder: '2024',
          min: 1900,
          max: 2100,
        },
      ],
    },
    {
      kind: 'select',
      name: 'status',
      label: 'Status',
      options: [
        { value: 'Aktif', label: 'Aktif' },
        { value: 'Selesai', label: 'Selesai' },
      ],
    },
    {
      kind: 'people',
      name: 'contributors',
      label: 'Kontributor Lain',
      hint: 'Klik nama untuk menambah atau melepas. Kosongkan bila peneliti tunggal.',
    },
    {
      kind: 'row',
      fields: [
        {
          kind: 'text',
          name: 'journal',
          label: 'Dipublikasikan di',
          placeholder: 'cth: Jurnal Teknik Lingkungan Vol. 12 No. 2',
        },
        { kind: 'text', name: 'doi', label: 'DOI', placeholder: 'cth: 10.1234/jtl.2025.001' },
      ],
    },
    {
      kind: 'url',
      name: 'publication_url',
      label: 'URL Publikasi',
      placeholder: 'https://... (opsional bila DOI sudah diisi)',
    },
    {
      kind: 'textarea',
      name: 'abstract',
      label: 'Abstrak / Deskripsi',
      placeholder: 'Deskripsi singkat penelitian...',
    },
    {
      kind: 'text',
      name: 'keywords',
      label: 'Kata Kunci',
      placeholder: 'cth: lingkungan, kualitas udara, biomassa (pisahkan dengan koma)',
    },
  ];

  return (
    <EntityForm
      table="penelitian"
      slugFrom={{ field: 'title', table: 'penelitian', fallback: 'penelitian' }}
      titles={{ create: 'Tambah Penelitian', edit: 'Edit Penelitian' }}
      cardTitles={{ create: 'Penelitian Baru', edit: 'Edit Penelitian' }}
      backHref="/admin/penelitian"
      editId={editId}
      fields={fields}
      initialValues={{
        title: '',
        author: '',
        category: '',
        year: '',
        status: 'Aktif',
        publication_url: '',
        abstract: '',
        keywords: '',
        contributors: '',
        doi: '',
        journal: '',
      }}
      fromRow={(row) => ({
        title: str(row.title),
        author: str(row.author),
        category: str(row.category),
        year: str(row.year),
        status: str(row.status) || 'Aktif',
        publication_url: str(row.publication_url),
        abstract: str(row.abstract),
        keywords: str(row.keywords),
        contributors: str(row.contributors),
        doi: str(row.doi),
        journal: str(row.journal),
      })}
      toPayload={(v) => ({
        title: v.title.trim(),
        author: v.author.trim(),
        category: v.category,
        year: intOrNull(v.year),
        status: v.status || 'Aktif',
        publication_url: orNull(v.publication_url),
        abstract: orNull(v.abstract),
        keywords: orNull(v.keywords),
        contributors: orNull(v.contributors),
        doi: orNull(v.doi),
        journal: orNull(v.journal),
      })}
      validate={(v) => {
        const errors: string[] = [];
        if (!v.title.trim()) errors.push('Judul wajib diisi.');
        if (!v.author.trim()) errors.push('Peneliti utama wajib diisi.');
        if (!v.category) errors.push('Kategori wajib dipilih.');
        if (!v.year.trim()) errors.push('Tahun wajib diisi.');
        return errors;
      }}
    />
  );
}

/* ───────────────────────────── Mitra ───────────────────────────── */

/**
 * Satu baris = satu kerja sama, mengikuti Tabel 2 LKPS (Kerjasama Tridharma).
 * Urutan field di bawah menyalin urutan kolom pada sheet 2a1/2a2/2a3.
 */
export function MitraForm({ editId }: { editId: number | null }) {
  const fields: FieldDef[] = [
    {
      kind: 'text',
      name: 'name',
      label: 'Lembaga Mitra',
      required: true,
      placeholder: 'cth: PT. Borneo Alumina Indonesia',
      maxLength: 250,
    },
    {
      kind: 'row',
      fields: [
        {
          kind: 'select',
          name: 'jenis_kerjasama',
          label: 'Jenis Kerja Sama',
          required: true,
          options: [
            { value: '', label: 'Pilih jenis…' },
            ...MITRA_JENIS.map((c) => ({ value: c, label: c })),
          ],
        },
        {
          kind: 'select',
          name: 'tingkat',
          label: 'Tingkat',
          required: true,
          options: [
            { value: '', label: 'Pilih tingkat…' },
            ...MITRA_TINGKAT.map((c) => ({ value: c, label: c })),
          ],
        },
      ],
    },
    {
      kind: 'select',
      name: 'category',
      label: 'Kategori Lembaga',
      required: true,
      options: [
        { value: '', label: 'Pilih kategori…' },
        ...MITRA_CATEGORIES.map((c) => ({ value: c, label: c })),
      ],
    },
    {
      kind: 'textarea',
      name: 'judul_kegiatan',
      label: 'Judul Kegiatan Kerja Sama',
      required: true,
      placeholder: 'cth: Kerja Praktik Mahasiswa Program Studi Teknik Lingkungan',
    },
    {
      kind: 'textarea',
      name: 'manfaat',
      label: 'Manfaat bagi Program Studi',
      required: true,
      placeholder: 'cth: Pengajaran, transfer ilmu pengetahuan, serta penguatan kompetensi…',
    },
    {
      kind: 'row',
      fields: [
        { kind: 'date', name: 'tanggal_awal', label: 'Tanggal Awal', required: true },
        { kind: 'date', name: 'tanggal_akhir', label: 'Tanggal Akhir', required: true },
      ],
    },
    {
      kind: 'row',
      fields: [
        {
          kind: 'select',
          name: 'status_kerjasama',
          label: 'Status Kerja Sama',
          options: [
            { value: '', label: '—' },
            ...MITRA_STATUS.map((c) => ({ value: c, label: c })),
          ],
        },
        {
          kind: 'url',
          name: 'website_url',
          label: 'Website',
          placeholder: 'https://www.contoh.com',
        },
      ],
    },
    {
      kind: 'select',
      name: 'bukti_kerjasama',
      label: 'Bukti Kerja Sama',
      options: [
        { value: '', label: '—' },
        ...MITRA_BUKTI.map((c) => ({ value: c, label: c })),
      ],
    },
    { kind: 'gdrive', name: 'logo_url', label: 'Logo Mitra (Google Drive)' },
  ];

  return (
    <EntityForm
      table="mitra"
      titles={{ create: 'Tambah Kerja Sama', edit: 'Edit Kerja Sama' }}
      cardTitles={{ create: 'Kerja Sama Baru', edit: 'Edit Kerja Sama' }}
      backHref="/admin/mitra"
      editId={editId}
      fields={fields}
      initialValues={{
        name: '',
        category: '',
        jenis_kerjasama: '',
        tingkat: '',
        judul_kegiatan: '',
        manfaat: '',
        tanggal_awal: '',
        tanggal_akhir: '',
        status_kerjasama: 'Valid',
        bukti_kerjasama: '',
        website_url: '',
        logo_url: '',
        logo_url_raw: '',
      }}
      fromRow={(row) => ({
        name: str(row.name),
        category: str(row.category),
        jenis_kerjasama: str(row.jenis_kerjasama),
        tingkat: str(row.tingkat),
        judul_kegiatan: str(row.judul_kegiatan),
        manfaat: str(row.manfaat),
        tanggal_awal: str(row.tanggal_awal),
        tanggal_akhir: str(row.tanggal_akhir),
        status_kerjasama: str(row.status_kerjasama),
        bukti_kerjasama: str(row.bukti_kerjasama),
        website_url: str(row.website_url),
        logo_url: str(row.logo_url),
        logo_url_raw: str(row.logo_url),
      })}
      toPayload={(v) => ({
        name: v.name.trim(),
        category: v.category,
        jenis_kerjasama: v.jenis_kerjasama,
        tingkat: v.tingkat,
        judul_kegiatan: v.judul_kegiatan.trim(),
        manfaat: v.manfaat.trim(),
        // Kolom lama; tetap diisi supaya tampilan yang masih membacanya
        // menampilkan teks yang sama dengan `manfaat`.
        description: v.manfaat.trim(),
        tanggal_awal: orNull(v.tanggal_awal),
        tanggal_akhir: orNull(v.tanggal_akhir),
        // Diturunkan, bukan diketik: dua nilai ini selalu mengikuti tanggalnya.
        since_year: yearOf(v.tanggal_awal),
        durasi_tahun: durasiTahun(v.tanggal_awal, v.tanggal_akhir),
        status_kerjasama: orNull(v.status_kerjasama),
        bukti_kerjasama: orNull(v.bukti_kerjasama),
        website_url: orNull(v.website_url),
        logo_url: orNull(v.logo_url),
      })}
      validate={(v) => {
        const errors: string[] = [];
        if (!v.name.trim()) errors.push('Lembaga mitra wajib diisi.');
        if (!v.jenis_kerjasama) errors.push('Jenis kerja sama wajib dipilih.');
        if (!v.tingkat) errors.push('Tingkat wajib dipilih.');
        if (!v.category) errors.push('Kategori lembaga wajib dipilih.');
        if (!v.judul_kegiatan.trim()) errors.push('Judul kegiatan wajib diisi.');
        if (!v.manfaat.trim()) errors.push('Manfaat bagi program studi wajib diisi.');
        if (!v.tanggal_awal) errors.push('Tanggal awal wajib diisi.');
        if (!v.tanggal_akhir) errors.push('Tanggal akhir wajib diisi.');
        if (v.tanggal_awal && v.tanggal_akhir && v.tanggal_akhir < v.tanggal_awal) {
          errors.push('Tanggal akhir tidak boleh mendahului tanggal awal.');
        }
        return errors;
      }}
    />
  );
}

/* ───────────────────────────── Staff ───────────────────────────── */

const TYPE_LABELS: Record<string, string> = {
  dosen: 'Dosen',
  alumni: 'Alumni',
  staf: 'Staf',
};

export function StaffForm({ editId }: { editId: number | null }) {
  const fields: FieldDef[] = [
    {
      kind: 'row',
      fields: [
        { kind: 'text', name: 'name', label: 'Nama Lengkap', required: true },
        {
          kind: 'select',
          name: 'type',
          label: 'Tipe',
          required: true,
          options: [
            { value: 'dosen', label: 'Dosen' },
            { value: 'alumni', label: 'Alumni' },
            { value: 'staf', label: 'Staf' },
          ],
        },
      ],
    },
    {
      kind: 'row',
      fields: [
        { kind: 'text', name: 'nim_nip', label: 'NIP / NIM' },
        { kind: 'text', name: 'position', label: 'Jabatan / Gelar', required: true },
      ],
    },
    {
      kind: 'row',
      fields: [
        { kind: 'text', name: 'bidang', label: 'Bidang Keahlian', required: true },
        {
          kind: 'select',
          name: 'org_level',
          label: 'Level Bagan Organisasi',
          options: [
            { value: '', label: '— Tidak tampil di bagan organisasi —' },
            { value: 'rektor', label: 'Ketua Jurusan' },
            { value: 'wakil', label: 'Koordinator Program Studi' },
            { value: 'dosen', label: 'Dosen / Profesor' },
            { value: 'staf', label: 'Staf Administrasi' },
          ],
        },
      ],
    },
    { kind: 'textarea', name: 'expertise_desc', label: 'Deskripsi Keahlian' },
    {
      kind: 'row',
      fields: [
        { kind: 'email', name: 'email', label: 'Email' },
      ],
    },
    {
      kind: 'row',
      fields: [
        { kind: 'url', name: 'linkedin_url', label: 'URL LinkedIn' },
        {
          kind: 'number',
          name: 'graduation_year',
          label: 'Tahun Lulus',
          placeholder: '2020',
          min: 1950,
          max: 2100,
        },
      ],
    },
    { kind: 'gdrive', name: 'photo_url', label: 'Foto (Google Drive)' },
  ];

  /** NIP/NIM must be unique across staff; the row being edited is exempt. */
  async function checkNimConflict(values: Values, currentId: number | null) {
    const nim = values.nim_nip.trim();
    if (!nim) return null;

    const supabase = createSupabaseBrowserClient();
    const { data, error } = await supabase
      .from('staff')
      .select('id, name, type, position')
      .eq('nim_nip', nim);

    if (error || !data) return null;

    const conflict = data.find((r) => r.id !== currentId);
    if (!conflict) return null;

    const who =
      (TYPE_LABELS[conflict.type] ?? conflict.type) +
      (conflict.position ? ` · ${conflict.position}` : '');
    return `NIP/NIM "${nim}" sudah dipakai oleh ${conflict.name} (${who}).`;
  }

  return (
    <EntityForm
      table="staff"
      titles={{ create: 'Tambah Staf / Alumni', edit: 'Edit Staf / Alumni' }}
      cardTitles={{ create: 'Data Baru', edit: 'Edit Data' }}
      backHref="/admin/staff"
      editId={editId}
      fields={fields}
      initialValues={{
        name: '',
        type: 'dosen',
        nim_nip: '',
        position: '',
        bidang: '',
        org_level: '',
        expertise_desc: '',
        email: '',
        linkedin_url: '',
        graduation_year: '',
        photo_url: '',
        photo_url_raw: '',
      }}
      fromRow={(row) => ({
        name: str(row.name),
        type: str(row.type) || 'dosen',
        nim_nip: str(row.nim_nip),
        position: str(row.position),
        bidang: str(row.bidang),
        org_level: str(row.org_level),
        expertise_desc: str(row.expertise_desc),
        email: str(row.email),
        linkedin_url: str(row.linkedin_url),
        graduation_year: str(row.graduation_year),
        photo_url: str(row.photo_url),
        photo_url_raw: str(row.photo_url),
      })}
      toPayload={(v) => ({
        name: v.name.trim(),
        type: v.type,
        nim_nip: orNull(v.nim_nip),
        position: v.position.trim(),
        bidang: v.bidang.trim(),
        expertise_desc: v.expertise_desc.trim(),
        email: orNull(v.email),
        linkedin_url: orNull(v.linkedin_url),
        graduation_year: intOrNull(v.graduation_year),
        photo_url: orNull(v.photo_url),
        org_level: orNull(v.org_level),
      })}
      validate={(v) => {
        const errors: string[] = [];
        if (!v.name.trim()) errors.push('Nama wajib diisi.');
        if (!v.position.trim()) errors.push('Jabatan wajib diisi.');
        if (!v.bidang.trim()) errors.push('Bidang keahlian wajib diisi.');
        return errors;
      }}
      beforeSave={checkNimConflict}
    />
  );
}
