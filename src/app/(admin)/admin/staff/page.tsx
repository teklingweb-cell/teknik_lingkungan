import type { Metadata } from 'next';
import { StaffAdminList } from '@/components/admin/lists';

export const metadata: Metadata = { title: 'Admin — Manajemen Staf & Alumni' };

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ msg?: string }>;
}) {
  const { msg } = await searchParams;
  return <StaffAdminList flash={msg} />;
}
