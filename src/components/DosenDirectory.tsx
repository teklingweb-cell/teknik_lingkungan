'use client';

import { useState } from 'react';
import type { Staff } from '@/lib/types';
import { BioModal, type Tier } from './OrgChart';

function birthKey(nip: string | null): number {
  const match = nip?.match(/^(\d{8})/);
  return match ? Number(match[1]) : Number.MAX_SAFE_INTEGER;
}

const DOSEN_TIER: Tier = { key: 'dosen', label: 'Dosen / Profesor', cssClass: 'tier-dosen', color: '#2563eb' };

function ListPhoto({ person }: { person: Staff }) {
  const [failed, setFailed] = useState(false);

  if (!person.photo_url || failed) {
    return (
      <div className="list-avatar initials" style={{ background: '#2563eb' }}>
        {(person.name || '?')[0].toUpperCase()}
      </div>
    );
  }

  return (
    /* eslint-disable-next-line @next/next/no-img-element */
    <img
      className="list-avatar"
      src={person.photo_url}
      alt={person.name}
      onError={() => setFailed(true)}
    />
  );
}

/** A readable, chronological directory rather than a visual card grid. */
export default function DosenDirectory({ people }: { people: Staff[] }) {
  const [selected, setSelected] = useState<Staff | null>(null);

  const dosen = [...people].sort(
    (a, b) => birthKey(a.nim_nip) - birthKey(b.nim_nip) || a.name.localeCompare(b.name, 'id')
  );

  if (!dosen.length) {
    return <p className="directory-empty">Data dosen belum tersedia.</p>;
  }

  return (
    <>
      <ol className="dosen-directory">
        {dosen.map((person) => (
          <li 
            key={person.id} 
            className="dosen-row clickable"
            role="button"
            tabIndex={0}
            onClick={() => setSelected(person)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                setSelected(person);
              }
            }}
          >
            <ListPhoto person={person} />
            <div className="dosen-details">
              <h3>{person.name}</h3>
              <p>
                {person.nim_nip && <span>NIP {person.nim_nip}</span>}
                {person.nim_nip && person.bidang && <span aria-hidden="true"> · </span>}
                {person.bidang && <span>KBK {person.bidang}</span>}
              </p>
            </div>
            {person.link_sinta ? (
              <a 
                className="sinta-link" 
                href={person.link_sinta} 
                target="_blank" 
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
              >
                Link SINTA <span aria-hidden="true">↗</span>
              </a>
            ) : (
              <span className="sinta-missing">SINTA belum tersedia</span>
            )}
          </li>
        ))}
      </ol>
      {selected && (
        <BioModal
          person={selected}
          tier={DOSEN_TIER}
          onClose={() => setSelected(null)}
        />
      )}
    </>
  );
}

