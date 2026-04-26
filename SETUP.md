# Setup Guide — Universitas Website

## Stack
- **Frontend**: Plain HTML/JS → Vercel (free)
- **Backend**: Supabase (free) — database + auth + REST API
- **No server. No PHP. No surprise bills.**

---

## Step 1 — Create Supabase Project

1. Go to [supabase.com](https://supabase.com) → New Project
2. Choose a name, set a strong DB password, pick nearest region (Singapore)
3. Wait ~2 min for provisioning

---

## Step 2 — Create the `news` Table

Go to **SQL Editor** in your Supabase dashboard and run this:

```sql
-- Create news table
create table public.news (
  id        bigserial primary key,
  title     text        not null,
  excerpt   text        not null,
  category  text        not null,
  date      date        not null,
  author    text        not null,
  featured  boolean     not null default false,
  created_at timestamptz default now()
);

-- Allow public read (for berita.html)
alter table public.news enable row level security;

create policy "Public can read news"
  on public.news for select
  using (true);

-- Only authenticated users can write (for admin panel)
create policy "Auth users can insert"
  on public.news for insert
  to authenticated
  with check (true);

create policy "Auth users can update"
  on public.news for update
  to authenticated
  using (true);

create policy "Auth users can delete"
  on public.news for delete
  to authenticated
  using (true);
```

---

## Step 3 — Seed Sample Data (Optional)

```sql
insert into public.news (title, excerpt, category, date, author, featured) values
  ('Inovasi Terbaru Tim Riset dalam Pengembangan Material Ramah Lingkungan',
   'Tim peneliti kami berhasil mengembangkan material komposit berbasis biomassa lokal.',
   'Penelitian', '2025-04-15', 'Dr. Lorem Ipsum', true),
  ('Universitas Raih Akreditasi Internasional dari Lembaga Bergengsi Dunia',
   'Pencapaian bersejarah bagi institusi kami dalam meraih pengakuan internasional.',
   'Pencapaian', '2025-04-10', 'Humas', false),
  ('Seminar Nasional Lingkungan 2025: Menuju Kampus Hijau Berkelanjutan',
   'Seminar tahunan menghadirkan pakar dari seluruh Indonesia.',
   'Acara', '2025-04-05', 'Panitia Acara', false);
```

---

## Step 4 — Create Admin User

In Supabase dashboard → **Authentication** → **Users** → **Add User**:
- Email: `admin@universitas.ac.id` (or whatever you want)
- Password: something strong
- Click "Create User"

---

## Step 5 — Get Your API Keys

Go to **Project Settings** → **API**:
- Copy **Project URL** (looks like `https://abcxyz.supabase.co`)
- Copy **anon public** key

Open `js/supabase-client.js` and replace:
```js
const SUPABASE_URL  = 'https://YOUR_PROJECT_ID.supabase.co';  // ← paste here
const SUPABASE_ANON = 'YOUR_ANON_PUBLIC_KEY';                  // ← paste here
```

---

## Step 6 — Deploy to Vercel

```bash
# Install Vercel CLI (one time)
npm i -g vercel

# From the project folder
cd uni-converted
vercel

# Follow prompts — select your account, create new project
# After deploy you'll get a URL like https://your-uni.vercel.app
```

Or just drag-drop the folder to [vercel.com/new](https://vercel.com/new) — no CLI needed.

---

## File Structure

```
uni-converted/
├── index.html          ← Beranda (public)
├── berita.html         ← Berita (reads from Supabase)
├── penelitian.html
├── pencapaian.html
├── fasilitas.html
├── profile.html
├── staf.html
├── mitra.html
├── kontak.html
├── style.css
├── main.js
├── vercel.json
├── js/
│   └── supabase-client.js   ← ⚠️ Put your keys here
└── admin/
    ├── login.html     ← Admin login
    ├── index.html     ← Dashboard (list + delete + featured)
    └── add.html       ← Tambah / Edit berita
```

---

## Cost Breakdown

| Service | Cost |
|---------|------|
| Vercel  | Gratis |
| Supabase (500MB DB, 50k users) | Gratis |
| Domain (.ac.id optional) | ~Rp 150k/tahun |
| **Total** | **~Rp 0 — Rp 150k/tahun** |

---

## Admin Panel URL

After deploy: `https://your-site.vercel.app/admin/login`

Bookmark it. Share only with the client's admin staff.
