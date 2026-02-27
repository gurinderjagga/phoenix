const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL || 'https://rckfzebmphobenrcgmqv.supabase.co';
const supabaseKey = process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJja2Z6ZWJtcGhvYmVucmNnbXF2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg5MjAzMjcsImV4cCI6MjA4NDQ5NjMyN30.JOj2Ok6ke82csWJyRUg_ZF9VKv8QbpuETZsGjjmEBDM';

if (!supabaseUrl || !supabaseKey) {
  console.warn('Missing Supabase environment variables, using defaults');
}

// Create Supabase client
const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
});

module.exports = supabase;