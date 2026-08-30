import type { MetadataRoute } from 'next';
import { supabasePublic } from '@/lib/supabase/public';
import { SITE, absoluteUrl } from '@/lib/seo';
import { slugOf } from '@/lib/utils';
import { loadIndex } from '@/lib/content';

// The pages render per request; the sitemap does not need to. Ten minutes
// bounds how long it can list a berita that was renamed straight in the
// Supabase dashboard, while an edit made through the admin purges it at once.
export const revalidate = 600;

type StaticRoute = {
  path: string;
  priority: number;
  changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency'];
};

/**
 * changeFrequency is a hint, not a promise, so it is set from how often each
 * page's content genuinely moves: the berita index gains rows weekly, while
 * sejarah and visi-misi are effectively fixed.
 */
const STATIC_ROUTES: StaticRoute[] = [
  { path: '/', priority: 1.0, changeFrequency: 'weekly' },
  { path: '/profile', priority: 0.9, changeFrequency: 'monthly' },
  { path: '/berita', priority: 0.9, changeFrequency: 'weekly' },
  { path: '/penelitian', priority: 0.9, changeFrequency: 'weekly' },
  { path: '/staf', priority: 0.8, changeFrequency: 'monthly' },
  { path: '/pencapaian', priority: 0.8, changeFrequency: 'monthly' },
  { path: '/fasilitas', priority: 0.7, changeFrequency: 'yearly' },
  { path: '/struktur', priority: 0.7, changeFrequency: 'monthly' },
  { path: '/advisory-board', priority: 0.6, changeFrequency: 'yearly' },
  { path: '/mitra', priority: 0.7, changeFrequency: 'monthly' },
  { path: '/visi-misi', priority: 0.6, changeFrequency: 'yearly' },
  { path: '/sejarah', priority: 0.6, changeFrequency: 'yearly' },
  { path: '/kontak', priority: 0.6, changeFrequency: 'yearly' },
];

/**
 * Generated rather than hand-maintained, so every berita and penelitian page is
 * listed — the old static sitemap.xml only covered the twelve top-level pages,
 * leaving every article invisible to crawlers.
 *
 * The limits are deliberate: a sitemap may hold 50,000 URLs, so 1,000 rows each
 * leaves plenty of headroom while keeping one Supabase round trip per table.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  // Via loadIndex so a missing `slug` column degrades to `select('*')` instead
  // of emptying the sitemap — the same failure that took the detail pages down.
  const [news, penelitian] = await Promise.all([
    loadIndex('news'),
    loadIndex('penelitian'),
  ]);

  const entries: MetadataRoute.Sitemap = STATIC_ROUTES.map((r) => ({
    url: absoluteUrl(r.path),
    lastModified: now,
    changeFrequency: r.changeFrequency,
    priority: r.priority,
  }));

  for (const row of news as (typeof news[number] & { date?: string | null; created_at?: string | null })[]) {
    const stamp = row.date ?? row.created_at;
    entries.push({
      url: `${SITE.url}/berita/${slugOf(row)}`,
      lastModified: stamp ? new Date(stamp) : now,
      changeFrequency: 'yearly',
      priority: 0.7,
    });
  }

  for (const row of penelitian as (typeof penelitian[number] & { created_at?: string | null })[]) {
    entries.push({
      url: `${SITE.url}/penelitian/${slugOf(row)}`,
      lastModified: row.created_at ? new Date(row.created_at) : now,
      changeFrequency: 'yearly',
      priority: 0.7,
    });
  }

  return entries;
}
