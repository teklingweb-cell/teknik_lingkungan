import type { Metadata } from 'next';
import NewsAdmin from '@/components/admin/NewsAdmin';

export const metadata: Metadata = { title: 'Admin — Manajemen Berita' };

export default async function AdminNewsPage({
  searchParams,
}: {
  searchParams: Promise<{ msg?: string }>;
}) {
  const { msg } = await searchParams;
  return <NewsAdmin flash={msg} />;
}
