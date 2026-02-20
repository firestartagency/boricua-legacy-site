/**
 * Run this script to apply database migrations:
 *   node scripts/migrate.js
 * 
 * Requires SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local
 */

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function testInsertAndCleanup(table, record) {
    // Test if column exists by attempting a zero-result query
    const { error } = await supabase.from(table).select('id').limit(0);
    if (error) {
        console.log(`  ⚠ Table ${table} issue:`, error.message);
        return false;
    }
    return true;
}

async function checkColumn(table, column) {
    // Try selecting just that column
    const { error } = await supabase.from(table).select(column).limit(1);
    if (error && error.message.includes(column)) {
        return false; // Column doesn't exist
    }
    return true;
}

async function main() {
    console.log('Checking schema...\n');

    // Check books columns
    const booksNewCols = [
        'page_count', 'publication_date', 'language', 'audience',
        'about_text', 'author_title', 'author_bio', 'author_quote',
        'author_image_url', 'author_signature_url'
    ];

    const missingBookCols = [];
    for (const col of booksNewCols) {
        const exists = await checkColumn('books', col);
        if (!exists) missingBookCols.push(col);
        else console.log(`  ✓ books.${col} exists`);
    }

    if (missingBookCols.length > 0) {
        console.log('\n  ✗ Missing book columns:', missingBookCols.join(', '));
        console.log('  → You need to run the following SQL in the Supabase dashboard:\n');
        for (const col of missingBookCols) {
            const type = col === 'page_count' ? 'integer' : 'text';
            const def = col === 'language' ? " DEFAULT 'English'" : '';
            console.log(`    ALTER TABLE books ADD COLUMN IF NOT EXISTS ${col} ${type}${def};`);
        }
    }

    // Check book_editions.isbn
    const isbnExists = await checkColumn('book_editions', 'isbn');
    if (!isbnExists) {
        console.log('\n  ✗ Missing book_editions.isbn');
        console.log('  → ALTER TABLE book_editions ADD COLUMN IF NOT EXISTS isbn text;');
    } else {
        console.log('  ✓ book_editions.isbn exists');
    }

    // Check book_reviews table
    const reviewsExist = await testInsertAndCleanup('book_reviews', {});
    if (!reviewsExist) {
        console.log('\n  ✗ Missing book_reviews table');
        console.log('  → CREATE TABLE book_reviews (id uuid DEFAULT gen_random_uuid() PRIMARY KEY, book_id uuid REFERENCES books(id) ON DELETE CASCADE NOT NULL, quote text NOT NULL, source_name text NOT NULL, display_order integer DEFAULT 0, created_at timestamptz DEFAULT now());');
    } else {
        console.log('  ✓ book_reviews table exists');
    }

    // Check collection_items.book_id
    const bookIdExists = await checkColumn('collection_items', 'book_id');
    if (!bookIdExists) {
        console.log('\n  ✗ Missing collection_items.book_id');
        console.log('  → ALTER TABLE collection_items ADD COLUMN IF NOT EXISTS book_id uuid REFERENCES books(id) ON DELETE SET NULL;');
    } else {
        console.log('  ✓ collection_items.book_id exists');
    }

    console.log('\nDone checking schema.');

    // Print full migration SQL for convenience
    if (missingBookCols.length > 0 || !isbnExists || !reviewsExist || !bookIdExists) {
        console.log('\n========== FULL MIGRATION SQL ==========');
        console.log('Run this in the Supabase SQL Editor:\n');
        console.log(`
-- Add new fields to books table
ALTER TABLE books ADD COLUMN IF NOT EXISTS page_count integer;
ALTER TABLE books ADD COLUMN IF NOT EXISTS publication_date text;
ALTER TABLE books ADD COLUMN IF NOT EXISTS language text DEFAULT 'English';
ALTER TABLE books ADD COLUMN IF NOT EXISTS audience text;
ALTER TABLE books ADD COLUMN IF NOT EXISTS about_text text;
ALTER TABLE books ADD COLUMN IF NOT EXISTS author_title text;
ALTER TABLE books ADD COLUMN IF NOT EXISTS author_bio text;
ALTER TABLE books ADD COLUMN IF NOT EXISTS author_quote text;
ALTER TABLE books ADD COLUMN IF NOT EXISTS author_image_url text;
ALTER TABLE books ADD COLUMN IF NOT EXISTS author_signature_url text;

-- Add ISBN to editions
ALTER TABLE book_editions ADD COLUMN IF NOT EXISTS isbn text;

-- Create book_reviews table
CREATE TABLE IF NOT EXISTS book_reviews (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    book_id uuid REFERENCES books(id) ON DELETE CASCADE NOT NULL,
    quote text NOT NULL,
    source_name text NOT NULL,
    display_order integer DEFAULT 0,
    created_at timestamptz DEFAULT now()
);

-- Add book_id to collection_items
ALTER TABLE collection_items ADD COLUMN IF NOT EXISTS book_id uuid REFERENCES books(id) ON DELETE SET NULL;

-- Enable RLS on book_reviews
ALTER TABLE book_reviews ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read access" ON book_reviews FOR SELECT USING (true);
CREATE POLICY "Authenticated full access" ON book_reviews FOR ALL USING (true);
GRANT ALL ON book_reviews TO anon;
GRANT ALL ON book_reviews TO authenticated;
        `);
    }
}

main();
