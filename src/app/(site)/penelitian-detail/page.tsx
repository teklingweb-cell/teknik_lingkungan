import { permanentRedirect } from 'next/navigation';
import type { Penelitian } from '@/lib/types';
import { resolvePenelitian } from '@/lib/content';

/** Compatibility shim for the old penelitian-detail.html?id=… URLs. */
export default async function PenelitianDetailRedirect({
  searchParams,
}: {
  searchParams: Promise<{ id?: string }>;
}) {
  const { id } = await searchParams;
  if (!id) permanentRedirect('/penelitian');

  // Straight to the slug, so there is only one redirect hop.
  const found = await resolvePenelitian<Penelitian>(id);
  permanentRedirect(found ? `/penelitian/${found.slug}` : '/penelitian');
}
