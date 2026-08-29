/**
 * Turn a Google Drive share link into a directly embeddable image URL.
 * Ported unchanged from the static site so existing image_url rows keep working.
 */
export function toGDriveImg(url: string | null | undefined, width = 800): string | null {
  if (!url) return null;
  if (url.includes('lh3.googleusercontent.com')) return url;
  let m = url.match(/\/d\/([a-zA-Z0-9_-]{10,})/);
  if (!m) m = url.match(/[?&]id=([a-zA-Z0-9_-]{10,})/);
  if (m) return `https://lh3.googleusercontent.com/d/${m[1]}=w${width}`;
  return url;
}

const MONTHS_LONG = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember',
];

// Matches the abbreviations berita.html used ('Ags', where Intl gives 'Agu').
const MONTHS_SHORT = [
  'Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun',
  'Jul', 'Ags', 'Sep', 'Okt', 'Nov', 'Des',
];

/**
 * Split a Postgres `date` (YYYY-MM-DD) into parts without going through `new Date()`.
 *
 * This matters more than it did on the static site: these strings now render on
 * the server as well as in the browser, and `new Date('2025-04-15')` parses as
 * UTC midnight — formatting that in a negative-offset timezone lands on the
 * previous day and causes a hydration mismatch. Reading the digits is stable
 * everywhere.
 */
function parseDateParts(d: string): { day: number; month: number; year: number } | null {
  const m = d.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (!m) return null;
  return { year: Number(m[1]), month: Number(m[2]), day: Number(m[3]) };
}

/** Long Indonesian date, e.g. "15 April 2025". */
export function formatDate(d: string | null | undefined): string {
  if (!d) return '';
  const p = parseDateParts(d);
  if (!p) return '';
  return `${p.day} ${MONTHS_LONG[p.month - 1]} ${p.year}`;
}

/** Short Indonesian date, e.g. "15 Apr 2025". Renders "–" when unset. */
export function formatDateShort(d: string | null | undefined): string {
  if (!d) return '–';
  const p = parseDateParts(d);
  if (!p) return '–';
  return `${p.day} ${MONTHS_SHORT[p.month - 1]} ${p.year}`;
}

/**
 * Normalise a pasted Google Drive share link into a direct image URL.
 *
 * Differs from `toGDriveImg`: this is the admin-side parser, so it returns null
 * for input that is not a usable URL at all (letting the form show a hint)
 * rather than echoing it back.
 */
export function parseGDriveUrl(raw: string | null | undefined): string | null {
  if (!raw) return null;
  const value = raw.trim();
  if (!value) return null;
  if (value.includes('lh3.googleusercontent.com')) return value;

  let m = value.match(/\/d\/([a-zA-Z0-9_-]{10,})/);
  if (!m) m = value.match(/[?&]id=([a-zA-Z0-9_-]{10,})/);
  if (!m) m = value.match(/open\?id=([a-zA-Z0-9_-]{10,})/);
  if (m) return `https://lh3.googleusercontent.com/d/${m[1]}=w1200`;

  return value.startsWith('http') ? value : null;
}

/** Today as YYYY-MM-DD in local time, for date input defaults. */
export function todayISO(): string {
  const d = new Date();
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

/**
 * Turns a title into a URL segment: "Mahasiswa TL Raih Juara — Nasional!"
 * becomes "mahasiswa-tl-raih-juara-nasional".
 *
 * Accented characters are folded to ASCII first (NFD + strip combining marks)
 * so "Kualitas Udara Sepanjang Tahun" and its accented variants agree, and the
 * result is limited to 80 characters on a word boundary — long enough to carry
 * the keywords, short enough to stay readable in a search result.
 */
export function slugify(text: string): string {
  const base = text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/&/g, ' dan ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

  if (base.length <= 80) return base;
  const cut = base.slice(0, 80);
  const lastDash = cut.lastIndexOf('-');
  return (lastDash > 40 ? cut.slice(0, lastDash) : cut).replace(/-+$/, '');
}

/**
 * The URL segment for a row: its stored `slug` when an editor has set one,
 * otherwise one derived from the title. Deriving means existing rows get
 * readable URLs without anyone having to backfill the database first.
 *
 * Falls back to the id when a title yields nothing sluggable — a title of only
 * punctuation or emoji would otherwise produce an empty segment, and
 * `/berita/` is the listing page, not the article.
 */
export function slugOf(row: { id: number; slug?: string | null; title: string }): string {
  const stored = row.slug?.trim();
  if (stored) return stored;
  return slugify(row.title) || String(row.id);
}
