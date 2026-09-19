'use client';

import { useMemo, useState } from 'react';
import type { Staff } from '@/lib/types';

export default function AlumniDirectory({ people }: { people: Staff[] }) {
  const years = useMemo(
    () => [...new Set(people.map((person) => person.graduation_year).filter((year): year is number => Number.isInteger(year)))].sort((a, b) => b - a),
    [people]
  );
  const [year, setYear] = useState('all');
  const visible = people
    .filter((person) => year === 'all' || String(person.graduation_year) === year)
    .sort((a, b) => (b.graduation_year ?? 0) - (a.graduation_year ?? 0) || a.name.localeCompare(b.name, 'id'));

  return (
    <div className="alumni-directory">
      <div className="alumni-filter">
        <label htmlFor="graduation-year">Filter tahun kelulusan</label>
        <select id="graduation-year" value={year} onChange={(event) => setYear(event.target.value)}>
          <option value="all">Semua tahun ({people.length})</option>
          {years.map((item) => <option key={item} value={item}>{item}</option>)}
        </select>
      </div>
      <ul className="alumni-list" aria-live="polite">
        {visible.length ? visible.map((person) => (
          <li key={person.id}>
            <span className="alumni-name">{person.name}</span>
            <span className="alumni-year">{person.graduation_year ? `Lulus ${person.graduation_year}` : 'Tahun kelulusan belum tersedia'}</span>
          </li>
        )) : <li className="alumni-empty">Belum ada alumni untuk tahun yang dipilih.</li>}
      </ul>
    </div>
  );
}
