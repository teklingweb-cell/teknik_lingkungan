'use client';

import { useMemo, useState } from 'react';
import PublicSearch from './PublicSearch';
import type { Mitra } from '@/lib/types';
import { toGDriveImg, formatDateShort } from '@/lib/utils';
import { jenisLabel } from '@/lib/mitra';

function initialOf(name: string | null): string {
  return (name || '?')[0].toUpperCase();
}

function categoryOf(item: Mitra): string {
  return item.mitra_kategori?.name ?? item.category ?? 'Lainnya';
}

function categoryColor(item: Mitra): string {
  return item.mitra_kategori?.color ?? '#4e8c5a';
}

function PartnerLogo({ item }: { item: Mitra }) {
  const [failed, setFailed] = useState(false);
  const src = toGDriveImg(item.logo_url, 400);

  if (!src || failed) return <div className="partner-avatar">{initialOf(item.name)}</div>;

  return (
    <div className="partner-logo">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt={item.name} loading="lazy" onError={() => setFailed(true)} />
    </div>
  );
}

export default function MitraList({ items }: { items: Mitra[] }) {
  const [filter, setFilter] = useState('all');
  const [query, setQuery] = useState('');

  const categories = useMemo(
    () => Array.from(new Set(items.map(categoryOf))).sort((a, b) => a.localeCompare(b, 'id')),
    [items]
  );

  const visible = useMemo(() => {
    const inCategory = filter === 'all' ? items : items.filter((item) => categoryOf(item) === filter);
    const q = query.trim().toLowerCase();
    if (!q) return inCategory;
    return inCategory.filter((item) =>
      [item.name, categoryOf(item), item.tingkat, item.jenis_kerjasama, item.judul_kegiatan, item.manfaat]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()
        .includes(q)
    );
  }, [items, filter, query]);

  return (
    <>
      <PublicSearch value={query} onChange={setQuery} placeholder="Cari lembaga, kegiatan, atau kategori…" resultCount={visible.length} totalCount={items.length} />

      <div className="tab-bar mitra-tabs fade-up" aria-label="Filter kategori mitra">
        <button className={`tab-btn${filter === 'all' ? ' active' : ''}`} onClick={() => setFilter('all')}>
          Semua
        </button>
        {categories.map((category) => (
          <button key={category} className={`tab-btn${filter === category ? ' active' : ''}`} onClick={() => setFilter(category)}>
            {category}
          </button>
        ))}
      </div>

      <div className="partner-directory" aria-live="polite">
        {visible.length ? visible.map((item) => {
          const color = categoryColor(item);
          return (
            <article key={item.id} className="partner-row fade-up">
              <PartnerLogo item={item} />
              <div className="partner-main">
                <div className="partner-tags">
                  <span className="partner-category" style={{ color, backgroundColor: `${color}14`, borderColor: `${color}40` }}>{categoryOf(item)}</span>
                  {item.jenis_kerjasama && <span className="partner-type">{jenisLabel(item.jenis_kerjasama)}</span>}
                  {item.tingkat && <span className="partner-type">{item.tingkat}</span>}
                </div>
                <h2>{item.name}</h2>
                {item.judul_kegiatan && <p className="partner-activity">{item.judul_kegiatan}</p>}
                {(item.manfaat ?? item.description) && <p className="partner-desc">{item.manfaat ?? item.description}</p>}
              </div>
              <div className="partner-side">
                <span className="partner-period">
                  {item.tanggal_awal
                    ? `${formatDateShort(item.tanggal_awal)}${item.tanggal_akhir ? ` – ${formatDateShort(item.tanggal_akhir)}` : ''}`
                    : item.since_year ? `Mitra sejak ${item.since_year}` : 'Periode belum dicantumkan'}
                </span>
                {item.website_url && <a href={item.website_url} target="_blank" rel="noopener noreferrer" className="partner-link">Website <span aria-hidden="true">→</span></a>}
              </div>
            </article>
          );
        }) : <p className="partner-empty">Tidak ada kerja sama ditemukan.</p>}
      </div>
    </>
  );
}
