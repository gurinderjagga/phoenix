const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
if (!supabaseUrl) throw new Error('Missing env var: SUPABASE_URL');

// IMPORTANT: The backend uses the Service Role Key, NOT the anon key.
// The anon key is for the browser/frontend where Supabase Auth session is active.
// The service role key bypasses RLS so the Express server can make queries on behalf
// of any user — security is enforced by the authenticateToken / requireAdmin middleware.
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;

if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
  console.warn(
    '⚠️  SUPABASE_SERVICE_ROLE_KEY is not set. Falling back to anon key — RLS will block server-side writes.'
  );
}

// Create Supabase client with service role (disables RLS for server-side queries)
const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

module.exports = supabase;