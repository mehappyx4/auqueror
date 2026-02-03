const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

// 1. Load Environment Variables manually
function loadEnv(filePath) {
    if (!fs.existsSync(filePath)) {
        console.log(`⚠️  File not found: ${filePath}`);
        return {};
    }
    const content = fs.readFileSync(filePath, 'utf8');
    const env = {};
    content.split('\n').forEach(line => {
        const match = line.match(/^([^=]+)=(.*)$/);
        if (match) {
            const key = match[1].trim();
            let value = match[2].trim();
            if (value.startsWith('"') && value.endsWith('"')) value = value.slice(1, -1);
            env[key] = value;
        }
    });
    return env;
}

const envLocal = loadEnv(path.join(__dirname, '../.env.local'));
const env = { ...process.env, ...envLocal };

const SUPABASE_URL = env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = env.SUPABASE_SERVICE_ROLE_KEY || env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
    console.error('❌ Missing credentials.');
    process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function checkStorage() {
    try {
        console.log('\n--- Checking Storage Write Access ---');

        // TEST UPLOAD
        const fileName = `test_upload_${Date.now()}.txt`;
        const fileContent = 'Supabase Upload Test';

        console.log(`Attempting to upload ${fileName}...`);

        const { data, error } = await supabase.storage
            .from('uploads')
            .upload(fileName, fileContent, {
                contentType: 'text/plain',
                upsert: true
            });

        if (error) {
            console.error('❌ Upload Failed:', error.message);
            console.error('   Details:', error);
            if (error.message.includes('polic')) {
                console.log('   CAUSE: RLS Policy violation. The "uploads" bucket needs an INSERT policy for public/anon users OR you need a Service Role key.');
            }
        } else {
            console.log('✅ Upload Successful!', data);

            // Get Public URL
            const { data: { publicUrl } } = supabase.storage.from('uploads').getPublicUrl(fileName);
            console.log('   Public URL:', publicUrl);

            // CLEANUP
            console.log('   Cleaning up (deleting test file)...');
            const { error: delError } = await supabase.storage.from('uploads').remove([fileName]);
            if (delError) console.error('   ❌ Delete failed:', delError.message);
            else console.log('   ✅ Test file deleted.');
        }

    } catch (err) {
        console.error('Unexpected error:', err);
    }
}

checkStorage();
