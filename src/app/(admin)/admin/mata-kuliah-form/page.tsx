import type { Metadata } from 'next';
import { MataKuliahForm } from '@/components/admin/forms';

export const metadata: Metadata = { title: 'Admin — Form Mata Kuliah' };

export default async function Page({ searchParams }: { searchParams: Promise<{ edit?: string }> }) {
  const { edit } = await searchParams;
  const editId = edit && Number.isInteger(Number(edit)) ? Number(edit) : null;
  return <MataKuliahForm editId={editId} />;
}
