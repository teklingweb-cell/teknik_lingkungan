/** Tables whose public pages can be refreshed on demand. */
export type RevalidateEntity = 'news' | 'penelitian' | 'staff' | 'pencapaian' | 'mitra';

/**
 * Tells the public site to drop its cached pages for one content type.
 *
 * Call after a successful insert, update or delete. Deliberately never throws:
 * the row is already saved by this point, so a failed cache purge must not turn
 * into a "gagal menyimpan" error in front of the editor. The worst case is the
 * old behaviour — the change appears within the 60-second ISR window instead of
 * immediately.
 */
export async function revalidatePublic(
  entity: RevalidateEntity,
  /**
   * Exact detail-page paths touched by this write, e.g. the slug of the row
   * just deleted, or both the old and new slug of a renamed one. Purging them
   * by name closes the one-request gap left by a route-wide purge.
   */
  paths: string[] = []
): Promise<void> {
  try {
    await fetch('/api/revalidate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ entity, paths }),
      // Same origin, so the admin's Supabase session cookie rides along and
      // the route can confirm the caller is signed in.
      credentials: 'same-origin',
    });
  } catch {
    // Network hiccup: fall back to the timed revalidation.
  }
}
