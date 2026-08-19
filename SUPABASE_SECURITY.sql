-- =====================================================
-- SUPABASE SECURITY HARDENING
-- Run this in: Supabase Dashboard > SQL Editor
--
-- Fixes:
--   1. `news` table had NO table definition and NO RLS at all
--   2. Write access was granted to ANY authenticated user, so anyone
--      who self-registered could edit/delete all site content
--   3. contact_messages (names, emails, phones) was readable by any
--      authenticated user
--
-- Safe to run more than once (idempotent).
-- =====================================================


-- ─────────────────────────────────────────────────
-- 0. ENSURE ALL TABLES EXIST
-- `create table if not exists` never touches an existing table, so
-- this is safe to run against a live database. It exists because a
-- partial SUPABASE_SETUP.sql run can leave tables missing — which is
-- what happened to contact_messages (the contact form was silently
-- failing against a table that was never created).
-- ─────────────────────────────────────────────────
create table if not exists public.staff (
  id                 serial primary key,
  name               text not null,
  type               text not null check (type in ('dosen', 'alumni', 'staf')),
  position           text not null,
  bidang             text not null,
  expertise_desc     text,
  email              text,
  publications_count integer default 0,
  linkedin_url       text,
  photo_url          text,
  nim_nip            text,
  org_level          text,
  graduation_year    integer,
  created_at         timestamptz default now()
);
-- columns added after the original schema shipped
alter table public.staff add column if not exists photo_url text;
alter table public.staff add column if not exists nim_nip   text;
alter table public.staff add column if not exists org_level text;

create table if not exists public.penelitian (
  id              serial primary key,
  title           text not null,
  author          text not null,
  category        text not null,
  year            integer not null,
  funding         text,
  status          text default 'Aktif' check (status in ('Aktif', 'Selesai')),
  publication_url text,
  abstract        text,
  slug            text,
  seo_title       text,
  seo_description text,
  og_image_url    text,
  created_at      timestamptz default now()
);
alter table public.penelitian add column if not exists slug text;
alter table public.penelitian add column if not exists keywords text;
alter table public.penelitian add column if not exists image_url text;
alter table public.penelitian add column if not exists seo_title text;
alter table public.penelitian add column if not exists seo_description text;
alter table public.penelitian add column if not exists og_image_url text;

-- Keep the form and database in sync for research lifecycle statuses.
alter table public.penelitian drop constraint if exists penelitian_status_check;
alter table public.penelitian add constraint penelitian_status_check
  check (status in ('Aktif', 'Sedang Berjalan', 'Selesai'));

create table if not exists public.pencapaian (
  id          serial primary key,
  title       text not null,
  description text not null,
  category    text not null,
  year        integer not null,
  icon        text default '🏆',
  created_at  timestamptz default now()
);

create table if not exists public.mitra (
  id          serial primary key,
  name        text not null,
  category    text not null,
  description text not null,
  since_year  integer,
  website_url text,
  created_at  timestamptz default now()
);

-- This is the one that was missing. Columns match the insert in main.js.
create table if not exists public.contact_messages (
  id         bigserial primary key,
  nama       text not null,
  email      text not null,
  phone      text,
  unit       text,
  subjek     text not null,
  pesan      text not null,
  created_at timestamptz default now()
);

alter table public.staff            enable row level security;
alter table public.penelitian       enable row level security;
alter table public.pencapaian       enable row level security;
alter table public.mitra            enable row level security;
alter table public.contact_messages enable row level security;


-- ─────────────────────────────────────────────────
-- 1. ADMIN ALLOWLIST
-- Being logged in is no longer enough. A user must be
-- explicitly listed here to write anything.
-- ─────────────────────────────────────────────────
create table if not exists public.admins (
  user_id    uuid primary key references auth.users(id) on delete cascade,
  email      text,
  added_at   timestamptz default now()
);

-- No client may read or modify this table directly.
-- Manage it from the SQL Editor / dashboard only (service_role bypasses RLS).
alter table public.admins enable row level security;

