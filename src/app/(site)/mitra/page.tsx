import type { Metadata } from 'next';
import './mitra.css';
import { supabasePublic } from '@/lib/supabase/public';
import type { Mitra } from '@/lib/types';
import PageHero from '@/components/PageHero';
import MitraList from '@/components/MitraList';

export const revalidate = 60;

export const metadata: Metadata = {
  title: 'Mitra Institusi',
  description:
    'Jaringan mitra strategis yang memperkuat ekosistem riset, pendidikan, dan pengembangan SDM kami.',
};

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

/**
 * Mean partnership length in years. Rows with a missing, future, or absurdly old
 * `since_year` are excluded rather than skewing the average.
 */
function averagePartnershipYears(items: Mitra[]): string {
  const currentYear = new Date().getFullYear();
  const valid = items.filter(
    (d) => d.since_year && d.since_year >= 1900 && d.since_year <= currentYear
  );
  if (!valid.length) return '–';

  const total = valid.reduce((sum, d) => sum + Math.max(0, currentYear - d.since_year!), 0);
  return String(Math.round(total / valid.length));
}

export default async function MitraPage() {
  const { data } = await supabasePublic
    .from('mitra')
    .select('*')
    .order('since_year', { ascending: true })
    .limit(100);

  const items = (data ?? []) as Mitra[];

  const stats = [
    { value: String(items.length), label: 'Total Mitra' },
    {
      value: String(items.filter((d) => d.category === 'Internasional').length),
      label: 'Mitra Internasional',
    },
    // Every row in the table represents a live partnership, so this mirrors the total.
    { value: String(items.length), label: 'MoU Aktif' },
    { value: averagePartnershipYears(items), label: 'Tahun Kemitraan Rata-rata' },
  ];

  return (
    <>
      <PageHero
        tag="Kolaborasi & Kemitraan"
        title="Mitra Institusi"
        subtitle="Jaringan mitra strategis yang memperkuat ekosistem riset, pendidikan, dan pengembangan SDM kami."
        breadcrumb={[{ label: 'Mitra' }]}
      />

      <div style={{ background: '#fff', borderBottom: '1px solid rgba(26,46,30,0.08)' }}>
        <div className="container" style={{ padding: '40px 24px' }}>
          <div
            className="mitra-stats"
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

      <section className="section" style={{ background: 'var(--cream)' }}>
        <div className="container">
          <MitraList items={items} />
        </div>
      </section>
    </>
  );
}
