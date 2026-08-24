import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { supabasePublic } from '@/lib/supabase/public';
import type { News } from '@/lib/types';
import { toGDriveImg, formatDateShort } from '@/lib/utils';

export const revalidate = 60;

// Ids that appear after the build get rendered on first request, then cached.
export const dynamicParams = true;

async function getArticle(id: string): Promise<News | null> {
  const numericId = Number(id);
  if (!Number.isInteger(numericId)) return null;

  const { data, error } = await supabasePublic
    .from('news')
    .select('*')
    .eq('id', numericId)
    .single();

  if (error || !data) return null;
  return data as News;
}

export async function generateStaticParams() {
  const { data } = await supabasePublic.from('news').select('id').limit(200);
  return (data ?? []).map((row: { id: number }) => ({ id: String(row.id) }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const article = await getArticle(id);
  if (!article) return { title: 'Berita tidak ditemukan' };

  const cover = toGDriveImg(article.image_url, 1200);

  return {
    title: article.title,
    description: article.excerpt ?? undefined,
    openGraph: {
      title: article.title,
      description: article.excerpt ?? undefined,
      type: 'article',
      images: cover ? [cover] : undefined,
    },
  };
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

export default async function BeritaDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const article = await getArticle(id);
  if (!article) notFound();

  const cover = toGDriveImg(article.image_url, 1200);

  return (
    <>
      <section className="article-hero">
        <div className="article-hero-glow" />
        <div className="article-hero-inner">
          <Link href="/berita" className="article-back">
            ke Berita
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
            Berita
          </Link>
          <span>
            <span className="tag">{article.category}</span>
          </span>
        </div>
      </div>
    </>
  );
}
