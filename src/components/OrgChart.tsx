'use client';

import { Fragment, useEffect, useState, useRef } from 'react';
import type { Staff } from '@/lib/types';

export type Tier = {
  key: string;
  label: string;
  cssClass: string;
  color: string;
};

// Semua tier memakai ukuran kartu yang sama; hierarki dibedakan lewat warna saja.
const TIERS: Tier[] = [
  { key: 'rektor', label: 'Ketua Jurusan', cssClass: 'tier-ketua', color: '#1a2e1e' },
  { key: 'wakil', label: 'Koordinator Program Studi', cssClass: 'tier-koorprodi', color: '#2d6a40' },
  { key: 'kbk_rekayasa', label: 'Ketua KBK Rekayasa Infrastruktur Lingkungan', cssClass: 'tier-dosen', color: '#0f766e' },
  { key: 'kbk_manajemen', label: 'Ketua KBK Manajemen Lingkungan', cssClass: 'tier-dosen', color: '#0f766e' },
  { key: 'kbk_pengendalian', label: 'Ketua KBK Pengendalian Pencemaran Lingkungan', cssClass: 'tier-dosen', color: '#0f766e' },
  { key: 'lab_kualitas_air', label: 'Kepala Lab. Kualitas Air', cssClass: 'tier-dosen', color: '#b91c1c' },
  { key: 'lab_mikrobiologi', label: 'Kepala Lab. Mikrobiologi', cssClass: 'tier-dosen', color: '#b91c1c' },
  { key: 'lab_kualitas_udara', label: 'Kepala Lab. Kualitas Udara', cssClass: 'tier-dosen', color: '#b91c1c' },
  { key: 'dosen', label: 'Dosen / Profesor', cssClass: 'tier-dosen', color: '#2563eb' },
  { key: 'staf', label: 'Staf Administrasi', cssClass: 'tier-staf', color: '#9333ea' },
];


function initialOf(name: string | null): string {
  return (name || '?')[0].toUpperCase();
}

