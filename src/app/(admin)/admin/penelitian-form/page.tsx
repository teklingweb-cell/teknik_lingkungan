import type { Metadata } from 'next';
import { PenelitianForm } from '@/components/admin/forms';

export const metadata: Metadata = { title: 'Admin — Form Penelitian' };

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ edit?: string }>;
}) {
  const { edit } = await searchParams;
  const editId = edit && Number.isInteger(Number(edit)) ? Number(edit) : null;
  return <PenelitianForm editId={editId} />;
}
