import type { Metadata } from 'next';
import { PencapaianForm } from '@/components/admin/forms';

export const metadata: Metadata = { title: 'Admin — Form Pencapaian' };

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ edit?: string }>;
}) {
  const { edit } = await searchParams;
  const editId = edit && Number.isInteger(Number(edit)) ? Number(edit) : null;
  return <PencapaianForm editId={editId} />;
}
