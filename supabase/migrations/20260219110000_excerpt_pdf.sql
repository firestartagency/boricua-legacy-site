-- Change book_excerpts to support PDF files
-- Rename image_url to file_url and add file_name column
ALTER TABLE book_excerpts RENAME COLUMN image_url TO file_url;
ALTER TABLE book_excerpts ADD COLUMN IF NOT EXISTS file_name TEXT;
-- Rename page_label to label (more generic for PDFs)
ALTER TABLE book_excerpts RENAME COLUMN page_label TO label;
