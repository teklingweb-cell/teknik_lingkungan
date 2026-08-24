'use client';

import { createSupabaseBrowserClient } from '@/lib/supabase/client';
import EntityForm, { type FieldDef, type Values } from './EntityForm';

const str = (v: unknown) => (v === null || v === undefined ? '' : String(v));
const orNull = (v: string) => (v.trim() ? v.trim() : null);
const intOrNull = (v: string) => (v.trim() ? parseInt(v, 10) : null);

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
    {
      kind: 'text',
      name: 'author',
      label: 'Peneliti Utama',
      required: true,
      placeholder: 'cth: Dr. Hendra Wahyudi',
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
      kind: 'row',
      fields: [
        { kind: 'text', name: 'funding', label: 'Dana Penelitian', placeholder: 'cth: Rp 450 Juta' },
        {
          kind: 'select',
          name: 'status',
          label: 'Status',
          options: [
            { value: 'Aktif', label: 'Aktif' },
            { value: 'Selesai', label: 'Selesai' },
          ],
        },
      ],
    },
    {
      kind: 'url',
      name: 'publication_url',
      label: 'URL Publikasi',
      placeholder: 'https://doi.org/...',
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
    { kind: 'gdrive', name: 'image_url', label: 'Gambar Penelitian (Google Drive)' },
  ];

  return (
    <EntityForm
      table="penelitian"
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
        funding: '',
        status: 'Aktif',
        publication_url: '',
        abstract: '',
        keywords: '',
        image_url: '',
        image_url_raw: '',
      }}
      fromRow={(row) => ({
        title: str(row.title),
        author: str(row.author),
        category: str(row.category),
        year: str(row.year),
        funding: str(row.funding),
        status: str(row.status) || 'Aktif',
        publication_url: str(row.publication_url),
        abstract: str(row.abstract),
        keywords: str(row.keywords),
        image_url: str(row.image_url),
        image_url_raw: str(row.image_url),
      })}
      toPayload={(v) => ({
        title: v.title.trim(),
        author: v.author.trim(),
        category: v.category,
        year: intOrNull(v.year),
        funding: orNull(v.funding),
        status: v.status || 'Aktif',
        publication_url: orNull(v.publication_url),
        abstract: orNull(v.abstract),
        keywords: orNull(v.keywords),
        image_url: orNull(v.image_url),
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

const MITRA_CATEGORIES = ['Industri', 'Akademik', 'Pemerintah', 'Internasional'];

export function MitraForm({ editId }: { editId: number | null }) {
  const fields: FieldDef[] = [
    {
      kind: 'text',
      name: 'name',
      label: 'Nama Institusi / Perusahaan',
      required: true,
      placeholder: 'cth: PT Pertamina Persero',
      maxLength: 150,
    },
    {
      kind: 'select',
      name: 'category',
      label: 'Kategori',
      required: true,
      options: [
        { value: '', label: 'Pilih kategori…' },
        ...MITRA_CATEGORIES.map((c) => ({ value: c, label: c })),
      ],
    },
    {
      kind: 'textarea',
      name: 'description',
      label: 'Deskripsi Kerjasama',
      required: true,
      placeholder: 'Deskripsi singkat bentuk kerjasama...',
    },
    {
      kind: 'row',
      fields: [
        {
          kind: 'number',
          name: 'since_year',
          label: 'Tahun Bergabung',
          placeholder: '2015',
          min: 1900,
          max: 2100,
        },
        {
          kind: 'url',
          name: 'website_url',
          label: 'Website',
          placeholder: 'https://www.contoh.com',
        },
      ],
    },
    { kind: 'gdrive', name: 'logo_url', label: 'Logo Mitra (Google Drive)' },
  ];

  return (
    <EntityForm
      table="mitra"
      titles={{ create: 'Tambah Mitra', edit: 'Edit Mitra' }}
      cardTitles={{ create: 'Mitra Baru', edit: 'Edit Mitra' }}
      backHref="/admin/mitra"
      editId={editId}
      fields={fields}
      initialValues={{
        name: '',
        category: '',
        description: '',
        since_year: '',
        website_url: '',
        logo_url: '',
        logo_url_raw: '',
      }}
      fromRow={(row) => ({
        name: str(row.name),
        category: str(row.category),
        description: str(row.description),
        since_year: str(row.since_year),
        website_url: str(row.website_url),
        logo_url: str(row.logo_url),
        logo_url_raw: str(row.logo_url),
      })}
      toPayload={(v) => ({
        name: v.name.trim(),
        category: v.category,
        description: v.description.trim(),
        since_year: intOrNull(v.since_year),
        website_url: orNull(v.website_url),
        logo_url: orNull(v.logo_url),
      })}
      validate={(v) => {
        const errors: string[] = [];
        if (!v.name.trim()) errors.push('Nama wajib diisi.');
        if (!v.category) errors.push('Kategori wajib dipilih.');
        if (!v.description.trim()) errors.push('Deskripsi wajib diisi.');
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
            { value: 'rektor', label: 'Rektor' },
            { value: 'wakil', label: 'Wakil Rektor' },
            { value: 'dekan', label: 'Dekan' },
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
        {
          kind: 'number',
          name: 'publications_count',
          label: 'Jumlah Publikasi',
          placeholder: '0',
          min: 0,
        },
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
        publications_count: '0',
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
        publications_count: str(row.publications_count ?? 0),
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
        publications_count: parseInt(v.publications_count, 10) || 0,
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
