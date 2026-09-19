/** Shared client-side image preparation for the admin panel. */
export const IMAGE_BUCKET = 'site-images';
export const MAX_IMAGE_BYTES = 5 * 1024 * 1024;

const ACCEPTED_IMAGE_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/gif']);

export function imageUploadError(file: File): string | null {
  if (!ACCEPTED_IMAGE_TYPES.has(file.type)) {
    return 'Gunakan gambar JPG, PNG, WEBP, atau GIF.';
  }
  if (file.size > MAX_IMAGE_BYTES) {
    return 'Ukuran gambar maksimal 5 MB.';
  }
  return null;
}

/**
 * Re-encodes an image in the browser before it crosses the network. This keeps
 * the original upload out of Storage and gives every uploaded asset a stable,
 * lightweight WebP format. Animated GIFs intentionally become their first
 * frame, which is appropriate for the site’s editorial image fields.
 */
export async function toWebp(file: File): Promise<File> {
  const bitmap = await createImageBitmap(file);
  try {
    const canvas = document.createElement('canvas');
    canvas.width = bitmap.width;
    canvas.height = bitmap.height;
    const context = canvas.getContext('2d');
    if (!context) throw new Error('Browser tidak mendukung pemrosesan gambar.');
    context.drawImage(bitmap, 0, 0);

    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, 'image/webp', 0.84)
    );
    if (!blob) throw new Error('Gagal mengonversi gambar ke WEBP.');

    const baseName = file.name.replace(/\.[^.]+$/, '') || 'gambar';
    return new File([blob], `${baseName}.webp`, { type: 'image/webp' });
  } finally {
    bitmap.close();
  }
}
