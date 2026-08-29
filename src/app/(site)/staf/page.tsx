import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/seo';
import { supabasePublic } from '@/lib/supabase/public';
import type { Staff } from '@/lib/types';
import PageHero from '@/components/PageHero';
import StafDirectory from '@/components/StafDirectory';

// Read fresh on every request — see the note in (site)/page.tsx.
export const dynamic = 'force-dynamic';

export const metadata: Metadata = pageMetadata({
  title: 'Staf, Dosen & Alumni',
  description:
    'Direktori dosen, tenaga kependidikan, dan alumni Program Studi Teknik Lingkungan Untan beserta bidang keahlian masing-masing.',
  path: '/staf',
});

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
