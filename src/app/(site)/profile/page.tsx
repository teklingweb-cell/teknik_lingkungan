import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/seo';
import Link from 'next/link';
import Carousel from '@/components/Carousel';

/** Capaian Pembelajaran Lulusan — one card each, shown as a carousel. */
const CPL = [
  {
    code: 'CPL 1',
    title: 'Dasar Keilmuan',
    text: 'Menerapkan pengetahuan matematika, fisika, kimia, biologi, dan teknologi informasi untuk memahami prinsip keteknikan lingkungan.',
  },
  {
    code: 'CPL 2',
    title: 'Perancangan Rekayasa',
    text: 'Mendesain komponen, sistem, dan proses rekayasa lingkungan (air minum, air limbah, persampahan, drainase) dengan mempertimbangkan batasan realistis dan kearifan lokal.',
  },
  {
    code: 'CPL 3',
    title: 'Eksperimen & Analisis Data',
    text: 'Mendesain dan melaksanakan eksperimen laboratorium maupun lapangan, menganalisis dan mengartikan data.',
  },
  {
    code: 'CPL 4',
    title: 'Pemecahan Masalah',
    text: 'Mengidentifikasi, merumuskan, dan menyelesaikan permasalahan lingkungan kompleks — air, udara, dan tanah.',
  },
  {
    code: 'CPL 5',
    title: 'Metode & Teknologi',
    text: 'Memilih sumber daya dan menerapkan metode rekayasa berbasis teknologi informasi dan komputasi.',
  },
  {
    code: 'CPL 6–10',
    title: 'Sikap & Profesionalisme',
    text: 'Komunikasi efektif, kepemimpinan tim lintas disiplin, etika profesional, tanggung jawab sosial, dan komitmen pembelajaran sepanjang hayat.',
  },
];

export const metadata: Metadata = pageMetadata({
  title: 'Profil Prodi',
  description:
    'Profil Program Studi Teknik Lingkungan (Tekling) Universitas Tanjungpura: bidang kajian unggulan, capaian pembelajaran lulusan, dan kehidupan kampus.',
  path: '/profile',
});

