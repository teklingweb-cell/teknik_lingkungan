'use client';

import { useEffect, useState } from 'react';
import { parseGDriveUrl } from '@/lib/utils';

/**
 * Google Drive image picker: paste a share link, get a live preview and the
 * normalised direct URL. `value` is the raw pasted text; `onResolved` receives
 * the direct URL (or null) that should be written to the database.
 */
export default function GDriveField({
  label = 'Gambar Cover (Google Drive)',
  value,
  onChange,
  onResolved,
}: {
  label?: string;
  value: string;
  onChange: (raw: string) => void;
  onResolved: (direct: string | null) => void;
}) {
  const direct = parseGDriveUrl(value);
  const [status, setStatus] = useState<'idle' | 'ok' | 'err'>('idle');

  useEffect(() => {
    onResolved(direct);
    setStatus('idle');
  }, [direct, onResolved]);

  return (
    <div className="form-group gdrive-wrap">
      <label>{label}</label>
      <div className="gdrive-input-row">
        <input
          className="form-input"
          placeholder="Paste link Google Drive di sini…"
          autoComplete="off"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
        <button
          type="button"
          className="gdrive-clear-btn"
          onClick={() => onChange('')}
        >
          ✕ Hapus
        </button>
      </div>

      {direct && (
        <div className={`gdrive-preview${status === 'ok' ? ' show' : ''}`}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={direct}
            alt="Preview"
            loading="lazy"
            onLoad={() => setStatus('ok')}
            onError={() => setStatus('err')}
          />
          <span className="gdrive-preview-label">Preview</span>
        </div>
      )}

      <span className={`gdrive-status${status === 'ok' ? ' ok' : status === 'err' ? ' err' : ''}`}>
        {status === 'ok' && '✓ Gambar berhasil dimuat'}
        {status === 'err' && '✗ Gambar tidak bisa dimuat. Pastikan link bisa diakses publik.'}
      </span>

      <span className="gdrive-hint">
        Di Google Drive: klik kanan file → <strong>Bagikan</strong> →{' '}
        <strong>Siapa saja dengan link</strong> → salin link.
      </span>
    </div>
  );
}
