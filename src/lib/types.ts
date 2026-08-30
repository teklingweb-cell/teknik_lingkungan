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
  photo_url: string | null;
  nim_nip: string | null;
  org_level: string | null;
  graduation_year: number | null;
  created_at: string | null;
};

export type Penelitian = {
  id: number;
  title: string;
  author: string;
  category: string;
  year: number;
  status: 'Aktif' | 'Selesai' | null;
  publication_url: string | null;
  abstract: string | null;
  /**
   * Everyone credited besides the lead in `author`, written as one string.
   * Optional columns: the page renders fine without any of them.
   */
  contributors?: string | null;
  /** Bare DOI, e.g. "10.1234/abcd" — linked via doi.org. */
  doi?: string | null;
  /** Where it appeared: journal, conference or publisher. */
  journal?: string | null;
  /** Comma-separated. Not in the documented schema; read defensively. */
  keywords?: string | null;
  /** URL segment. Optional: rows created before slugs derive one from title. */
  slug?: string | null;
  created_at: string | null;
};

export type Pencapaian = {
  id: number;
  title: string;
  description: string;
  category: string;
  year: number;
  icon: string | null;
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
  /** Turunan dari nama lembaga — bukan kolom Excel. Lihat MITRA_CATEGORIES. */
  category: string;
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
