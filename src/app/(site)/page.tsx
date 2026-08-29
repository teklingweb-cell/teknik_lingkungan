import Link from 'next/link';
import './home.css';
import { supabasePublic } from '@/lib/supabase/public';
import type { News } from '@/lib/types';
import NewsCard from '@/components/NewsCard';

// Next static-analyses this export, so it has to be a literal.
export const revalidate = 60;

/**
 * Three items for the home strip: rows explicitly flagged show_on_home, and if
 * none are flagged, simply the newest three. Mirrors the old client-side logic.
 */
async function getHomeNews(): Promise<News[]> {
  const flagged = await supabasePublic
    .from('news')
    .select('*')
    .eq('show_on_home', true)
    .order('date', { ascending: false })
    .limit(3);

  if (!flagged.error && flagged.data?.length) return flagged.data as News[];

  const latest = await supabasePublic
    .from('news')
    .select('*')
    .order('date', { ascending: false })
    .limit(3);

  return (latest.data ?? []) as News[];
}

const FOKUS = [
  {
    href: '/penelitian',
    title: 'Rekayasa Air & Air Limbah',
    desc: 'Perancangan sistem pengolahan air bersih, IPAL, dan teknologi daur ulang air limbah domestik maupun industri.',
    icon: (
      <>
        <path d="M12 2C6.5 8.5 4 12.5 4 15.5a8 8 0 0 0 16 0C20 12.5 17.5 8.5 12 2z" />
        <path d="M12 12v6M9 15l3 3 3-3" strokeWidth="1.5" />
      </>
    ),
  },
  {
    href: '/fasilitas',
    title: 'Kualitas Udara',
    desc: 'Monitoring, pemodelan dispersi polutan, serta pengendalian emisi gas berbahaya dari sumber industri dan transportasi.',
    icon: (
      <>
        <path d="M17.7 7.7a2.5 2.5 0 1 1 1.8 4.3H2" />
        <path d="M9.6 4.6A2 2 0 1 1 11 8H2" />
        <path d="M12.6 19.4A2 2 0 1 0 14 16H2" />
      </>
    ),
  },
  {
    href: '/penelitian',
    title: 'Pengelolaan Limbah Padat',
    desc: 'Desain TPS, sistem pengangkutan, landfill engineering, serta teknologi pengolahan sampah berbasis circular economy.',
    icon: (
      <>
        <polyline points="1 4 1 10 7 10" />
        <polyline points="23 20 23 14 17 14" />
        <path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4-4.64 4.36A9 9 0 0 1 3.51 15" />
      </>
    ),
  },
  {
    href: '/pencapaian',
    title: 'Analisis Dampak Lingkungan',
    desc: 'Penyusunan AMDAL, UKL-UPL, dan kajian risiko lingkungan untuk proyek infrastruktur dan industri skala nasional.',
    icon: (
      <>
        <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10z" />
        <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
      </>
    ),
  },
];

const STATS = [
  { value: '20+', label: 'Tahun Berdiri' },
  { value: '480+', label: 'Mahasiswa Aktif' },
  { value: '28', label: 'Dosen Pengampu' },
  { value: '94%', label: 'Tingkat Kelulusan' },
];

const MINI_STATS = [
  { val: '3', lbl: 'Lab Aktif' },
  { val: '42+', lbl: 'Jurnal Terindeks' },
  { val: '18+', lbl: 'Mitra Industri' },
  { val: '4', lbl: 'Konsentrasi Studi' },
];

