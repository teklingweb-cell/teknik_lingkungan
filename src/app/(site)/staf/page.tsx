import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/seo';
import { supabasePublic } from '@/lib/supabase/public';
import type { Staff } from '@/lib/types';
import PageHero from '@/components/PageHero';
import AlumniDirectory from '@/components/AlumniDirectory';
import './staf.css';

// Read fresh on every request — see the note in (site)/page.tsx.
export const dynamic = 'force-dynamic';

export const metadata: Metadata = pageMetadata({
  title: 'Alumni',
  description:
    'Direktori alumni Program Studi Teknik Lingkungan Universitas Tanjungpura.',
  path: '/staf',
});

export default async function StafPage() {
  const { data } = await supabasePublic
    .from('staff')
    .select('*')
    .eq('type', 'alumni')
    .order('name', { ascending: true })
    .limit(100);

  const people = (data ?? []) as Staff[];

  return (
    <>
      <PageHero
        tag="Komunitas Kami"
        title="Alumni"
        subtitle="Jejak para lulusan Program Studi Teknik Lingkungan Universitas Tanjungpura."
        breadcrumb={[{ label: 'Alumni' }]}
      />
      <section className="section">
        <div className="container">
          <AlumniDirectory people={people} />
        </div>
      </section>
    </>
  );
}
