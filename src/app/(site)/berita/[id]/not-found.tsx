import Link from 'next/link';

export default function NotFound() {
  return (
    <>
      <section className="article-hero" style={{ minHeight: 200 }}>
        <div className="article-hero-glow" />
      </section>
      <div className="state-wrap">
        <div className="state-icon" />
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
          ke Berita
        </Link>
      </div>
    </>
  );
}
