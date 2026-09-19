import type { Metadata } from 'next';
import { KurikulumAdminList } from '@/components/admin/lists';

export const metadata: Metadata = { title: 'Admin — Kurikulum' };

export default async function Page({ searchParams }: { searchParams: Promise<{ msg?: string }> }) {
  const { msg } = await searchParams;
  return <KurikulumAdminList flash={msg} />;
}
