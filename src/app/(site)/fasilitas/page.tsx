import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/seo';
import Link from 'next/link';

export const metadata: Metadata = pageMetadata({
  title: 'Fasilitas Laboratorium',
  description:
    'Laboratorium dan fasilitas penunjang Prodi Teknik Lingkungan Untan — kualitas air, kualitas udara, dan limbah padat — untuk praktikum dan penelitian mahasiswa.',
  path: '/fasilitas',
});

export default function FasilitasPage() {
  return (
    <>
      <div className="page-hero">
        <div className="page-hero-glow"></div>
        <div className="container" style={{ position: 'relative' }}>
          <div className="page-hero-tag">Infrastruktur Riset</div>
          <h1 className="page-hero-title">Fasilitas Laboratorium</h1>
          <p className="page-hero-subtitle">Tiga laboratorium utama Prodi Teknik Lingkungan dengan peralatan mutakhir untuk mendukung penelitian kualitas lingkungan.</p>
          <div className="breadcrumb"><Link href="/">Beranda</Link><span>›</span><span>Fasilitas</span></div>
        </div>
      </div>

      {/* LAB 01 – KIMIA */}
      <section className="lab-section" id="kimia" style={{ background: 'var(--cream)' }}>
        <div className="container">
          <div className="lab-grid">
            <div className="fade-up">
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                <div style={{ width: '40px', height: '40px', background: 'rgba(78,140,90,0.1)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem' }}><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#4e8c5a" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M9 3h6l1 8H8L9 3z" /><path d="M6.5 15a6 6 0 1 0 11 0l-1-4H7.5l-1 4z" /><line x1="12" y1="3" x2="12" y2="11" /></svg></div>
                <span style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.2em', color: 'var(--gold)', fontFamily: 'var(--font-body)', fontWeight: '500' }}>Lab 01</span>
              </div>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem,4vw,3rem)', fontWeight: '300', color: 'var(--navy)', lineHeight: '1.1', marginBottom: '16px' }}>Laboratorium Kimia</h2>
              <div className="gold-divider"></div>
              <p style={{ color: 'rgba(45,58,46,0.7)', fontFamily: 'var(--font-body)', lineHeight: '1.7', marginTop: '16px', marginBottom: '24px' }}>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Laboratorium Kimia kami dilengkapi peralatan mutakhir untuk mendukung riset sintesis organik, analisis kimia lingkungan, dan pengembangan material baru.</p>
              <div className="lab-stats">
                <div><div className="lab-stat-val">420 m²</div><div className="lab-stat-lbl" style={{ color: 'rgba(45,58,46,0.5)' }}>Luas</div></div>
                <div><div className="lab-stat-val">32</div><div className="lab-stat-lbl" style={{ color: 'rgba(45,58,46,0.5)' }}>Kapasitas Peneliti</div></div>
              </div>
              <Link href="/kontak" className="btn-primary" style={{ background: 'var(--navy)' }}>Jadwalkan Kunjungan</Link>
            </div>
            <div className="fade-up delay-2">
              <div style={{ background: 'linear-gradient(135deg,rgba(245,158,11,0.2),rgba(245,158,11,0.05))', border: '1px solid rgba(26,46,30,0.08)', borderRadius: '16px', padding: '24px' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'rgba(45,58,46,0.6)', fontFamily: 'var(--font-body)', marginBottom: '16px' }}>Peralatan Utama</div>
                <ul className="equipment-list">
                  <li className="equipment-item"><span className="check">✓</span><span style={{ color: 'rgba(45,58,46,0.8)' }}>GCMS Agilent 7890B</span></li>
                  <li className="equipment-item"><span className="check">✓</span><span style={{ color: 'rgba(45,58,46,0.8)' }}>HPLC Waters Alliance</span></li>
                  <li className="equipment-item"><span className="check">✓</span><span style={{ color: 'rgba(45,58,46,0.8)' }}>Spektrofotometer UV-Vis</span></li>
                  <li className="equipment-item"><span className="check">✓</span><span style={{ color: 'rgba(45,58,46,0.8)' }}>Atomic Absorption Spectrometer</span></li>
                  <li className="equipment-item"><span className="check">✓</span><span style={{ color: 'rgba(45,58,46,0.8)' }}>X-Ray Diffractometer</span></li>
                  <li className="equipment-item"><span className="check">✓</span><span style={{ color: 'rgba(45,58,46,0.8)' }}>Nuclear Magnetic Resonance</span></li>
                </ul>
                <div className="lab-placeholder" style={{ background: 'rgba(242,245,239,0.05)', border: '1px solid rgba(242,245,239,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,0.3)', fontSize: '0.75rem', fontFamily: '\'Inter\',sans-serif' }}>Foto Laboratorium</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* LAB 02 – MIKROBIOLOGI */}
      <section className="lab-section" id="mikrobiologi" style={{ background: 'var(--navy)' }}>
        <div className="container">
          <div className="lab-grid">
            <div className="fade-up delay-2">
              <div style={{ background: 'linear-gradient(135deg,rgba(16,185,129,0.2),rgba(16,185,129,0.05))', border: '1px solid rgba(242,245,239,0.1)', borderRadius: '16px', padding: '24px' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'rgba(242,245,239,0.6)', fontFamily: 'var(--font-body)', marginBottom: '16px' }}>Peralatan Utama</div>
                <ul className="equipment-list">
                  <li className="equipment-item"><span className="check">✓</span><span style={{ color: 'rgba(242,245,239,0.8)' }}>Flow Cytometer BD FACSAria</span></li>
                  <li className="equipment-item"><span className="check">✓</span><span style={{ color: 'rgba(242,245,239,0.8)' }}>Real-Time PCR Applied Biosystems</span></li>
                  <li className="equipment-item"><span className="check">✓</span><span style={{ color: 'rgba(242,245,239,0.8)' }}>Biosafety Cabinet Class II A2</span></li>
                  <li className="equipment-item"><span className="check">✓</span><span style={{ color: 'rgba(242,245,239,0.8)' }}>CO2 Incubator</span></li>
                  <li className="equipment-item"><span className="check">✓</span><span style={{ color: 'rgba(242,245,239,0.8)' }}>Ultra-Low Freezer -80°C</span></li>
                  <li className="equipment-item"><span className="check">✓</span><span style={{ color: 'rgba(242,245,239,0.8)' }}>Confocal Microscope Leica</span></li>
                </ul>
                <div className="lab-placeholder" style={{ background: 'rgba(242,245,239,0.05)', border: '1px solid rgba(242,245,239,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,0.3)', fontSize: '0.75rem', fontFamily: '\'Inter\',sans-serif' }}>Foto Laboratorium</div>
              </div>
            </div>
            <div className="fade-up">
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                <div style={{ width: '40px', height: '40px', background: 'rgba(78,140,90,0.2)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem' }}><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--gold-light)" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><path d="M11 8v3l2 2" /><line x1="16.5" y1="16.5" x2="22" y2="22" /><circle cx="11" cy="11" r="3" /></svg></div>
                <span style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.2em', color: 'var(--gold)', fontFamily: 'var(--font-body)', fontWeight: '500' }}>Lab 02</span>
              </div>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem,4vw,3rem)', fontWeight: '300', color: 'var(--cream)', lineHeight: '1.1', marginBottom: '16px' }}>Laboratorium Mikrobiologi</h2>
              <div className="gold-divider"></div>
              <p style={{ color: 'rgba(242,245,239,0.7)', fontFamily: 'var(--font-body)', lineHeight: '1.7', marginTop: '16px', marginBottom: '24px' }}>Lab Mikrobiologi kami memiliki fasilitas Biosafety Level 2 yang memungkinkan penelitian pada berbagai agen biologis dengan keamanan penuh.</p>
              <div className="lab-stats">
                <div><div className="lab-stat-val">380 m²</div><div className="lab-stat-lbl" style={{ color: 'rgba(242,245,239,0.5)' }}>Luas</div></div>
                <div><div className="lab-stat-val">24</div><div className="lab-stat-lbl" style={{ color: 'rgba(242,245,239,0.5)' }}>Kapasitas Peneliti</div></div>
              </div>
              <Link href="/kontak" className="btn-gold">Jadwalkan Kunjungan</Link>
            </div>
          </div>
        </div>
      </section>

      {/* LAB 03 – UDARA */}
      <section className="lab-section" id="udara" style={{ background: 'var(--cream)' }}>
        <div className="container">
          <div className="lab-grid">
            <div className="fade-up">
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                <div style={{ width: '40px', height: '40px', background: 'rgba(78,140,90,0.1)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem' }}><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#4e8c5a" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M17.7 7.7a2.5 2.5 0 1 1 1.8 4.3H2" /><path d="M9.6 4.6A2 2 0 1 1 11 8H2" /><path d="M12.6 19.4A2 2 0 1 0 14 16H2" /></svg></div>
                <span style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.2em', color: 'var(--gold)', fontFamily: 'var(--font-body)', fontWeight: '500' }}>Lab 03</span>
              </div>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem,4vw,3rem)', fontWeight: '300', color: 'var(--navy)', lineHeight: '1.1', marginBottom: '16px' }}>Laboratorium Udara</h2>
              <div className="gold-divider"></div>
              <p style={{ color: 'rgba(45,58,46,0.7)', fontFamily: 'var(--font-body)', lineHeight: '1.7', marginTop: '16px', marginBottom: '24px' }}>Laboratorium Udara mendukung penelitian kualitas lingkungan atmosfer termasuk monitoring polutan udara, identifikasi partikulat, dan pemodelan dispersi gas.</p>
              <div className="lab-stats">
                <div><div className="lab-stat-val">290 m²</div><div className="lab-stat-lbl" style={{ color: 'rgba(45,58,46,0.5)' }}>Luas</div></div>
                <div><div className="lab-stat-val">18</div><div className="lab-stat-lbl" style={{ color: 'rgba(45,58,46,0.5)' }}>Kapasitas Peneliti</div></div>
              </div>
              <Link href="/kontak" className="btn-primary">Jadwalkan Kunjungan</Link>
            </div>
            <div className="fade-up delay-2">
              <div style={{ background: 'linear-gradient(135deg,rgba(14,165,233,0.2),rgba(14,165,233,0.05))', border: '1px solid rgba(26,46,30,0.08)', borderRadius: '16px', padding: '24px' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'rgba(45,58,46,0.6)', fontFamily: 'var(--font-body)', marginBottom: '16px' }}>Peralatan Utama</div>
                <ul className="equipment-list">
                  <li className="equipment-item"><span className="check">✓</span><span style={{ color: 'rgba(45,58,46,0.8)' }}>Air Quality Monitor Thermo Scientific</span></li>
                  <li className="equipment-item"><span className="check">✓</span><span style={{ color: 'rgba(45,58,46,0.8)' }}>Particle Counter TSI</span></li>
                  <li className="equipment-item"><span className="check">✓</span><span style={{ color: 'rgba(45,58,46,0.8)' }}>Gas Analyzer Multi-channel</span></li>
                  <li className="equipment-item"><span className="check">✓</span><span style={{ color: 'rgba(45,58,46,0.8)' }}>Weather Station Davis Vantage Pro</span></li>
                  <li className="equipment-item"><span className="check">✓</span><span style={{ color: 'rgba(45,58,46,0.8)' }}>LIDAR Portable</span></li>
                  <li className="equipment-item"><span className="check">✓</span><span style={{ color: 'rgba(45,58,46,0.8)' }}>PM2.5/PM10 Sampler</span></li>
                </ul>
                <div className="lab-placeholder" style={{ background: 'rgba(242,245,239,0.05)', border: '1px solid rgba(242,245,239,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,0.3)', fontSize: '0.75rem', fontFamily: '\'Inter\',sans-serif' }}>Foto Laboratorium</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="section bg-white">
        <div className="container">
          <div className="fade-up" style={{ marginBottom: '40px' }}>
            <div className="section-tag">— FAQ</div>
            <h2 className="section-title">Pertanyaan Umum</h2>
          </div>
          <div style={{ maxWidth: '640px' }}>
            <div className="faq-item fade-up">
              <button className="faq-btn">Bagaimana prosedur peminjaman laboratorium untuk mahasiswa?<svg className="faq-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9" /></svg></button>
              <div className="faq-answer"><p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mahasiswa dapat mengajukan permohonan peminjaman melalui portal akademik dengan melampirkan proposal penelitian yang telah disetujui dosen pembimbing.</p></div>
            </div>
            <div className="faq-item fade-up delay-1">
              <button className="faq-btn">Apakah fasilitas lab tersedia untuk peneliti luar institusi?<svg className="faq-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9" /></svg></button>
              <div className="faq-answer"><p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fasilitas laboratorium kami terbuka untuk peneliti eksternal melalui skema kerjasama institusional atau perjanjian MoU.</p></div>
            </div>
            <div className="faq-item fade-up delay-2">
              <button className="faq-btn">Berapa biaya penggunaan peralatan laboratorium?<svg className="faq-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9" /></svg></button>
              <div className="faq-answer"><p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Biaya penggunaan bervariasi tergantung jenis peralatan dan durasi penggunaan. Mahasiswa aktif mendapatkan subsidi khusus.</p></div>
            </div>
            <div className="faq-item fade-up delay-3">
              <button className="faq-btn">Bagaimana cara mendaftar sebagai pengguna tetap laboratorium?<svg className="faq-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9" /></svg></button>
              <div className="faq-answer"><p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pendaftaran dilakukan melalui Biro Laboratorium Terpadu dengan mengisi formulir pendaftaran dan mengikuti orientasi keselamatan laboratorium.</p></div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
