import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/seo';
import './pencapaian.css';
import { supabasePublic } from '@/lib/supabase/public';
import type { Pencapaian } from '@/lib/types';
import PageHero from '@/components/PageHero';
import PencapaianList from '@/components/PencapaianList';

// Read fresh on every request — see the note in (site)/page.tsx.
export const dynamic = 'force-dynamic';

export const metadata: Metadata = pageMetadata({
  title: 'Pencapaian Institusi',
  description:
    'Rekam jejak prestasi, penghargaan, dan akreditasi Program Studi Teknik Lingkungan Universitas Tanjungpura.',
  path: '/pencapaian',
});

const statValue: React.CSSProperties = {
  fontFamily: 'var(--font-display)',
  fontSize: '2.5rem',
  fontWeight: 300,
  color: 'var(--gold-light)',
};

const statLabel: React.CSSProperties = {
  fontSize: '0.7rem',
  textTransform: 'uppercase',
  letterSpacing: '0.1em',
  color: 'rgba(45,58,46,0.5)',
  fontFamily: 'var(--font-body)',
  marginTop: 4,
};

export default async function PencapaianPage() {
  const { data } = await supabasePublic
    .from('pencapaian')
    .select('*')
    .order('year', { ascending: false })
    .limit(100);

  const items = (data ?? []) as Pencapaian[];
  const countOf = (category: string) => items.filter((d) => d.category === category).length;

  const stats = [
    { value: items.length, label: 'Total Penghargaan' },
    { value: countOf('Ranking'), label: 'Penghargaan Internasional' },
    { value: countOf('Akreditasi'), label: 'Akreditasi A/Unggul' },
    { value: countOf('Prestasi'), label: 'Alumni Berprestasi' },
  ];

  return (
    <>
      <PageHero
        tag="Prestasi & Rekognisi"
        title="Pencapaian Institusi"
        subtitle="Rekam jejak pencapaian dan penghargaan yang mencerminkan komitmen kami terhadap keunggulan."
        breadcrumb={[{ label: 'Pencapaian' }]}
      />

      <div style={{ background: '#fff', borderBottom: '1px solid rgba(26,46,30,0.08)' }}>
        <div className="container" style={{ padding: '40px 24px' }}>
          <div
            className="stats-mini"
            style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 24 }}
          >
            {stats.map((s) => (
              <div key={s.label} style={{ textAlign: 'center' }}>
                <div style={statValue}>{s.value}</div>
                <div style={statLabel}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <section className="section">
        <div className="container">
          <PencapaianList items={items} />
        </div>
      </section>
    </>
  );
}
