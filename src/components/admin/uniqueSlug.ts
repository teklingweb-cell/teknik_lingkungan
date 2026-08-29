import type { createSupabaseBrowserClient } from '@/lib/supabase/client';
import { slugify } from '@/lib/utils';

type Client = ReturnType<typeof createSupabaseBrowserClient>;

/**
 * A slug no other row in `table` is using.
 *
 * Checked against the table rather than relying on a unique index, because
 * neither `news.slug` nor `penelitian.slug` has one: two articles both titled
 * "Kuliah Tamu" would otherwise claim the same address and one of them would
 * become unreachable. The row being edited is excluded so re-saving an article
 * without renaming it keeps the slug — and therefore the URL — it already has.
 */
export async function uniqueSlug(
  supabase: Client,
  table: 'news' | 'penelitian',
  title: string,
  editId: number | null,
  fallback = 'item'
): Promise<string> {
  const base = slugify(title) || fallback;

  const { data } = await supabase.from(table).select('id, slug').limit(1000);
  const taken = new Set(
    (data ?? [])
      .filter((r: { id: number }) => r.id !== editId)
      .map((r: { slug?: string | null }) => r.slug?.trim())
      .filter((v): v is string => !!v)
  );

  if (!taken.has(base)) return base;
  for (let n = 2; n < 500; n++) {
    if (!taken.has(`${base}-${n}`)) return `${base}-${n}`;
  }
  return `${base}-${Date.now()}`;
}
