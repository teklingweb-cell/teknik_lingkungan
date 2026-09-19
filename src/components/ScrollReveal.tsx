'use client';

import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

/**
 * Replaces the IntersectionObserver block in the old main.js.
 *
 * Two differences that matter: it re-arms on client-side navigation, and a
 * MutationObserver picks up `.fade-up` nodes that appear later (rendered lists,
 * filtered grids) — the old script only ever saw what existed at DOMContentLoaded.
 */
export default function ScrollReveal() {
  const pathname = usePathname();

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '-40px 0px' }
    );

    const observeAll = () => {
      document
        .querySelectorAll('.fade-up:not(.visible)')
        .forEach((el) => io.observe(el));
    };

    observeAll();

    const mo = new MutationObserver(observeAll);
    mo.observe(document.body, { childList: true, subtree: true });

    return () => {
      io.disconnect();
      mo.disconnect();
    };
  }, [pathname]);

  return null;
}
