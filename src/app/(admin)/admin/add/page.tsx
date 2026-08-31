import type { Metadata } from 'next';
import NewsForm from '@/components/admin/NewsForm';

export const metadata: Metadata = { title: 'Admin — Tambah / Edit Berita' };

export default async function AdminAddPage({
  searchParams,
}: {
  searchParams: Promise<{ edit?: string }>;
}) {
  const { edit } = await searchParams;
  const editId = edit && Number.isInteger(Number(edit)) ? Number(edit) : null;
  return <NewsForm editId={editId} />;
}
