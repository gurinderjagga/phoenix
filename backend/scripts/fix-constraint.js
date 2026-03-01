/**
 * One-time script to fix the orders status CHECK constraint in Supabase.
 * Run with: node scripts/fix-constraint.js
 */
require('dotenv').config();
const https = require('https');

const SUPABASE_URL = process.env.SUPABASE_URL || 'https://rckfzebmphobenrcgmqv.supabase.co';
const ANON_KEY = process.env.SUPABASE_ANON_KEY;

const sql = `
  ALTER TABLE public.orders DROP CONSTRAINT IF EXISTS orders_status_check;
  ALTER TABLE public.orders ADD CONSTRAINT orders_status_check 
    CHECK (status IN ('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'));
`;

const body = JSON.stringify({ query: sql });

const urlObj = new URL(`${SUPABASE_URL}/rest/v1/rpc/exec_sql`);

const options = {
    hostname: urlObj.hostname,
    path: urlObj.pathname,
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'apikey': ANON_KEY,
        'Authorization': `Bearer ${ANON_KEY}`,
        'Content-Length': Buffer.byteLength(body)
    }
};

console.log('Attempting to fix constraint via Supabase RPC...');
const req = https.request(options, (res) => {
    let data = '';
    res.on('data', (chunk) => data += chunk);
    res.on('end', () => {
        console.log('Status:', res.statusCode);
        console.log('Response:', data);
        if (res.statusCode === 200 || res.statusCode === 204) {
            console.log('✅ Constraint fixed successfully!');
        } else {
            console.log('❌ RPC method not available. Please run this SQL manually in Supabase SQL Editor:');
            console.log('---');
            console.log(sql.trim());
            console.log('---');
        }
    });
});

req.on('error', (err) => {
    console.error('Request error:', err.message);
    console.log('\nPlease run this SQL manually in Supabase SQL Editor (https://supabase.com/dashboard):');
    console.log('---');
    console.log(sql.trim());
    console.log('---');
});

req.write(body);
req.end();
