import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/seo';
import './struktur.css';
import { supabasePublic } from '@/lib/supabase/public';
import type { Staff } from '@/lib/types';
import PageHero from '@/components/PageHero';
import OrgChart from '@/components/OrgChart';

export const revalidate = 60;

export const metadata: Metadata = pageMetadata({
  title: 'Struktur Organisasi',
  description:
    'Bagan organisasi Program Studi Teknik Lingkungan Untan: ketua jurusan, koordinator program studi, dosen, dan staf administrasi.',
  path: '/struktur',
});

const LEGEND = [
  { color: '#1a2e1e', label: 'Ketua Jurusan' },
  { color: '#2d6a40', label: 'Koordinator Program Studi' },
  { color: '#2563eb', label: 'Dosen / Profesor' },
  { color: '#9333ea', label: 'Staf Administrasi' },
];

export default async function StrukturPage() {
  // The chart is the prodi's working structure, so only dosen and staf are
  // eligible — an alumnus carrying a stale org_level must not show up here.
  const { data } = await supabasePublic
    .from('staff')
    .select('*')
    .not('org_level', 'is', null)
    .in('type', ['dosen', 'staf'])
    .order('org_level')
    .order('name')
    .limit(100);

  const people = (data ?? []) as Staff[];

  return (
    <>
      <PageHero
        tag="Tentang Prodi"
        title="Struktur Organisasi"
        subtitle="Kepemimpinan dan susunan organisasi institusi kami yang berdedikasi pada kemajuan pendidikan."
        breadcrumb={[{ label: 'Tentang Prodi', href: '/profile' }, { label: 'Struktur Organisasi' }]}
      />

      <section className="org-section">
        <div className="container">
          <div className="fade-up" style={{ marginBottom: 40, textAlign: 'center' }}>
            <div className="section-tag" style={{ justifyContent: 'center' }}>
              — Kepemimpinan
            </div>
            <h2 className="section-title" style={{ textAlign: 'center' }}>
              Bagan Organisasi
            </h2>
            <p
              style={{
                fontFamily: 'var(--font-body)',
                color: 'var(--text-muted)',
                fontSize: '0.9rem',
                marginTop: 8,
              }}
            >
              Klik kartu untuk melihat profil lengkap
            </p>
          </div>

          <div className="org-legend fade-up">
            {LEGEND.map((l) => (
              <div key={l.label} className="org-legend-item">
                <div className="org-legend-dot" style={{ background: l.color }} /> {l.label}
              </div>
            ))}
          </div>

          <OrgChart people={people} />
        </div>
      </section>
    </>
  );
}
