/**
 * Konstanta & helper bersama untuk tabel `pencapaian`, dipakai halaman publik
 * maupun admin. Bentuk datanya mengikuti LKPS sheet 6c1 (Prestasi Akademik
 * Mahasiswa), 6c2 (Prestasi Non-akademik Mahasiswa), dan 4j (Rekognisi DTPS)
 * pada "LKPS TL - 14 Agustus 2026.xlsx".
 */

/**
 * Pengelompokan untuk tab halaman publik. `Prestasi` dan `Rekognisi` datang
 * dari Excel; sisanya untuk entri yang diinput manual lewat admin — terutama
 * `Akreditasi`, yang tidak punya sheet di LKPS.
 */
export const PENCAPAIAN_CATEGORIES = [
  'Prestasi',
  'Rekognisi',
  'Akreditasi',
  'Riset',
  'Hibah',
  'Ranking',
  'Lainnya',
] as const;

/** Kolom "Tingkat" pada Excel. */
export const PENCAPAIAN_TINGKAT = ['Lokal/Wilayah', 'Nasional', 'Internasional'] as const;

/** Siapa yang meraih. `Institusi` untuk entri manual seperti akreditasi. */
export const PENCAPAIAN_PELAKU = ['Mahasiswa', 'Dosen', 'Institusi'] as const;

/** Sheet asal: 6c1 → Akademik, 6c2 → Non-akademik, 4j → Penghargaan. */
export const PENCAPAIAN_JENIS = ['Akademik', 'Non-akademik', 'Penghargaan'] as const;

export const PENCAPAIAN_COLORS: Record<string, string> = {
  Prestasi: '#d97706',
  Rekognisi: '#9333ea',
  Akreditasi: '#16a34a',
  Riset: '#2563eb',
  Hibah: '#db2777',
  Ranking: '#0891b2',
  Lainnya: '#6b7a6c',
};

export const TINGKAT_COLORS: Record<string, string> = {
  Internasional: '#9333ea',
  Nasional: '#2563eb',
  'Lokal/Wilayah': '#6b7a6c',
};

/**
 * Warna lencana kartu. Sengaja tidak memakai emoji: emoji ikut tersimpan ke
 * dalam file SQL dan rusak begitu file itu dibuka atau ditempel lewat editor
 * yang bukan UTF-8. Bentuknya digambar sebagai SVG di komponen.
 */
export function colorOf(item: { category?: string | null }): string {
  return PENCAPAIAN_COLORS[item.category ?? ''] ?? '#6b7a6c';
}
