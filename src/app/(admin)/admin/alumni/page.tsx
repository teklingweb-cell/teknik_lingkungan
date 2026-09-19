import type { Metadata } from 'next';
import { AlumniAdminList } from '@/components/admin/lists';

export const metadata: Metadata = { title: 'Admin — Manajemen Alumni' };

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ msg?: string }>;
}) {
  const { msg } = await searchParams;
  return <AlumniAdminList flash={msg} />;
}
