import { permanentRedirect } from 'next/navigation';
import type { News } from '@/lib/types';
import { resolveNews } from '@/lib/content';

/**
 * Compatibility shim for the old query-string URL (berita-detail.html?id=12).
 * Anything already shared or indexed lands here and is forwarded to the clean
 * route. New links should point at /berita/[id] directly.
 */
export default async function BeritaDetailRedirect({
  searchParams,
}: {
  searchParams: Promise<{ id?: string }>;
}) {
  const { id } = await searchParams;
  if (!id) permanentRedirect('/berita');

  // Straight to the slug rather than to /berita/<id>, which would only
  // redirect a second time. 308, not 307: these URLs are gone for good, so
  // they should drop out of the index and pass their ranking across.
  const found = await resolveNews<News>(id);
  permanentRedirect(found ? `/berita/${found.slug}` : '/berita');
}
