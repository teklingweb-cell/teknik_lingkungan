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
    // Sheet 4j hanya mencatat tahun, jadi `tanggal` jadi pengurut kedua dan
    // baris tanpa tanggal jatuh ke bawah dalam tahunnya masing-masing.
    .order('year', { ascending: false })
    .order('tanggal', { ascending: false, nullsFirst: false })
    .limit(200);

  const items = (data ?? []) as Pencapaian[];
  const count = (fn: (d: Pencapaian) => boolean) => items.filter(fn).length;

  // Dulu tiga dari empat angka ini menghitung kategori yang labelnya tidak
  // cocok — "Penghargaan Internasional" membaca kategori Ranking, dan "Alumni
  // Berprestasi" membaca kategori Prestasi yang isinya mahasiswa aktif.
  const stats = [
    { value: items.length, label: 'Total Pencapaian' },
    { value: count((d) => d.tingkat === 'Internasional'), label: 'Tingkat Internasional' },
    { value: count((d) => d.pelaku === 'Mahasiswa'), label: 'Prestasi Mahasiswa' },
    { value: count((d) => d.pelaku === 'Dosen'), label: 'Rekognisi Dosen' },
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