export default async function HomePage() {
  const news = await getHomeNews();
  const delays = ['', 'delay-1', 'delay-2'];

  return (
    <>
      {/* HERO */}
      <section className="hero">
        <div className="hero-banner-overlay" />
        <div className="hero-bg-glow-1" />
        <div className="hero-bg-glow-2" />
        <svg className="hero-grid" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid-hero" width="80" height="80" patternUnits="userSpaceOnUse">
              <path d="M 80 0 L 0 0 0 80" fill="none" stroke="#7aab6e" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid-hero)" />
        </svg>
        <div className="hero-line" />

        <div className="hero-content">
          <div className="hero-logo-badge">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/logo-untan.png"
              alt="Logo Universitas Tanjungpura"
              className="hero-untan-logo"
            />
            <div className="hero-untan-text">
              <span className="hero-untan-name">Universitas Tanjungpura</span>
              <span className="hero-untan-sub">Pontianak — Kalimantan Barat</span>
            </div>
          </div>
          <div className="hero-badge">
            <span className="dot" />
            Prodi Teknik Lingkungan — Terakreditasi Unggul
          </div>
          <h1 className="hero-title">
            Menjaga
            <br />
            <em>Bumi</em> untuk
            <br />
            Generasi Mendatang
          </h1>
          <p className="hero-subtitle">
            Program Studi Teknik Lingkungan hadir untuk mencetak insinyur lingkungan yang mampu
            merancang solusi nyata atas krisis air, udara, dan pengelolaan limbah demi keberlanjutan
            ekosistem Indonesia.
          </p>
          <div className="hero-buttons">
            <Link href="/profile" className="btn-primary">
              Tentang Prodi →
            </Link>
            <Link href="/penelitian" className="btn-ghost">
              Lihat Penelitian ›
            </Link>
          </div>
        </div>

        <div className="hero-scroll">
          <span>Scroll</span>
          <div className="hero-scroll-line" />
        </div>
      </section>

      {/* STATS */}
      <div className="stats-strip">
        <div className="container section" style={{ paddingTop: 0, paddingBottom: 0 }}>
          <div className="stats-grid">
            {STATS.map((s, i) => (
              <div key={s.label} className={`stat-item fade-up${i ? ` delay-${i}` : ''}`}>
                <span className="stat-value">{s.value}</span>
                <span className="stat-label">{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* NEWS */}
      <section className="section">
        <div className="container">
          <div
            style={{
              display: 'flex',
              alignItems: 'flex-end',
              justifyContent: 'space-between',
              marginBottom: 36,
            }}
          >
            <div className="fade-up">
              <div className="section-tag">— Terkini</div>
              <h2 className="section-title">Berita &amp; Kegiatan</h2>
              <div className="gold-divider" />
            </div>
            <Link
              href="/berita"
              style={{
                fontSize: '0.85rem',
                color: 'rgba(26,46,30,0.5)',
                textDecoration: 'none',
                fontFamily: 'var(--font-body)',
              }}
            >
              Semua Berita ›
            </Link>
          </div>
          <div className="grid-3" id="homeNewsGrid">
            {news.map((item, i) => (
              <NewsCard
                key={item.id}
                item={item}
                className={`fade-up ${delays[i] ?? ''}`.trim()}
                fallbackLabel={i + 1}
              />
            ))}
          </div>
        </div>
      </section>

      {/* FOKUS KAJIAN */}
      <section className="section">
        <div className="container">
          <div className="fade-up">
            <div className="section-tag">— Bidang Unggulan</div>
            <h2 className="section-title">Fokus Kajian Kami</h2>
            <div className="gold-divider" />
          </div>
          <div className="grid-4" style={{ marginTop: 40 }}>
            {FOKUS.map((f) => (
              <Link
                key={f.title}
                href={f.href}
                className="card"
                style={{ padding: 24, textDecoration: 'none' }}
              >
                <div className="card-icon">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="var(--moss)"
                    strokeWidth="1.75"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    {f.icon}
                  </svg>
                </div>
                <div className="card-title">{f.title}</div>
                <div className="card-desc">{f.desc}</div>
                <div className="card-link">Selengkapnya →</div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ABOUT STRIP */}
      <section className="about-strip section">
        <div className="container">
          <div className="about-strip-grid">
            <div className="fade-up">
              <div className="section-tag">— Tentang Prodi</div>
              <h2 className="section-title light" style={{ marginBottom: 16 }}>
                Lebih dari Sekadar
                <br />
                Program Studi
              </h2>
              <p
                style={{
                  color: 'rgba(242,245,239,0.6)',
                  fontFamily: 'var(--font-body)',
                  fontWeight: 300,
                  lineHeight: 1.7,
                  marginBottom: 16,
                }}
              >
                Prodi Teknik Lingkungan hadir sebagai jawaban atas tantangan lingkungan yang kian
                kompleks — dari pencemaran air dan udara hingga krisis sampah perkotaan. Kami
                menyiapkan lulusan yang tidak hanya paham teori, tapi juga siap turun ke lapangan
                dengan solusi terukur.
              </p>
              <p
                style={{
                  color: 'rgba(242,245,239,0.6)',
                  fontFamily: 'var(--font-body)',
                  fontWeight: 300,
                  lineHeight: 1.7,
                  marginBottom: 32,
                }}
              >
                Didukung tiga laboratorium aktif dan jaringan mitra industri lingkungan, mahasiswa
                kami mendapat pengalaman riset dan praktik yang relevan dengan kebutuhan dunia kerja.
              </p>
              <Link
                href="/profile"
                style={{
                  color: 'var(--gold-light)',
                  fontSize: '0.875rem',
                  fontFamily: 'var(--font-body)',
                  fontWeight: 500,
                  textDecoration: 'none',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                }}
              >
                Pelajari Selengkapnya →
              </Link>
            </div>
            <div className="about-strip-mini-grid fade-up delay-2">
              {MINI_STATS.map((s) => (
                <div key={s.lbl} className="about-strip-stat">
                  <div className="val">{s.val}</div>
                  <div className="lbl">{s.lbl}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA BANNER */}
      <section className="section">
        <div className="container">
          <div className="cta-banner fade-up">
            <div className="cta-banner-bg">
              <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <pattern id="dots" width="20" height="20" patternUnits="userSpaceOnUse">
                    <circle cx="2" cy="2" r="1.5" fill="#0e1628" />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#dots)" />
              </svg>
            </div>
            <div style={{ position: 'relative' }}>
              <div className="cta-banner-title">Bergabung &amp; Jadilah Bagian dari Solusi</div>
              <div className="cta-banner-sub">
                Daftarkan dirimu dan jadilah insinyur lingkungan yang dibutuhkan Indonesia.
              </div>
            </div>
            <div className="cta-banner-btns">
              <Link href="/kontak" className="btn-navy">
                Daftar Sekarang →
              </Link>
              <Link href="/kontak" className="btn-white">
                Hubungi Kami
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
