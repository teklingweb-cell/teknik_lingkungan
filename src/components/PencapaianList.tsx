'use client';

import { useMemo, useState } from 'react';
import PublicSearch from './PublicSearch';
import type { Pencapaian } from '@/lib/types';

const CATEGORIES = ['all', 'Riset', 'Akreditasi', 'Prestasi', 'Hibah', 'Ranking'] as const;

const TITLE_LIMIT = 80;
const DESC_LIMIT = 160;

function trunc(s: string | null, n: number): string {
  const v = String(s ?? '').trim();
  return v.length > n ? `${v.substring(0, n)}…` : v;
}

/** Staggers the reveal across each row of four cards. */
function delayClass(i: number): string {
  const d = i % 4;
  return d === 0 ? '' : ` delay-${d}`;
}

export default function PencapaianList({ items }: { items: Pencapaian[] }) {
  const [filter, setFilter] = useState<string>('all');
  const [query, setQuery] = useState('');

  const visible = useMemo(() => {
    const byCat = filter === 'all' ? items : items.filter((d) => d.category === filter);
    const q = query.trim().toLowerCase();
    if (!q) return byCat;
    return byCat.filter((d) =>
      [d.title, d.description, d.category, String(d.year)].filter(Boolean).join(' ').toLowerCase().includes(q)
    );
  }, [items, filter, query]);

  return (
    <>
      <PublicSearch
        value={query}
        onChange={setQuery}
        placeholder="Cari pencapaian atau penghargaan…"
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
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))',
          gap: 24,
          minHeight: 200,
        }}
      >
        {visible.length ? (
          visible.map((item, i) => (
            <div key={item.id} className={`achievement-card fade-up${delayClass(i)}`}>
              <div className="achievement-year">{item.year}</div>
              <div className="achievement-title">{trunc(item.title, TITLE_LIMIT)}</div>
              <div className="achievement-desc">{trunc(item.description, DESC_LIMIT)}</div>
              <div style={{ marginTop: 12 }}>
                <span
                  style={{
                    fontSize: '0.65rem',
                    fontWeight: 600,
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                    padding: '3px 10px',
                    borderRadius: 999,
                    background: 'rgba(26,46,30,0.08)',
                    color: 'rgba(45,58,46,0.6)',
                  }}
                >
                  {item.category}
                </span>
              </div>
            </div>
          ))
        ) : (
          <div
            style={{
              gridColumn: '1/-1',
              textAlign: 'center',
              padding: '60px 20px',
              color: 'rgba(45,58,46,0.5)',
            }}
          >
            Tidak ada pencapaian ditemukan.
          </div>
        )}
      </div>
    </>
  );
}
