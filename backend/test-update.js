require('dotenv').config({ path: __dirname + '/.env' });
const { createClient } = require('@supabase/supabase-js');

if (!process.env.SUPABASE_URL || !process.env.SUPABASE_ANON_KEY) {
    console.error("Missing env vars");
    process.exit(1);
}

// Just use ANON_KEY to see if RLS fails, or service key to see if constraint fails
const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;
const supabase = createClient(process.env.SUPABASE_URL, key);

async function test() {
    const { data: resData, error: readError } = await supabase.from('reservations').select('id, status').limit(1);
    if (readError) return console.error("Read error:", readError);
    if (!resData || resData.length === 0) return console.log("No reservations found");

    const id = resData[0].id;
    const oldStatus = resData[0].status;

    console.log(`Setting reservation ${id} from ${oldStatus} to 'ready for pickup'...`);

    const { data, error } = await supabase
        .from('reservations')
        .update({ status: 'ready for pickup' })
        .eq('id', id)
        .select()
        .single();

    if (error) {
        console.error("====== UPDATE ERROR ======");
        console.error(error);
    } else {
        console.log("====== UPDATE SUCCESS ======");
        console.log(data);
        // revert it back
        await supabase.from('reservations').update({ status: oldStatus }).eq('id', id);
    }
}
test();
