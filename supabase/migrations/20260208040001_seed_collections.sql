-- ============================================
-- Seed initial collections data
-- Run this in Supabase Dashboard > SQL Editor
-- ============================================

-- Insert the three main collections
INSERT INTO collections (title, title_es, description, description_es, theme_color, display_order, price, is_active)
VALUES 
  (
    'The Legacy Collection',
    'La Colección Legado',
    'Immerse yourself in the stories that shaped a nation, accompanied by tools to document your own journey.',
    'Sumérgete en las historias que dieron forma a una nación, acompañado de herramientas para documentar tu propio viaje.',
    '#d4af37',
    0,
    49.99,
    true
  ),
  (
    'The Diaspora Collection',
    'La Colección Diáspora',
    'Voices from across the sea, bringing the island spirit to every corner of the world.',
    'Voces de todo el mar, llevando el espíritu isleño a cada rincón del mundo.',
    '#3b82f6',
    1,
    39.99,
    true
  ),
  (
    'The Future Collection',
    'La Colección Futuro',
    'Technological marvels and ancient traditions collide in this forward-looking set.',
    'Maravillas tecnológicas y tradiciones antiguas chocan en este conjunto orientado al futuro.',
    '#10b981',
    2,
    54.99,
    true
  )
ON CONFLICT DO NOTHING;

-- Note: Books, resources, and merch can be added via the admin interface
-- or with additional INSERT statements linking to these collection IDs