-- SECURITY DEFINER so the check can read `admins` without granting
-- clients any direct access to it. search_path pinned to block hijacking.
create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public, pg_temp
stable
as $$
  select exists (
    select 1 from public.admins where user_id = auth.uid()
  );
$$;

revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to anon, authenticated;


-- ─────────────────────────────────────────────────
-- 2. NEWS TABLE  (was completely missing + unsecured)
-- Columns derived from admin/add.html and berita*.html
-- ─────────────────────────────────────────────────
create table if not exists public.news (
  id            bigserial primary key,
  title         text not null,
  excerpt       text,
  category      text,
  date          date,
  author        text,
  featured      boolean default false,
  show_on_home  boolean default false,
  image_url     text,
  link_url      text,
  slug          text,
  seo_title     text,
  seo_description text,
  og_image_url  text,
  created_at    timestamptz default now()
);

alter table public.news add column if not exists slug text;
alter table public.news add column if not exists seo_title text;
alter table public.news add column if not exists seo_description text;
alter table public.news add column if not exists og_image_url text;

alter table public.news enable row level security;

create index if not exists news_date_idx         on public.news (date desc);
create index if not exists news_featured_idx     on public.news (featured) where featured;
create index if not exists news_show_on_home_idx on public.news (show_on_home) where show_on_home;


-- ─────────────────────────────────────────────────
-- 3. REPLACE THE WEAK POLICIES
-- Old rule: auth.role() = 'authenticated'  -> any signed-up user
-- New rule: public.is_admin()              -> allowlisted users only
--
-- RLS policies are PERMISSIVE: Postgres ORs them together, so a single
-- leftover loose policy re-opens the table no matter how strict the
-- others are. Dropping by name is unreliable because policies created
-- by hand in the dashboard use names this script cannot predict — an
-- earlier run left "Auth insert news" alive next to "news_admin_insert",
-- which silently defeated the allowlist on that table.
--
-- So: enumerate and drop EVERY existing policy on these tables first,
-- whatever it is called, then recreate the canonical set below.
-- ─────────────────────────────────────────────────
do $$
declare
  pol record;
begin
  for pol in
    select policyname, tablename
    from pg_policies
    where schemaname = 'public'
      and tablename in (
        'staff','penelitian','pencapaian','mitra','news','contact_messages'
      )
  loop
    execute format(
      'drop policy if exists %I on public.%I',
      pol.policyname, pol.tablename
    );
  end loop;
end $$;


-- staff
create policy "staff_public_read" on public.staff for select using (true);
create policy "staff_admin_insert" on public.staff for insert to authenticated with check (public.is_admin());
create policy "staff_admin_update" on public.staff for update to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "staff_admin_delete" on public.staff for delete to authenticated using (public.is_admin());

-- penelitian
create policy "penelitian_public_read" on public.penelitian for select using (true);
create policy "penelitian_admin_insert" on public.penelitian for insert to authenticated with check (public.is_admin());
create policy "penelitian_admin_update" on public.penelitian for update to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "penelitian_admin_delete" on public.penelitian for delete to authenticated using (public.is_admin());

-- pencapaian
create policy "pencapaian_public_read" on public.pencapaian for select using (true);
create policy "pencapaian_admin_insert" on public.pencapaian for insert to authenticated with check (public.is_admin());
create policy "pencapaian_admin_update" on public.pencapaian for update to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "pencapaian_admin_delete" on public.pencapaian for delete to authenticated using (public.is_admin());

-- mitra
create policy "mitra_public_read" on public.mitra for select using (true);
create policy "mitra_admin_insert" on public.mitra for insert to authenticated with check (public.is_admin());
create policy "mitra_admin_update" on public.mitra for update to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "mitra_admin_delete" on public.mitra for delete to authenticated using (public.is_admin());

-- news (public reads the site, admins manage it)
create policy "news_public_read" on public.news for select using (true);
create policy "news_admin_insert" on public.news for insert to authenticated with check (public.is_admin());
create policy "news_admin_update" on public.news for update to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "news_admin_delete" on public.news for delete to authenticated using (public.is_admin());


