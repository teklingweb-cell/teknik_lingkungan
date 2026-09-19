import type { Metadata } from 'next';
import Link from 'next/link';
import { pageMetadata } from '@/lib/seo';
import { LABS } from './data';
import './fasilitas.css';

export const metadata: Metadata = pageMetadata({
  title: 'Fasilitas Laboratorium',
  description:
    'Tiga laboratorium Prodi Teknik Lingkungan Untan — Analisis Kualitas Lingkungan, Mikrobiologi Lingkungan, dan Udara — beserta peralatan yang tersedia untuk praktikum dan penelitian.',
  path: '/fasilitas',
});

const ICONS: Record<string, React.ReactNode> = {
  kimia: (
    <>
      <path d="M9 3h6l1 8H8L9 3z" />
      <path d="M6.5 15a6 6 0 1 0 11 0l-1-4H7.5l-1 4z" />
      <line x1="12" y1="3" x2="12" y2="11" />
    </>
  ),
  mikrobiologi: (
    <>
      <circle cx="11" cy="11" r="8" />
      <path d="M11 8v3l2 2" />
      <line x1="16.5" y1="16.5" x2="22" y2="22" />
      <circle cx="11" cy="11" r="3" />
    </>
  ),
  udara: (
    <>
      <path d="M17.7 7.7a2.5 2.5 0 1 1 1.8 4.3H2" />
      <path d="M9.6 4.6A2 2 0 1 1 11 8H2" />
      <path d="M12.6 19.4A2 2 0 1 0 14 16H2" />
    </>
  ),
};

function Icon({ children, dark }: { children: React.ReactNode; dark: boolean }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke={dark ? 'var(--gold-light)' : '#4e8c5a'}
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {children}
    </svg>
  );
}

/**
 * Panel peralatan.
 *
 * Daftarnya panjang — laboratorium kimia saja 38 jenis alat — jadi dibatasi
 * tingginya dan digulir di dalam panelnya sendiri. Tanpa itu satu bagian
 * laboratorium menjadi jauh lebih tinggi dari layar dan mendorong dua lab
 * lainnya sampai tidak terlihat. Bayangan tipis di tepi bawah menandakan
 * masih ada isi di bawahnya.
 */
function EquipmentPanel({
  alat,
  dark,
}: {
  alat: { nama: string; jumlah: number | null }[];
  dark: boolean;
}) {
  const totalUnit = alat.reduce((n, a) => n + (a.jumlah ?? 0), 0);

  return (
    <div className={`lab-panel${dark ? ' on-dark' : ''}`}>
      <div className="lab-panel-head">
        <span className="lab-panel-title">Peralatan Tersedia</span>
        <span className="lab-panel-count">{alat.length} jenis</span>
      </div>

      <div className="lab-scroll">
        <ul className="lab-equipment">
          {alat.map((a) => (
            <li key={a.nama}>
              <span className="lab-equipment-name">{a.nama}</span>
              {a.jumlah !== null && <span className="lab-equipment-qty">{a.jumlah}</span>}
            </li>
          ))}
        </ul>
      </div>

      <div className="lab-panel-foot">
        Total {totalUnit.toLocaleString('id-ID')} unit · gulir untuk melihat seluruh daftar
      </div>
    </div>
  );
}

export default function FasilitasPage() {
  return (
    <>
      <div className="page-hero">
        <div className="page-hero-glow" />
        <div className="container" style={{ position: 'relative' }}>
          <div className="page-hero-tag">Infrastruktur Riset</div>
          <h1 className="page-hero-title">Fasilitas Laboratorium</h1>
          <p className="page-hero-subtitle">
            Tiga laboratorium Prodi Teknik Lingkungan yang menopang praktikum, pengujian sampel, dan
            penelitian mahasiswa maupun dosen.
          </p>
          <div className="breadcrumb">
            <Link href="/">Beranda</Link>
            <span>›</span>
            <span>Fasilitas</span>
          </div>
        </div>
      </div>

      {LABS.map((lab, i) => {
        // Berselang-seling: latar gelap pada laboratorium kedua, dan sisi
        // panel peralatan bertukar agar halaman tidak terbaca monoton.
        const dark = i % 2 === 1;
        const panelFirst = dark;

        const heading = (
          <div className="fade-up">
            <div className="lab-badge">
              <span className={`lab-badge-icon${dark ? ' on-dark' : ''}`}>
                <Icon dark={dark}>{ICONS[lab.key]}</Icon>
              </span>
              <span className="lab-badge-text">{lab.nomor}</span>
            </div>

            <h2 className={`lab-title${dark ? ' on-dark' : ''}`}>{lab.ringkas}</h2>
            <div className="gold-divider" />
            <p className={`lab-desc${dark ? ' on-dark' : ''}`}>{lab.deskripsi}</p>

            <div className="lab-stats">
              <div>
                <div className="lab-stat-val">{lab.alat.length}</div>
                <div className={`lab-stat-lbl${dark ? ' on-dark' : ''}`}>Jenis Peralatan</div>
              </div>
              <div>
                <div className="lab-stat-val">
                  {lab.alat.reduce((n, a) => n + (a.jumlah ?? 0), 0).toLocaleString('id-ID')}
                </div>
                <div className={`lab-stat-lbl${dark ? ' on-dark' : ''}`}>Total Unit</div>
              </div>
            </div>

            <Link
              href="/kontak"
              className="btn-primary"
              style={{ background: dark ? 'var(--green, #4e8c5a)' : 'var(--navy)' }}
            >
              Jadwalkan Kunjungan
            </Link>
          </div>
        );

        const panel = (
          <div className="fade-up delay-2">
            <EquipmentPanel alat={lab.alat} dark={dark} />
          </div>
        );

        return (
          <section
            key={lab.key}
            className="lab-section"
            id={lab.key}
            style={{ background: dark ? 'var(--navy)' : 'var(--cream)' }}
          >
            <div className="container">
              <div className="lab-grid">
                {panelFirst ? panel : heading}
                {panelFirst ? heading : panel}
              </div>
            </div>
          </section>
        );
      })}

      {/* Catatan sumber data */}
      <section className="section">
        <div className="container">
          <p className="lab-source fade-up">
            Daftar peralatan di atas mengacu pada Laporan Kinerja Program Studi (LKPS) Teknik
            Lingkungan. Untuk keperluan pengujian sampel atau kunjungan laboratorium, silakan
            menghubungi prodi melalui halaman <Link href="/kontak">Kontak</Link>.
          </p>
        </div>
      </section>
    </>
  );
}
