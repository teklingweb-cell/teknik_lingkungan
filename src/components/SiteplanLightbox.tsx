'use client';

import { useState, useEffect, useCallback } from 'react';

interface Props {
  /** Path to siteplan image inside /public, e.g. "/siteplan.jpg" */
  src: string;
  /** Alt text for accessibility */
  alt?: string;
}

/**
 * Shows a clickable siteplan thumbnail.
 * Clicking opens a full-screen lightbox with the image.
 * Press Escape or click outside the image to close.
 */
export default function SiteplanLightbox({ src, alt = 'Siteplan Gedung Teknik Lingkungan UNTAN' }: Props) {
  const [open, setOpen] = useState(false);

  const close = useCallback(() => setOpen(false), []);

  /* Close on Escape */
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') close(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open, close]);

  /* Prevent body scroll while open */
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  return (
    <>
      {/* Thumbnail */}
      <div className="siteplan-block fade-up delay-2">
        <div className="siteplan-label">Siteplan Gedung</div>
        <button
          className="siteplan-thumb-btn"
          onClick={() => setOpen(true)}
          aria-label="Perbesar siteplan"
          type="button"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={src} alt={alt} loading="lazy" className="siteplan-thumb-img" />
          <span className="siteplan-zoom-hint" aria-hidden="true">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
              <line x1="11" y1="8" x2="11" y2="14" /><line x1="8" y1="11" x2="14" y2="11" />
            </svg>
            Perbesar
          </span>
        </button>
      </div>

      {/* Lightbox */}
      {open && (
        <div
          className="siteplan-lightbox"
          role="dialog"
          aria-modal="true"
          aria-label="Siteplan gedung"
          onClick={close}
        >
          <button className="siteplan-close" onClick={close} aria-label="Tutup" type="button">✕</button>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={src}
            alt={alt}
            className="siteplan-full-img"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </>
  );
}
