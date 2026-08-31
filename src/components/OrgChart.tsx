'use client';

import { Fragment, useEffect, useState } from 'react';
import type { Staff } from '@/lib/types';

type Tier = {
  key: string;
  label: string;
  cssClass: string;
  color: string;
};

// Semua tier memakai ukuran kartu yang sama; hierarki dibedakan lewat warna saja.
const TIERS: Tier[] = [
  { key: 'rektor', label: 'Ketua Jurusan', cssClass: 'tier-ketua', color: '#1a2e1e' },
  { key: 'wakil', label: 'Koordinator Program Studi', cssClass: 'tier-koorprodi', color: '#2d6a40' },
  { key: 'dosen', label: 'Dosen / Profesor', cssClass: 'tier-dosen', color: '#2563eb' },
  { key: 'staf', label: 'Staf Administrasi', cssClass: 'tier-staf', color: '#9333ea' },
];

const TYPE_LABELS: Record<string, string> = { dosen: 'Dosen', alumni: 'Alumni', staf: 'Staf' };

function initialOf(name: string | null): string {
  return (name || '?')[0].toUpperCase();
}

function NodePhoto({ person }: { person: Staff }) {
  const [failed, setFailed] = useState(false);

  if (!person.photo_url || failed) {
    return <div className="org-node-initials">{initialOf(person.name)}</div>;
  }

  return (
    /* eslint-disable-next-line @next/next/no-img-element */
    <img
      className="org-node-photo"
      src={person.photo_url}
      alt={person.name}
      onError={() => setFailed(true)}
    />
  );
}

function BioPhoto({ person, color }: { person: Staff; color: string }) {
  const [failed, setFailed] = useState(false);

  if (!person.photo_url || failed) {
    return (
      <div className="bio-initials" style={{ background: color }}>
        {initialOf(person.name)}
      </div>
    );
  }

  return (
    /* eslint-disable-next-line @next/next/no-img-element */
    <img
      className="bio-photo"
      src={person.photo_url}
      alt={person.name}
      onError={() => setFailed(true)}
    />
  );
}

function BioModal({
  person,
  tier,
  onClose,
}: {
  person: Staff;
  tier: Tier;
  onClose: () => void;
}) {
  // Lock body scroll while the modal is up, and close on Escape.
  useEffect(() => {
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);

    return () => {
      document.body.style.overflow = previous;
      document.removeEventListener('keydown', onKey);
    };
  }, [onClose]);

  const stats: { label: string; value: string | number }[] = [];
  if (person.email) stats.push({ label: 'Email', value: person.email });
  if (person.graduation_year) stats.push({ label: 'Tahun Lulus', value: person.graduation_year });
  if (person.type) {
    stats.push({ label: 'Tipe', value: TYPE_LABELS[person.type] ?? person.type });
  }

  return (
    <div
      className="bio-overlay open"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bio-modal">
        <div className="bio-header">
          <div className="bio-header-accent" style={{ background: tier.color }} />
          <div>
            <BioPhoto person={person} color={tier.color} />
          </div>
          <div className="bio-header-info">
            <div
              className="bio-badge"
              style={{ background: `${tier.color}18`, color: tier.color }}
            >
              {tier.label}
            </div>
            <div className="bio-name">{person.name ?? ''}</div>
            <div className="bio-position">{person.position ?? ''}</div>
            <div className="bio-dept">{person.bidang ?? ''}</div>
          </div>
          <button className="bio-close" onClick={onClose} aria-label="Tutup">
            ✕
          </button>
        </div>
        <div className="bio-body">
          <div className="bio-divider" />
          <div className="bio-grid">
            {stats.map((s) => (
              <div key={s.label} className="bio-stat">
                <div className="bio-stat-label">{s.label}</div>
                <div className="bio-stat-value">{String(s.value)}</div>
              </div>
            ))}
          </div>
          {person.expertise_desc && (
            <div>
              <div className="bio-desc-label">Bidang Keahlian &amp; Riset</div>
              <div className="bio-desc">{person.expertise_desc}</div>
            </div>
          )}
          <div className="bio-links">
            {person.linkedin_url && (
              <a
                href={person.linkedin_url}
                target="_blank"
                rel="noopener noreferrer"
                className="bio-link"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                  <rect x="2" y="9" width="4" height="12" />
                  <circle cx="4" cy="4" r="2" />
                </svg>
                LinkedIn
              </a>
            )}
            {person.email && (
              <a href={`mailto:${person.email}`} className="bio-link">
                <svg
                  width="14"
                  height="14"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <rect x="2" y="4" width="20" height="16" rx="2" />
                  <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                </svg>
                Email
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function OrgChart({ people }: { people: Staff[] }) {
  const [selected, setSelected] = useState<{ person: Staff; tier: Tier } | null>(null);

  // Bucket by org_level, then keep only the tiers that actually have anyone.
  const groups = new Map<string, Staff[]>();
  for (const p of people) {
    const level = (p.org_level ?? '').toLowerCase();
    if (!groups.has(level)) groups.set(level, []);
    groups.get(level)!.push(p);
  }

  const tiers = TIERS.filter((t) => (groups.get(t.key)?.length ?? 0) > 0);

  if (!tiers.length) {
    return (
      <div className="org-tree fade-up">
        <div style={{ textAlign: 'center', padding: '60px 20px' }}>
          <div
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '1.2rem',
              color: 'var(--navy)',
              marginBottom: 8,
            }}
          >
            Belum Ada Data Organisasi
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="org-tree fade-up">
        {tiers.map((tier, idx) => {
          const tierPeople = groups.get(tier.key)!;
          const multi = tierPeople.length > 1;

          return (
            <Fragment key={tier.key}>
              {idx > 0 && (
                <div className={multi ? 'org-connector-spread' : 'org-connector'} />
              )}
              <div className="org-tier">
                <div className="org-tier-label">{tier.label.toUpperCase()}</div>
                <div className="org-tier-nodes">
                  {tierPeople.map((person) => (
                    <div
                      key={person.id}
                      className={`org-node ${tier.cssClass}`}
                      tabIndex={0}
                      role="button"
                      onClick={() => setSelected({ person, tier })}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          setSelected({ person, tier });
                        }
                      }}
                    >
                      <div className="org-node-card">
                        <NodePhoto person={person} />
                        <div className="org-node-role">{tier.label}</div>
                        <div className="org-node-name">{person.name}</div>
                        {person.bidang && <div className="org-node-dept">{person.bidang}</div>}
                        <div className="org-node-click-hint">lihat profil ↗</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              {idx < tiers.length - 1 && multi && <div className="org-connector-gather" />}
            </Fragment>
          );
        })}
      </div>

      {selected && (
        <BioModal
          person={selected.person}
          tier={selected.tier}
          onClose={() => setSelected(null)}
        />
      )}
    </>
  );
}
