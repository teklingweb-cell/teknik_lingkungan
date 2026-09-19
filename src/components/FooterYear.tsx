'use client';

import { useEffect, useState } from 'react';

/**
 * Renders the current year. Seeded from the server so there's no hydration
 * mismatch, then corrected on mount — a statically-cached page served across a
 * new year would otherwise show a stale copyright.
 */
export default function FooterYear({ initialYear }: { initialYear: number }) {
  const [year, setYear] = useState(initialYear);
  useEffect(() => setYear(new Date().getFullYear()), []);
  return <span className="footer-year">{year}</span>;
}
