import type { Metadata } from 'next';
import { PenelitianAdminList } from '@/components/admin/lists';

export const metadata: Metadata = { title: 'Admin — Manajemen Penelitian' };

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ msg?: string }>;
}) {
  const { msg } = await searchParams;
  return <PenelitianAdminList flash={msg} />;
}
