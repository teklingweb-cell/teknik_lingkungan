import type { Metadata } from 'next';
import { supabasePublic } from '@/lib/supabase/public';
import type { Staff } from '@/lib/types';
import PageHero from '@/components/PageHero';
import StafDirectory from '@/components/StafDirectory';

export const revalidate = 60;

export const metadata: Metadata = {
  title: 'Staf, Dosen & Alumni',
  description:
    'Mengenal individu-individu luar biasa yang membentuk komunitas akademik institusi kami.',
};

export default async function StafPage() {
  const { data } = await supabasePublic
    .from('staff')
    .select('*')
    .order('publications_count', { ascending: false })
    .limit(100);

  const people = (data ?? []) as Staff[];

  return (
    <>
      <PageHero
        tag="Komunitas Kami"
        title="Staf, Dosen & Alumni"
        subtitle="Mengenal individu-individu luar biasa yang membentuk komunitas akademik institusi kami."
        breadcrumb={[{ label: 'Staf & Alumni' }]}
      />
      <section className="section">
        <div className="container">
          <StafDirectory people={people} />
        </div>
      </section>
    </>
  );
}
