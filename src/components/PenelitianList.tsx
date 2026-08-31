'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import PublicSearch from './PublicSearch';
import type { Penelitian } from '@/lib/types';
import { slugOf, contributorsOf } from '@/lib/utils';

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
  const people = contributorsOf(item);
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
          {/* Lead plus a count: the full list of names overflowed the card
              and pushed the abstract out of alignment across the grid. */}
          <div className="research-card-author">
            {people[0] ?? item.author}
            {people.length > 1 && (
              <span className="research-card-more"> +{people.length - 1} kontributor</span>
            )}
          </div>
          {abstract ? (
            <div className="research-card-abstract">{abstract}</div>
          ) : (
            <div style={{ flex: 1 }} />
          )}
        </div>
        <div className="research-card-footer">
          <span className={`research-card-status ${statusClass}`}>{statusLabel}</span>
          <span className="research-card-cta">Lihat Detail →</span>
        </div>
      </Link>
    </div>
  );
}

export default function PenelitianList({ items }: { items: Penelitian[] }) {
  const [filter, setFilter] = useState<string>('all');
  const [query, setQuery] = useState('');

  const visible = useMemo(() => {
    const byCat = filter === 'all' ? items : items.filter((d) => d.category === filter);
    const q = query.trim().toLowerCase();
    if (!q) return byCat;
    // Judul, peneliti, abstrak dan kata kunci sekaligus — orang mencari
    // dengan potongan apa pun yang mereka ingat.
    return byCat.filter((d) =>
      [d.title, d.author, d.contributors, d.abstract, d.keywords, d.category, String(d.year)]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()
        .includes(q)
    );
  }, [items, filter, query]);

  return (
    <>
      <PublicSearch
        value={query}
        onChange={setQuery}
        placeholder="Cari judul, peneliti, atau kata kunci…"
        resultCount={visible.length}
        totalCount={items.length}
      />

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
        // minmax(min(Npx,100%),1fr), bukan minmax(Npx,1fr): tanpa min()
        // trek grid menolak menyusut di bawah N piksel, sehingga di layar
        // ~320px kartu jadi lebih lebar dari ruang yang tersedia dan
        // halaman meluber ke samping.
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill,minmax(min(300px,100%),1fr))',
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
