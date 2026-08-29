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

export type IndexRow = { id: number; title: string | null; slug?: string | null };

/**
 * The id/title/slug of every row, for matching slugs derived from titles.
 *
 * Naming `slug` in the select is the cheap way to do this, but it makes the
 * query fail outright if the column is not there — and `news.slug` and
 * `penelitian.slug` are optional add-ons, not part of the base schema. When
 * that happened in production the index came back empty and *every* detail
 * page answered 404 while the listings, which select `*`, carried on working.
 * So: try the narrow select, and fall back to `*`, which returns whatever
 * columns the table actually has.
 */
export async function loadIndex(table: 'news' | 'penelitian'): Promise<IndexRow[]> {
  const narrow = await supabasePublic
    .from(table)
    .select('id, title, slug')
    .order('id', { ascending: true })
    .limit(1000);

  if (!narrow.error) return (narrow.data ?? []) as IndexRow[];

  // Logged, not swallowed: this fallback exists for a schema that lacks the
  // column, and if it ever fires for another reason we want to know which.
  console.warn(`[content] narrow select on ${table} failed: ${narrow.error.message}`);

  const wide = await supabasePublic
    .from(table)
    .select('*')
    .order('id', { ascending: true })
    .limit(1000);

  if (wide.error) {
    console.warn(`[content] wide select on ${table} failed too: ${wide.error.message}`);
  }
  return (wide.data ?? []) as IndexRow[];
}

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
  for (const r of await loadIndex(table)) {
    if (slugOf(r) === slug) return r.id === id;
  }
  return false;
}

async function resolve<T extends { id: number }>(
  table: 'news' | 'penelitian',
  segment: string
): Promise<Resolved<T> | null> {
  // 1 — a stored slug. Unique, because the admin assigns it that way. If the
  // column does not exist the query errors, `data` is null, and the lookup
  // falls through to the derived-slug path below — which is the right answer.
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
  const index = await loadIndex(table);

  let match: IndexRow | null = null;
  for (const r of index) {
    // First row wins a contested slug, so the mapping stays stable as rows
    // are added.
    if (slugOf(r) === segment) {
      match = r;
      break;
    }
  }
  if (!match) {
    // A 404 is silent by nature, so say why here: without this, "the page is
    // not found but the row exists" is impossible to tell apart from "the
    // query came back empty" once the site is deployed. Visible in the Vercel
    // runtime logs, never to the visitor.
    console.warn(
      `[content] no ${table} matches "${segment}" — index had ${index.length} row(s)` +
        (index.length ? `, first: "${slugOf(index[0])}"` : '')
    );
    return null;
  }

  const full = await supabasePublic.from(table).select('*').eq('id', match.id).maybeSingle();
  if (!full.data) {
    console.warn(`[content] ${table} id ${match.id} matched "${segment}" but the row would not load`);
    return null;
  }

  return { row: full.data as T, slug: segment, shouldRedirect: false };
}

export function resolveNews<T extends { id: number }>(segment: string) {
  return resolve<T>('news', segment);
}

export function resolvePenelitian<T extends { id: number }>(segment: string) {
  return resolve<T>('penelitian', segment);
}
