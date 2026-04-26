// ─── SUPABASE CONFIG ─────────────────────────────────────
// Replace these with your actual values from supabase.com → Project Settings → API
const SUPABASE_URL  = 'https://goqmeheazigreyvfwfih.supabase.co';
const SUPABASE_ANON = 'sb_publishable_dvWMgg6ZMw1qWMd6fZlfxQ_g8Q0Nt34';

const { createClient } = supabase;
const sb = createClient(SUPABASE_URL, SUPABASE_ANON);
