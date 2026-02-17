-- ============================================
-- Storage Bucket RLS Policies
-- Run this in Supabase Dashboard > SQL Editor
-- ============================================

-- ============================================
-- book-covers bucket policies
-- ============================================
CREATE POLICY "Public can view book covers"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'book-covers');

CREATE POLICY "Authenticated users can upload book covers"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'book-covers');

CREATE POLICY "Authenticated users can update book covers"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'book-covers');

CREATE POLICY "Authenticated users can delete book covers"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'book-covers');

-- ============================================
-- resources bucket policies
-- ============================================
CREATE POLICY "Public can view resources"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'resources');

CREATE POLICY "Authenticated users can upload resources"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'resources');

CREATE POLICY "Authenticated users can update resources"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'resources');

CREATE POLICY "Authenticated users can delete resources"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'resources');

-- ============================================
-- merch bucket policies
-- ============================================
CREATE POLICY "Public can view merch"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'merch');

CREATE POLICY "Authenticated users can upload merch"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'merch');

CREATE POLICY "Authenticated users can update merch"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'merch');

CREATE POLICY "Authenticated users can delete merch"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'merch');
