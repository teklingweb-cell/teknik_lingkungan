import type { Metadata } from 'next';
import { PosterForm } from '@/components/admin/PostersAdmin';
export const metadata: Metadata = { title: 'Admin — Form Poster' };
export default async function Page({ searchParams }: { searchParams: Promise<{ edit?: string }> }) { const { edit } = await searchParams; const editId = edit && Number.isInteger(Number(edit)) ? Number(edit) : null; return <PosterForm editId={editId} />; }
