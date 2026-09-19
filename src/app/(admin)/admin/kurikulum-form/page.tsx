import type { Metadata } from 'next';
import { KurikulumForm } from '@/components/admin/forms';

export const metadata: Metadata = { title: 'Admin — Form Kurikulum' };

export default async function Page({ searchParams }: { searchParams: Promise<{ edit?: string }> }) {
  const { edit } = await searchParams;
  const editId = edit && Number.isInteger(Number(edit)) ? Number(edit) : null;
  return <KurikulumForm editId={editId} />;
}
