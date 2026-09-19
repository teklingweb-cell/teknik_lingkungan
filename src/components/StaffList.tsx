import type { Staff } from '@/lib/types';

/** Administrative staff displayed below the lecturer directory. */
export default function StaffList({ people }: { people: Staff[] }) {
  if (!people.length) {
    return <p className="directory-empty">Data staf belum tersedia.</p>;
  }

  return (
    <ul className="staff-directory">
      {people.map((person) => (
        <li key={person.id} className="staff-directory-row">
          <span className="staff-directory-initial" aria-hidden="true">
            {(person.name || '?')[0].toUpperCase()}
          </span>
          <div>
            <h3>{person.name}</h3>
            <p>{person.position || 'Staf'}</p>
          </div>
        </li>
      ))}
    </ul>
  );
}
