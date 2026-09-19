/** Row shapes mirroring the Supabase schema (SUPABASE_SECURITY.sql). */

export type News = {
  id: number;
  title: string;
  excerpt: string | null;
  category: string | null;
  date: string | null;
  author: string | null;
  featured: boolean | null;
  show_on_home: boolean | null;
  image_url: string | null;
  link_url: string | null;
  /** URL segment. Optional: rows created before slugs derive one from title. */
  slug?: string | null;
  created_at: string | null;
};

export type StaffType = 'dosen' | 'alumni' | 'staf';

export type Staff = {
  id: number;
  name: string;
  type: StaffType;
  position: string;
  bidang: string;
  expertise_desc: string | null;
  email: string | null;
  linkedin_url: string | null;
  link_sinta?: string | null;
  photo_url: string | null;
  nim_nip: string | null;
  org_level: string | null;
  graduation_year: number | null;
  created_at: string | null;
};

export type HomePoster = {
  id: number;
  image_url: string;
  link_url: string;
  title: string | null;
  created_at: string | null;
};

/**
 * Satu baris = satu pencapaian. Kolom di bawah mengikuti LKPS sheet 6c1
 * (Prestasi Akademik Mahasiswa), 6c2 (Prestasi Non-akademik Mahasiswa), dan 4j
 * (Rekognisi DTPS) pada "LKPS TL - 14 Agustus 2026.xlsx".
 */
export type Pencapaian = {
  id: number;
  /** "Nama Kegiatan" (6c1/6c2) atau nama sertifikat penghargaan (4j). */
  title: string;
  description: string;
  category: string;
  year: number;
  icon: string | null;
  created_at: string | null;

  /* ── Kolom yang mengikuti LKPS ── */
  /** "Prestasi yang Dicapai", mis. "Juara I", "Medali Perak kategori Environment". */
  hasil: string | null;
  /** Akademik | Non-akademik | Penghargaan. */
  jenis: string | null;
  /** Mahasiswa | Dosen | Institusi. */
  pelaku: string | null;
  /** Nama DTPS — hanya terisi untuk baris dari sheet 4j. */
  nama_pelaku: string | null;
  /** "Bidang Keahlian" (sheet 4j). */
  bidang: string | null;
  /** Lokal/Wilayah | Nasional | Internasional. */
  tingkat: string | null;
  /** "Waktu Perolehan" (6c1/6c2). Kosong untuk 4j, yang hanya mencatat tahun. */
  tanggal: string | null;
  /** "Bukti Pendukung" (sheet 4j). */
  bukti: string | null;
};

export type KalenderAkademik = {
  id: number;
  title: string;
  academic_year: string;
  semester: string | null;
  category: string | null;
  start_date: string;
  end_date: string | null;
  description: string | null;
  document_url: string | null;
  created_at: string | null;
};

export type Kurikulum = {
  id: number;
  name: string;
  academic_year: string | null;
  description: string | null;
  document_url: string | null;
  is_active: boolean;
  created_at: string | null;
};

export type MataKuliah = {
  id: number;
  code: string;
  name: string;
  semester: number;
  credits: number;
  category: string | null;
  description: string | null;
  created_at: string | null;
};

/** A configurable grouping for partnership records. */
export type MitraKategori = {
  id: number;
  name: string;
  color: string | null;
  created_at: string | null;
};

/**
 * Satu baris = satu kerja sama, mengikuti Tabel 2 LKPS (sheet 2a1/2a2/2a3 pada
 * "LKPS TL - 14 Agustus 2026.xlsx"). Satu lembaga bisa muncul lebih dari sekali
 * karena punya beberapa kerja sama.
 */
export type Mitra = {
  id: number;
  /** Kolom Excel "Lembaga Mitra". */
  name: string;
  /** Nama kategori untuk kompatibilitas data lama. */
  category: string;
  /** Kategori yang dikelola dari panel admin. */
  category_id?: number | null;
  mitra_kategori?: MitraKategori | null;
  /** Ringkasan kartu; disalin dari `manfaat` saat impor. */
  description: string | null;
  since_year: number | null;
  website_url: string | null;
  /** Not in the documented schema; read defensively. */
  logo_url?: string | null;
  created_at: string | null;

  /* ── Kolom yang mengikuti Tabel 2 LKPS ── */
  /** Pendidikan | Penelitian | Pengabdian kepada Masyarakat (dari sheet asal). */
  jenis_kerjasama: string | null;
  /** Internasional | Nasional | Lokal/Wilayah. */
  tingkat: string | null;
  judul_kegiatan: string | null;
  manfaat: string | null;
  /** ISO date, mis. "2026-08-01". */
  tanggal_awal: string | null;
  tanggal_akhir: string | null;
  durasi_tahun: number | null;
  /** Valid | Tidak Valid. */
  status_kerjasama: string | null;
  bukti_kerjasama: string | null;
};

export type ContactMessage = {
  id: number;
  nama: string;
  email: string;
  phone: string | null;
  unit: string | null;
  subjek: string;
  pesan: string;
  created_at: string | null;
};
