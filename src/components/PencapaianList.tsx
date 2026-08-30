'use client';

import { useMemo, useState } from 'react';
import PublicSearch from './PublicSearch';
import type { Pencapaian } from '@/lib/types';
import { formatDateShort } from '@/lib/utils';
import { PENCAPAIAN_CATEGORIES, TINGKAT_COLORS, colorOf } from '@/lib/pencapaian';

const TABS = ['all', ...PENCAPAIAN_CATEGORIES] as const;

const TITLE_LIMIT = 90;
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

/** Lencana piala. SVG, bukan emoji — lihat catatan di lib/pencapaian.ts. */
function AwardBadge({ color }: { color: string }) {
  return (
    <span
      style={{
        width: 36,
        height: 36,
        borderRadius: 10,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: `${color}18`,
        flexShrink: 0,
      }}
      aria-hidden="true"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="12" cy="8" r="6" />
        <path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11" />
      </svg>
    </span>
  );
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
            <div
              key={item.id}
              className={`achievement-card fade-up${delayClass(i)}`}
              // Kolom flex supaya baris lencana selalu menempel ke dasar kartu
              // dan semua kartu dalam satu baris grid berakhir rata.
              style={{ display: 'flex', flexDirection: 'column' }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: 12,
                  marginBottom: 12,
                }}
              >
                <AwardBadge color={colorOf(item)} />
                <div className="achievement-year">
                  {item.tanggal ? formatDateShort(item.tanggal) : item.year}
                </div>
              </div>

              <div className="achievement-title">{trunc(item.title, TITLE_LIMIT)}</div>

              {item.hasil && (
                <div
                  style={{
                    fontSize: '0.92rem',
                    fontWeight: 600,
                    color: 'var(--green)',
                    lineHeight: 1.4,
                    marginBottom: 6,
                  }}
                >
                  {item.hasil}
                </div>
              )}

              {item.nama_pelaku && (
                <div
                  style={{
                    fontSize: '0.78rem',
                    color: 'rgba(45,58,46,0.65)',
                    lineHeight: 1.5,
                    marginBottom: 6,
                  }}
                >
                  {item.nama_pelaku}
                  {item.bidang ? ` · ${item.bidang}` : ''}
                </div>
              )}

              {/* `hasil` dan chip tingkat sudah memuat isi kalimat deskripsi
                  hasil impor, jadi deskripsi hanya ditampilkan untuk entri
                  yang tidak punya `hasil` — misalnya akreditasi yang diinput
                  manual lewat admin. */}
              {!item.hasil && <div className="achievement-desc">{trunc(item.description, DESC_LIMIT)}</div>}

              <div
                style={{
                  marginTop: 'auto',
                  paddingTop: 14,
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: 6,
                }}
              >
                <Chip color={colorOf(item)}>{item.category}</Chip>
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
