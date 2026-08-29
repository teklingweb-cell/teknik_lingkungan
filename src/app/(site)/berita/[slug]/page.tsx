import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound, permanentRedirect } from 'next/navigation';
import type { News } from '@/lib/types';
import { toGDriveImg, formatDateShort } from '@/lib/utils';
import { resolveNews, allSlugs } from '@/lib/content';
import { pageMetadata } from '@/lib/seo';
import JsonLd from '@/components/JsonLd';
import { articleJsonLd, breadcrumbJsonLd } from '@/lib/jsonld';

export const revalidate = 60;

// Slugs published after the build render on first request, then cache.
export const dynamicParams = true;

export async function generateStaticParams() {
  const slugs = await allSlugs('news');
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const found = await resolveNews<News>(slug);

  // An unknown segment must answer 404, not a 200 page that says "not found" —
  // Google records the latter as a soft 404 and keeps the URL in the index.
  if (!found) notFound();

  const article = found.row;

  return pageMetadata({
    title: article.title,
    // Falls back to a sentence built from the row, so a berita without an
    // excerpt still gets a real description instead of none at all.
    description:
      article.excerpt?.trim() ||
      `${article.title ?? 'Berita'} — berita ${article.category ?? 'kegiatan'} Program Studi Teknik Lingkungan Universitas Tanjungpura.`,
    // Always the slug URL, even when the visitor arrived on the old id one,
    // so Google is told which single address is the real page.
    path: `/berita/${found.slug}`,
    // No cover? Fall back to the site card inside pageMetadata, so the link
    // still previews as the prodi rather than as a bare URL.
    image: toGDriveImg(article.image_url, 1200),
    imageAlt: article.title,
    type: 'article',
    publishedTime: article.date ?? undefined,
    authors: article.author ? [article.author] : undefined,
    section: article.category ?? undefined,
  });
}

/** "Budi Santoso" -> "BS", used for the author avatar. */
function initialsOf(author: string | null): string {
  return (author || '?')
    .split(' ')
    .map((w) => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
}

export default async function BeritaDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const found = await resolveNews<News>(slug);
  if (!found) notFound();

  // Arrived on /berita/14? Move to /berita/judul-berita permanently, so the
  // old links keep working and hand their ranking to the new address.
  if (found.shouldRedirect) permanentRedirect(`/berita/${found.slug}`);

  const article = found.row;
  const cover = toGDriveImg(article.image_url, 1200);

  return (
    <>
      <JsonLd
        data={[
          articleJsonLd({
            headline: article.title,
            description: article.excerpt,
            path: `/berita/${found.slug}`,
            image: cover,
            datePublished: article.date,
            author: article.author,
            section: article.category,
          }),
          breadcrumbJsonLd([
            { name: 'Berita', path: '/berita' },
            { name: article.title, path: `/berita/${found.slug}` },
          ]),
        ]}
      />
      <section className="article-hero">
        <div className="article-hero-glow" />
        <div className="article-hero-inner">
          <Link href="/berita" className="article-back">
            ← ke Berita
          </Link>
          <div className="article-meta-row">
            <span className="tag">{article.category}</span>
            <span
              style={{
                fontSize: '0.75rem',
                color: 'rgba(242,245,239,0.4)',
                fontFamily: 'var(--font-body)',
              }}
            >
              {formatDateShort(article.date)}
            </span>
          </div>
          <div className="article-title fade-up">{article.title}</div>
          <div className="article-byline">
            <span>{article.author}</span>
          </div>
        </div>
      </section>

      <div className="article-cover-wrap">
        {cover ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img src={cover} alt={article.title} className="article-cover" loading="lazy" />
        ) : (
          <div className="article-cover-placeholder">{article.id}</div>
        )}
      </div>

      <div className="article-body">
        <p className="article-excerpt">{article.excerpt}</p>

        {article.link_url && (
          <div style={{ padding: '32px 0 8px' }}>
            <a
              href={article.link_url}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 10,
                padding: '14px 28px',
                background: 'var(--navy)',
                color: 'var(--cream)',
                borderRadius: 12,
                textDecoration: 'none',
                fontFamily: 'var(--font-body)',
                fontSize: '0.9rem',
                fontWeight: 600,
              }}
            >
              Buka Artikel Lengkap ↗
            </a>
          </div>
        )}

        <div className="article-footer-meta">
          <div className="article-author-pill">
            <div className="author-avatar">{initialsOf(article.author)}</div>
            <div>
              <div className="author-name">{article.author}</div>
              <div className="author-role">Penulis / Unit</div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <span className="tag">{article.category}</span>
          </div>
        </div>
      </div>

      <div className="article-nav-bar">
        <div className="article-nav-inner">
          <Link
            href="/berita"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              fontSize: '0.83rem',
              color: 'var(--muted)',
              textDecoration: 'none',
              fontFamily: 'var(--font-body)',
            }}
          >
            ← Berita
          </Link>
          <span>
            <span className="tag">{article.category}</span>
          </span>
        </div>
      </div>
    </>
  );
}
