import type { Mitra } from './types';

/**
 * Konstanta & helper bersama untuk tabel `mitra`, dipakai halaman publik
 * maupun admin. Bentuk datanya mengikuti Tabel 2 LKPS (Kerjasama Tridharma),
 * sheet 2a1/2a2/2a3 pada "LKPS TL - 14 Agustus 2026.xlsx".
 */

/**
 * Kategori lembaga. Bukan kolom Excel — diturunkan dari nama lembaga saat
 * impor, karena Excel hanya mencatat *tingkat* kerja sama, bukan jenis
 * institusinya.
 */
export const MITRA_CATEGORIES = [
  'Industri',
  'Pemerintah',
  'Akademik',
  'Masyarakat',
  'Asosiasi',
  'Internasional',
] as const;

/** Kolom "Tingkat" pada Excel. */
export const MITRA_TINGKAT = ['Internasional', 'Nasional', 'Lokal/Wilayah'] as const;

/** Sheet asal: 2a1, 2a2, 2a3. */
export const MITRA_JENIS = [
  'Pendidikan',
  'Penelitian',
  'Pengabdian kepada Masyarakat',
] as const;

/** Kolom "Status Kerjasama" pada Excel. */
export const MITRA_STATUS = ['Valid', 'Tidak Valid'] as const;

/** Kolom "Bukti Kerjasama" — daftar tertutup di Excel. */
export const MITRA_BUKTI = [
  'Surat Penugasan',
  'Surat Perjanjian Kerjasama (SPK)',
  'Bukti-bukti Pelaksanaan (Laporan, Hasil Kerjasama, Luaran Kerjasama)',
  'Bukti lain yang relevan',
] as const;

export const MITRA_CATEGORY_COLORS: Record<string, string> = {
  Industri: '#2563eb',
  Pemerintah: '#d97706',
  Akademik: '#16a34a',
  Masyarakat: '#0891b2',
  Asosiasi: '#db2777',
  Internasional: '#9333ea',
};

export const MITRA_JENIS_COLORS: Record<string, string> = {
  Pendidikan: '#2563eb',
  Penelitian: '#16a34a',
  'Pengabdian kepada Masyarakat': '#d97706',
};

/** Label pendek untuk chip/badge — nama jenis PkM terlalu panjang. */
export function jenisLabel(jenis: string | null | undefined): string {
  if (!jenis) return '–';
  return jenis === 'Pengabdian kepada Masyarakat' ? 'PkM' : jenis;
}

/**
 * Kerja sama dianggap masih berlaku selama tanggal akhirnya belum lewat.
 * Baris tanpa tanggal akhir diperlakukan sebagai masih berlaku — di LKPS
 * kolom itu wajib, jadi yang kosong berarti data belum lengkap, bukan selesai.
 */
export function isAktif(item: Pick<Mitra, 'tanggal_akhir'>, today = new Date()): boolean {
  if (!item.tanggal_akhir) return true;
  const pad = (n: number) => String(n).padStart(2, '0');
  const iso = `${today.getFullYear()}-${pad(today.getMonth() + 1)}-${pad(today.getDate())}`;
  // Perbandingan string aman untuk format ISO dan menghindari pergeseran zona waktu.
  return item.tanggal_akhir >= iso;
}
