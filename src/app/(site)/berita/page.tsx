import type { Metadata } from 'next';
import { supabasePublic } from '@/lib/supabase/public';
import type { News } from '@/lib/types';
import PageHero from '@/components/PageHero';
import BeritaList from '@/components/BeritaList';

export const revalidate = 60;

export const metadata: Metadata = {
  title: 'Berita & Acara',
  description:
    'Informasi terbaru seputar kegiatan, penelitian, dan pencapaian Program Studi Teknik Lingkungan Universitas Tanjungpura.',
};

export default async function BeritaPage() {
  // The old page fell back to a local data/news.json when Supabase was empty.
  // That file has been an empty array for a while, so the fallback is dropped.
  const { data } = await supabasePublic
    .from('news')
    .select('*')
    .order('date', { ascending: false })
    .limit(100);

  const news = (data ?? []) as News[];

  return (
    <>
      <PageHero
        tag="Terkini"
        title="Berita & Acara"
        subtitle="Informasi terbaru seputar kegiatan, penelitian, dan pencapaian institusi kami."
      />
      <section className="section">
        <div className="container">
          <BeritaList news={news} />
        </div>
      </section>
    </>
  );
}
