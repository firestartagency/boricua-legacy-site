-- ============================================
-- Collections Redesign Migration
-- Unified collection_items + pricing + buttons
-- ============================================

-- ============================================
-- 1. Add pricing & button fields to collections
-- ============================================
ALTER TABLE collections ADD COLUMN IF NOT EXISTS original_price DECIMAL(10,2);
ALTER TABLE collections ADD COLUMN IF NOT EXISTS sale_price DECIMAL(10,2);
ALTER TABLE collections ADD COLUMN IF NOT EXISTS is_on_sale BOOLEAN DEFAULT false;
ALTER TABLE collections ADD COLUMN IF NOT EXISTS primary_btn_text TEXT DEFAULT 'View Collection';
ALTER TABLE collections ADD COLUMN IF NOT EXISTS primary_btn_text_es TEXT;
ALTER TABLE collections ADD COLUMN IF NOT EXISTS primary_btn_link TEXT;
ALTER TABLE collections ADD COLUMN IF NOT EXISTS secondary_btn_text TEXT;
ALTER TABLE collections ADD COLUMN IF NOT EXISTS secondary_btn_text_es TEXT;
ALTER TABLE collections ADD COLUMN IF NOT EXISTS secondary_btn_link TEXT;

-- ============================================
-- 2. Create unified collection_items table
-- ============================================
CREATE TABLE IF NOT EXISTS collection_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  collection_id UUID REFERENCES collections(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  name_es TEXT,
  type TEXT CHECK (type IN ('book', 'merch', 'resource', 'digital', 'other')) DEFAULT 'other',
  description TEXT,
  description_es TEXT,
  image_url TEXT,
  price DECIMAL(10,2),
  purchase_url TEXT,
  is_included BOOLEAN DEFAULT true,
  grid_size TEXT CHECK (grid_size IN ('featured', 'standard', 'hidden')) DEFAULT 'standard',
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Index for queries
CREATE INDEX IF NOT EXISTS idx_collection_items_collection_id ON collection_items(collection_id);
CREATE INDEX IF NOT EXISTS idx_collection_items_display_order ON collection_items(display_order);

-- Enable RLS
ALTER TABLE collection_items ENABLE ROW LEVEL SECURITY;

-- RLS policies
DROP POLICY IF EXISTS "Public read access" ON collection_items;
DROP POLICY IF EXISTS "Authenticated insert" ON collection_items;
DROP POLICY IF EXISTS "Authenticated update" ON collection_items;
DROP POLICY IF EXISTS "Authenticated delete" ON collection_items;

CREATE POLICY "Public read access" ON collection_items FOR SELECT USING (true);
CREATE POLICY "Authenticated insert" ON collection_items FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated update" ON collection_items FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Authenticated delete" ON collection_items FOR DELETE TO authenticated USING (true);

-- ============================================
-- 3. Migrate existing data
-- ============================================

-- Migrate collection_resources
INSERT INTO collection_items (collection_id, name, name_es, type, description, description_es, image_url, display_order, is_included, grid_size)
SELECT
  collection_id,
  name,
  name_es,
  COALESCE(type, 'resource'),
  description,
  description_es,
  image_url,
  display_order,
  true,
  CASE WHEN image_url IS NOT NULL THEN 'standard' ELSE 'hidden' END
FROM collection_resources
ON CONFLICT DO NOTHING;

-- Migrate collection_merch
INSERT INTO collection_items (collection_id, name, name_es, type, image_url, price, purchase_url, display_order, is_included, is_active, grid_size)
SELECT
  collection_id,
  name,
  name_es,
  'merch',
  image_url,
  price,
  purchase_url,
  display_order,
  false,
  is_active,
  CASE WHEN image_url IS NOT NULL THEN 'standard' ELSE 'hidden' END
FROM collection_merch
ON CONFLICT DO NOTHING;

-- Migrate collection_images
INSERT INTO collection_items (collection_id, name, type, image_url, display_order, is_included, grid_size)
SELECT
  collection_id,
  COALESCE(alt_text, 'Collection Image'),
  'other',
  image_url,
  display_order,
  true,
  'standard'
FROM collection_images
ON CONFLICT DO NOTHING;

-- ============================================
-- 4. Drop old tables
-- ============================================
DROP TABLE IF EXISTS collection_images CASCADE;
DROP TABLE IF EXISTS collection_resources CASCADE;
DROP TABLE IF EXISTS collection_merch CASCADE;
