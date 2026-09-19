import type { Metadata } from 'next';
import { KalenderAkademikAdminList } from '@/components/admin/lists';

export const metadata: Metadata = { title: 'Admin — Kalender Akademik' };

export default async function Page({ searchParams }: { searchParams: Promise<{ msg?: string }> }) {
  const { msg } = await searchParams;
  return <KalenderAkademikAdminList flash={msg} />;
}
