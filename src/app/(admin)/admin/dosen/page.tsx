import type { Metadata } from 'next';
import { DosenAdminList } from '@/components/admin/lists';

export const metadata: Metadata = { title: 'Admin — Manajemen Dosen' };

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ msg?: string }>;
}) {
  const { msg } = await searchParams;
  return <DosenAdminList flash={msg} />;
}