-- ─────────────────────────────────────────────────
-- 4. CONTACT MESSAGES  (contains personal data)
-- Public may submit. Only admins may read. Nobody edits or deletes
-- from the client — omitted policies deny by default.
-- ─────────────────────────────────────────────────
create policy "contact_public_insert" on public.contact_messages
  for insert to anon, authenticated with check (true);

-- Anonymous INSERT is required for the contact form, so the real exposure
-- here is abuse rather than disclosure. Length caps stop a bot writing
-- multi-megabyte rows to run up storage. They match the limits the form
-- already enforces client-side, which an attacker calling the API directly
-- would simply skip.
do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'contact_messages_length_guard'
  ) then
    alter table public.contact_messages
      add constraint contact_messages_length_guard check (
        char_length(nama)                 between 1 and 200
        and char_length(email)            between 3 and 320
        and char_length(coalesce(phone,'')) <= 50
        and char_length(coalesce(unit,''))  <= 200
        and char_length(subjek)           between 1 and 300
        and char_length(pesan)            between 1 and 5000
      );
  end if;
end $$;

create policy "contact_admin_read" on public.contact_messages
  for select to authenticated using (public.is_admin());


-- ─────────────────────────────────────────────────
-- 5. BOOTSTRAP THE FIRST ADMIN  <<< YOU MUST DO THIS
-- Until a row exists here, NOBODY can edit the site.
-- Replace the email with the real admin account, which must
-- already exist under Authentication > Users.
-- ─────────────────────────────────────────────────
insert into public.admins (user_id, email)
select id, email from auth.users
where email = 'REPLACE_WITH_ADMIN@EMAIL.COM'
on conflict (user_id) do nothing;


-- ─────────────────────────────────────────────────
-- 6. VERIFY
-- Every table below must show rowsecurity = true.
-- ─────────────────────────────────────────────────
select tablename, rowsecurity
from pg_tables
where schemaname = 'public'
  and tablename in ('staff','penelitian','pencapaian','mitra','news','contact_messages','admins')
order by tablename;

select tablename, policyname, cmd, roles
from pg_policies
where schemaname = 'public'
order by tablename, cmd;

-- MUST RETURN 0 ROWS. Anything listed here is an unexpected policy that
-- survived the cleanup, and because policies are OR'd it may be granting
-- access the allowlist is trying to deny. Investigate before going live.
select tablename, policyname, cmd, roles, 'UNEXPECTED POLICY' as warning
from pg_policies
where schemaname = 'public'
  and tablename in ('staff','penelitian','pencapaian','mitra','news','contact_messages')
  and policyname not in (
    'staff_public_read','staff_admin_insert','staff_admin_update','staff_admin_delete',
    'penelitian_public_read','penelitian_admin_insert','penelitian_admin_update','penelitian_admin_delete',
    'pencapaian_public_read','pencapaian_admin_insert','pencapaian_admin_update','pencapaian_admin_delete',
    'mitra_public_read','mitra_admin_insert','mitra_admin_update','mitra_admin_delete',
    'news_public_read','news_admin_insert','news_admin_update','news_admin_delete',
    'contact_public_insert','contact_admin_read'
  );

-- MUST RETURN 0 ROWS. Any write policy still keyed to bare authentication
-- rather than public.is_admin() lets any self-registered user through.
--
-- contact_public_insert is excluded on purpose: the contact form has to
-- accept submissions from anonymous visitors, so `with check (true)` is
-- correct there. It grants INSERT only — reads are gated by
-- contact_admin_read — so nothing is readable through it.
select tablename, policyname, cmd, qual::text, with_check::text
from pg_policies
where schemaname = 'public'
  and cmd <> 'SELECT'
  and policyname <> 'contact_public_insert'
  and coalesce(qual::text,'') || coalesce(with_check::text,'') not like '%is_admin%';

-- Confirm the admin bootstrap worked (must return at least 1 row):
select a.email, a.added_at from public.admins a;
