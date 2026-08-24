# Prodi Teknik Lingkungan Untan — Next.js

Next.js (App Router + TypeScript) rebuild of the static `uni-static` site.
Same Supabase backend, same visual design, same URLs.

## Running it

```bash
npm install
```

Copy `.env.example` to `.env.local` and fill in the Supabase credentials (the
publishable/anon key is safe in the browser — table access is gated by RLS):

```bash
npm run dev
```

Other scripts: `npm run build`, `npm start`, `npm run typecheck`.

## Layout

```
src/
  app/
    (site)/          public site — its own <html>, imports globals.css
      page.tsx           /            home
      berita/            /berita, /berita/[id]
      penelitian/        /penelitian, /penelitian/[id]
      pencapaian/  staf/  struktur/  mitra/
      fasilitas/  profile/  sejarah/  visi-misi/  kontak/
      berita-detail/     redirect shim for the old ?id= URLs
      penelitian-detail/ ditto
    (admin)/         admin panel — separate <html>, imports admin.css
      admin/             dashboard, login, and the CRUD screens
    globals.css      byte-for-byte copy of the old style.css
    sitemap.ts       generated, includes every article
    robots.ts
  components/        shared UI; components/admin/* is the panel
  lib/
    supabase/        public (ISR reads), client (browser), server (cookies)
    types.ts         row shapes
    utils.ts         dates, Google Drive URL handling
  middleware.ts      refreshes the session and gates /admin/*
```

### Two root layouts

`(site)` and `(admin)` each render their own `<html>`/`<body>`. The two design
systems collide on bare selectors (`body`, `table`, `input`, `h1`), and this
keeps Next from ever shipping both stylesheets to the same page. Moving between
them is a full page load, which is why the admin sidebar's "Lihat Situs" is a
plain `<a>` rather than a `<Link>`.

## Data and rendering

Public pages are Server Components with `export const revalidate = 60`, so
content is prerendered and refreshed once a minute. **This is the main
difference from the old site**, where every list was fetched in the browser and
search engines saw empty pages.

- Reads use `lib/supabase/public.ts` — a session-less anon client. It
  deliberately avoids cookies, because reading cookies in a Server Component
  opts the route out of static rendering and would disable ISR.
- `/berita/[id]` and `/penelitian/[id]` are prerendered via
  `generateStaticParams`; ids added later render on first request and are then
  cached (`dynamicParams = true`).
- The admin panel is client-side, using the browser client so RLS sees the
  signed-in user.

## Styling

`app/globals.css` is the original `style.css`, unchanged — verify with:

```bash
md5sum src/app/globals.css ../uni-static/style.css
```

Page-specific `<style>` blocks from the old HTML were extracted next to the page
that uses them (`home.css`, `kontak.css`, `struktur.css`, `article.css`,
`detail.css`). The only edit was `url('banner.png')` → `url('/banner.png')`,
since `public/` is served from the root.

`app/(admin)/admin.css` is assembled from the twelve inline `<style>` blocks in
the old `admin/*.html`. Those had drifted apart; where they disagreed the
dashboard version wins, and login-only rules are scoped under `.login-card`.

## URLs

Every old path still works. `/*.html` permanently redirects to the clean route,
and `/berita-detail?id=N` / `/penelitian-detail?id=N` forward to `/berita/N` and
`/penelitian/N`.

## Schema drift worth knowing about

`SUPABASE_SETUP.sql` / `SUPABASE_SECURITY.sql` in the old repo are behind the
live database. These columns exist in Supabase and are read/written by the app,
but no SQL file creates them:

| table        | column      |
|--------------|-------------|
| `penelitian` | `keywords`  |
| `penelitian` | `image_url` |
| `mitra`      | `logo_url`  |

Anyone rebuilding the database from those files alone would get an app that
fails to save. Worth folding into the SQL before it is used for a restore.

## Deploying

Vercel picks up the App Router automatically — `vercel.json` is no longer
needed, since the headers and redirects moved into `next.config.ts`. Set
`NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` in the project's
environment variables; `.env.local` is not committed.
