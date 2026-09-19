import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/seo';
import Link from 'next/link';

export const metadata: Metadata = pageMetadata({
  title: 'Sejarah Prodi',
  description:
    'Sejarah singkat Program Studi Teknik Lingkungan Untan, dari pengajuan pada 2005–2006 hingga penerimaan mahasiswa pertama pada 2007.',
  path: '/sejarah',
});

export default function SejarahPage() {
  return (
    <>
      <div className="page-hero">
        <div className="page-hero-glow"></div>
        <div className="container" style={{ position: 'relative' }}>
          <div className="page-hero-tag">Tentang Prodi</div>
          <h1 className="page-hero-title">Sejarah Prodi</h1>
          <p className="page-hero-subtitle">Perjalanan Program Studi Teknik Lingkungan, dari tahap pengajuan hingga berkembang sebagai bagian dari Fakultas Teknik Untan.</p>
          <div className="breadcrumb"><Link href="/">Beranda</Link><span>›</span><Link href="/profile">Tentang Prodi</Link><span>›</span><span>Sejarah</span></div>
        </div>
      </div>

      <section className="section">
        <div className="container">
          <div className="fade-up">
            <div className="section-tag">— Perjalanan Kami</div>
            <h2 className="section-title">Tonggak Perjalanan Prodi</h2>
            <div className="gold-divider"></div>
            <p style={{ color: 'rgba(45,58,46,0.7)', fontFamily: 'var(--font-body)', fontWeight: '300', lineHeight: '1.7', maxWidth: '640px', marginTop: '16px' }}>Program Studi Teknik Lingkungan dibangun untuk mengembangkan keilmuan dan solusi rekayasa bagi persoalan lingkungan, terutama di wilayah tropis dan perbatasan.</p>
          </div>
          <div style={{ marginTop: '56px', display: 'flex', flexDirection: 'column', gap: '32px' }}>
            <div className="fade-up">
              <div className="timeline-year">2005–2006</div>
              <div className="timeline-title">Pengajuan Program Studi</div>
              <div className="timeline-desc">Proses pengajuan Program Studi Teknik Lingkungan dilaksanakan pada periode 2005–2006.</div>
            </div>
            <div className="fade-up delay-1">
              <div className="timeline-year">2006</div>
              <div className="timeline-title">Izin Operasional</div>
              <div className="timeline-desc">Program Studi Teknik Lingkungan memperoleh izin operasional pada tahun 2006.</div>
            </div>
            <div className="fade-up delay-2">
              <div className="timeline-year">2007</div>
              <div className="timeline-title">Penerimaan Mahasiswa Pertama</div>
              <div className="timeline-desc">Penerimaan mahasiswa angkatan pertama dimulai pada tahun 2007.</div>
            </div>
            <div className="fade-up delay-3">
              <div className="timeline-year">Saat ini</div>
              <div className="timeline-title">Akreditasi Baik Sekali</div>
              <div className="timeline-desc">Status akreditasi yang tercantum dalam profil jurusan adalah Baik Sekali, dengan masa berlaku hingga 11 Januari 2027.</div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
