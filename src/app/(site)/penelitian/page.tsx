import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/seo';
import { supabasePublic } from '@/lib/supabase/public';
import type { Penelitian } from '@/lib/types';
import PageHero from '@/components/PageHero';
import PenelitianList from '@/components/PenelitianList';

// Read fresh on every request — see the note in (site)/page.tsx.
export const dynamic = 'force-dynamic';

export const metadata: Metadata = pageMetadata({
  title: 'Penelitian & Pengabdian',
  description:
    'Daftar penelitian dan pengabdian masyarakat dosen Prodi Teknik Lingkungan Untan di bidang air, udara, persampahan, dan manajemen lingkungan.',
  path: '/penelitian',
});

/**
 * Sum the `funding` free-text column ("Rp 450 Juta", "Rp 1,2 Miliar") into a
 * single headline figure. Values are Indonesian-formatted: '.' groups thousands
 * and ',' is the decimal separator, so both are normalised before parsing.
 */
function totalFunding(rows: Penelitian[]): string {
  const totalJuta = rows.reduce((sum, row) => {
    if (!row.funding) return sum;
    const m = row.funding.match(/([\d.,]+)\s*(Juta|Miliar|M)/i);
    if (!m) return sum;
    let value = parseFloat(m[1].replace(/\./g, '').replace(',', '.'));
    if (/Miliar|M/i.test(m[2])) value *= 1000;
    return sum + value;
  }, 0);

  return totalJuta >= 1000
    ? `Rp ${(totalJuta / 1000).toFixed(1)}M`
    : `Rp ${Math.round(totalJuta)}Jt`;
}

const iconBox: React.CSSProperties = {
  width: 40,
  height: 40,
  background: 'rgba(78,140,90,0.1)',
  borderRadius: 10,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0,
};

const statValue: React.CSSProperties = {
  fontFamily: 'var(--font-display)',
  fontSize: '1.8rem',
  fontWeight: 300,
  color: 'var(--navy)',
};

const statLabel: React.CSSProperties = {
  fontSize: '0.7rem',
  textTransform: 'uppercase',
  letterSpacing: '0.1em',
  color: 'rgba(45,58,46,0.5)',
  fontFamily: 'var(--font-body)',
};

function Stat({ icon, value, label }: { icon: React.ReactNode; value: string; label: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
      <div style={iconBox}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#4e8c5a"
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {icon}
        </svg>
      </div>
      <div>
        <div style={statValue}>{value}</div>
        <div style={statLabel}>{label}</div>
      </div>
    </div>
  );
}

export default async function PenelitianPage() {
  const { data } = await supabasePublic
    .from('penelitian')
    .select('*')
    .order('year', { ascending: false })
    .limit(100);

  const items = (data ?? []) as Penelitian[];
  const uniqueAuthors = new Set(items.map((d) => d.author)).size;

  return (
    <>
      <PageHero
        tag="Riset & Inovasi"
        title="Penelitian & Pengabdian"
        subtitle="Mendorong batas pengetahuan melalui riset interdisipliner dan berkontribusi nyata bagi masyarakat luas."
        breadcrumb={[{ label: 'Penelitian' }]}
      />

      <div style={{ background: '#fff', borderBottom: '1px solid rgba(26,46,30,0.08)' }}>
        <div className="container" style={{ padding: '32px 24px' }}>
          <div className="penelitian-stats">
            <Stat
              value={String(items.length)}
              label="Publikasi Aktif"
              icon={
                <>
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                  <line x1="16" y1="13" x2="8" y2="13" />
                  <line x1="16" y1="17" x2="8" y2="17" />
                  <polyline points="10 9 9 9 8 9" />
                </>
              }
            />
            <Stat
              value={String(uniqueAuthors)}
              label="Tim Peneliti"
              icon={
                <>
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </>
              }
            />
            <Stat
              value={totalFunding(items)}
              label="Total Dana Riset"
              icon={
                <>
                  <line x1="12" y1="1" x2="12" y2="23" />
                  <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                </>
              }
            />
          </div>
        </div>
      </div>

      <section className="section" style={{ background: 'var(--cream)' }}>
        <div className="container">
          <PenelitianList items={items} />
        </div>
      </section>
    </>
  );
}
