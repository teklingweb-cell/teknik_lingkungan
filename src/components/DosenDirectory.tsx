import type { Staff } from '@/lib/types';

function birthKey(nip: string | null): number {
  const match = nip?.match(/^(\d{8})/);
  return match ? Number(match[1]) : Number.MAX_SAFE_INTEGER;
}

/** A readable, chronological directory rather than a visual card grid. */
export default function DosenDirectory({ people }: { people: Staff[] }) {
  const dosen = [...people].sort(
    (a, b) => birthKey(a.nim_nip) - birthKey(b.nim_nip) || a.name.localeCompare(b.name, 'id')
  );

  if (!dosen.length) {
    return <p className="directory-empty">Data dosen belum tersedia.</p>;
  }

  return (
    <ol className="dosen-directory">
      {dosen.map((person, index) => (
        <li key={person.id} className="dosen-row">
          <span className="dosen-number" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
          <div className="dosen-details">
            <h3>{person.name}</h3>
            <p>
              {person.nim_nip && <span>NIP {person.nim_nip}</span>}
              {person.nim_nip && person.bidang && <span aria-hidden="true"> · </span>}
              {person.bidang && <span>KBK {person.bidang}</span>}
            </p>
          </div>
          {person.link_sinta ? (
            <a className="sinta-link" href={person.link_sinta} target="_blank" rel="noopener noreferrer">
              Link SINTA <span aria-hidden="true">↗</span>
            </a>
          ) : (
            <span className="sinta-missing">SINTA belum tersedia</span>
          )}
        </li>
      ))}
    </ol>
  );
}