export function NodePhoto({ person }: { person: Staff }) {
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

export function BioModal({
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
            {person.type === 'staf' && person.position && (
              <div className="bio-position">{person.position}</div>
            )}
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
            {person.link_sinta && (
              <a
                href={person.link_sinta}
                target="_blank"
                rel="noopener noreferrer"
                className="bio-link"
              >
                <svg
                  width="14"
                  height="14"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                  <path d="M2 12h20" />
                </svg>
                Sinta
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function OrgChart({ people: rawPeople }: { people: Staff[] }) {
  const [selected, setSelected] = useState<{ person: Staff; tier: Tier } | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Gunakan timeout kecil agar memastikan DOM dan gaya CSS (width, flex) sudah ter-render penuh 
    // sebelum menghitung scrollWidth
    const timer = setTimeout(() => {
      if (scrollRef.current) {
        const { scrollWidth, clientWidth } = scrollRef.current;
        if (scrollWidth > clientWidth) {
          scrollRef.current.scrollLeft = (scrollWidth - clientWidth) / 2;
        }
      }
    }, 50);
    return () => clearTimeout(timer);
  }, [rawPeople]);

  // Hilangkan duplikat jika data staf/dosen masuk dua kali
  const people = Array.from(new Map(rawPeople.map(p => [p.id, p])).values());

  const kajurNodes: { person: Staff; tier: Tier }[] = [];
  const korprodiNodes: { person: Staff; tier: Tier }[] = [];
  const leftNodes: { person: Staff; tier: Tier }[] = [];
  const rightNodes: { person: Staff; tier: Tier }[] = [];

  people.forEach(p => {
    const levels = (p.org_level || '').toLowerCase().split(',').map(s => s.trim());
    
    if (levels.includes('rektor') || levels.includes('ketua')) {
      const tier = TIERS.find(t => t.key === 'rektor' || levels.includes(t.key)) || TIERS[0];
      kajurNodes.push({ person: p, tier });
    }
    if (levels.includes('wakil') || levels.includes('koordinator')) {
      const tier = TIERS.find(t => t.key === 'wakil' || levels.includes(t.key)) || TIERS[1];
      korprodiNodes.push({ person: p, tier });
    }
    
    // Untuk kolom kiri (KBK)
    let personKbkTiers = TIERS.filter(t => t.key.startsWith('kbk') && levels.includes(t.key));
    if (personKbkTiers.length === 0 && levels.includes('kbk')) {
      personKbkTiers = [{ key: 'kbk', label: 'Ketua KBK', cssClass: 'tier-dosen', color: '#0f766e' }];
    }
    personKbkTiers.forEach(tier => leftNodes.push({ person: p, tier }));

    // Untuk kolom kanan (Lab)
    let personLabTiers = TIERS.filter(t => t.key.startsWith('lab') && levels.includes(t.key));
    if (personLabTiers.length === 0 && levels.includes('lab')) {
      personLabTiers = [{ key: 'lab', label: 'Kepala Lab', cssClass: 'tier-dosen', color: '#b91c1c' }];
    }
    personLabTiers.forEach(tier => rightNodes.push({ person: p, tier }));
  });

  if (kajurNodes.length === 0 && korprodiNodes.length === 0 && leftNodes.length === 0 && rightNodes.length === 0) {
    return (
      <div className="org-tree fade-up">
        <div style={{ textAlign: 'center', padding: '60px 20px' }}>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', color: 'var(--navy)', marginBottom: 8 }}>
            Belum Ada Data Organisasi
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="org-scroll-wrapper" ref={scrollRef}>
        <div className="org-tree fade-up">
        {/* Tier 1: Ketua Jurusan */}
        {kajurNodes.length > 0 && (
          <div className="org-tier">
            <div className="org-tier-label">KETUA JURUSAN</div>
            <div className="org-tier-nodes">
              {kajurNodes.map((item, idx) => {
                const { person, tier: primaryTier } = item;
                return (
                <div
                  key={`${person.id}-${primaryTier.key}-${idx}`}
                  className={`org-node ${primaryTier.cssClass}`}
                  tabIndex={0}
                  role="button"
                  onClick={() => setSelected({ person, tier: primaryTier })}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      setSelected({ person, tier: primaryTier });
                    }
                  }}
                >
                  <div className="org-node-card">
                    <NodePhoto person={person} />
                    <div className="org-node-role">{primaryTier.label}</div>
                    <div className="org-node-name">{person.name}</div>
                    <div className="org-node-click-hint">lihat profil ↗</div>
                  </div>
                </div>
              )})}
            </div>
          </div>
        )}

        <div className="org-connector" />
        <div className="org-connector-spread" style={{ width: 'calc(100% - 170px)', maxWidth: '730px' }} />

        {/* Tier 2: The complex row with Left Nodes, Korprodi, Right Nodes */}
        <div className="org-complex-row">
          {/* Left Column */}
          <div className="org-side-column">
            {leftNodes.length > 0 && <div className="org-column-label">Ketua KBK</div>}
            <div className="org-side-nodes">
              {leftNodes.map((item, idx) => {
                const { person, tier: primaryTier } = item;
                return (
                <div
                  key={`${person.id}-${primaryTier.key}-${idx}`}
                  className={`org-node ${primaryTier.cssClass}`}
                  tabIndex={0}
                  role="button"
                  onClick={() => setSelected({ person, tier: primaryTier })}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      setSelected({ person, tier: primaryTier });
                    }
                  }}
                >
                  <div className="org-node-card">
                    <NodePhoto person={person} />
                    <div className="org-node-role">{primaryTier.label}</div>
                    <div className="org-node-name">{person.name}</div>
                    <div className="org-node-click-hint">lihat profil ↗</div>
                  </div>
                </div>
              )})}
            </div>
          </div>

          {/* Center Column: Korprodi */}
          <div className="org-side-column org-center-column">
            {korprodiNodes.length > 0 && <div className="org-column-label">Koordinator<br/>Program Studi</div>}
            <div className="org-side-nodes">
              {korprodiNodes.map((item, idx) => {
                const { person, tier: primaryTier } = item;
                return (
                <div
                  key={`${person.id}-${primaryTier.key}-${idx}`}
                  className={`org-node ${primaryTier.cssClass}`}
                  tabIndex={0}
                  role="button"
                  onClick={() => setSelected({ person, tier: primaryTier })}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      setSelected({ person, tier: primaryTier });
                    }
                  }}
                >
                  <div className="org-node-card">
                    <NodePhoto person={person} />
                    <div className="org-node-role">{primaryTier.label}</div>
                    <div className="org-node-name">{person.name}</div>
                    <div className="org-node-click-hint">lihat profil ↗</div>
                  </div>
                </div>
              )})}
            </div>
          </div>

          {/* Right Column */}
          <div className="org-side-column">
            {rightNodes.length > 0 && <div className="org-column-label">Kepala Lab</div>}
            <div className="org-side-nodes">
              {rightNodes.map((item, idx) => {
                const { person, tier: primaryTier } = item;
                return (
                <div
                  key={`${person.id}-${primaryTier.key}-${idx}`}
                  className={`org-node ${primaryTier.cssClass}`}
                  tabIndex={0}
                  role="button"
                  onClick={() => setSelected({ person, tier: primaryTier })}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      setSelected({ person, tier: primaryTier });
                    }
                  }}
                >
                  <div className="org-node-card">
                    <NodePhoto person={person} />
                    <div className="org-node-role">{primaryTier.label}</div>
                    <div className="org-node-name">{person.name}</div>
                    <div className="org-node-click-hint">lihat profil ↗</div>
                  </div>
                </div>
              )})}
            </div>
          </div>
        </div>

      </div>
      </div>

      <div style={{ textAlign: 'center', marginTop: '30px' }}>
        <a href="#dosen-heading" className="org-route-button">
          DOSEN / STAFF
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 9l6 6 6-6"/>
          </svg>
        </a>
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
