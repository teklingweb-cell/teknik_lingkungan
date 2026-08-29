import { supabasePublic } from './supabase/public';
import { slugOf } from './utils';

/**
 * Resolves a URL segment to a row, for the berita and penelitian detail pages.
 *
 * A segment can be three things, in order of preference:
 *
 *   1. a slug stored in the row's `slug` column — what the admin saves;
 *   2. a slug derived from the title, so rows written before slugs existed get
 *      readable URLs without anyone having to backfill the database;
 *   3. a bare numeric id, the URL shape the site used to publish. Those still
 *      resolve, and the page redirects them to the slug so old links keep
 *      working and their ranking moves across.
 *
 * Cases 1 and 3 are answered by a single indexed lookup. Only case 2 needs to
 * read the table, because a derived slug exists nowhere in the database and so
 * cannot be matched by a `where` clause. That matters now that these pages
 * render per request: an article whose slug is stored costs one query, not a
 * scan of every row.
 */

type IndexRow = { id: number; title: string | null; slug?: string | null };

export type Resolved<T> = {
  row: T;
  /** The URL segment this row should live at. */
  slug: string;
  /** True when the visitor arrived on a different segment (usually the id). */
  shouldRedirect: boolean;
};

/** Whether `slug` is the segment this row owns, once ties are settled. */
async function ownsSlug(
  table: 'news' | 'penelitian',
  slug: string,
  id: number
): Promise<boolean> {
  const { data } = await supabasePublic
    .from(table)
    .select('id, title, slug')
    .order('id', { ascending: true })
    .limit(1000);

  for (const r of (data ?? []) as IndexRow[]) {
    if (slugOf(r) === slug) return r.id === id;
  }
  return false;
}

async function resolve<T extends { id: number }>(
  table: 'news' | 'penelitian',
  segment: string
): Promise<Resolved<T> | null> {
  // 1 — a stored slug. Unique, because the admin assigns it that way.
  const stored = await supabasePublic.from(table).select('*').eq('slug', segment).maybeSingle();
  if (stored.data) {
    return { row: stored.data as T, slug: segment, shouldRedirect: false };
  }

  // 2 — an old numeric id. Resolve it, then point at the canonical slug.
  if (/^\d+$/.test(segment)) {
    const byId = await supabasePublic
      .from(table)
      .select('*')
      .eq('id', Number(segment))
      .maybeSingle();

    if (!byId.data) return null;

    const row = byId.data as T & { title?: string | null; slug?: string | null };
    const canonical = slugOf({ id: row.id, title: row.title, slug: row.slug });

    // Nothing to redirect to if the canonical segment is the id itself.
    if (canonical === segment) {
      return { row: row as T, slug: segment, shouldRedirect: false };
    }

    // A stored slug is unique by construction; a derived one has to be checked,
    // or an older row sharing a title would send visitors to somebody else's
    // article.
    const safe = row.slug?.trim() ? true : await ownsSlug(table, canonical, row.id);

    return {
      row: row as T,
      slug: safe ? canonical : segment,
      shouldRedirect: safe,
    };
  }

  // 3 — a slug derived from a title. Needs the table, since it exists only as
  // a computed value.
  const { data } = await supabasePublic
    .from(table)
    .select('id, title, slug')
    .order('id', { ascending: true })
    .limit(1000);

  let match: IndexRow | null = null;
  for (const r of (data ?? []) as IndexRow[]) {
    // First row wins a contested slug, so the mapping stays stable as rows
    // are added.
    if (slugOf(r) === segment) {
      match = r;
      break;
    }
  }
  if (!match) return null;

  const full = await supabasePublic.from(table).select('*').eq('id', match.id).maybeSingle();
  if (!full.data) return null;

  return { row: full.data as T, slug: segment, shouldRedirect: false };
}

export function resolveNews<T extends { id: number }>(segment: string) {
  return resolve<T>('news', segment);
}

export function resolvePenelitian<T extends { id: number }>(segment: string) {
  return resolve<T>('penelitian', segment);
}
