// ─── SUPABASE CONFIG ─────────────────────────────────────
// The anon key below is safe to expose in frontend code.
// IMPORTANT: Ensure Row Level Security (RLS) is enabled on ALL tables
// in your Supabase project so public visitors cannot read/write arbitrary data.
// See SUPABASE_SETUP.sql for required RLS policies.
const SUPABASE_URL  = 'https://goqmeheazigreyvfwfih.supabase.co';
const SUPABASE_ANON = 'sb_publishable_dvWMgg6ZMw1qWMd6fZlfxQ_g8Q0Nt34';

const { createClient } = supabase;
const sb = createClient(SUPABASE_URL, SUPABASE_ANON);
