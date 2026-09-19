import type { Metadata } from 'next';
import { PosterAdminList } from '@/components/admin/PostersAdmin';
export const metadata: Metadata = { title: 'Admin — Poster Beranda' };
export default async function Page({ searchParams }: { searchParams: Promise<{ msg?: string }> }) { const { msg } = await searchParams; return <PosterAdminList flash={msg} />; }
