import type { Metadata } from 'next';
import { MitraForm } from '@/components/admin/forms';

export const metadata: Metadata = { title: 'Admin — Form Mitra' };

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ edit?: string }>;
}) {
  const { edit } = await searchParams;
  const editId = edit && Number.isInteger(Number(edit)) ? Number(edit) : null;
  return <MitraForm editId={editId} />;
}
