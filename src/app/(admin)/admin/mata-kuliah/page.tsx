import type { Metadata } from 'next';
import { MataKuliahAdminList } from '@/components/admin/lists';

export const metadata: Metadata = { title: 'Admin — Mata Kuliah' };

export default async function Page({ searchParams }: { searchParams: Promise<{ msg?: string }> }) {
  const { msg } = await searchParams;
  return <MataKuliahAdminList flash={msg} />;
}
