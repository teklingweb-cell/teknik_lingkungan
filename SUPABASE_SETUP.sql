-- =====================================================
-- SUPABASE SQL SETUP — Universitas Lorem Ipsum
-- Run all of this in: Supabase Dashboard > SQL Editor
-- =====================================================


-- ─────────────────────────────────────────────────
-- TABLE: staff
-- Used by: staf.html (public), admin/staff.html
-- ─────────────────────────────────────────────────
create table if not exists staff (
  id                serial primary key,
  name              text not null,
  type              text not null check (type in ('dosen', 'alumni', 'staf')),
  position          text not null,           -- Jabatan / Gelar / Posisi saat ini
  bidang            text not null,           -- Bidang keahlian / Departemen
  expertise_desc    text,                    -- Deskripsi keahlian (dosen only)
  email             text,
  publications_count integer default 0,      -- Jumlah publikasi (dosen only)
  linkedin_url      text,
  graduation_year   integer,                 -- Tahun lulus (alumni only)
  created_at        timestamptz default now()
);

-- RLS
alter table staff enable row level security;
create policy "Public read staff"      on staff for select using (true);
create policy "Auth insert staff"      on staff for insert with check (auth.role() = 'authenticated');
create policy "Auth update staff"      on staff for update using (auth.role() = 'authenticated');
create policy "Auth delete staff"      on staff for delete using (auth.role() = 'authenticated');


-- ─────────────────────────────────────────────────
-- TABLE: penelitian
-- Used by: penelitian.html (public), admin/penelitian.html
-- ─────────────────────────────────────────────────
create table if not exists penelitian (
  id              serial primary key,
  title           text not null,
  author          text not null,             -- Peneliti utama
  category        text not null,             -- Sains & Teknologi | Lingkungan | Kesehatan | Sosial & Humaniora | Ekonomi
  year            integer not null,
  funding         text,                      -- cth: Rp 450 Juta
  status          text default 'Aktif' check (status in ('Aktif', 'Selesai')),
  publication_url text,                      -- DOI / URL publikasi
  abstract        text,
  created_at      timestamptz default now()
);

alter table penelitian enable row level security;
create policy "Public read penelitian"  on penelitian for select using (true);
create policy "Auth insert penelitian"  on penelitian for insert with check (auth.role() = 'authenticated');
create policy "Auth update penelitian"  on penelitian for update using (auth.role() = 'authenticated');
create policy "Auth delete penelitian"  on penelitian for delete using (auth.role() = 'authenticated');


-- ─────────────────────────────────────────────────
-- TABLE: pencapaian
-- Used by: pencapaian.html (public), admin/pencapaian.html
-- ─────────────────────────────────────────────────
create table if not exists pencapaian (
  id          serial primary key,
  title       text not null,
  description text not null,
  category    text not null,                 -- Riset | Akreditasi | Prestasi | Hibah | Ranking | Lainnya
  year        integer not null,
  icon        text default '🏆',             -- Emoji icon
  created_at  timestamptz default now()
);

alter table pencapaian enable row level security;
create policy "Public read pencapaian"  on pencapaian for select using (true);
create policy "Auth insert pencapaian"  on pencapaian for insert with check (auth.role() = 'authenticated');
create policy "Auth update pencapaian"  on pencapaian for update using (auth.role() = 'authenticated');
create policy "Auth delete pencapaian"  on pencapaian for delete using (auth.role() = 'authenticated');


-- ─────────────────────────────────────────────────
-- TABLE: mitra
-- Used by: mitra.html (public), admin/mitra.html
-- ─────────────────────────────────────────────────
create table if not exists mitra (
  id          serial primary key,
  name        text not null,
  category    text not null,                 -- Industri | Akademik | Pemerintah | Internasional
  description text not null,
  since_year  integer,
  website_url text,
  created_at  timestamptz default now()
);

alter table mitra enable row level security;
create policy "Public read mitra"  on mitra for select using (true);
create policy "Auth insert mitra"  on mitra for insert with check (auth.role() = 'authenticated');
create policy "Auth update mitra"  on mitra for update using (auth.role() = 'authenticated');
create policy "Auth delete mitra"  on mitra for delete using (auth.role() = 'authenticated');


-- ─────────────────────────────────────────────────
-- SAMPLE DATA (optional — delete if not needed)
-- ─────────────────────────────────────────────────

insert into staff (name, type, position, bidang, expertise_desc, email, publications_count) values
  ('Prof. Dr. Lorem Ipsum, M.Si.', 'dosen', 'Guru Besar', 'Kimia Organik', 'Sintesis organik, katalisis heterogen, dan pengembangan material fungsional.', 'lorem@unilorem.ac.id', 42),
  ('Dr. Adipiscing Elit, M.Pd.', 'dosen', 'Lektor Kepala', 'Mikrobiologi', 'Mikrobiologi lingkungan, biodegradasi polutan, dan bioteknologi.', 'adipiscing@unilorem.ac.id', 28),
  ('Consectetur Amet', 'alumni', 'Health Program Officer', 'World Health Organization', null, null, 0),
  ('Nisi Ut Aliquip', 'staf', 'Kepala Biro Akademik', 'Administrasi', null, null, 0);

insert into penelitian (title, author, category, year, funding, status) values
  ('Lorem Ipsum Dolor Sit Amet Consectetur Adipiscing', 'Dr. Lorem Ipsum', 'Sains & Teknologi', 2024, 'Rp 450 Juta', 'Aktif'),
  ('Analisis Kualitas Udara Ambien di Wilayah Perkotaan', 'Dr. Adipiscing Elit', 'Lingkungan', 2024, 'Rp 320 Juta', 'Aktif'),
  ('Studi Epidemiologi Penyakit Menular pada Komunitas Rural', 'Prof. Consectetur', 'Kesehatan', 2023, 'Rp 680 Juta', 'Selesai');

insert into pencapaian (title, description, category, year, icon) values
  ('Penghargaan Kampus Inovatif Terbaik 2024', 'Diraih atas kontribusi luar biasa dalam pengembangan riset terapan yang berdampak langsung bagi industri nasional.', 'Riset', 2024, '🏆'),
  ('Re-Akreditasi Unggul Program Studi Teknik Lingkungan', 'Program Studi Teknik Lingkungan kembali meraih akreditasi Unggul dari BAN-PT dengan skor sempurna.', 'Akreditasi', 2024, '⭐'),
  ('QS Asia University Rankings – Top 500', 'Masuk dalam daftar 500 universitas terbaik Asia versi QS Rankings untuk pertama kalinya dalam sejarah institusi.', 'Ranking', 2023, '🌏');

insert into mitra (name, category, description, since_year, website_url) values
  ('PT Pertamina Persero', 'Industri', 'Kolaborasi penelitian energi terbarukan dan pengembangan bahan bakar ramah lingkungan.', 2015, 'https://www.pertamina.com'),
  ('Unilever Indonesia', 'Industri', 'Program magang dan penelitian bersama di bidang ilmu bahan dan formulasi produk.', 2018, 'https://www.unilever.co.id'),
  ('Universitas Indonesia', 'Akademik', 'Kerjasama riset kolaboratif dan program pertukaran dosen dan mahasiswa.', 2012, 'https://www.ui.ac.id');
