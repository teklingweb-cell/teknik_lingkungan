'use client';

import { useCallback, useEffect, useRef } from 'react';

/**
 * Modal detail untuk kartu di halaman publik.
 *
 * Kartu di grid sengaja memotong judul dan deskripsi supaya tinggi barisnya
 * rata; modal ini yang menampilkan teks utuhnya. Admin punya modal sendiri
 * (`admin/DeleteModal`) yang memakai kelas dari admin.css — keduanya tidak
 * pernah dimuat bersamaan karena `(site)` dan `(admin)` punya root layout
 * masing-masing, tapi nama kelasnya tetap dibedakan supaya tidak tertukar.
 */

const FOCUSABLE =
  'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])';

export default function DetailModal({
  open,
  title,
  onClose,
  children,
}: {
  open: boolean;
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}) {
  const panelRef = useRef<HTMLDivElement>(null);
  /** Elemen yang membuka modal, supaya fokus bisa dikembalikan saat ditutup. */
  const opener = useRef<HTMLElement | null>(null);

  const onKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
        return;
      }
      if (e.key !== 'Tab' || !panelRef.current) return;

      // Jebak fokus di dalam panel: tanpa ini, Tab akan berjalan ke kartu-kartu
      // di belakang modal yang tidak terlihat.
      const nodes = Array.from(panelRef.current.querySelectorAll<HTMLElement>(FOCUSABLE));
      if (!nodes.length) return;
      const first = nodes[0];
      const last = nodes[nodes.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    },
    [onClose]
  );

  useEffect(() => {
    if (!open) return;

    opener.current = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', onKeyDown);

    // Fokus ke panel, bukan ke tombol tutup: pembaca layar lalu membacakan
    // judulnya lebih dulu, bukan kata "Tutup".
    panelRef.current?.focus();

    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = previousOverflow;
      opener.current?.focus?.();
    };
  }, [open, onKeyDown]);

  if (!open) return null;

  return (
    <div
      className="dm-overlay"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="dm-panel"
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        tabIndex={-1}
      >
        <button className="dm-close" onClick={onClose} aria-label="Tutup">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          >
            <path d="M18 6 6 18M6 6l12 12" />
          </svg>
        </button>
        {children}
      </div>
    </div>
  );
}

/** Satu baris "label — nilai" di badan modal. Tidak dirender bila nilai kosong. */
export function DetailRow({ label, value }: { label: string; value?: React.ReactNode }) {
  if (value === null || value === undefined || value === '') return null;
  return (
    <div className="dm-row">
      <div className="dm-row-label">{label}</div>
      <div className="dm-row-value">{value}</div>
    </div>
  );
}
