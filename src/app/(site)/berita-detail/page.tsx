import { permanentRedirect } from 'next/navigation';

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
  // 308, not 307: these URLs are gone for good, so the old ones should
  // drop out of the index and pass their ranking to the clean route.
  permanentRedirect(id ? `/berita/${id}` : '/berita');
}
