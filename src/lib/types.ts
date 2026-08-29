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
  publications_count: number | null;
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
  funding: string | null;
  status: 'Aktif' | 'Selesai' | null;
  publication_url: string | null;
  abstract: string | null;
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

export type Mitra = {
  id: number;
  name: string;
  category: string;
  description: string;
  since_year: number | null;
  website_url: string | null;
  /** Not in the documented schema; read defensively. */
  logo_url?: string | null;
  created_at: string | null;
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