export default function ProfilePage() {
  return (
    <>
      <div className="page-hero">
        <div className="page-hero-glow"></div>
        <div className="container" style={{ position: 'relative' }}>
          <div className="page-hero-tag">Tentang Prodi</div>
          <h1 className="page-hero-title">Profil Program Studi</h1>
          <p className="page-hero-subtitle">Mengenal Program Studi Teknik Lingkungan — mendedikasikan diri pada ilmu rekayasa demi kelestarian bumi dan kesehatan ekosistem.</p>
          <div className="breadcrumb"><Link href="/">Beranda</Link><span>›</span><span>Profil</span></div>
        </div>
      </div>

      {/* STATS STRIP */}
      <div className="stats-strip">
        <div className="container">
          <div className="stats-grid" style={{ padding: '40px 0' }}>
            <div className="stat-item">
              <div className="stat-value">2004</div>
              <div className="stat-label">Tahun Berdiri</div>
            </div>
            <div className="stat-item">
              <div className="stat-value">480+</div>
              <div className="stat-label">Mahasiswa Aktif</div>
            </div>
            <div className="stat-item">
              <div className="stat-value">22</div>
              <div className="stat-label">Dosen Pengampu</div>
            </div>
            <div className="stat-item">
              <div className="stat-value">Unggul</div>
              <div className="stat-label">Akreditasi BAN-PT</div>
            </div>
          </div>
        </div>
      </div>

      {/* TENTANG PRODI */}
      <section className="section">
        <div className="container">
          <div className="grid-2" style={{ alignItems: 'center', gap: '64px' }}>
            <div className="fade-up">
              <div className="section-tag">— Siapa Kami</div>
              <h2 className="section-title">Prodi yang Lahir dari<br />Kebutuhan Nyata</h2>
              <div className="gold-divider"></div>
              <p style={{ color: 'rgba(45,58,46,0.7)', fontFamily: 'var(--font-body)', fontWeight: '300', lineHeight: '1.8', marginTop: '20px' }}>
                Program Studi Teknik Lingkungan didirikan sebagai respon terhadap krisis lingkungan yang kian mengancam kualitas hidup masyarakat — mulai dari pencemaran sungai, polusi udara perkotaan, hingga timbulan sampah yang tak terkendali.
              </p>
              <p style={{ color: 'rgba(45,58,46,0.7)', fontFamily: 'var(--font-body)', fontWeight: '300', lineHeight: '1.8', marginTop: '16px' }}>
                Kami mengintegrasikan ilmu rekayasa, sains lingkungan, dan kebijakan publik dalam satu kurikulum yang adaptif. Lulusan kami siap bekerja di sektor industri, konsultan lingkungan, pemerintahan, maupun melanjutkan riset di tingkat pascasarjana.
              </p>
            </div>
            <div className="fade-up delay-1">
              <div style={{ background: 'var(--navy)', borderRadius: '20px', padding: '40px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{ width: '44px', height: '44px', background: 'rgba(78,140,90,0.2)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', flexShrink: '0' }}><svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--gold-light)" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="6" /><path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11" /></svg></div>
                  <div>
                    <div style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', color: 'var(--cream)', marginBottom: '4px' }}>Akreditasi Unggul</div>
                    <div style={{ fontSize: '0.8rem', color: 'rgba(242,245,239,0.5)', fontFamily: 'var(--font-body)' }}>Terakreditasi Unggul oleh BAN-PT</div>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{ width: '44px', height: '44px', background: 'rgba(78,140,90,0.2)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', flexShrink: '0' }}><svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--gold-light)" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg></div>
                  <div>
                    <div style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', color: 'var(--cream)', marginBottom: '4px' }}>Jaringan Mitra Luas</div>
                    <div style={{ fontSize: '0.8rem', color: 'rgba(242,245,239,0.5)', fontFamily: 'var(--font-body)' }}>Bermitra dengan 18+ industri dan lembaga lingkungan</div>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{ width: '44px', height: '44px', background: 'rgba(78,140,90,0.2)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', flexShrink: '0' }}><svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--gold-light)" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M9 3h6l1 8H8L9 3z" /><path d="M6.5 15a6 6 0 1 0 11 0l-1-4H7.5l-1 4z" /><line x1="12" y1="3" x2="12" y2="11" /></svg></div>
                  <div>
                    <div style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', color: 'var(--cream)', marginBottom: '4px' }}>3 Lab Aktif</div>
                    <div style={{ fontSize: '0.8rem', color: 'rgba(242,245,239,0.5)', fontFamily: 'var(--font-body)' }}>Laboratorium Kimia, Mikrobiologi, dan Udara</div>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{ width: '44px', height: '44px', background: 'rgba(78,140,90,0.2)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', flexShrink: '0' }}><svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--gold-light)" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" /><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" /></svg></div>
                  <div>
                    <div style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', color: 'var(--cream)', marginBottom: '4px' }}>Kurikulum OBE</div>
                    <div style={{ fontSize: '0.8rem', color: 'rgba(242,245,239,0.5)', fontFamily: 'var(--font-body)' }}>Berbasis Outcome Based Education sesuai standar IABEE</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PROFIL LULUSAN */}
      <section className="section bg-white">
        <div className="container">
          <div className="fade-up" style={{ marginBottom: '40px' }}>
            <div className="section-tag">— Profil Lulusan</div>
            <h2 className="section-title">Apa yang Bisa Kamu Kerjakan?</h2>
            <p style={{ color: 'rgba(45,58,46,0.5)', fontFamily: 'var(--font-body)', fontSize: '0.9rem', marginTop: '8px' }}>Sarjana Teknik Lingkungan Untan disiapkan untuk berkontribusi di enam area strategis abad 21 ini.</p>
          </div>
          <div className="grid-2" style={{ gap: '20px', marginBottom: '40px' }}>
            <div className="card fade-up" style={{ padding: '24px', display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
              <div style={{ width: '40px', height: '40px', background: 'rgba(78,140,90,0.12)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: '0' }}><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--moss)" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2C6.5 8.5 4 12.5 4 15.5a8 8 0 0 0 16 0C20 12.5 17.5 8.5 12 2z" /></svg></div>
              <div><div style={{ fontFamily: 'var(--font-display)', fontSize: '0.95rem', color: 'var(--navy)', marginBottom: '5px' }}>Pembangunan Berkelanjutan</div><div style={{ fontSize: '0.8rem', color: 'rgba(45,58,46,0.55)', fontFamily: 'var(--font-body)', lineHeight: '1.6' }}>Sustainable &amp; environmental development yang seimbang antara kebutuhan manusia dan kelestarian ekosistem.</div></div>
            </div>
            <div className="card fade-up delay-1" style={{ padding: '24px', display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
              <div style={{ width: '40px', height: '40px', background: 'rgba(78,140,90,0.12)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: '0' }}><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--moss)" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M17.7 7.7a2.5 2.5 0 1 1 1.8 4.3H2" /><path d="M9.6 4.6A2 2 0 1 1 11 8H2" /><path d="M12.6 19.4A2 2 0 1 0 14 16H2" /></svg></div>
              <div><div style={{ fontFamily: 'var(--font-display)', fontSize: '0.95rem', color: 'var(--navy)', marginBottom: '5px' }}>Kelestarian Lingkungan</div><div style={{ fontSize: '0.8rem', color: 'rgba(45,58,46,0.55)', fontFamily: 'var(--font-body)', lineHeight: '1.6' }}>Environmental sustainability — menjaga fungsi ekosistem dan keanekaragaman hayati jangka panjang.</div></div>
            </div>
            <div className="card fade-up delay-1" style={{ padding: '24px', display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
              <div style={{ width: '40px', height: '40px', background: 'rgba(78,140,90,0.12)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: '0' }}><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--moss)" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M9 3h6l1 8H8L9 3z" /><path d="M6.5 15a6 6 0 1 0 11 0l-1-4H7.5l-1 4z" /></svg></div>
              <div><div style={{ fontFamily: 'var(--font-display)', fontSize: '0.95rem', color: 'var(--navy)', marginBottom: '5px' }}>Air, Sanitasi &amp; Kesehatan Publik</div><div style={{ fontSize: '0.8rem', color: 'rgba(45,58,46,0.55)', fontFamily: 'var(--font-body)', lineHeight: '1.6' }}>Sesuai target UN SDGs — water, sanitation and public health untuk masyarakat wilayah tropis.</div></div>
            </div>
            <div className="card fade-up delay-2" style={{ padding: '24px', display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
              <div style={{ width: '40px', height: '40px', background: 'rgba(78,140,90,0.12)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: '0' }}><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--moss)" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5" /><line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" /><line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" /><line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" /><line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" /></svg></div>
              <div><div style={{ fontFamily: 'var(--font-display)', fontSize: '0.95rem', color: 'var(--navy)', marginBottom: '5px' }}>Energi Bersih &amp; Terbarukan</div><div style={{ fontSize: '0.8rem', color: 'rgba(45,58,46,0.55)', fontFamily: 'var(--font-body)', lineHeight: '1.6' }}>Clean, new and renewable energy — solusi rekayasa untuk transisi energi dan minimasi emisi karbon.</div></div>
            </div>
            <div className="card fade-up delay-2" style={{ padding: '24px', display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
              <div style={{ width: '40px', height: '40px', background: 'rgba(78,140,90,0.12)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: '0' }}><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--moss)" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg></div>
              <div><div style={{ fontFamily: 'var(--font-display)', fontSize: '0.95rem', color: 'var(--navy)', marginBottom: '5px' }}>Keamanan &amp; Ketahanan Pangan</div><div style={{ fontSize: '0.8rem', color: 'rgba(45,58,46,0.55)', fontFamily: 'var(--font-body)', lineHeight: '1.6' }}>Food safety and security — aspek rekayasa lingkungan dalam rantai pasok pangan yang aman dan berkelanjutan.</div></div>
            </div>
            <div className="card fade-up delay-3" style={{ padding: '24px', display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
              <div style={{ width: '40px', height: '40px', background: 'rgba(78,140,90,0.12)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: '0' }}><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--moss)" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><polyline points="1 4 1 10 7 10" /><polyline points="23 20 23 14 17 14" /><path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4-4.64 4.36A9 9 0 0 1 3.51 15" /></svg></div>
              <div><div style={{ fontFamily: 'var(--font-display)', fontSize: '0.95rem', color: 'var(--navy)', marginBottom: '5px' }}>Mitigasi Perubahan Iklim</div><div style={{ fontSize: '0.8rem', color: 'rgba(45,58,46,0.55)', fontFamily: 'var(--font-body)', lineHeight: '1.6' }}>Climate change mitigation and adaptation — rekayasa teknik untuk ketangguhan ekosistem dan komunitas terhadap dampak iklim.</div></div>
            </div>
          </div>

          {/* CPL STRIP */}
          <div className="fade-up cpl-strip">
            <div className="cpl-strip-label">Capaian Pembelajaran Lulusan (CPL)</div>
            <Carousel
              label="Capaian Pembelajaran Lulusan"
              perView={3}
              interval={5000}
              className="carousel-on-dark"
            >
              {CPL.map((c) => (
                <article key={c.code} className="cpl-card">
                  <span className="cpl-card-code">{c.code}</span>
                  <h3 className="cpl-card-title">{c.title}</h3>
                  <p className="cpl-card-text">{c.text}</p>
                </article>
              ))}
            </Carousel>
          </div>
        </div>
      </section>

      {/* KEHIDUPAN PRODI */}
      <section className="section bg-navy">
        <div className="container">
          <div className="fade-up" style={{ marginBottom: '40px' }}>
            <div className="section-tag">— Kehidupan Kampus</div>
            <h2 className="section-title light">Lebih dari Sekadar Kuliah</h2>
          </div>
          <div className="grid-2" style={{ gap: '32px' }}>
            <div className="card-dark fade-up" style={{ padding: '32px', borderRadius: '16px' }}>
              <div style={{ width: '44px', height: '44px', background: 'rgba(78,140,90,0.2)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}><svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--gold-light)" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg></div>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', color: 'var(--cream)', marginBottom: '10px' }}>Himpunan Mahasiswa Teknik Lingkungan</h3>
              <p style={{ fontSize: '0.85rem', color: 'rgba(242,245,239,0.6)', fontFamily: 'var(--font-body)', lineHeight: '1.7' }}>Organisasi kemahasiswaan aktif dengan program kerja sosial, environmental campaign, dan kompetisi bidang lingkungan tingkat nasional.</p>
            </div>
            <div className="card-dark fade-up delay-1" style={{ padding: '32px', borderRadius: '16px' }}>
              <div style={{ width: '44px', height: '44px', background: 'rgba(78,140,90,0.2)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}><svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--gold-light)" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="6" /><path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11" /></svg></div>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', color: 'var(--cream)', marginBottom: '10px' }}>Prestasi Mahasiswa</h3>
              <p style={{ fontSize: '0.85rem', color: 'rgba(242,245,239,0.6)', fontFamily: 'var(--font-body)', lineHeight: '1.7' }}>Mahasiswa kami aktif berprestasi di lomba desain IPAL, kompetisi AMDAL, dan program PKM Kemdikbud setiap tahunnya.</p>
            </div>
            <div className="card-dark fade-up delay-2" style={{ padding: '32px', borderRadius: '16px' }}>
              <div style={{ width: '44px', height: '44px', background: 'rgba(78,140,90,0.2)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}><svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--gold-light)" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" /><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" /><line x1="12" y1="12" x2="12" y2="16" /><line x1="10" y1="14" x2="14" y2="14" /></svg></div>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', color: 'var(--cream)', marginBottom: '10px' }}>Program Magang Industri</h3>
              <p style={{ fontSize: '0.85rem', color: 'rgba(242,245,239,0.6)', fontFamily: 'var(--font-body)', lineHeight: '1.7' }}>Kerjasama magang dengan BPLHD, perusahaan AMDK, konsultan lingkungan, dan industri manufaktur berwawasan lingkungan.</p>
            </div>
            <div className="card-dark fade-up delay-3" style={{ padding: '32px', borderRadius: '16px' }}>
              <div style={{ width: '44px', height: '44px', background: 'rgba(78,140,90,0.2)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}><svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--gold-light)" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10z" /><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" /></svg></div>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', color: 'var(--cream)', marginBottom: '10px' }}>Green Campus Initiative</h3>
              <p style={{ fontSize: '0.85rem', color: 'rgba(242,245,239,0.6)', fontFamily: 'var(--font-body)', lineHeight: '1.7' }}>Program kampus berkelanjutan yang diprakarsai mahasiswa: pengelolaan kompos, bank sampah, dan audit energi gedung.</p>
            </div>
          </div>
        </div>
      </section>

      {/* EXPLORE MORE */}
      <section className="section">
        <div className="container">
          <div className="fade-up" style={{ marginBottom: '40px', textAlign: 'center' }}>
            <div className="section-tag" style={{ justifyContent: 'center' }}>— Pelajari Lebih Lanjut</div>
            <h2 className="section-title">Jelajahi Lebih Dalam</h2>
          </div>
          <div className="grid-4">
            <Link href="/sejarah" className="card fade-up" style={{ padding: '28px', textDecoration: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
              <div className="card-icon" style={{ margin: '0 auto 16px' }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--moss)" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" /></svg>
              </div>
              <div className="card-title">Sejarah</div>
              <div className="card-desc" style={{ flex: '1' }}>Perjalanan Prodi Teknik Lingkungan sejak berdiri hingga hari ini.</div>
              <div className="card-link" style={{ justifyContent: 'center', marginTop: '16px' }}>Selengkapnya →</div>
            </Link>
            <Link href="/visi-misi" className="card fade-up delay-1" style={{ padding: '28px', textDecoration: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
              <div className="card-icon" style={{ margin: '0 auto 16px' }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--moss)" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="6" /><circle cx="12" cy="12" r="2" /></svg>
              </div>
              <div className="card-title">Visi &amp; Misi</div>
              <div className="card-desc" style={{ flex: '1' }}>Arah dan tujuan prodi menuju keunggulan rekayasa lingkungan.</div>
              <div className="card-link" style={{ justifyContent: 'center', marginTop: '16px' }}>Selengkapnya →</div>
            </Link>
            <Link href="/fasilitas" className="card fade-up delay-2" style={{ padding: '28px', textDecoration: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
              <div className="card-icon" style={{ margin: '0 auto 16px' }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--moss)" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M9 3h6l1 8H8L9 3z" /><path d="M6.5 15a6 6 0 1 0 11 0l-1-4H7.5l-1 4z" /><line x1="12" y1="3" x2="12" y2="11" /></svg>
              </div>
              <div className="card-title">Fasilitas Lab</div>
              <div className="card-desc" style={{ flex: '1' }}>Tiga laboratorium berstandar tinggi untuk mendukung riset mahasiswa.</div>
              <div className="card-link" style={{ justifyContent: 'center', marginTop: '16px' }}>Selengkapnya →</div>
            </Link>
            <Link href="/staf" className="card fade-up delay-3" style={{ padding: '28px', textDecoration: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
              <div className="card-icon" style={{ margin: '0 auto 16px' }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--moss)" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>
              </div>
              <div className="card-title">Dosen &amp; Tendik</div>
              <div className="card-desc" style={{ flex: '1' }}>Kenali para pengampu yang berpengalaman di bidang teknik lingkungan.</div>
              <div className="card-link" style={{ justifyContent: 'center', marginTop: '16px' }}>Selengkapnya →</div>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
