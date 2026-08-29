import { permanentRedirect } from 'next/navigation';

/** Compatibility shim for the old penelitian-detail.html?id=… URLs. */
export default async function PenelitianDetailRedirect({
  searchParams,
}: {
  searchParams: Promise<{ id?: string }>;
}) {
  const { id } = await searchParams;
  // 308, not 307: these URLs are gone for good, so the old ones should
  // drop out of the index and pass their ranking to the clean route.
  permanentRedirect(id ? `/penelitian/${id}` : '/penelitian');
}
