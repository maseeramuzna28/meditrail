const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL      = process.env.SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;
const SUPABASE_SRK      = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SRK) {
  console.error('❌  Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env');
  process.exit(1);
}

// Admin client — bypasses RLS, used for all server-side operations
const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SRK, {
  auth: { autoRefreshToken: false, persistSession: false },
});

// Public client — respects RLS policies
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

module.exports = { supabase, supabaseAdmin };
