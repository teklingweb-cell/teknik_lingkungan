import { NextResponse, type NextRequest } from 'next/server';
import { revalidatePath } from 'next/cache';
import { createSupabaseServerClient } from '@/lib/supabase/server';

/**
 * Clears cached routes for one content type, on demand.
 *
 * The pages themselves now render per request, so they need no purging — this
 * exists for the routes that are still cached, chiefly `/sitemap.xml`, which is
 * regenerated hourly and would otherwise list a berita that had just been
 * renamed or deleted. The admin calls it after every successful write.
 *
 * The page paths below are kept deliberately: purging a route that is already
 * dynamic costs nothing, and it means the site stays correct if any of these
 * pages is ever put back on a cache.
 */

/** Which public routes each table feeds. */
const TARGETS: Record<string, { paths: string[]; routes?: string[] }> = {
  news: { paths: ['/', '/berita', '/sitemap.xml'], routes: ['/berita/[slug]'] },
  penelitian: { paths: ['/penelitian', '/sitemap.xml'], routes: ['/penelitian/[slug]'] },
  // Staff feeds both the directory and the org chart.
  staff: { paths: ['/staf', '/struktur'] },
  pencapaian: { paths: ['/pencapaian'] },
  mitra: { paths: ['/mitra'] },
};

export async function POST(request: NextRequest) {
  // Middleware only guards /admin/*, so this route checks the session itself.
  // getUser() revalidates against Supabase rather than trusting the cookie.
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }

  let entity: unknown;
  let paths: unknown;
  try {
    ({ entity, paths } = await request.json());
  } catch {
    return NextResponse.json({ error: 'invalid body' }, { status: 400 });
  }

  if (typeof entity !== 'string' || !(entity in TARGETS)) {
    return NextResponse.json({ error: 'unknown entity' }, { status: 400 });
  }

  const target = TARGETS[entity];
  const cleared: string[] = [];

  for (const path of target.paths) {
    revalidatePath(path);
    cleared.push(path);
  }

  // Passing the route pattern with 'page' marks every generated page of that
  // dynamic segment stale — needed because an edit can change a row's slug,
  // and a delete leaves a page that must stop resolving.
  for (const route of target.routes ?? []) {
    revalidatePath(route, 'page');
    cleared.push(route);
  }

  // Marking a route stale still lets Next serve the old page once while it
  // regenerates, so a just-deleted article answered 200 on the very next
  // request. Purging its exact path as well closes that one-request gap.
  // The shape is checked so this cannot be used to purge arbitrary routes.
  if (Array.isArray(paths)) {
    for (const path of paths) {
      if (typeof path === 'string' && /^\/(berita|penelitian)\/[a-z0-9-]+$/.test(path)) {
        revalidatePath(path);
        cleared.push(path);
      }
    }
  }

  return NextResponse.json({ revalidated: true, cleared });
}
