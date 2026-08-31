import type { Metadata } from 'next';
import StrukturAdmin from '@/components/admin/StrukturAdmin';

export const metadata: Metadata = { title: 'Admin — Struktur Organisasi' };

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ msg?: string }>;
}) {
  const { msg } = await searchParams;
  return <StrukturAdmin flash={msg} />;
}
