-- Add spine toggle to hero_slides
ALTER TABLE hero_slides ADD COLUMN IF NOT EXISTS show_spine BOOLEAN DEFAULT false;

-- Comment for clarity
COMMENT ON COLUMN hero_slides.show_spine IS 'When true, renders a CSS 3D spine effect on the book cover. When false, displays the uploaded image as-is.';
