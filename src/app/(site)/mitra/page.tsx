import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/seo';
import './mitra.css';
import { supabasePublic } from '@/lib/supabase/public';
import type { Mitra } from '@/lib/types';
import { todayISO } from '@/lib/utils';
import PageHero from '@/components/PageHero';
import MitraList from '@/components/MitraList';

// Read fresh on every request — see the note in (site)/page.tsx.
export const dynamic = 'force-dynamic';

export const metadata: Metadata = pageMetadata({
  title: 'Mitra Institusi',
  description:
    'Mitra industri, pemerintah, dan institusi yang bekerja sama dengan Program Studi Teknik Lingkungan Universitas Tanjungpura.',
  path: '/mitra',
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

export default async function MitraPage() {
  // Hanya kerja sama yang masih berlaku. Yang sudah lewat tanggal akhirnya
  // tetap tersimpan untuk keperluan LKPS dan bisa dilihat di halaman admin.
  const { data } = await supabasePublic
    .from('mitra')
    .select('*')
    .or(`tanggal_akhir.gte.${todayISO()},tanggal_akhir.is.null`)
    .order('tanggal_akhir', { ascending: false })
    .limit(500);

  const items = (data ?? []) as Mitra[];

  // Satu lembaga bisa punya beberapa kerja sama; hitungan "mitra" pakai nama unik.
  const lembaga = new Set(items.map((d) => d.name));
  const countJenis = (jenis: string) =>
    String(items.filter((d) => d.jenis_kerjasama === jenis).length);

  const stats = [
    { value: String(lembaga.size), label: 'Lembaga Mitra' },
    { value: countJenis('Pendidikan'), label: 'Kerja Sama Pendidikan' },
    { value: countJenis('Penelitian'), label: 'Kerja Sama Penelitian' },
    { value: countJenis('Pengabdian kepada Masyarakat'), label: 'Kerja Sama PkM' },
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
