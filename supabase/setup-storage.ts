import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import { resolve } from 'path';

// Load environment variables from .env.local
dotenv.config({ path: resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
    console.error('Missing environment variables. Check your .env.local file.');
    console.error('Required: NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: {
        autoRefreshToken: false,
        persistSession: false
    }
});

async function setupStorage() {
    console.log('Setting up storage buckets...\n');

    const buckets = [
        { name: 'book-covers', public: true },
        { name: 'resources', public: true },
        { name: 'merch', public: true }
    ];

    for (const bucket of buckets) {
        const { data, error } = await supabase.storage.createBucket(bucket.name, {
            public: bucket.public,
            fileSizeLimit: 10485760, // 10MB
            allowedMimeTypes: ['image/png', 'image/jpeg', 'image/webp', 'image/gif']
        });

        if (error) {
            if (error.message.includes('already exists')) {
                console.log(`✓ Bucket "${bucket.name}" already exists`);
            } else {
                console.error(`✗ Error creating bucket "${bucket.name}":`, error.message);
            }
        } else {
            console.log(`✓ Created bucket "${bucket.name}"`);
        }
    }

    console.log('\nStorage setup complete!');
}

setupStorage().catch(console.error);
