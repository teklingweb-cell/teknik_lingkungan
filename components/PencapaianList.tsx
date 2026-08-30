'use client';

import { useMemo, useState } from 'react';
import PublicSearch from './PublicSearch';
import type { Pencapaian } from '@/lib/types';
import { formatDateShort } from '@/lib/utils';
import { PENCAPAIAN_CATEGORIES, TINGKAT_COLORS, iconOf } from '@/lib/pencapaian';

const TABS = ['all', ...PENCAPAIAN_CATEGORIES] as const;

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

function Chip({ color, children }: { color: string; children: React.ReactNode }) {
  return (
    <span
      style={{
        fontSize: '0.62rem',
        fontWeight: 600,
        textTransform: 'uppercase',
        letterSpacing: '0.08em',
        padding: '3px 10px',
        borderRadius: 999,
        background: `${color}14`,
        border: `1px solid ${color}33`,
        color,
        whiteSpace: 'nowrap',
      }}
    >
      {children}
    </span>
  );
}

export default function PencapaianList({ items }: { items: Pencapaian[] }) {
  const [filter, setFilter] = useState<string>('all');
  const [query, setQuery] = useState('');

  // Tab hanya menampilkan kategori yang benar-benar ada isinya — daftar
  // kategori memuat beberapa yang baru terpakai kalau diinput manual.
  const tabs = useMemo(
    () => TABS.filter((c) => c === 'all' || items.some((d) => d.category === c)),
    [items]
  );

  const visible = useMemo(() => {
    const byCat = filter === 'all' ? items : items.filter((d) => d.category === filter);
    const q = query.trim().toLowerCase();
    if (!q) return byCat;
    return byCat.filter((d) =>
      [d.title, d.description, d.category, d.hasil, d.tingkat, d.nama_pelaku, d.bidang, String(d.year)]
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
        placeholder="Cari pencapaian, penghargaan, atau nama dosen…"
        resultCount={visible.length}
        totalCount={items.length}
      />

      <div className="tab-bar fade-up" style={{ marginBottom: 36 }}>
        {tabs.map((c) => (
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
          visible.map((item, i) => (
            <div key={item.id} className={`achievement-card fade-up${delayClass(i)}`}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: 12,
                }}
              >
                <span style={{ fontSize: '1.5rem', lineHeight: 1 }} aria-hidden="true">
                  {iconOf(item)}
                </span>
                <div className="achievement-year">
                  {item.tanggal ? formatDateShort(item.tanggal) : item.year}
                </div>
              </div>

              <div className="achievement-title" style={{ marginTop: 10 }}>
                {trunc(item.title, TITLE_LIMIT)}
              </div>

              {item.hasil && (
                <div
                  style={{
                    fontSize: '0.9rem',
                    fontWeight: 600,
                    color: 'var(--green)',
                    margin: '6px 0 4px',
                  }}
                >
                  {item.hasil}
                </div>
              )}

              {item.nama_pelaku && (
                <div style={{ fontSize: '0.78rem', color: 'rgba(45,58,46,0.65)', marginBottom: 4 }}>
                  {item.nama_pelaku}
                  {item.bidang ? ` · ${item.bidang}` : ''}
                </div>
              )}

              <div className="achievement-desc">{trunc(item.description, DESC_LIMIT)}</div>

              <div style={{ marginTop: 12, display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                <Chip color="#6b7a6c">{item.category}</Chip>
                {item.tingkat && (
                  <Chip color={TINGKAT_COLORS[item.tingkat] ?? '#6b7a6c'}>{item.tingkat}</Chip>
                )}
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
