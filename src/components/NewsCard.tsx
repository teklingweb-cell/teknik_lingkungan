import Link from 'next/link';
import type { News } from '@/lib/types';
import { toGDriveImg, formatDate } from '@/lib/utils';

/**
 * The news card used on the home page and the berita listing.
 * `fallbackLabel` is what shows when a row has no image_url — the home page
 * used the card's position, the listing used the row id.
 */
export default function NewsCard({
  item,
  className = '',
  style,
  fallbackLabel,
}: {
  item: News;
  className?: string;
  style?: React.CSSProperties;
  fallbackLabel: React.ReactNode;
}) {
  const imgSrc = toGDriveImg(item.image_url);

  return (
    <Link href={`/berita/${item.id}`} className={`news-card ${className}`.trim()} style={style}>
      <article>
        <div className="news-thumb">
          {imgSrc ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              src={imgSrc}
              alt={item.title}
              loading="lazy"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          ) : (
            <span className="news-thumb-num">{fallbackLabel}</span>
          )}
        </div>
        <div className="news-body">
          <div className="news-meta">
            <span className="tag">{item.category}</span>
            <span className="news-date">{formatDate(item.date)}</span>
          </div>
          <div className="news-title">{item.title}</div>
          <div className="news-excerpt">{item.excerpt}</div>
          <div className="news-read-more">Baca Selengkapnya →</div>
        </div>
      </article>
    </Link>
  );
}
