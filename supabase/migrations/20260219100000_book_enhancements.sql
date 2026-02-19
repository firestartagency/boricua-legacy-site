-- ============================================
-- Book Feature Enhancements
-- ============================================

-- 1. Book Images (gallery)
CREATE TABLE IF NOT EXISTS book_images (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    book_id UUID NOT NULL REFERENCES books(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    alt_text TEXT,
    display_order INT DEFAULT 0,
    is_cover BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_book_images_book_id ON book_images(book_id);

-- 2. Book Excerpts (uploadable excerpt pages)
CREATE TABLE IF NOT EXISTS book_excerpts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    book_id UUID NOT NULL REFERENCES books(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    page_label TEXT DEFAULT 'Page',
    display_order INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_book_excerpts_book_id ON book_excerpts(book_id);

-- 3. Book Editions (format/pricing variants)
CREATE TABLE IF NOT EXISTS book_editions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    book_id UUID NOT NULL REFERENCES books(id) ON DELETE CASCADE,
    format_name TEXT NOT NULL DEFAULT 'Hardcover',
    price DECIMAL(10,2) NOT NULL DEFAULT 0,
    purchase_link TEXT,
    is_featured BOOLEAN DEFAULT false,
    display_order INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_book_editions_book_id ON book_editions(book_id);

-- 4. Clean up books table
-- Remove columns that are no longer needed
ALTER TABLE books DROP COLUMN IF EXISTS price;
ALTER TABLE books DROP COLUMN IF EXISTS collection_id;
ALTER TABLE books DROP COLUMN IF EXISTS spine_text;
ALTER TABLE books DROP COLUMN IF EXISTS spine_color;

-- Enable RLS on new tables
ALTER TABLE book_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE book_excerpts ENABLE ROW LEVEL SECURITY;
ALTER TABLE book_editions ENABLE ROW LEVEL SECURITY;

-- Public read access policies
CREATE POLICY "Public read access" ON book_images FOR SELECT USING (true);
CREATE POLICY "Public read access" ON book_excerpts FOR SELECT USING (true);
CREATE POLICY "Public read access" ON book_editions FOR SELECT USING (true);

-- Service role full access
CREATE POLICY "Service role full access" ON book_images FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Service role full access" ON book_excerpts FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Service role full access" ON book_editions FOR ALL USING (true) WITH CHECK (true);
