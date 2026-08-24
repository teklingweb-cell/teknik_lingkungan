import { redirect } from 'next/navigation';

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
  redirect(id ? `/berita/${id}` : '/berita');
}
