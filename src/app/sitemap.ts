import type { MetadataRoute } from 'next';
import { supabasePublic } from '@/lib/supabase/public';

const SITE_URL = 'https://tl.ft.untan.ac.id';

export const revalidate = 3600;

const STATIC_ROUTES: { path: string; priority: number }[] = [
  { path: '/', priority: 1.0 },
  { path: '/profile', priority: 0.8 },
  { path: '/sejarah', priority: 0.6 },
  { path: '/visi-misi', priority: 0.6 },
  { path: '/struktur', priority: 0.6 },
  { path: '/fasilitas', priority: 0.6 },
  { path: '/penelitian', priority: 0.8 },
  { path: '/pencapaian', priority: 0.7 },
  { path: '/staf', priority: 0.7 },
  { path: '/mitra', priority: 0.7 },
  { path: '/berita', priority: 0.8 },
  { path: '/kontak', priority: 0.6 },
];

/**
 * Generated rather than hand-maintained, so individual berita and penelitian
 * pages are listed too — the old static sitemap.xml only covered the twelve
 * top-level pages, leaving every article invisible to crawlers.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [news, penelitian] = await Promise.all([
    supabasePublic.from('news').select('id, date').limit(500),
    supabasePublic.from('penelitian').select('id').limit(500),
  ]);

  const entries: MetadataRoute.Sitemap = STATIC_ROUTES.map((r) => ({
    url: `${SITE_URL}${r.path}`,
    priority: r.priority,
  }));

  for (const row of news.data ?? []) {
    entries.push({
      url: `${SITE_URL}/berita/${row.id}`,
      lastModified: row.date ? new Date(row.date) : undefined,
      priority: 0.6,
    });
  }

  for (const row of penelitian.data ?? []) {
    entries.push({ url: `${SITE_URL}/penelitian/${row.id}`, priority: 0.6 });
  }

  return entries;
}
