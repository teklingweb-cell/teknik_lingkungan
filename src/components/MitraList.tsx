'use client';

import { useMemo, useState } from 'react';
import PublicSearch from './PublicSearch';
import type { Mitra } from '@/lib/types';
import { toGDriveImg, formatDateShort } from '@/lib/utils';
import { MITRA_JENIS, MITRA_JENIS_COLORS, jenisLabel } from '@/lib/mitra';

/**
 * Tab utama memakai *jenis kerja sama* (sesuai Tabel 2 LKPS), bukan kategori
 * lembaga — itulah pembagian yang dipakai di dokumen sumbernya. Kategori dan
 * tingkat tetap bisa dicari lewat kotak pencarian.
 */
const TABS = ['all', ...MITRA_JENIS] as const;

/** Staggers the reveal across each row of three cards. */
function delayClass(i: number): string {
  const d = i % 3;
  return d === 0 ? '' : ` delay-${d}`;
}

function initialOf(name: string | null): string {
  return (name || '?')[0].toUpperCase();
}

/**
 * Partner logo with a letter-avatar fallback.
 *
 * The static site did this with an inline `onerror` that rewrote the parent's
 * innerHTML — which meant escaping the letter by hand to keep it from breaking
 * out of the attribute. React state makes the same behaviour injection-proof.
 */
function PartnerLogo({ item }: { item: Mitra }) {
  const [failed, setFailed] = useState(false);
  const src = toGDriveImg(item.logo_url, 400);

  if (!src || failed) {
    return <div className="partner-avatar">{initialOf(item.name)}</div>;
  }

  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        maxWidth: 120,
        height: 48,
        padding: '6px 10px',
        borderRadius: 8,
        background: '#fff',
        border: '1px solid rgba(26,46,30,0.08)',
        flexShrink: 0,
        boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={item.name}
        loading="lazy"
        onError={() => setFailed(true)}
        style={{
          maxWidth: '100%',
          maxHeight: 36,
          width: 'auto',
          height: 'auto',
          objectFit: 'contain',
          display: 'block',
        }}
      />
    </div>
  );
}

function Chip({ color, children }: { color: string; children: React.ReactNode }) {
  return (
    <span
      style={{
        fontSize: '0.62rem',
        textTransform: 'uppercase',
        letterSpacing: '0.08em',
        fontFamily: 'var(--font-body)',
        fontWeight: 600,
        color,
        background: `${color}14`,
        border: `1px solid ${color}33`,
        borderRadius: 999,
        padding: '3px 9px',
        whiteSpace: 'nowrap',
      }}
    >
      {children}
    </span>
  );
}

export default function MitraList({ items }: { items: Mitra[] }) {
  const [filter, setFilter] = useState<string>('all');
  const [query, setQuery] = useState('');

  const visible = useMemo(() => {
    const byJenis =
      filter === 'all' ? items : items.filter((d) => d.jenis_kerjasama === filter);
    const q = query.trim().toLowerCase();
    if (!q) return byJenis;
    return byJenis.filter((d) =>
      [d.name, d.category, d.tingkat, d.jenis_kerjasama, d.judul_kegiatan, d.manfaat]
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
        placeholder="Cari lembaga, kegiatan, atau bidang kerja sama…"
        resultCount={visible.length}
        totalCount={items.length}
      />

      <div className="tab-bar fade-up" style={{ marginBottom: 36 }}>
        {TABS.map((c) => (
          <button
            key={c}
            className={`tab-btn${filter === c ? ' active' : ''}`}
            onClick={() => setFilter(c)}
          >
            {c === 'all' ? 'Semua' : jenisLabel(c)}
          </button>
        ))}
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill,minmax(320px,1fr))',
          gap: 24,
          minHeight: 200,
        }}
      >
        {visible.length ? (
          visible.map((item, i) => (
            <div key={item.id} className={`partner-card fade-up${delayClass(i)}`}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 14 }}>
                <PartnerLogo item={item} />
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {item.jenis_kerjasama && (
                    <Chip color={MITRA_JENIS_COLORS[item.jenis_kerjasama] ?? '#6b7a6c'}>
                      {jenisLabel(item.jenis_kerjasama)}
                    </Chip>
                  )}
                  {item.tingkat && <Chip color="#6b7a6c">{item.tingkat}</Chip>}
                </div>
              </div>

              <div className="partner-name">{item.name}</div>

              {item.judul_kegiatan && (
                <div
                  style={{
                    fontSize: '0.82rem',
                    lineHeight: 1.5,
                    color: 'var(--navy)',
                    fontWeight: 500,
                    margin: '6px 0 8px',
                  }}
                >
                  {item.judul_kegiatan}
                </div>
              )}

              <div className="partner-desc">{item.manfaat ?? item.description ?? ''}</div>

              <div className="partner-footer">
                <span className="partner-since">
                  {item.tanggal_awal
                    ? `${formatDateShort(item.tanggal_awal)} – ${formatDateShort(item.tanggal_akhir)}`
                    : item.since_year
                      ? `Mitra sejak ${item.since_year}`
                      : ''}
                </span>
                {item.website_url && (
                  <a
                    href={item.website_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="partner-link"
                  >
                    Website →
                  </a>
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
            Tidak ada kerja sama ditemukan.
          </div>
        )}
      </div>
    </>
  );
}
