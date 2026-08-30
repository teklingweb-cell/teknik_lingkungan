import { createClient } from '@supabase/supabase-js';
import { SUPABASE_URL, SUPABASE_ANON_KEY } from './env';

/**
 * Anonymous, session-less client for public Server Component reads.
 *
 * Deliberately does NOT touch cookies: reading cookies in a Server Component
 * opts the route out of static rendering, which would kill ISR. Public pages
 * have no user context anyway — RLS grants `select` to everyone.
 */
export const supabasePublic = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: { persistSession: false, autoRefreshToken: false },
});
