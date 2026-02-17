-- ============================================
-- Add button fields to hero_slides table
-- Run this in Supabase SQL Editor
-- ============================================

ALTER TABLE hero_slides 
ADD COLUMN IF NOT EXISTS button_primary_text TEXT DEFAULT 'Order Now',
ADD COLUMN IF NOT EXISTS button_primary_text_es TEXT DEFAULT 'Ordenar Ahora',
ADD COLUMN IF NOT EXISTS button_primary_link TEXT DEFAULT '/books',
ADD COLUMN IF NOT EXISTS button_secondary_text TEXT DEFAULT 'Read an Excerpt',
ADD COLUMN IF NOT EXISTS button_secondary_text_es TEXT DEFAULT 'Leer un Extracto',
ADD COLUMN IF NOT EXISTS button_secondary_link TEXT;

-- Add collection preview images table for multiple thumbnails per collection
CREATE TABLE IF NOT EXISTS collection_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  collection_id UUID REFERENCES collections(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  alt_text TEXT,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE collection_images ENABLE ROW LEVEL SECURITY;

-- Public read access
CREATE POLICY "Public read access" ON collection_images FOR SELECT USING (true);

-- Authenticated write access
CREATE POLICY "Authenticated insert" ON collection_images FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated update" ON collection_images FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Authenticated delete" ON collection_images FOR DELETE TO authenticated USING (true);

-- Index for faster collection lookups
CREATE INDEX IF NOT EXISTS idx_collection_images_collection_id ON collection_images(collection_id);
