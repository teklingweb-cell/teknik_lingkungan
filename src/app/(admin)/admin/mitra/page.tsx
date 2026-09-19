import type { Metadata } from 'next';
import { MitraAdminList } from '@/components/admin/lists';

export const metadata: Metadata = { title: 'Admin — Manajemen Mitra' };

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ msg?: string }>;
}) {
  const { msg } = await searchParams;
  return <MitraAdminList flash={msg} />;
}
