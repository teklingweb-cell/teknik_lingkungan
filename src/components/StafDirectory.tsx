'use client';

import { useState } from 'react';
import type { Staff, StaffType } from '@/lib/types';
import { MailIcon, SearchIcon } from './icons';

const TABS: { key: StaffType; label: string }[] = [
  { key: 'dosen', label: 'Dosen' },
  { key: 'alumni', label: 'Alumni' },
  { key: 'staf', label: 'Staf' },
];

function initialOf(name: string | null): string {
  return (name || '?')[0].toUpperCase();
}

const idStyle: React.CSSProperties = {
  fontSize: '0.7rem',
  color: 'rgba(45,58,46,0.45)',
  fontFamily: 'monospace',
  marginTop: 3,
  letterSpacing: '0.04em',
};

/** Alumni photo with a letter-avatar fallback when the image fails to load. */
function AlumniAvatar({ person }: { person: Staff }) {
  const [failed, setFailed] = useState(false);

  if (!person.photo_url || failed) {
    return <div className="staff-avatar alumni">{initialOf(person.name)}</div>;
  }

  return (
    /* eslint-disable-next-line @next/next/no-img-element */
    <img
      src={person.photo_url}
      alt={person.name}
      className="staff-avatar alumni"
      style={{ objectFit: 'cover' }}
      onError={() => setFailed(true)}
    />
  );
}

function DosenCard({ person }: { person: Staff }) {
  return (
    <div className="staff-card fade-up">
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16 }}>
        <div className="staff-avatar">{initialOf(person.name)}</div>
        <div style={{ flex: 1 }}>
          <div className="staff-name">{person.name}</div>
          <div className="staff-pos">
            {person.position} · {person.bidang}
          </div>
          {person.nim_nip && <div style={idStyle}>NIP: {person.nim_nip}</div>}
        </div>
      </div>
      <div className="staff-expertise">{person.expertise_desc ?? ''}</div>
      <div className="staff-footer">
        <span className="staff-pubs">{person.publications_count ?? 0} Publikasi</span>
        <div className="staff-actions">
          {person.email && (
            <a href={`mailto:${person.email}`} className="staff-btn" aria-label="Email">
              <MailIcon />
            </a>
          )}
          {person.linkedin_url ? (
            <a
              href={person.linkedin_url}
              target="_blank"
              rel="noopener noreferrer"
              className="staff-btn"
            >
              in
            </a>
          ) : (
            <button className="staff-btn" disabled style={{ opacity: 0.3 }}>
              in
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function AlumniCard({ person }: { person: Staff }) {
  return (
    <div className="staff-card fade-up">
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <AlumniAvatar person={person} />
        <div>
          <div className="staff-name">{person.name}</div>
          <div className="staff-pos">
            {person.graduation_year ? `Lulus ${person.graduation_year}` : ''}
          </div>
          {person.nim_nip && <div style={idStyle}>NIM: {person.nim_nip}</div>}
        </div>
      </div>
      <div
        style={{
          marginTop: 10,
          fontSize: '0.85rem',
          color: 'var(--charcoal)',
          fontFamily: 'var(--font-body)',
        }}
      >
        {person.position}
      </div>
      <div
        style={{
          fontSize: '0.8rem',
          color: 'rgba(45,58,46,0.6)',
          fontFamily: 'var(--font-body)',
        }}
      >
        {person.bidang}
      </div>
      <div className="staff-footer" style={{ marginTop: 12 }}>
        <span />
        <div className="staff-actions">
          {person.email && (
            <a href={`mailto:${person.email}`} className="staff-btn" aria-label="Email">
              <MailIcon />
            </a>
          )}
          {person.linkedin_url && (
            <a
              href={person.linkedin_url}
              target="_blank"
              rel="noopener noreferrer"
              className="staff-btn"
            >
              in
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

function StafCard({ person }: { person: Staff }) {
  return (
    <div className="staff-card fade-up">
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <div
          style={{
            width: 40,
            height: 40,
            borderRadius: 10,
            background: 'rgba(45,58,46,0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: 'var(--font-display)',
            fontWeight: 500,
            color: 'var(--charcoal)',
          }}
        >
          {initialOf(person.name)}
        </div>
        <div style={{ flex: 1 }}>
          <div
            style={{
              fontSize: '0.9rem',
              fontWeight: 500,
              color: 'var(--navy)',
              fontFamily: 'var(--font-body)',
            }}
          >
            {person.name}
          </div>
          <div
            style={{
              fontSize: '0.75rem',
              color: 'rgba(45,58,46,0.6)',
              fontFamily: 'var(--font-body)',
            }}
          >
            {person.position}
          </div>
          {person.nim_nip && (
            <div style={{ ...idStyle, color: 'rgba(45,58,46,0.4)', marginTop: 2 }}>
              NIP: {person.nim_nip}
            </div>
          )}
        </div>
        <span
          style={{
            fontSize: '0.7rem',
            color: 'rgba(45,58,46,0.4)',
            fontFamily: 'var(--font-body)',
          }}
        >
          {person.bidang}
        </span>
      </div>
    </div>
  );
}

export default function StafDirectory({ people }: { people: Staff[] }) {
  const [tab, setTab] = useState<StaffType>('dosen');
  const [query, setQuery] = useState('');

  const q = query.toLowerCase();
  const items = people
    .filter((s) => s.type === tab)
    .filter(
      (s) =>
        !q ||
        (s.name ?? '').toLowerCase().includes(q) ||
        (s.nim_nip ?? '').toLowerCase().includes(q) ||
        (s.bidang ?? '').toLowerCase().includes(q) ||
        (s.position ?? '').toLowerCase().includes(q)
    );

  return (
    <>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 32 }} className="fade-up">
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 12,
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div className="tab-bar">
            {TABS.map((t) => (
              <button
                key={t.key}
                className={`tab-btn${tab === t.key ? ' active' : ''}`}
                onClick={() => {
                  setTab(t.key);
                  // Reset the search when switching tabs, otherwise a query that
                  // matched a dosen leaves the alumni tab looking empty.
                  setQuery('');
                }}
              >
                {t.label}{' '}
                <span className="tab-count">{people.filter((s) => s.type === t.key).length}</span>
              </button>
            ))}
          </div>
          <div className="search-wrap" style={{ position: 'relative' }}>
            <span className="search-icon">
              <SearchIcon />
            </span>
            <input
              type="text"
              className="form-input search-input"
              placeholder="Cari nama atau NIP/NIM…"
              style={{ width: 260, paddingLeft: 36 }}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="grid-2" style={{ minHeight: 200 }}>
        {items.length ? (
          items.map((person) => {
            if (tab === 'dosen') return <DosenCard key={person.id} person={person} />;
            if (tab === 'alumni') return <AlumniCard key={person.id} person={person} />;
            return <StafCard key={person.id} person={person} />;
          })
        ) : (
          <div
            style={{
              gridColumn: '1/-1',
              textAlign: 'center',
              padding: '60px 20px',
              color: 'rgba(45,58,46,0.5)',
            }}
          >
            Tidak ada data ditemukan.
          </div>
        )}
      </div>
    </>
  );
}
