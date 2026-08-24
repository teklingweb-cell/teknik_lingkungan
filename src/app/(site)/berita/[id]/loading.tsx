/**
 * The skeleton the static page showed while its fetch was in flight. Prerendered
 * articles never hit this; it only appears while ISR renders an id on demand.
 */
export default function Loading() {
  return (
    <>
      <section className="article-hero" style={{ minHeight: 280 }}>
        <div className="article-hero-glow" />
        <div className="article-hero-inner">
          <div className="skeleton sk-block" style={{ width: 100, height: 14, marginBottom: 28 }} />
          <div
            className="skeleton sk-block"
            style={{ width: 80, height: 22, borderRadius: 99, marginBottom: 20 }}
          />
          <div className="skeleton sk-block" style={{ width: '90%', height: 42 }} />
          <div className="skeleton sk-block" style={{ width: '60%', height: 28 }} />
          <div className="skeleton sk-block" style={{ width: 200, height: 14, marginTop: 12 }} />
        </div>
      </section>
      <div className="article-cover-wrap" style={{ marginTop: 0 }}>
        <div className="skeleton" style={{ width: '100%', height: 300, borderRadius: 16 }} />
      </div>
      <div className="article-body">
        <div className="skeleton sk-block" style={{ width: '100%', height: 18 }} />
        <div className="skeleton sk-block" style={{ width: '95%', height: 18 }} />
        <div className="skeleton sk-block" style={{ width: '80%', height: 18 }} />
      </div>
    </>
  );
}
