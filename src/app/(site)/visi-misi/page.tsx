import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: "Visi & Misi",
  description: "Visi, misi, dan tujuan Program Studi Teknik Lingkungan Universitas Tanjungpura.",
};

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
      <section className="section bg-navy">
        <div className="container">
          <div className="fade-up" style={{ marginBottom: '40px' }}>
            <div className="section-tag">— Hierarki Kelembagaan</div>
            <h2 className="section-title light">Visi &amp; Misi</h2>
            <p style={{ color: 'rgba(242,245,239,0.5)', fontFamily: 'var(--font-body)', fontSize: '0.9rem', marginTop: '8px' }}>Dari tingkat universitas hingga jurusan — satu arah, satu tujuan.</p>
          </div>

          {/* UNTAN */}
          <div className="fade-up" style={{ marginBottom: '40px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
              <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'rgba(242,245,239,0.3)' }}></div>
              <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.75rem', color: 'rgba(242,245,239,0.4)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Universitas Tanjungpura</span>
            </div>
            <div className="grid-2">
              <div style={{ background: 'rgba(242,245,239,0.04)', border: '1px solid rgba(242,245,239,0.08)', borderRadius: '16px', padding: '28px' }}>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: '0.7rem', color: 'var(--gold-light)', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: '12px' }}>Visi Untan</div>
                <p style={{ fontSize: '0.875rem', color: 'rgba(242,245,239,0.75)', fontFamily: 'var(--font-body)', lineHeight: '1.7', fontStyle: 'italic' }}>
                  "Menjadi Universitas Inovatif dan Berdaya saing global, serta unggul dalam Pengembangan Wilayah Tropis dan Perbatasan, dijiwai nilai-nilai Pancasila."
                </p>
              </div>
              <div style={{ background: 'rgba(242,245,239,0.04)', border: '1px solid rgba(242,245,239,0.08)', borderRadius: '16px', padding: '28px' }}>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: '0.7rem', color: 'var(--gold-light)', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: '12px' }}>Misi Untan</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '0.8rem', color: 'rgba(242,245,239,0.65)', fontFamily: 'var(--font-body)', lineHeight: '1.6' }}><span style={{ flexShrink: '0', color: 'var(--gold-light)', fontSize: '0.7rem', marginTop: '3px' }}>1.</span>Menyelenggarakan pendidikan dan pembelajaran yang inovatif, adaptif, dan berbasis teknologi.</div>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '0.8rem', color: 'rgba(242,245,239,0.65)', fontFamily: 'var(--font-body)', lineHeight: '1.6' }}><span style={{ flexShrink: '0', color: 'var(--gold-light)', fontSize: '0.7rem', marginTop: '3px' }}>2.</span>Menyelenggarakan penelitian yang menghasilkan temuan baru yang bermanfaat bagi masyarakat dan lingkungan.</div>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '0.8rem', color: 'rgba(242,245,239,0.65)', fontFamily: 'var(--font-body)', lineHeight: '1.6' }}><span style={{ flexShrink: '0', color: 'var(--gold-light)', fontSize: '0.7rem', marginTop: '3px' }}>3.</span>Menyelenggarakan pengabdian kepada masyarakat untuk membangun dan menyejahterakan masyarakat di bidang IPTEKS dan keunggulan wilayah tropis dan perbatasan.</div>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '0.8rem', color: 'rgba(242,245,239,0.65)', fontFamily: 'var(--font-body)', lineHeight: '1.6' }}><span style={{ flexShrink: '0', color: 'var(--gold-light)', fontSize: '0.7rem', marginTop: '3px' }}>4.</span>Menyelenggarakan tata kelola perguruan tinggi dengan prinsip good university government.</div>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '0.8rem', color: 'rgba(242,245,239,0.65)', fontFamily: 'var(--font-body)', lineHeight: '1.6' }}><span style={{ flexShrink: '0', color: 'var(--gold-light)', fontSize: '0.7rem', marginTop: '3px' }}>5.</span>Meningkatkan kerja sama dengan stakeholders dalam dan luar negeri untuk mewujudkan Tridharma yang berdaya saing global.</div>
                </div>
              </div>
            </div>
          </div>

          {/* FAKULTAS TEKNIK */}
          <div className="fade-up delay-1" style={{ marginBottom: '40px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
              <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'rgba(242,245,239,0.3)' }}></div>
              <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.75rem', color: 'rgba(242,245,239,0.4)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Fakultas Teknik</span>
            </div>
            <div className="grid-2">
              <div style={{ background: 'rgba(242,245,239,0.04)', border: '1px solid rgba(242,245,239,0.08)', borderRadius: '16px', padding: '28px' }}>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: '0.7rem', color: 'var(--gold-light)', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: '12px' }}>Visi Fakultas Teknik</div>
                <p style={{ fontSize: '0.875rem', color: 'rgba(242,245,239,0.75)', fontFamily: 'var(--font-body)', lineHeight: '1.7', fontStyle: 'italic' }}>
                  "Menjadi Fakultas Teknik yang unggul, inovatif, dan berdaya saing global dalam pengembangan teknologi rekayasa berbasis kearifan lokal untuk pembangunan wilayah tropis dan perbatasan yang dijiwai nilai-nilai Pancasila."
                </p>
              </div>
              <div style={{ background: 'rgba(242,245,239,0.04)', border: '1px solid rgba(242,245,239,0.08)', borderRadius: '16px', padding: '28px' }}>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: '0.7rem', color: 'var(--gold-light)', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: '12px' }}>Misi Fakultas Teknik</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '0.8rem', color: 'rgba(242,245,239,0.65)', fontFamily: 'var(--font-body)', lineHeight: '1.6' }}><span style={{ flexShrink: '0', color: 'var(--gold-light)', fontSize: '0.7rem', marginTop: '3px' }}>1.</span>Menyelenggarakan pendidikan dan pembelajaran yang inovatif dan adaptif di bidang teknologi rekayasa.</div>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '0.8rem', color: 'rgba(242,245,239,0.65)', fontFamily: 'var(--font-body)', lineHeight: '1.6' }}><span style={{ flexShrink: '0', color: 'var(--gold-light)', fontSize: '0.7rem', marginTop: '3px' }}>2.</span>Menyelenggarakan penelitian yang menghasilkan inovasi teknologi untuk mendukung pembangunan wilayah tropis dan perbatasan.</div>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '0.8rem', color: 'rgba(242,245,239,0.65)', fontFamily: 'var(--font-body)', lineHeight: '1.6' }}><span style={{ flexShrink: '0', color: 'var(--gold-light)', fontSize: '0.7rem', marginTop: '3px' }}>3.</span>Menyelenggarakan pengabdian kepada masyarakat melalui penerapan inovasi teknologi tepat guna berbasis kearifan lokal.</div>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '0.8rem', color: 'rgba(242,245,239,0.65)', fontFamily: 'var(--font-body)', lineHeight: '1.6' }}><span style={{ flexShrink: '0', color: 'var(--gold-light)', fontSize: '0.7rem', marginTop: '3px' }}>4.</span>Menyelenggarakan tata kelola fakultas dengan prinsip good faculty governance.</div>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '0.8rem', color: 'rgba(242,245,239,0.65)', fontFamily: 'var(--font-body)', lineHeight: '1.6' }}><span style={{ flexShrink: '0', color: 'var(--gold-light)', fontSize: '0.7rem', marginTop: '3px' }}>5.</span>Menyelenggarakan kerja sama dengan stakeholders dalam dan luar negeri guna mewujudkan Tridharma untuk mendukung pembangunan wilayah tropis dan perbatasan.</div>
                </div>
              </div>
            </div>
          </div>

          {/* JURUSAN TL — MAIN HIGHLIGHT */}
          <div className="fade-up delay-2">
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--gold-light)' }}></div>
              <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.75rem', color: 'var(--gold-light)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Jurusan Teknik Lingkungan</span>
            </div>
            <div className="grid-2">
              <div style={{ background: 'rgba(78,140,90,0.12)', border: '1px solid rgba(78,140,90,0.3)', borderRadius: '16px', padding: '32px' }}>
                <div style={{ width: '48px', height: '48px', background: 'rgba(78,140,90,0.25)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-display)', color: 'var(--gold-light)', fontSize: '1.3rem', marginBottom: '20px' }}>V</div>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', color: 'var(--cream)', marginBottom: '12px' }}>Visi Jurusan</h3>
                <p style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', color: 'rgba(242,245,239,0.9)', fontWeight: '300', lineHeight: '1.6', fontStyle: 'italic' }}>
                  "Mengembangkan keilmuan Teknik Lingkungan yang unggul dalam Rekayasa Infrastruktur, Pengendalian Pencemaran, dan Manajemen Lingkungan berbasis kearifan lokal untuk mendukung pembangunan berkelanjutan di wilayah tropis dan perbatasan."
                </p>
              </div>
              <div style={{ background: 'rgba(78,140,90,0.08)', border: '1px solid rgba(78,140,90,0.2)', borderRadius: '16px', padding: '32px' }}>
                <div style={{ width: '48px', height: '48px', background: 'rgba(78,140,90,0.2)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-display)', color: 'var(--gold-light)', fontSize: '1.3rem', marginBottom: '20px' }}>M</div>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', color: 'var(--cream)', marginBottom: '16px' }}>Misi Jurusan</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', fontSize: '0.875rem', color: 'rgba(242,245,239,0.75)', fontFamily: 'var(--font-body)', lineHeight: '1.6' }}>
                    <span style={{ width: '22px', height: '22px', background: 'rgba(78,140,90,0.3)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--gold-light)', fontSize: '0.7rem', flexShrink: '0', marginTop: '1px' }}>1</span>
                    Menyelenggarakan pendidikan dan pembelajaran yang inovatif dan berorientasi dalam bidang teknik lingkungan untuk menghasilkan lulusan profesional, berintegritas, dan berdaya saing.
                  </div>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', fontSize: '0.875rem', color: 'rgba(242,245,239,0.75)', fontFamily: 'var(--font-body)', lineHeight: '1.6' }}>
                    <span style={{ width: '22px', height: '22px', background: 'rgba(78,140,90,0.3)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--gold-light)', fontSize: '0.7rem', flexShrink: '0', marginTop: '1px' }}>2</span>
                    Menyelenggarakan penelitian di bidang lingkungan yang mendorong inovasi dan teknologi dalam pengelolaan kualitas lingkungan dan pengendalian pencemaran untuk mendukung pembangunan berkelanjutan di wilayah tropis dan perbatasan.
                  </div>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', fontSize: '0.875rem', color: 'rgba(242,245,239,0.75)', fontFamily: 'var(--font-body)', lineHeight: '1.6' }}>
                    <span style={{ width: '22px', height: '22px', background: 'rgba(78,140,90,0.3)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--gold-light)', fontSize: '0.7rem', flexShrink: '0', marginTop: '1px' }}>3</span>
                    Menyelenggarakan pengabdian kepada masyarakat berbasis teknologi lingkungan tepat guna untuk meningkatkan kualitas masyarakat dan kelestarian lingkungan.
                  </div>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', fontSize: '0.875rem', color: 'rgba(242,245,239,0.75)', fontFamily: 'var(--font-body)', lineHeight: '1.6' }}>
                    <span style={{ width: '22px', height: '22px', background: 'rgba(78,140,90,0.3)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--gold-light)', fontSize: '0.7rem', flexShrink: '0', marginTop: '1px' }}>4</span>
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
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '24px' }}>
            <div className="card fade-up" style={{ padding: '32px' }}>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '2.8rem', color: 'rgba(78,140,90,0.15)', fontWeight: '300', marginBottom: '12px' }}>01</div>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.15rem', color: 'var(--navy)', marginBottom: '10px' }}>Rekayasa Infrastruktur Lingkungan</h3>
              <p style={{ fontSize: '0.8rem', color: 'rgba(45,58,46,0.55)', fontFamily: 'var(--font-body)', lineHeight: '1.7' }}>Perencanaan dan perancangan sistem penyediaan air minum (SPAM), penyaluran dan pengolahan air buangan, drainase lingkungan, pengelolaan persampahan dan TPA, serta manajemen proyek infrastruktur.</p>
            </div>
            <div className="card fade-up delay-1" style={{ padding: '32px' }}>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '2.8rem', color: 'rgba(78,140,90,0.15)', fontWeight: '300', marginBottom: '12px' }}>02</div>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.15rem', color: 'var(--navy)', marginBottom: '10px' }}>Pengendalian Pencemaran Lingkungan</h3>
              <p style={{ fontSize: '0.8rem', color: 'rgba(45,58,46,0.55)', fontFamily: 'var(--font-body)', lineHeight: '1.7' }}>Pengendalian pencemaran udara (PPU), pengelolaan buangan industri (PBI), limbah padat, B3, pengendalian tanah dan air tanah (PTAT), AMDAL, serta statistika lingkungan terapan.</p>
            </div>
            <div className="card fade-up delay-2" style={{ padding: '32px' }}>
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
