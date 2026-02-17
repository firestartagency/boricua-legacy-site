-- ============================================
-- Collection Images Table & RLS Policies
-- Run this in Supabase Dashboard > SQL Editor
-- ============================================

-- Create collection_images table (for collection preview thumbnails)
CREATE TABLE IF NOT EXISTS collection_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  collection_id UUID REFERENCES collections(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  alt_text TEXT,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_collection_images_collection_id ON collection_images(collection_id);

-- Enable RLS
ALTER TABLE collection_images ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist, then recreate
DROP POLICY IF EXISTS "Public read access" ON collection_images;
DROP POLICY IF EXISTS "Authenticated insert" ON collection_images;
DROP POLICY IF EXISTS "Authenticated update" ON collection_images;
DROP POLICY IF EXISTS "Authenticated delete" ON collection_images;

-- Public read access
CREATE POLICY "Public read access" ON collection_images FOR SELECT USING (true);

-- Authenticated user CRUD access
CREATE POLICY "Authenticated insert" ON collection_images FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated update" ON collection_images FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Authenticated delete" ON collection_images FOR DELETE TO authenticated USING (true);
