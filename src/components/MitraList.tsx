'use client';

import { useState } from 'react';
import type { Mitra } from '@/lib/types';
import { toGDriveImg } from '@/lib/utils';

const CATEGORIES = ['all', 'Industri', 'Akademik', 'Pemerintah', 'Internasional'] as const;

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

export default function MitraList({ items }: { items: Mitra[] }) {
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
          gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))',
          gap: 24,
          minHeight: 200,
        }}
      >
        {visible.length ? (
          visible.map((item, i) => (
            <div key={item.id} className={`partner-card fade-up${delayClass(i)}`}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 12 }}>
                <PartnerLogo item={item} />
                <span
                  style={{
                    fontSize: '0.65rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.1em',
                    color: 'var(--moss)',
                    fontFamily: 'var(--font-body)',
                    fontWeight: 500,
                  }}
                >
                  {item.category ?? ''}
                </span>
              </div>
              <div className="partner-name">{item.name}</div>
              <div className="partner-desc">{item.description ?? ''}</div>
              <div className="partner-footer">
                <span className="partner-since">
                  {item.since_year ? `Mitra sejak ${item.since_year}` : ''}
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
            Tidak ada mitra ditemukan.
          </div>
        )}
      </div>
    </>
  );
}
