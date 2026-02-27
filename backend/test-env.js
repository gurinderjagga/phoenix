// Test script to check environment variables
require('dotenv').config();

console.log('Environment Variables Check:');
console.log('SUPABASE_URL:', process.env.SUPABASE_URL ? '✅ Set' : '❌ Missing');
console.log('SUPABASE_ANON_KEY:', process.env.SUPABASE_ANON_KEY ? '✅ Set' : '❌ Missing');
console.log('PORT:', process.env.PORT || '5000');
console.log('NODE_ENV:', process.env.NODE_ENV || 'development');

if (process.env.SUPABASE_URL) {
    console.log('SUPABASE_URL value:', process.env.SUPABASE_URL.substring(0, 30) + '...');
}
if (process.env.SUPABASE_ANON_KEY) {
    console.log('SUPABASE_ANON_KEY length:', process.env.SUPABASE_ANON_KEY.length);
}