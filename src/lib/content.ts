import { supabasePublic } from './supabase/public';
import { slugOf } from './utils';

/**
 * Resolves a URL segment to a row, for the berita and penelitian detail pages.
 *
 * A segment can be three things, in order of preference:
 *
 *   1. a slug stored in the row's `slug` column — what an editor set by hand;
 *   2. a slug derived from the title, so rows written before slugs existed get
 *      readable URLs without anyone having to backfill the database;
 *   3. a bare numeric id, the URL shape the site used to publish. Those still
 *      resolve, and the page redirects them to the slug so the old links keep
 *      working and their ranking moves across.
 *
 * The index query asks for three columns over the whole table rather than
 * filtering in SQL, because a derived slug does not exist in the database and
 * so cannot be matched by a `where` clause. Both detail routes are prerendered
 * and revalidate on a timer, so this runs on regeneration, not per visitor.
 */

type IndexRow = { id: number; title: string; slug?: string | null };

export type Resolved<T> = {
  row: T;
  /** The URL segment this row should live at. */
  slug: string;
  /** True when the visitor arrived on a different segment (usually the id). */
  shouldRedirect: boolean;
};

async function resolve<T extends { id: number }>(
  table: 'news' | 'penelitian',
  segment: string
): Promise<Resolved<T> | null> {
  const { data: index } = await supabasePublic
    .from(table)
    .select('id, title, slug')
    .order('id', { ascending: true })
    .limit(1000);

  const rows = (index ?? []) as IndexRow[];

  // First row wins a contested slug, so the mapping is stable as rows are
  // added. Editors get a unique slug assigned on save, so ties only happen
  // among older rows that share a title.
  const bySlug = new Map<string, IndexRow>();
  for (const r of rows) {
    const s = slugOf(r);
    if (!bySlug.has(s)) bySlug.set(s, r);
  }

  let match = bySlug.get(segment) ?? null;
  let arrivedOnSlug = match !== null;

  if (!match && /^\d+$/.test(segment)) {
    const id = Number(segment);
    match = rows.find((r) => r.id === id) ?? null;
  }

  if (!match) return null;

  const canonical = slugOf(match);

  // Only send an id URL to the slug when that slug leads back to this very
  // row. If an older duplicate title lost the slug to a newer row, redirecting
  // would hand the visitor somebody else's article — so it keeps its id URL.
  const slugOwner = bySlug.get(canonical);
  const canRedirect = slugOwner?.id === match.id;

  const { data } = await supabasePublic.from(table).select('*').eq('id', match.id).single();
  if (!data) return null;

  return {
    row: data as T,
    slug: canRedirect ? canonical : String(match.id),
    shouldRedirect: !arrivedOnSlug && canRedirect,
  };
}

export function resolveNews<T extends { id: number }>(segment: string) {
  return resolve<T>('news', segment);
}

export function resolvePenelitian<T extends { id: number }>(segment: string) {
  return resolve<T>('penelitian', segment);
}

/** Every segment worth prerendering, for generateStaticParams. */
export async function allSlugs(table: 'news' | 'penelitian'): Promise<string[]> {
  const { data } = await supabasePublic.from(table).select('id, title, slug').limit(1000);
  const rows = (data ?? []) as IndexRow[];

  const seen = new Set<string>();
  const out: string[] = [];
  for (const r of rows) {
    const s = slugOf(r);
    // A row that lost the slug to an earlier one stays reachable by its id.
    out.push(seen.has(s) ? String(r.id) : s);
    seen.add(s);
  }
  return out;
}
