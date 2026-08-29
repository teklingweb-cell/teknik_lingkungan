'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import type { News } from '@/lib/types';
import { toGDriveImg, formatDateShort, slugOf } from '@/lib/utils';
import NewsCard from './NewsCard';

const FILTERS = ['all', 'Penelitian', 'Pencapaian', 'Acara', 'Pengumuman', 'Beasiswa'] as const;

const metaTextStyle: React.CSSProperties = {
  fontSize: '0.75rem',
  color: 'rgba(45,58,46,0.5)',
  fontFamily: 'var(--font-body)',
};

function FeaturedCard({ item }: { item: News }) {
  const imgSrc = toGDriveImg(item.image_url);

  return (
    <Link href={`/berita/${slugOf(item)}`} className="featured-card fade-up" style={{ textDecoration: 'none' }}>
      <div className="featured-thumb" style={{ position: 'relative', overflow: 'hidden' }}>
        {imgSrc ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={imgSrc}
            alt={item.title}
            loading="lazy"
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
          />
        ) : (
          <span
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '6rem',
              fontWeight: 300,
              color: 'rgba(26,46,30,0.15)',
            }}
          >
            {item.id}
          </span>
        )}
        <span className="featured-badge">Featured</span>
      </div>
      <div className="featured-body">
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
          <span className="tag">{item.category}</span>
          <span style={metaTextStyle}> {formatDateShort(item.date)}</span>
        </div>
        <div className="featured-title">{item.title}</div>
        <div className="featured-excerpt">{item.excerpt}</div>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            marginBottom: 24,
            ...metaTextStyle,
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="13"
            height="13"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </svg>
          <span>{item.author}</span>
        </div>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            color: 'var(--gold-light)',
            fontSize: '0.875rem',
            fontWeight: 500,
            fontFamily: 'var(--font-body)',
          }}
        >
          Baca Selengkapnya ›
        </div>
      </div>
    </Link>
  );
}

function EmptyState() {
  return (
    <div style={{ textAlign: 'center', padding: '60px 0' }}>
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 12 }}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="48"
          height="48"
          viewBox="0 0 24 24"
          fill="none"
          stroke="rgba(45,58,46,0.25)"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
          <line x1="16" y1="13" x2="8" y2="13" />
          <line x1="16" y1="17" x2="8" y2="17" />
        </svg>
      </div>
      <div style={{ fontSize: '1rem', fontWeight: 500, color: 'var(--navy)' }}>Belum ada berita</div>
      <div style={{ fontSize: '0.83rem', color: 'var(--muted)', marginTop: 6 }}>
        Tidak ada berita untuk kategori ini.
      </div>
    </div>
  );
}

/**
 * The berita listing. Rows arrive already sorted from the server component;
 * only the category filtering happens here, which is why this is the sole
 * client boundary on the page.
 */
export default function BeritaList({ news }: { news: News[] }) {
  const [filter, setFilter] = useState<string>('all');

  // The newest featured row is pulled out into the hero card; everything else
  // (including any older featured rows) falls through to the grid.
  const { featured, rest } = useMemo(() => {
    let featured: News | null = null;
    const rest: News[] = [];
    for (const item of news) {
      if (item.featured && !featured) featured = item;
      else rest.push(item);
    }
    return { featured, rest };
  }, [news]);

  const showFeatured = !!featured && (filter === 'all' || filter === featured.category);
  const filtered = filter === 'all' ? rest : rest.filter((n) => n.category === filter);
  const isEmpty = !showFeatured && filtered.length === 0;

  return (
    <>
      <div className="berita-filters fade-up" role="group" aria-label="Saring berita per kategori">
        {FILTERS.map((f) => (
          <button
            key={f}
            type="button"
            className={`filter-btn${filter === f ? ' active' : ''}`}
            aria-pressed={filter === f}
            onClick={() => setFilter(f)}
          >
            {f === 'all' ? 'Semua' : f}
          </button>
        ))}
      </div>

      <div>{showFeatured && featured && <FeaturedCard item={featured} />}</div>

      <div className="grid-3 berita-grid">
        {filtered.map((item) => (
          <NewsCard
            key={item.id}
            item={item}
            className="fade-up"
            style={{ width: '100%' }}
            fallbackLabel={item.id}
          />
        ))}
      </div>

      {isEmpty && <EmptyState />}
    </>
  );
}
