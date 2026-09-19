'use client';

import { createSupabaseBrowserClient } from '@/lib/supabase/client';
import {
  MITRA_BUKTI,
  MITRA_JENIS,
  MITRA_STATUS,
  MITRA_TINGKAT,
} from '@/lib/mitra';
import {
  PENCAPAIAN_CATEGORIES,
  PENCAPAIAN_JENIS,
  PENCAPAIAN_PELAKU,
  PENCAPAIAN_TINGKAT,
} from '@/lib/pencapaian';
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

/**
 * Urutan field mengikuti kolom LKPS sheet 6c1/6c2 (prestasi mahasiswa) dan 4j
 * (rekognisi dosen). `nama_pelaku` dan `bidang` hanya terisi untuk baris dosen
 * — sheet prestasi mahasiswa tidak mencatat nama mahasiswanya.
 */
export function PencapaianForm({ editId }: { editId: number | null }) {
  const fields: FieldDef[] = [
    {
      kind: 'text',
      name: 'title',
      label: 'Judul Pencapaian / Nama Kegiatan',
      required: true,
      placeholder: 'cth: BIOSELOM National Essay Competition',
      maxLength: 300,
    },
    {
      kind: 'row',
      fields: [
        {
          kind: 'text',
          name: 'hasil',
          label: 'Prestasi yang Dicapai',
          placeholder: 'cth: Juara I',
          maxLength: 200,
        },
        {
          kind: 'select',
          name: 'tingkat',
          label: 'Tingkat',
          options: [
            { value: '', label: '—' },
            ...PENCAPAIAN_TINGKAT.map((c) => ({ value: c, label: c })),
          ],
        },
      ],
    },
    {
      kind: 'row',
      fields: [
        {
          kind: 'select',
          name: 'pelaku',
          label: 'Diraih Oleh',
          required: true,
          options: [
            { value: '', label: 'Pilih…' },
            ...PENCAPAIAN_PELAKU.map((c) => ({ value: c, label: c })),
          ],
        },
        {
          kind: 'select',
          name: 'jenis',
          label: 'Jenis',
          options: [
            { value: '', label: '—' },
            ...PENCAPAIAN_JENIS.map((c) => ({ value: c, label: c })),
          ],
        },
      ],
    },
    {
      kind: 'row',
      fields: [
        {
          kind: 'text',
          name: 'nama_pelaku',
          label: 'Nama Dosen / Mahasiswa',
          placeholder: 'Kosongkan bila tidak atas nama perorangan',
          maxLength: 200,
        },
        {
          kind: 'text',
          name: 'bidang',
          label: 'Bidang Keahlian',
          placeholder: 'cth: Pengelolaan Kualitas Air',
          maxLength: 200,
        },
      ],
    },
    {
      kind: 'textarea',
      name: 'description',
      label: 'Deskripsi',
      required: true,
      placeholder: 'Deskripsi singkat pencapaian ini...',
    },
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
      kind: 'row',
      fields: [
        {
          kind: 'date',
          name: 'tanggal',
          label: 'Waktu Perolehan',
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
      kind: 'textarea',
      name: 'bukti',
      label: 'Bukti Pendukung',
      placeholder: 'cth: Certificate of Reviewing – Sustainable Futures (Elsevier)',
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
      initialValues={{
        title: '',
        description: '',
        category: '',
        year: '',
        hasil: '',
        jenis: '',
        pelaku: '',
        nama_pelaku: '',
        bidang: '',
        tingkat: '',
        tanggal: '',
        bukti: '',
      }}
      fromRow={(row) => ({
        title: str(row.title),
        description: str(row.description),
        category: str(row.category),
        year: str(row.year),
        hasil: str(row.hasil),
        jenis: str(row.jenis),
        pelaku: str(row.pelaku),
        nama_pelaku: str(row.nama_pelaku),
        bidang: str(row.bidang),
        tingkat: str(row.tingkat),
        tanggal: str(row.tanggal),
        bukti: str(row.bukti),
      })}
      toPayload={(v) => ({
        title: v.title.trim(),
        description: v.description.trim(),
        category: v.category,
        // Tahun mengikuti tanggal kalau diisi, supaya keduanya tidak bisa
        // saling bertentangan.
        year: yearOf(v.tanggal) ?? intOrNull(v.year),
        // `icon` sengaja tidak dikirim: lencana kartu digambar sebagai SVG
        // berdasarkan kategori, jadi tidak ada emoji yang perlu disimpan.
        hasil: orNull(v.hasil),
        jenis: orNull(v.jenis),
        pelaku: orNull(v.pelaku),
        nama_pelaku: orNull(v.nama_pelaku),
        bidang: orNull(v.bidang),
        tingkat: orNull(v.tingkat),
        tanggal: orNull(v.tanggal),
        bukti: orNull(v.bukti),
      })}
      validate={(v) => {
        const errors: string[] = [];
        if (!v.title.trim()) errors.push('Judul wajib diisi.');
        if (!v.description.trim()) errors.push('Deskripsi wajib diisi.');
        if (!v.category) errors.push('Kategori wajib dipilih.');
        if (!v.pelaku) errors.push('Kolom "Diraih Oleh" wajib dipilih.');
        if (!v.tanggal && !v.year.trim()) errors.push('Tahun wajib diisi bila tanggal dikosongkan.');
        return errors;
      }}
    />
  );
}

/* ─────────────────────────── Akademik ─────────────────────────── */

export function KalenderAkademikForm({ editId }: { editId: number | null }) {
  const fields: FieldDef[] = [
    { kind: 'text', name: 'title', label: 'Kegiatan', required: true, maxLength: 250 },
    { kind: 'text', name: 'academic_year', label: 'Tahun Akademik', required: true, placeholder: '2026/2027', maxLength: 20 },
    { kind: 'select', name: 'semester', label: 'Semester', options: [{ value: '', label: '—' }, { value: 'Ganjil', label: 'Ganjil' }, { value: 'Genap', label: 'Genap' }, { value: 'Antara', label: 'Antara' }] },
    { kind: 'select', name: 'category', label: 'Kategori', options: [{ value: '', label: '—' }, { value: 'Registrasi', label: 'Registrasi' }, { value: 'Perkuliahan', label: 'Perkuliahan' }, { value: 'Ujian', label: 'Ujian' }, { value: 'Libur', label: 'Libur' }, { value: 'Lainnya', label: 'Lainnya' }] },
    { kind: 'row', fields: [{ kind: 'date', name: 'start_date', label: 'Tanggal Mulai', required: true }, { kind: 'date', name: 'end_date', label: 'Tanggal Selesai' }] },
    { kind: 'textarea', name: 'description', label: 'Keterangan' },
    { kind: 'url', name: 'document_url', label: 'Tautan Dokumen', placeholder: 'https://...' },
  ];
  return <EntityForm table="kalender_akademik" titles={{ create: 'Tambah Kegiatan Akademik', edit: 'Edit Kegiatan Akademik' }} cardTitles={{ create: 'Kegiatan Akademik Baru', edit: 'Data Kegiatan Akademik' }} backHref="/admin/kalender-akademik" editId={editId} fields={fields} initialValues={{ title: '', academic_year: '', semester: '', category: '', start_date: '', end_date: '', description: '', document_url: '' }} fromRow={(row) => ({ title: str(row.title), academic_year: str(row.academic_year), semester: str(row.semester), category: str(row.category), start_date: str(row.start_date), end_date: str(row.end_date), description: str(row.description), document_url: str(row.document_url) })} toPayload={(v) => ({ title: v.title.trim(), academic_year: v.academic_year.trim(), semester: orNull(v.semester), category: orNull(v.category), start_date: v.start_date, end_date: orNull(v.end_date), description: orNull(v.description), document_url: orNull(v.document_url) })} validate={(v) => { const errors: string[] = []; if (!v.title.trim()) errors.push('Kegiatan wajib diisi.'); if (!v.academic_year.trim()) errors.push('Tahun akademik wajib diisi.'); if (!v.start_date) errors.push('Tanggal mulai wajib diisi.'); if (v.end_date && v.end_date < v.start_date) errors.push('Tanggal selesai tidak boleh mendahului tanggal mulai.'); return errors; }} />;
}

export function KurikulumForm({ editId }: { editId: number | null }) {
  const fields: FieldDef[] = [
    { kind: 'text', name: 'name', label: 'Nama Kurikulum', required: true, placeholder: 'Kurikulum Teknik Lingkungan 2026', maxLength: 250 },
    { kind: 'text', name: 'academic_year', label: 'Tahun Akademik / Berlaku', placeholder: '2026/2027', maxLength: 20 },
    { kind: 'textarea', name: 'description', label: 'Ringkasan' },
    { kind: 'url', name: 'document_url', label: 'Tautan Dokumen', placeholder: 'https://...' },
    { kind: 'select', name: 'is_active', label: 'Status', required: true, options: [{ value: 'true', label: 'Aktif' }, { value: 'false', label: 'Arsip' }] },
  ];
  return <EntityForm table="kurikulum" titles={{ create: 'Tambah Kurikulum', edit: 'Edit Kurikulum' }} cardTitles={{ create: 'Kurikulum Baru', edit: 'Data Kurikulum' }} backHref="/admin/kurikulum" editId={editId} fields={fields} initialValues={{ name: '', academic_year: '', description: '', document_url: '', is_active: 'true' }} fromRow={(row) => ({ name: str(row.name), academic_year: str(row.academic_year), description: str(row.description), document_url: str(row.document_url), is_active: row.is_active === false ? 'false' : 'true' })} toPayload={(v) => ({ name: v.name.trim(), academic_year: orNull(v.academic_year), description: orNull(v.description), document_url: orNull(v.document_url), is_active: v.is_active === 'true' })} validate={(v) => v.name.trim() ? [] : ['Nama kurikulum wajib diisi.']} />;
}

export function MataKuliahForm({ editId }: { editId: number | null }) {
  const fields: FieldDef[] = [
    { kind: 'row', fields: [{ kind: 'text', name: 'code', label: 'Kode Mata Kuliah', required: true, placeholder: 'TLG101', maxLength: 30 }, { kind: 'text', name: 'name', label: 'Nama Mata Kuliah', required: true, maxLength: 250 }] },
    { kind: 'row', fields: [{ kind: 'number', name: 'semester', label: 'Semester', required: true, min: 1, max: 14, placeholder: '1' }, { kind: 'number', name: 'credits', label: 'SKS', required: true, min: 1, max: 12, placeholder: '3' }] },
    { kind: 'text', name: 'category', label: 'Kelompok Mata Kuliah', placeholder: 'contoh: Mata Kuliah Wajib' },
    { kind: 'textarea', name: 'description', label: 'Deskripsi Singkat' },
  ];
  return <EntityForm table="mata_kuliah" titles={{ create: 'Tambah Mata Kuliah', edit: 'Edit Mata Kuliah' }} cardTitles={{ create: 'Mata Kuliah Baru', edit: 'Data Mata Kuliah' }} backHref="/admin/mata-kuliah" editId={editId} fields={fields} initialValues={{ code: '', name: '', semester: '', credits: '', category: '', description: '' }} fromRow={(row) => ({ code: str(row.code), name: str(row.name), semester: str(row.semester), credits: str(row.credits), category: str(row.category), description: str(row.description) })} toPayload={(v) => ({ code: v.code.trim().toUpperCase(), name: v.name.trim(), semester: intOrNull(v.semester), credits: intOrNull(v.credits), category: orNull(v.category), description: orNull(v.description) })} validate={(v) => { const errors: string[] = []; if (!v.code.trim()) errors.push('Kode mata kuliah wajib diisi.'); if (!v.name.trim()) errors.push('Nama mata kuliah wajib diisi.'); if (!v.semester.trim()) errors.push('Semester wajib diisi.'); if (!v.credits.trim()) errors.push('SKS wajib diisi.'); return errors; }} />;
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
      kind: 'mitra-category',
      name: 'category_id',
      labelField: 'category',
      label: 'Kategori Lembaga',
      required: true,
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
    { kind: 'gdrive', name: 'logo_url', label: 'Logo Mitra', folder: 'mitra' },
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
        category_id: '',
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
        category_id: str(row.category_id),
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
        category_id: intOrNull(v.category_id),
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
        if (!v.category_id) errors.push('Kategori lembaga wajib dipilih.');
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

/* ───────────────────────── Kategori Mitra ───────────────────────── */

export function MitraKategoriForm({ editId }: { editId: number | null }) {
  const fields: FieldDef[] = [
    {
      kind: 'text',
      name: 'name',
      label: 'Nama Kategori',
      required: true,
      placeholder: 'contoh: Industri',
      maxLength: 100,
    },
    {
      kind: 'text',
      name: 'color',
      label: 'Warna Kategori',
      required: true,
      placeholder: '#2563eb',
      maxLength: 7,
    },
  ];

  return (
    <EntityForm
      table="mitra_kategori"
      titles={{ create: 'Tambah Kategori Mitra', edit: 'Edit Kategori Mitra' }}
      cardTitles={{ create: 'Kategori Mitra Baru', edit: 'Data Kategori Mitra' }}
      backHref="/admin/mitra-kategori"
      editId={editId}
      fields={fields}
      initialValues={{ name: '', color: '#4e8c5a' }}
      fromRow={(row) => ({ name: str(row.name), color: str(row.color) || '#4e8c5a' })}
      toPayload={(v) => ({ name: v.name.trim(), color: v.color.trim() })}
      validate={(v) => {
        const errors: string[] = [];
        if (!v.name.trim()) errors.push('Nama kategori wajib diisi.');
        if (!/^#[0-9a-fA-F]{6}$/.test(v.color.trim())) {
          errors.push('Warna kategori harus berupa kode hex, misalnya #2563eb.');
        }
        return errors;
      }}
    />
  );
}

/* ───────────────────────────── Staff ───────────────────────────── */

export function StaffForm({ editId }: { editId: number | null }) {
  const fields: FieldDef[] = [
    { kind: 'text', name: 'name', label: 'Nama Lengkap', required: true },
    {
      kind: 'row',
      fields: [
        { kind: 'text', name: 'position', label: 'Jabatan', required: true, placeholder: 'contoh: Admin atau Laboran' },
        { kind: 'email', name: 'email', label: 'Email' },
      ],
    },
    { kind: 'gdrive', name: 'photo_url', label: 'Foto', folder: 'staff' },
  ];

  return (
    <EntityForm
      table="staff"
      titles={{ create: 'Tambah Staf', edit: 'Edit Staf' }}
      cardTitles={{ create: 'Data Staf', edit: 'Data Staf' }}
      backHref="/admin/staff"
      editId={editId}
      fields={fields}
      initialValues={{
        name: '',
        position: '',
        email: '',
        photo_url: '',
        photo_url_raw: '',
      }}
      fromRow={(row) => ({
        name: str(row.name),
        position: str(row.position),
        email: str(row.email),
        photo_url: str(row.photo_url),
        photo_url_raw: str(row.photo_url),
      })}
      toPayload={(v) => ({
        name: v.name.trim(),
        type: 'staf',
        nim_nip: null,
        position: v.position.trim(),
        bidang: '',
        expertise_desc: null,
        email: orNull(v.email),
        linkedin_url: null,
        graduation_year: null,
        photo_url: orNull(v.photo_url),
        org_level: 'staf',
      })}
      validate={(v) => {
        const errors: string[] = [];
        if (!v.name.trim()) errors.push('Nama wajib diisi.');
        if (!v.position.trim()) errors.push('Jabatan wajib diisi.');
        return errors;
      }}
    />
  );
}

/** Alumni are intentionally limited to their public directory fields. */
export function AlumniForm({ editId }: { editId: number | null }) {
  const fields: FieldDef[] = [
    { kind: 'text', name: 'name', label: 'Nama Lengkap', required: true, maxLength: 200 },
    { kind: 'number', name: 'graduation_year', label: 'Tahun Lulus', required: true, min: 1950, max: 2100, placeholder: '2026' },
  ];

  return (
    <EntityForm
      table="staff"
      titles={{ create: 'Tambah Alumni', edit: 'Edit Alumni' }}
      cardTitles={{ create: 'Data Alumni', edit: 'Data Alumni' }}
      backHref="/admin/alumni"
      editId={editId}
      fields={fields}
      initialValues={{ name: '', graduation_year: '' }}
      fromRow={(row) => ({ name: str(row.name), graduation_year: str(row.graduation_year) })}
      toPayload={(v) => ({
        name: v.name.trim(),
        type: 'alumni',
        graduation_year: intOrNull(v.graduation_year),
        // Keempat nilai ini memenuhi kolom lama tanpa menjadi bagian formulir alumni.
        position: 'Alumni',
        bidang: '',
        nim_nip: null,
        expertise_desc: null,
        email: null,
        linkedin_url: null,
        photo_url: null,
        org_level: null,
      })}
      validate={(v) => {
        const errors: string[] = [];
        if (!v.name.trim()) errors.push('Nama wajib diisi.');
        const year = Number(v.graduation_year);
        if (!Number.isInteger(year) || year < 1950 || year > 2100) errors.push('Tahun lulus harus antara 1950 dan 2100.');
        return errors;
      }}
    />
  );
}

/** Compact, lecturer-specific admin form. Staff and alumni keep their own form. */
export function DosenForm({ editId }: { editId: number | null }) {
  const fields: FieldDef[] = [
    { kind: 'text', name: 'name', label: 'Nama & Gelar', required: true, maxLength: 200 },
    { kind: 'text', name: 'nim_nip', label: 'NIP', required: true, maxLength: 32 },
    { kind: 'text', name: 'bidang', label: 'KBK', required: true, maxLength: 200 },
    { kind: 'url', name: 'link_sinta', label: 'Link SINTA', maxLength: 500 },
    { kind: 'gdrive', name: 'photo_url', label: 'Foto', folder: 'dosen' },
  ];

  async function checkNipConflict(values: Values, currentId: number | null) {
    const nip = values.nim_nip.trim();
    if (!nip) return null;
    const supabase = createSupabaseBrowserClient();
    const { data, error } = await supabase.from('staff').select('id, name').eq('nim_nip', nip);
    if (error || !data) return null;
    const conflict = data.find((row) => row.id !== currentId);
    return conflict ? `NIP "${nip}" sudah dipakai oleh ${conflict.name}.` : null;
  }

  return (
    <EntityForm
      table="staff"
      titles={{ create: 'Tambah Dosen', edit: 'Edit Dosen' }}
      cardTitles={{ create: 'Data Dosen', edit: 'Data Dosen' }}
      backHref="/admin/dosen"
      editId={editId}
      fields={fields}
      initialValues={{ name: '', nim_nip: '', bidang: '', link_sinta: '', photo_url: '', photo_url_raw: '' }}
      fromRow={(row) => ({
        name: str(row.name),
        nim_nip: str(row.nim_nip),
        bidang: str(row.bidang),
        link_sinta: str(row.link_sinta),
        photo_url: str(row.photo_url),
        photo_url_raw: str(row.photo_url),
      })}
      toPayload={(v) => ({
        name: v.name.trim(),
        type: 'dosen',
        nim_nip: v.nim_nip.trim(),
        bidang: v.bidang.trim(),
        link_sinta: orNull(v.link_sinta),
        photo_url: orNull(v.photo_url),
        // Required by legacy rows, but not part of the lecturer workflow.
        position: '',
      })}
      validate={(v) => {
        const errors: string[] = [];
        if (!v.name.trim()) errors.push('Nama & gelar wajib diisi.');
        if (!v.nim_nip.trim()) errors.push('NIP wajib diisi.');
        if (!v.bidang.trim()) errors.push('KBK wajib diisi.');
        return errors;
      }}
      beforeSave={checkNipConflict}
    />
  );
}
