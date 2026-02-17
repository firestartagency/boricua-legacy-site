-- ============================================
-- Add pricing field to collections
-- Run this in Supabase Dashboard > SQL Editor
-- ============================================

-- Add price field to collections table
ALTER TABLE collections ADD COLUMN IF NOT EXISTS price DECIMAL(10,2);

-- Update description to indicate this is the total collection price
COMMENT ON COLUMN collections.price IS 'Total price for the complete collection bundle';
