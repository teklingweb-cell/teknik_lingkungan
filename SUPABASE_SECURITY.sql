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
  created_at    timestamptz default now()
);

alter table public.news enable row level security;

create index if not exists news_date_idx         on public.news (date desc);
create index if not exists news_featured_idx     on public.news (featured) where featured;
create index if not exists news_show_on_home_idx on public.news (show_on_home) where show_on_home;


-- ─────────────────────────────────────────────────
-- 3. REPLACE THE WEAK POLICIES
-- Old rule: auth.role() = 'authenticated'  -> any signed-up user
-- New rule: public.is_admin()              -> allowlisted users only
-- ─────────────────────────────────────────────────

-- staff
drop policy if exists "Public read staff" on public.staff;
drop policy if exists "Auth insert staff" on public.staff;
drop policy if exists "Auth update staff" on public.staff;
drop policy if exists "Auth delete staff" on public.staff;
create policy "staff_public_read" on public.staff for select using (true);
create policy "staff_admin_insert" on public.staff for insert to authenticated with check (public.is_admin());
create policy "staff_admin_update" on public.staff for update to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "staff_admin_delete" on public.staff for delete to authenticated using (public.is_admin());

-- penelitian
drop policy if exists "Public read penelitian" on public.penelitian;
drop policy if exists "Auth insert penelitian" on public.penelitian;
drop policy if exists "Auth update penelitian" on public.penelitian;
drop policy if exists "Auth delete penelitian" on public.penelitian;
create policy "penelitian_public_read" on public.penelitian for select using (true);
create policy "penelitian_admin_insert" on public.penelitian for insert to authenticated with check (public.is_admin());
create policy "penelitian_admin_update" on public.penelitian for update to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "penelitian_admin_delete" on public.penelitian for delete to authenticated using (public.is_admin());

-- pencapaian
drop policy if exists "Public read pencapaian" on public.pencapaian;
drop policy if exists "Auth insert pencapaian" on public.pencapaian;
drop policy if exists "Auth update pencapaian" on public.pencapaian;
drop policy if exists "Auth delete pencapaian" on public.pencapaian;
create policy "pencapaian_public_read" on public.pencapaian for select using (true);
create policy "pencapaian_admin_insert" on public.pencapaian for insert to authenticated with check (public.is_admin());
create policy "pencapaian_admin_update" on public.pencapaian for update to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "pencapaian_admin_delete" on public.pencapaian for delete to authenticated using (public.is_admin());

-- mitra
drop policy if exists "Public read mitra" on public.mitra;
drop policy if exists "Auth insert mitra" on public.mitra;
drop policy if exists "Auth update mitra" on public.mitra;
drop policy if exists "Auth delete mitra" on public.mitra;
create policy "mitra_public_read" on public.mitra for select using (true);
create policy "mitra_admin_insert" on public.mitra for insert to authenticated with check (public.is_admin());
create policy "mitra_admin_update" on public.mitra for update to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "mitra_admin_delete" on public.mitra for delete to authenticated using (public.is_admin());

-- news (public reads the site, admins manage it)
drop policy if exists "news_public_read"  on public.news;
drop policy if exists "news_admin_insert" on public.news;
drop policy if exists "news_admin_update" on public.news;
drop policy if exists "news_admin_delete" on public.news;
create policy "news_public_read" on public.news for select using (true);
create policy "news_admin_insert" on public.news for insert to authenticated with check (public.is_admin());
create policy "news_admin_update" on public.news for update to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "news_admin_delete" on public.news for delete to authenticated using (public.is_admin());


-- ─────────────────────────────────────────────────
-- 4. CONTACT MESSAGES  (contains personal data)
-- Public may submit. Only admins may read. Nobody edits or deletes
-- from the client — omitted policies deny by default.
-- ─────────────────────────────────────────────────
drop policy if exists "public can insert contact messages" on public.contact_messages;
drop policy if exists "admins can read contact messages"   on public.contact_messages;
drop policy if exists "contact_public_insert" on public.contact_messages;
drop policy if exists "contact_admin_read"    on public.contact_messages;

create policy "contact_public_insert" on public.contact_messages
  for insert to anon, authenticated with check (true);

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

-- Confirm the admin bootstrap worked (must return at least 1 row):
select a.email, a.added_at from public.admins a;
