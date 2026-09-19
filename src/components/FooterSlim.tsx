import FooterYear from './FooterYear';

const barStyle: React.CSSProperties = {
  borderTop: '1px solid rgba(242,245,239,0.1)',
  paddingTop: 24,
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  flexWrap: 'wrap',
  gap: 8,
};

const textStyle: React.CSSProperties = {
  fontSize: '0.75rem',
  color: 'rgba(242,245,239,0.4)',
  fontFamily: 'var(--font-body)',
};

/**
 * The one-line footer used on every page except the home page.
 *
 * The static site had three near-identical copies of this (some missing the
 * "Powered by" credit, some missing "Hak cipta dilindungi."). This is the
 * fullest variant, matching the most recently updated pages.
 */
export default function FooterSlim() {
  return (
    <footer>
      <div className="footer-inner">
        <div style={barStyle}>
          <span style={textStyle}>
            © <FooterYear initialYear={new Date().getFullYear()} /> Prodi Teknik Lingkungan. Hak
            cipta dilindungi.
          </span>
          <span style={textStyle}>
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
    </footer>
  );
}
