import type { Metadata } from 'next';
import { MitraKategoriAdminList } from '@/components/admin/lists';

export const metadata: Metadata = { title: 'Admin — Kategori Mitra' };

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ msg?: string }>;
}) {
  const { msg } = await searchParams;
  return <MitraKategoriAdminList flash={msg} />;
}
