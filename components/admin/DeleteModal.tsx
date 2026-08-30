'use client';

import { useEffect } from 'react';

export default function DeleteModal({
  open,
  title = 'Konfirmasi Hapus',
  body,
  busy = false,
  onCancel,
  onConfirm,
}: {
  open: boolean;
  title?: string;
  body: React.ReactNode;
  busy?: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onCancel();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onCancel]);

  if (!open) return null;

  return (
    <div
      className="modal-overlay open"
      onClick={(e) => {
        if (e.target === e.currentTarget) onCancel();
      }}
    >
      <div className="modal">
        <div className="modal-icon">⚠️</div>
        <div className="modal-title">{title}</div>
        <div className="modal-body">{body}</div>
        <div className="modal-actions">
          <button className="btn btn-ghost" onClick={onCancel} disabled={busy}>
            Batal
          </button>
          <button className="btn btn-danger" onClick={onConfirm} disabled={busy}>
            {busy ? 'Menghapus…' : 'Ya, Hapus'}
          </button>
        </div>
      </div>
    </div>
  );
}
