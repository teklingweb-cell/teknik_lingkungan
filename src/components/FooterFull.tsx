import './footer.css';
import Link from 'next/link';
import FooterYear from './FooterYear';

const NAVIGASI = [
  { href: '/', label: 'Beranda' },
  { href: '/penelitian', label: 'Penelitian' },
  { href: '/fasilitas', label: 'Fasilitas Lab' },
  { href: '/profile', label: 'Profil Prodi' },
  { href: '/kontak', label: 'Kontak' },
];

const LAYANAN = [
  { href: '/staf', label: 'Keanggotaan' },
  { href: '/mitra', label: 'Mitra Industri' },
  { href: '/pencapaian', label: 'Pencapaian' },
  { href: '/berita', label: 'Berita & Kegiatan' },
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
              <div
                style={{
                  width: 36,
                  height: 36,
                  background: 'var(--gold)',
                  borderRadius: 8,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontFamily: 'var(--font-display)',
                  fontWeight: 700,
                  color: 'var(--navy)',
                  fontSize: '0.65rem',
                  letterSpacing: '-0.5px',
                }}
              >
                TL
              </div>
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
              <a href="#" className="footer-social">F</a>
              <a href="#" className="footer-social">I</a>
              <a href="#" className="footer-social">Y</a>
              <a href="#" className="footer-social">T</a>
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
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <span style={{ color: 'rgba(242,245,239,0.4)', fontSize: '0.75rem' }}>
              Powered by{' '}
              <a
                className="powered-link"
                href="https://sayba.web.id"
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
