const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

async function checkStats() {
    console.log('Checking orders...');

    // 1. Check raw orders
    const { data: orders, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);

    if (error) {
        console.error('Error fetching orders:', error);
        return;
    }

    console.log('Recent 5 orders:', JSON.stringify(orders.map(o => ({
        id: o.id,
        status: o.status,
        created_at: o.created_at,
        total_amount: o.total_amount
    })), null, 2));

    // 2. Check 30d range logic
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    console.log('Checking orders since:', thirtyDaysAgo.toISOString());

    const { data: trendOrders, error: trendError } = await supabase
        .from('orders')
        .select('total_amount, created_at, status')
        .in('status', ['confirmed', 'delivered'])
        .gte('created_at', thirtyDaysAgo.toISOString())
        .order('created_at', { ascending: true });

    if (trendError) {
        console.error('Trend Error:', trendError);
    } else {
        console.log(`Found ${trendOrders.length} orders in range.`);
        trendOrders.forEach(o => {
            const d = new Date(o.created_at);
            const key = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
            console.log(`Order ${o.id}: ${o.created_at} -> Key: "${key}" Amount: ${o.total_amount}`);
        });

        // Test Map Key generation
        const testDate = new Date();
        const testKey = testDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        console.log(`Today's Key: "${testKey}"`);
    }
}

checkStats();
