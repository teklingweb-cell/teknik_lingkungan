import { redirect } from 'next/navigation';

/** Compatibility shim for the old penelitian-detail.html?id=… URLs. */
export default async function PenelitianDetailRedirect({
  searchParams,
}: {
  searchParams: Promise<{ id?: string }>;
}) {
  const { id } = await searchParams;
  redirect(id ? `/penelitian/${id}` : '/penelitian');
}
