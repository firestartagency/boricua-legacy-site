-- ============================================
-- Boricua Legacy - Supabase Database Schema
-- Run this SQL in your Supabase SQL Editor
-- ============================================

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- Collections table (parent of books)
-- ============================================
CREATE TABLE IF NOT EXISTS collections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  title_es TEXT,
  description TEXT,
  description_es TEXT,
  theme_color TEXT DEFAULT '#d4af37',
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================
-- Books table
-- ============================================
CREATE TABLE IF NOT EXISTS books (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  collection_id UUID REFERENCES collections(id) ON DELETE SET NULL,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  title_es TEXT,
  author TEXT,
  price DECIMAL(10,2),
  description TEXT,
  description_es TEXT,
  cover_image_url TEXT,
  spine_text TEXT,
  spine_color TEXT DEFAULT '#d4af37',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================
-- Hero slides (homepage carousel)
-- ============================================
CREATE TABLE IF NOT EXISTS hero_slides (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  book_id UUID REFERENCES books(id) ON DELETE CASCADE,
  headline_1 TEXT,
  headline_1_es TEXT,
  headline_2 TEXT,
  headline_2_es TEXT,
  headline_3 TEXT,
  headline_3_es TEXT,
  subtext TEXT,
  subtext_es TEXT,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================
-- Collection resources (journals, bookmarks, etc.)
-- ============================================
CREATE TABLE IF NOT EXISTS collection_resources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  collection_id UUID REFERENCES collections(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  name_es TEXT,
  type TEXT CHECK (type IN ('journal', 'bookmark', 'poster', 'other')),
  description TEXT,
  description_es TEXT,
  image_url TEXT,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================
-- Collection merchandise
-- ============================================
CREATE TABLE IF NOT EXISTS collection_merch (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  collection_id UUID REFERENCES collections(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  name_es TEXT,
  price DECIMAL(10,2),
  image_url TEXT,
  purchase_url TEXT,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================
-- Indexes for performance
-- ============================================
CREATE INDEX IF NOT EXISTS idx_books_collection_id ON books(collection_id);
CREATE INDEX IF NOT EXISTS idx_books_slug ON books(slug);
CREATE INDEX IF NOT EXISTS idx_hero_slides_display_order ON hero_slides(display_order);
CREATE INDEX IF NOT EXISTS idx_collections_display_order ON collections(display_order);

-- ============================================
-- Row Level Security (RLS) Policies
-- ============================================

-- Enable RLS on all tables
ALTER TABLE collections ENABLE ROW LEVEL SECURITY;
ALTER TABLE books ENABLE ROW LEVEL SECURITY;
ALTER TABLE hero_slides ENABLE ROW LEVEL SECURITY;
ALTER TABLE collection_resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE collection_merch ENABLE ROW LEVEL SECURITY;

-- Public read access (for the website)
CREATE POLICY "Public read access" ON collections FOR SELECT USING (true);
CREATE POLICY "Public read access" ON books FOR SELECT USING (true);
CREATE POLICY "Public read access" ON hero_slides FOR SELECT USING (true);
CREATE POLICY "Public read access" ON collection_resources FOR SELECT USING (true);
CREATE POLICY "Public read access" ON collection_merch FOR SELECT USING (true);

-- Authenticated users can insert, update, delete (for admin portal)
-- Note: In production, you'd want to check for admin role
CREATE POLICY "Authenticated insert" ON collections FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated update" ON collections FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Authenticated delete" ON collections FOR DELETE TO authenticated USING (true);

CREATE POLICY "Authenticated insert" ON books FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated update" ON books FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Authenticated delete" ON books FOR DELETE TO authenticated USING (true);

CREATE POLICY "Authenticated insert" ON hero_slides FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated update" ON hero_slides FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Authenticated delete" ON hero_slides FOR DELETE TO authenticated USING (true);

CREATE POLICY "Authenticated insert" ON collection_resources FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated update" ON collection_resources FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Authenticated delete" ON collection_resources FOR DELETE TO authenticated USING (true);

CREATE POLICY "Authenticated insert" ON collection_merch FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated update" ON collection_merch FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Authenticated delete" ON collection_merch FOR DELETE TO authenticated USING (true);

-- ============================================
-- Updated_at trigger function
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply trigger to tables with updated_at
CREATE TRIGGER update_collections_updated_at
    BEFORE UPDATE ON collections
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_books_updated_at
    BEFORE UPDATE ON books
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
