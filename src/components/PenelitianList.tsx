'use client';

import Link from 'next/link';
import { useState } from 'react';
import type { Penelitian } from '@/lib/types';
import { slugOf } from '@/lib/utils';

const CATEGORIES = [
  'all',
  'Sains & Teknologi',
  'Lingkungan',
  'Kesehatan',
  'Sosial & Humaniora',
  'Ekonomi',
] as const;

const CAT_COLORS: Record<string, string> = {
  'Sains & Teknologi': '#2563eb',
  Lingkungan: '#16a34a',
  Kesehatan: '#dc2626',
  'Sosial & Humaniora': '#9333ea',
  Ekonomi: '#d97706',
};

const ABSTRACT_LIMIT = 110;

function ResearchCard({ item }: { item: Penelitian }) {
  const color = CAT_COLORS[item.category] ?? '#6b7a6c';
  const statusLabel = item.status || 'Aktif';
  const statusClass = statusLabel.toLowerCase() === 'sedang berjalan' ? 'wip' : 'aktif';
  const abstract = item.abstract
    ? item.abstract.substring(0, ABSTRACT_LIMIT) + (item.abstract.length > ABSTRACT_LIMIT ? '…' : '')
    : '';

  return (
    <div className="research-card-wrap">
      <Link href={`/penelitian/${slugOf(item)}`} className="research-card fade-up">
        <div className="research-card-accent" style={{ background: color }} />
        <div className="research-card-body">
          <div className="research-card-meta">
            <span className="research-card-category">{item.category}</span>
            <span className="research-card-year">{item.year}</span>
          </div>
          <div className="research-card-title">{item.title}</div>
          <div className="research-card-author">{item.author}</div>
          {abstract ? (
            <div className="research-card-abstract">{abstract}</div>
          ) : (
            <div style={{ flex: 1 }} />
          )}
        </div>
        <div className="research-card-footer">
          <span className={`research-card-status ${statusClass}`}>{statusLabel}</span>
          {item.funding && <span className="research-card-funding">{item.funding}</span>}
          <span className="research-card-cta">Lihat Detail →</span>
        </div>
      </Link>
    </div>
  );
}

export default function PenelitianList({ items }: { items: Penelitian[] }) {
  const [filter, setFilter] = useState<string>('all');
  const visible = filter === 'all' ? items : items.filter((d) => d.category === filter);

  return (
    <>
      <div className="tab-bar fade-up" style={{ marginBottom: 36 }}>
        {CATEGORIES.map((c) => (
          <button
            key={c}
            className={`tab-btn${filter === c ? ' active' : ''}`}
            onClick={() => setFilter(c)}
          >
            {c === 'all' ? 'Semua' : c}
          </button>
        ))}
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill,minmax(300px,1fr))',
          gap: 24,
          minHeight: 200,
        }}
      >
        {visible.length ? (
          visible.map((item) => <ResearchCard key={item.id} item={item} />)
        ) : (
          <div
            style={{
              gridColumn: '1/-1',
              textAlign: 'center',
              padding: '60px 20px',
              color: 'rgba(45,58,46,0.5)',
            }}
          >
            Tidak ada penelitian ditemukan.
          </div>
        )}
      </div>
    </>
  );
}
