import type { Metadata } from 'next';
import { PencapaianList } from '@/components/admin/lists';

export const metadata: Metadata = { title: 'Admin — Manajemen Pencapaian' };

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ msg?: string }>;
}) {
  const { msg } = await searchParams;
  return <PencapaianList flash={msg} />;
}
