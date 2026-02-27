import { createClient } from '@supabase/supabase-js';

// Hardcoded for now - update with your actual Supabase credentials
const supabaseUrl = 'https://rckfzebmphobenrcgmqv.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJja2Z6ZWJtcGhvYmVucmNnbXF2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg5MjAzMjcsImV4cCI6MjA4NDQ5NjMyN30.JOj2Ok6ke82csWJyRUg_ZF9VKv8QbpuETZsGjjmEBDM';

if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('Missing Supabase environment variables. Using hardcoded values.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true
    }
});

export default supabase;