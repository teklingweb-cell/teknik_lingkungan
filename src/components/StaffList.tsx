'use client';

import { useState } from 'react';
import type { Staff } from '@/lib/types';
import { BioModal, type Tier } from './OrgChart';

const STAFF_TIER: Tier = { key: 'staf', label: 'Staf Administrasi', cssClass: 'tier-staff', color: '#9333ea' };

function ListPhoto({ person }: { person: Staff }) {
  const [failed, setFailed] = useState(false);

  if (!person.photo_url || failed) {
    return (
      <div className="list-avatar initials" style={{ background: '#9333ea' }}>
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

/** Administrative staff displayed below the lecturer directory. */
export default function StaffList({ people }: { people: Staff[] }) {
  const [selected, setSelected] = useState<Staff | null>(null);

  if (!people.length) {
    return <p className="directory-empty">Data staf belum tersedia.</p>;
  }

  return (
    <>
      <ul className="staff-directory">
        {people.map((person) => (
          <li 
            key={person.id} 
            className="staff-directory-row clickable"
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
            <div>
              <h3>{person.name}</h3>
              <p>{person.position || 'Staf'}</p>
            </div>
          </li>
        ))}
      </ul>
      {selected && (
        <BioModal
          person={selected}
          tier={STAFF_TIER}
          onClose={() => setSelected(null)}
        />
      )}
    </>
  );
}

