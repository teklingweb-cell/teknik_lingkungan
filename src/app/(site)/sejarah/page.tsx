import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: "Sejarah Prodi",
  description: "Perjalanan Program Studi Teknik Lingkungan — dari gagasan awal hingga menjadi prodi unggulan berwawasan keberlanjutan.",
};

export default function SejarahPage() {
  return (
    <>
      <div className="page-hero">
        <div className="page-hero-glow"></div>
        <div className="container" style={{ position: 'relative' }}>
          <div className="page-hero-tag">Tentang Prodi</div>
          <h1 className="page-hero-title">Sejarah Prodi</h1>
          <p className="page-hero-subtitle">Perjalanan Program Studi Teknik Lingkungan — dari gagasan awal hingga menjadi prodi unggulan berwawasan keberlanjutan.</p>
          <div className="breadcrumb"><Link href="/">Beranda</Link><span>›</span><Link href="/profile">Tentang Prodi</Link><span>›</span><span>Sejarah</span></div>
        </div>
      </div>

      <section className="section">
        <div className="container">
          <div className="fade-up">
            <div className="section-tag">— Perjalanan Kami</div>
            <h2 className="section-title">Dua Dekade Dedikasi</h2>
            <div className="gold-divider"></div>
            <p style={{ color: 'rgba(45,58,46,0.7)', fontFamily: 'var(--font-body)', fontWeight: '300', lineHeight: '1.7', maxWidth: '640px', marginTop: '16px' }}>Program Studi Teknik Lingkungan lahir dari kesadaran akan mendesaknya masalah lingkungan yang dihadapi Indonesia — dan tekad untuk melahirkan insinyur yang mampu menjawabnya secara ilmiah dan terukur.</p>
          </div>
          <div style={{ marginTop: '56px', display: 'flex', flexDirection: 'column', gap: '32px' }}>
            <div className="fade-up">
              <div className="timeline-year">2004</div>
              <div className="timeline-title">Pendirian Program Studi</div>
              <div className="timeline-desc">Prodi Teknik Lingkungan resmi berdiri di bawah Fakultas Teknik, didirikan oleh tim akademisi dan praktisi lingkungan yang merespons kebutuhan nasional akan tenaga ahli rekayasa lingkungan.</div>
            </div>
            <div className="fade-up delay-1">
              <div className="timeline-year">2008</div>
              <div className="timeline-title">Akreditasi Pertama</div>
              <div className="timeline-desc">Meraih akreditasi B dari BAN-PT pada evaluasi perdana, menandai pengakuan resmi atas kualitas penyelenggaraan pendidikan di bidang teknik lingkungan.</div>
            </div>
            <div className="fade-up delay-2">
              <div className="timeline-year">2012</div>
              <div className="timeline-title">Pembukaan Laboratorium Udara</div>
              <div className="timeline-desc">Laboratorium Udara resmi beroperasi, melengkapi Lab Kimia dan Lab Mikrobiologi yang sudah ada, memperluas kapasitas riset kualitas atmosfer dan polutan udara.</div>
            </div>
            <div className="fade-up delay-3">
              <div className="timeline-year">2016</div>
              <div className="timeline-title">Akreditasi A &amp; Kemitraan Industri</div>
              <div className="timeline-desc">Berhasil meraih akreditasi A dari BAN-PT, sekaligus menandatangani MoU dengan sejumlah perusahaan konsultan lingkungan dan BUMN sektor pengelolaan limbah.</div>
            </div>
            <div className="fade-up">
              <div className="timeline-year">2020</div>
              <div className="timeline-title">Kurikulum OBE &amp; Kampus Merdeka</div>
              <div className="timeline-desc">Transformasi kurikulum berbasis Outcome-Based Education (OBE) dan integrasi program Kampus Merdeka Merdeka Belajar, membuka jalur magang industri, studi independen, dan proyek desa.</div>
            </div>
            <div className="fade-up delay-1">
              <div className="timeline-year">2024</div>
              <div className="timeline-title">Akreditasi Unggul</div>
              <div className="timeline-desc">Prodi Teknik Lingkungan meraih status Akreditasi Unggul dari BAN-PT — pencapaian tertinggi yang mencerminkan komitmen kami terhadap mutu pendidikan, riset, dan pengabdian masyarakat.</div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
