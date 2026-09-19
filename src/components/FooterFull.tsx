import './footer.css';
import Link from 'next/link';
import Image from 'next/image';
import FooterYear from './FooterYear';
import { FacebookIcon, InstagramIcon, YoutubeIcon, TiktokIcon } from './BrandIcons';

const NAVIGASI = [
  { href: '/', label: 'Beranda' },
  { href: '/akademik', label: 'Akademik' },
  { href: '/fasilitas', label: 'Fasilitas Lab' },
  { href: '/profile', label: 'Profil Prodi' },
  { href: '/kontak', label: 'Kontak' },
];

const LAYANAN = [
  { href: '/staf', label: 'Alumni' },
  { href: '/mitra', label: 'Mitra Industri' },
  { href: '/akademik#pencapaian', label: 'Pencapaian' },
  { href: '/berita', label: 'Berita & Kegiatan' },
];

/**
 * Placeholder hrefs: swap each `#` for the prodi's real profile URL. The mark,
 * hover colour and accessible name are already wired per platform.
 */
const SOCIALS = [
  { label: 'Facebook', brand: 'is-facebook', href: '#', icon: <FacebookIcon /> },
  { label: 'Instagram', brand: 'is-instagram', href: '#', icon: <InstagramIcon /> },
  { label: 'YouTube', brand: 'is-youtube', href: '#', icon: <YoutubeIcon /> },
  { label: 'TikTok', brand: 'is-tiktok', href: '#', icon: <TiktokIcon /> },
];

export default function FooterFull() {
  return (
    <footer>
      <div className="footer-inner">
        <div
          className="footer-main-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: '1.5fr 1fr 1fr 1.5fr',
            gap: 40,
            marginBottom: 48,
          }}
        >
          <div className="footer-brand">
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
              <Image
                src="/logo-untan.webp"
                alt="Logo Universitas Tanjungpura"
                width={40}
                height={40}
                style={{ objectFit: 'contain' }}
              />
              <div>
                <div
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontWeight: 600,
                    color: 'var(--cream)',
                    fontSize: '0.95rem',
                  }}
                >
                  Teknik Lingkungan
                </div>
                <div
                  style={{
                    fontSize: '0.6rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.15em',
                    color: 'var(--moss)',
                    fontFamily: 'var(--font-body)',
                  }}
                >
                  Program Studi
                </div>
              </div>
            </div>
            <p>
              Program Studi Teknik Lingkungan — mencetak insinyur lingkungan yang kompeten,
              berdedikasi, dan berdampak nyata.
            </p>
            <div className="footer-socials" style={{ marginTop: 16 }}>
              {SOCIALS.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  className={`footer-social ${s.brand}`}
                  aria-label={s.label}
                  title={s.label}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          <div>
            <div className="footer-heading">Navigasi</div>
            <ul className="footer-links">
              {NAVIGASI.map((l) => (
                <li key={l.href}>
                  <Link href={l.href}>{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <div className="footer-heading">Layanan</div>
            <ul className="footer-links">
              {LAYANAN.map((l) => (
                <li key={l.href}>
                  <Link href={l.href}>{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <div className="footer-heading">Kontak</div>
            <div className="footer-contact-item">Gedung Teknik Lingkungan, Kampus Utama</div>
            <div className="footer-contact-item">(0561) 123-4567</div>
            <div className="footer-contact-item">tl.ft@untan.ac.id</div>
            <div className="footer-contact-item">Senin–Jumat 08.00–16.00 WIB</div>
          </div>
        </div>

        <div className="footer-bottom">
          <span>
            © <FooterYear initialYear={new Date().getFullYear()} /> Prodi Teknik Lingkungan. Hak
            cipta dilindungi.
          </span>
          <div className="footer-bottom-right">
            <div className="footer-legal-links">
              <Link href="/privacy-policy" className="legal-link">Kebijakan Privasi</Link>
              <Link href="/terms-of-use" className="legal-link">Syarat &amp; Ketentuan</Link>
              <Link href="/disclaimer" className="legal-link">Sanggahan</Link>
            </div>
            <span className="footer-powered">
              Powered by{' '}
              <a
                className="powered-link"
                href="https://sayba.id"
                target="_blank"
                rel="noopener noreferrer"
              >
                Sayba Arc
              </a>
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
