-- =====================================================
-- BizChat CRM — 003_storage.sql
-- Supabase Storage bucket + RLS policies
-- Run THIRD in Supabase SQL Editor (after 001 + 002)
-- =====================================================

-- =====================================================
-- CREATE STORAGE BUCKET
-- =====================================================

-- NOTE: Storage buckets can only be created via the Supabase dashboard
-- or the management API. If using `supabase` CLI migrations, add this
-- bucket definition. Otherwise, create it manually in the dashboard:
--
-- Bucket name: business-assets
-- Public: false (private)
-- File size limit: 10 MB
-- Allowed MIME types: image/*, application/pdf
--
-- After creating the bucket manually, run the policies below.

-- =====================================================
-- STORAGE RLS POLICIES
-- =====================================================

-- Policy: Users can read files from their own business folder
CREATE POLICY "storage_select_own_business"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'business-assets'
    AND auth.role() = 'authenticated'
    AND (
      is_super_admin()
      OR (storage.foldername(name))[1] = get_current_business_id()::text
    )
  );

-- Policy: Business owners can upload files to their business folder
CREATE POLICY "storage_insert_own_business"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'business-assets'
    AND auth.role() = 'authenticated'
    AND (is_business_owner() OR is_super_admin())
    AND (storage.foldername(name))[1] = get_current_business_id()::text
  );

-- Policy: Business owners can update files in their business folder
CREATE POLICY "storage_update_own_business"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'business-assets'
    AND auth.role() = 'authenticated'
    AND (is_business_owner() OR is_super_admin())
    AND (storage.foldername(name))[1] = get_current_business_id()::text
  );

-- Policy: Business owners can delete files in their business folder
-- Staff cannot delete business assets
CREATE POLICY "storage_delete_own_business"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'business-assets'
    AND auth.role() = 'authenticated'
    AND (is_business_owner() OR is_super_admin())
    AND (storage.foldername(name))[1] = get_current_business_id()::text
  );

-- =====================================================
-- DONE
-- =====================================================
