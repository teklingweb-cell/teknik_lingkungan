import Link from 'next/link';
import { FileTextIcon } from '@/components/icons';

export default function NotFound() {
  return (
    <>
      <section className="article-hero" style={{ minHeight: 200 }}>
        <div className="article-hero-glow" />
      </section>
      <div className="state-wrap">
        {/* .state-icon reserves a 3.5rem slot and dims itself to 0.3 opacity. */}
        <div className="state-icon">
          <FileTextIcon size={56} strokeWidth={1.5} />
        </div>
        <div className="state-title">Berita tidak ditemukan</div>
        <div className="state-sub" style={{ marginBottom: 24 }}>
          Artikel yang Anda cari tidak ada atau telah dihapus.
        </div>
        <Link
          href="/berita"
          className="btn-primary"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            padding: '10px 20px',
            background: 'var(--navy)',
            color: 'var(--cream)',
            borderRadius: 8,
            textDecoration: 'none',
            fontFamily: 'var(--font-body)',
            fontSize: '0.875rem',
            fontWeight: 500,
          }}
        >
          ← ke Berita
        </Link>
      </div>
    </>
  );
}
