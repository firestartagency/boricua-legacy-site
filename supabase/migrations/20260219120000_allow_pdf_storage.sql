-- Update book-covers bucket to allow PDF uploads alongside images
UPDATE storage.buckets 
SET allowed_mime_types = ARRAY['image/png', 'image/jpeg', 'image/webp', 'image/gif', 'application/pdf']
WHERE id = 'book-covers';
