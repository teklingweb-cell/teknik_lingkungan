'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { parseGDriveUrl } from '@/lib/utils';
import { createSupabaseBrowserClient } from '@/lib/supabase/client';
import { IMAGE_BUCKET, imageUploadError, toWebp } from '@/lib/image-upload';

/**
 * Image picker used everywhere in the admin panel. A local file is converted
 * to WebP before it is uploaded to Supabase Storage; a previously saved or
 * pasted Google Drive URL remains supported for existing content.
 */
export default function GDriveField({
  label = 'Gambar Cover (Google Drive)',
  value,
  onChange,
  onResolved,
  folder = 'general',
}: {
  label?: string;
  value: string;
  onChange: (raw: string) => void;
  onResolved: (direct: string | null) => void;
  folder?: string;
}) {
  const supabase = useMemo(() => createSupabaseBrowserClient(), []);
  const direct = parseGDriveUrl(value) ?? (/^https?:\/\//i.test(value) ? value : null);
  const [status, setStatus] = useState<'idle' | 'ok' | 'err'>('idle');
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');

  // Keep the latest callback in a ref: parents usually pass an inline arrow, so
  // depending on its identity would re-run this effect on every render.
  const onResolvedRef = useRef(onResolved);
  onResolvedRef.current = onResolved;

  useEffect(() => {
    onResolvedRef.current(direct);
    setStatus('idle');
  }, [direct]);

  async function upload(file: File) {
    const validationError = imageUploadError(file);
    if (validationError) {
      setUploadError(validationError);
      return;
    }

    setUploading(true);
    setUploadError('');
    try {
      const webp = await toWebp(file);
      const suffix = typeof crypto.randomUUID === 'function'
        ? crypto.randomUUID()
        : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
      const safeFolder = folder.replace(/[^a-z0-9-_]/gi, '-').replace(/^-+|-+$/g, '') || 'general';
      const path = `${safeFolder}/${Date.now()}-${suffix}.webp`;
      const { error } = await supabase.storage.from(IMAGE_BUCKET).upload(path, webp, {
        cacheControl: '31536000',
        contentType: 'image/webp',
        upsert: false,
      });
      if (error) throw error;

      const { data } = supabase.storage.from(IMAGE_BUCKET).getPublicUrl(path);
      onChange(data.publicUrl);
      onResolvedRef.current(data.publicUrl);
      setStatus('idle');
    } catch (error) {
      setUploadError(error instanceof Error ? error.message : 'Gagal mengunggah gambar.');
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="form-group gdrive-wrap">
      <label>{label}</label>
      <div className="image-upload-row">
        <label className="image-upload-button" htmlFor={`image-upload-${folder}`}>
          {uploading ? 'Mengonversi & mengunggah…' : 'Pilih gambar'}
        </label>
        <input
          id={`image-upload-${folder}`}
          className="image-upload-input"
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          disabled={uploading}
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) void upload(file);
            e.currentTarget.value = '';
          }}
        />
        <span className="image-upload-help">JPG, PNG, WEBP, atau GIF · maks. 5 MB · disimpan sebagai WEBP</span>
      </div>
      <div className="gdrive-input-row">
        <input
          className="form-input"
          placeholder="Atau tempel link Google Drive / gambar…"
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

      <span className={`gdrive-status${status === 'ok' ? ' ok' : status === 'err' || uploadError ? ' err' : ''}`}>
        {status === 'ok' && '✓ Gambar berhasil dimuat'}
        {status === 'err' && '✗ Gambar tidak bisa dimuat. Pastikan link bisa diakses publik.'}
        {uploadError && `✗ ${uploadError}`}
      </span>

      <span className="gdrive-hint">
        Pilih gambar untuk mengonversinya otomatis ke WEBP. Link Google Drive lama tetap dapat
        digunakan: atur ke <strong>Siapa saja dengan link</strong> sebelum menempelkan tautannya.
      </span>
    </div>
  );
}
