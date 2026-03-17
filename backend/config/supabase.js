const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL || 'https://rckfzebmphobenrcgmqv.supabase.co';

// IMPORTANT: The backend uses the Service Role Key, NOT the anon key.
// The anon key is for the browser/frontend where Supabase Auth session is active.
// The service role key bypasses RLS so the Express server can make queries on behalf
// of any user — security is enforced by the authenticateToken / requireAdmin middleware.
const supabaseKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.SUPABASE_ANON_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJja2Z6ZWJtcGhvYmVucmNnbXF2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg5MjAzMjcsImV4cCI6MjA4NDQ5NjMyN30.JOj2Ok6ke82csWJyRUg_ZF9VKv8QbpuETZsGjjmEBDM';

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