import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/seo';
import Link from 'next/link';
import './visi-misi.css';

export const metadata: Metadata = pageMetadata({
  title: 'Visi & Misi',
  description:
    'Visi, misi, dan tujuan Program Studi Teknik Lingkungan Universitas Tanjungpura, beserta visi-misi Untan dan Fakultas Teknik yang menaunginya.',
  path: '/visi-misi',
});

export default function VisiMisiPage() {
  return (
    <>
      <div className="page-hero">
        <div className="page-hero-glow"></div>
        <div className="container" style={{ position: 'relative' }}>
          <div className="page-hero-tag">Tentang Prodi</div>
          <h1 className="page-hero-title">Visi &amp; Misi</h1>
          <p className="page-hero-subtitle">Landasan arah dan tujuan Program Studi Teknik Lingkungan dalam menghasilkan insinyur lingkungan yang berdaya saing dan berdampak.</p>
          <div className="breadcrumb"><Link href="/">Beranda</Link><span>›</span><Link href="/profile">Tentang Prodi</Link><span>›</span><span>Visi &amp; Misi</span></div>
        </div>
      </div>

      {/* VISI MISI HIERARCHY */}
      <section className="section">
        <div className="container">
          <div className="fade-up" style={{ marginBottom: '40px' }}>
            {/* Judulnya dulu "Visi & Misi" — sama persis dengan <h1> di hero
                tepat di atasnya, jadi kata yang sama muncul dua kali berurutan.
                Sekarang menyebutkan isi seksinya: tiga tingkat kelembagaan. */}
            <div className="section-tag">— Hierarki Kelembagaan</div>
            <h2 className="section-title">Universitas, Fakultas, dan Program Studi</h2>
            <p className="vm-lead">Dari tingkat universitas hingga jurusan — satu arah, satu tujuan.</p>
          </div>

          {/* UNTAN */}
          <div className="fade-up" style={{ marginBottom: '40px' }}>
            <div className="vm-tier">
              <span className="vm-dot"></span>
              <span className="vm-tier-label">Universitas Tanjungpura</span>
            </div>
            <div className="grid-2">
              <div className="vm-card">
                <div className="vm-card-label">Visi Untan</div>
                <p className="vm-quote">
                  "Menjadi Universitas Inovatif dan Berdaya saing global, serta unggul dalam Pengembangan Wilayah Tropis dan Perbatasan, dijiwai nilai-nilai Pancasila."
                </p>
              </div>
              <div className="vm-card">
                <div className="vm-card-label">Misi Untan</div>
                <div className="vm-list">
                  <div className="vm-item"><span className="vm-num">1.</span>Menyelenggarakan pendidikan dan pembelajaran yang inovatif, adaptif, dan berbasis teknologi.</div>
                  <div className="vm-item"><span className="vm-num">2.</span>Menyelenggarakan penelitian yang menghasilkan temuan baru yang bermanfaat bagi masyarakat dan lingkungan.</div>
                  <div className="vm-item"><span className="vm-num">3.</span>Menyelenggarakan pengabdian kepada masyarakat untuk membangun dan menyejahterakan masyarakat di bidang IPTEKS dan keunggulan wilayah tropis dan perbatasan.</div>
                  <div className="vm-item"><span className="vm-num">4.</span>Menyelenggarakan tata kelola perguruan tinggi dengan prinsip good university government.</div>
                  <div className="vm-item"><span className="vm-num">5.</span>Meningkatkan kerja sama dengan stakeholders dalam dan luar negeri untuk mewujudkan Tridharma yang berdaya saing global.</div>
                </div>
              </div>
            </div>
          </div>

          {/* FAKULTAS TEKNIK */}
          <div className="fade-up delay-1" style={{ marginBottom: '40px' }}>
            <div className="vm-tier">
              <span className="vm-dot"></span>
              <span className="vm-tier-label">Fakultas Teknik</span>
            </div>
            <div className="grid-2">
              <div className="vm-card">
                <div className="vm-card-label">Visi Fakultas Teknik</div>
                <p className="vm-quote">
                  "Menjadi Fakultas Teknik yang unggul, inovatif, dan berdaya saing global dalam pengembangan teknologi rekayasa berbasis kearifan lokal untuk pembangunan wilayah tropis dan perbatasan yang dijiwai nilai-nilai Pancasila."
                </p>
              </div>
              <div className="vm-card">
                <div className="vm-card-label">Misi Fakultas Teknik</div>
                <div className="vm-list">
                  <div className="vm-item"><span className="vm-num">1.</span>Menyelenggarakan pendidikan dan pembelajaran yang inovatif dan adaptif di bidang teknologi rekayasa.</div>
                  <div className="vm-item"><span className="vm-num">2.</span>Menyelenggarakan penelitian yang menghasilkan inovasi teknologi untuk mendukung pembangunan wilayah tropis dan perbatasan.</div>
                  <div className="vm-item"><span className="vm-num">3.</span>Menyelenggarakan pengabdian kepada masyarakat melalui penerapan inovasi teknologi tepat guna berbasis kearifan lokal.</div>
                  <div className="vm-item"><span className="vm-num">4.</span>Menyelenggarakan tata kelola fakultas dengan prinsip good faculty governance.</div>
                  <div className="vm-item"><span className="vm-num">5.</span>Menyelenggarakan kerja sama dengan stakeholders dalam dan luar negeri guna mewujudkan Tridharma untuk mendukung pembangunan wilayah tropis dan perbatasan.</div>
                </div>
              </div>
            </div>
          </div>

          {/* JURUSAN TL — MAIN HIGHLIGHT */}
          <div className="fade-up delay-2">
            <div className="vm-tier">
              <span className="vm-dot on"></span>
              <span className="vm-tier-label on">Jurusan Teknik Lingkungan</span>
            </div>
            <div className="grid-2">
              <div className="vm-card vm-card-prodi">
                <div className="vm-icon">V</div>
                <h3 className="vm-card-title">Visi Jurusan</h3>
                <p className="vm-quote-lg">
                  "Mengembangkan keilmuan Teknik Lingkungan yang unggul dalam Rekayasa Infrastruktur, Pengendalian Pencemaran, dan Manajemen Lingkungan berbasis kearifan lokal untuk mendukung pembangunan berkelanjutan di wilayah tropis dan perbatasan."
                </p>
              </div>
              <div className="vm-card vm-card-prodi soft">
                <div className="vm-icon">M</div>
                <h3 className="vm-card-title">Misi Jurusan</h3>
                <div className="vm-list lg">
                  <div className="vm-item lg">
                    <span className="vm-num-circle">1</span>
                    Menyelenggarakan pendidikan dan pembelajaran yang inovatif dan berorientasi dalam bidang teknik lingkungan untuk menghasilkan lulusan profesional, berintegritas, dan berdaya saing.
                  </div>
                  <div className="vm-item lg">
                    <span className="vm-num-circle">2</span>
                    Menyelenggarakan penelitian di bidang lingkungan yang mendorong inovasi dan teknologi dalam pengelolaan kualitas lingkungan dan pengendalian pencemaran untuk mendukung pembangunan berkelanjutan di wilayah tropis dan perbatasan.
                  </div>
                  <div className="vm-item lg">
                    <span className="vm-num-circle">3</span>
                    Menyelenggarakan pengabdian kepada masyarakat berbasis teknologi lingkungan tepat guna untuk meningkatkan kualitas masyarakat dan kelestarian lingkungan.
                  </div>
                  <div className="vm-item lg">
                    <span className="vm-num-circle">4</span>
                    Meningkatkan kerja sama dengan pemerintah, industri dan masyarakat, dalam mendukung pelaksanaan Tri Dharma Perguruan Tinggi di bidang teknik lingkungan.
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      <section className="section bg-white">
        <div className="container">
          <div className="fade-up" style={{ marginBottom: '40px' }}>
            <div className="section-tag">— Bidang Kompetensi Utama</div>
            <h2 className="section-title">Tiga Pilar Keilmuan</h2>
            <p style={{ color: 'rgba(45,58,46,0.5)', fontFamily: 'var(--font-body)', fontSize: '0.9rem', marginTop: '8px' }}>Seluruh kurikulum dan riset jurusan bertumpu pada tiga bidang kompetensi saling melengkapi ini.</p>
          </div>
          {/* Dulu `style={{gridTemplateColumns:'repeat(3,1fr)'}}` inline — tiga
              kolom dipaku mati tanpa media query, dan gaya inline tidak bisa
              ditimpa media query. Di ponsel tiga kolom paragraf panjang ini
              memaksa halaman lebih lebar dari layar: itulah yang membuat
              halaman bisa digeser ke samping dan tombol menu terdorong ke luar
              layar. `.grid-3` adalah kelas yang dipakai halaman lain. */}
          <div className="grid-3">
            <div className="card vm-card-pad fade-up">
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '2.8rem', color: 'rgba(78,140,90,0.15)', fontWeight: '300', marginBottom: '12px' }}>01</div>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.15rem', color: 'var(--navy)', marginBottom: '10px' }}>Rekayasa Infrastruktur Lingkungan</h3>
              <p style={{ fontSize: '0.8rem', color: 'rgba(45,58,46,0.55)', fontFamily: 'var(--font-body)', lineHeight: '1.7' }}>Perencanaan dan perancangan sistem penyediaan air minum (SPAM), penyaluran dan pengolahan air buangan, drainase lingkungan, pengelolaan persampahan dan TPA, serta manajemen proyek infrastruktur.</p>
            </div>
            <div className="card vm-card-pad fade-up delay-1">
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '2.8rem', color: 'rgba(78,140,90,0.15)', fontWeight: '300', marginBottom: '12px' }}>02</div>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.15rem', color: 'var(--navy)', marginBottom: '10px' }}>Pengendalian Pencemaran Lingkungan</h3>
              <p style={{ fontSize: '0.8rem', color: 'rgba(45,58,46,0.55)', fontFamily: 'var(--font-body)', lineHeight: '1.7' }}>Pengendalian pencemaran udara (PPU), pengelolaan buangan industri (PBI), limbah padat, B3, pengendalian tanah dan air tanah (PTAT), AMDAL, serta statistika lingkungan terapan.</p>
            </div>
            <div className="card vm-card-pad fade-up delay-2">
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '2.8rem', color: 'rgba(78,140,90,0.15)', fontWeight: '300', marginBottom: '12px' }}>03</div>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.15rem', color: 'var(--navy)', marginBottom: '10px' }}>Manajemen Lingkungan</h3>
              <p style={{ fontSize: '0.8rem', color: 'rgba(45,58,46,0.55)', fontFamily: 'var(--font-body)', lineHeight: '1.7' }}>K3, kesehatan lingkungan dan masyarakat, konservasi lingkungan, ekonomi lingkungan, hukum dan etika lingkungan, sosiologi lingkungan, serta pemodelan berbasis GIS dan teknologi informasi.</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
