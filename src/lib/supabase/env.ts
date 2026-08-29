export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;

/**
 * Supabase renamed the browser-safe key from "anon" to "publishable" (values
 * now look like `sb_publishable_…`). Both names are accepted so existing
 * .env.local files and deploy configs keep working either way.
 */
export const SUPABASE_ANON_KEY = (process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)!;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  throw new Error(
    'Missing NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ' +
      '(NEXT_PUBLIC_SUPABASE_ANON_KEY also accepted). ' +
      'Copy .env.example to .env.local and fill them in.'
  );
}
