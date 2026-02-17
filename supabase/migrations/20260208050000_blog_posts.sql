-- ============================================
-- Blog Posts and Press Mentions Tables
-- Run this in Supabase Dashboard > SQL Editor
-- ============================================

-- Blog Posts table
CREATE TABLE IF NOT EXISTS blog_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  title_es TEXT,
  excerpt TEXT,
  excerpt_es TEXT,
  content TEXT,
  content_es TEXT,
  featured_image_url TEXT,
  author TEXT,
  category TEXT,
  is_published BOOLEAN DEFAULT false,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Press Mentions table
CREATE TABLE IF NOT EXISTS press_mentions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  outlet_name TEXT NOT NULL,
  outlet_logo_url TEXT,
  headline TEXT NOT NULL,
  headline_es TEXT,
  quote TEXT,
  quote_es TEXT,
  article_url TEXT,
  published_date DATE,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON blog_posts(slug);
CREATE INDEX IF NOT EXISTS idx_blog_posts_published ON blog_posts(is_published, published_at);
CREATE INDEX IF NOT EXISTS idx_press_mentions_order ON press_mentions(display_order);

-- Enable RLS
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE press_mentions ENABLE ROW LEVEL SECURITY;

-- Public read access (for published posts only)
CREATE POLICY "Public read published" ON blog_posts FOR SELECT USING (is_published = true);
CREATE POLICY "Public read active" ON press_mentions FOR SELECT USING (is_active = true);

-- Authenticated user CRUD access
CREATE POLICY "Authenticated all" ON blog_posts FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Authenticated all" ON press_mentions FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Update trigger for blog_posts
CREATE TRIGGER update_blog_posts_updated_at
    BEFORE UPDATE ON blog_posts
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
