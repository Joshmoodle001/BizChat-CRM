-- =====================================================
-- BizChat CRM — 002_rls_policies.sql
-- Helper functions + Row Level Security policies
-- Run SECOND in Supabase SQL Editor (after 001)
-- =====================================================

-- =====================================================
-- HELPER FUNCTIONS
-- =====================================================

-- Get the current user's profile ID
CREATE OR REPLACE FUNCTION get_current_profile_id()
RETURNS UUID AS $$
  SELECT id FROM profiles WHERE auth_user_id = auth.uid()
$$ LANGUAGE sql STABLE SECURITY DEFINER;

-- Get the current user's business ID
CREATE OR REPLACE FUNCTION get_current_business_id()
RETURNS UUID AS $$
  SELECT business_id FROM profiles WHERE auth_user_id = auth.uid()
$$ LANGUAGE sql STABLE SECURITY DEFINER;

-- Get the current user's role
CREATE OR REPLACE FUNCTION get_current_role()
RETURNS TEXT AS $$
  SELECT role FROM profiles WHERE auth_user_id = auth.uid()
$$ LANGUAGE sql STABLE SECURITY DEFINER;

-- Check if current user is super_admin
CREATE OR REPLACE FUNCTION is_super_admin()
RETURNS BOOLEAN AS $$
  SELECT get_current_role() = 'super_admin'
$$ LANGUAGE sql STABLE;

-- Check if current user is business_owner
CREATE OR REPLACE FUNCTION is_business_owner()
RETURNS BOOLEAN AS $$
  SELECT get_current_role() = 'business_owner'
$$ LANGUAGE sql STABLE;

-- Check if current user is staff
CREATE OR REPLACE FUNCTION is_staff()
RETURNS BOOLEAN AS $$
  SELECT get_current_role() = 'staff'
$$ LANGUAGE sql STABLE;

-- Check if current user belongs to the given business
CREATE OR REPLACE FUNCTION user_has_business_access(target_business_id UUID)
RETURNS BOOLEAN AS $$
  SELECT
    is_super_admin()
    OR get_current_business_id() = target_business_id
$$ LANGUAGE sql STABLE;

-- =====================================================
-- ENABLE ROW LEVEL SECURITY ON ALL TABLES
-- =====================================================
ALTER TABLE businesses        ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles          ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers         ENABLE ROW LEVEL SECURITY;
ALTER TABLE services          ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings          ENABLE ROW LEVEL SECURITY;
ALTER TABLE quotes            ENABLE ROW LEVEL SECURITY;
ALTER TABLE quote_items       ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices          ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoice_items     ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments          ENABLE ROW LEVEL SECURITY;
ALTER TABLE reminders         ENABLE ROW LEVEL SECURITY;
ALTER TABLE message_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs        ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- RLS: businesses
-- =====================================================

-- Anyone in the business can read their own business. Super admins see all.
CREATE POLICY "businesses_select"
  ON businesses FOR SELECT
  USING (user_has_business_access(id));

-- Only business owners can update. Super admins can suspend/activate.
CREATE POLICY "businesses_update"
  ON businesses FOR UPDATE
  USING (
    is_super_admin()
    OR (id = get_current_business_id() AND is_business_owner())
  );

-- New signup: authenticated users with no business yet can insert
CREATE POLICY "businesses_insert"
  ON businesses FOR INSERT
  WITH CHECK (
    auth.role() = 'authenticated'
    AND get_current_business_id() IS NULL
    AND get_current_role() IS NULL
  );

-- No deletes through app (only super_admin can delete businesses)
CREATE POLICY "businesses_delete"
  ON businesses FOR DELETE
  USING (is_super_admin());

-- =====================================================
-- RLS: profiles
-- =====================================================

CREATE POLICY "profiles_select"
  ON profiles FOR SELECT
  USING (user_has_business_access(business_id));

-- Business owners can create staff profiles.
-- Also allows insert during registration (first profile for new business).
CREATE POLICY "profiles_insert"
  ON profiles FOR INSERT
  WITH CHECK (
    -- During registration: user is creating their own profile
    (auth_user_id = auth.uid() AND role = 'business_owner')
    -- Or: business owner creating staff in their own business
    OR (business_id = get_current_business_id() AND is_business_owner())
  );

-- Users update own profile; business owners update staff in same business
CREATE POLICY "profiles_update"
  ON profiles FOR UPDATE
  USING (
    auth_user_id = auth.uid()
    OR (business_id = get_current_business_id() AND is_business_owner())
  );

-- Only super admins can delete profiles
CREATE POLICY "profiles_delete"
  ON profiles FOR DELETE
  USING (is_super_admin());

-- =====================================================
-- RLS: customers
-- =====================================================

CREATE POLICY "customers_select"
  ON customers FOR SELECT
  USING (user_has_business_access(business_id));

CREATE POLICY "customers_insert"
  ON customers FOR INSERT
  WITH CHECK (
    business_id = get_current_business_id()
    AND (is_business_owner() OR is_super_admin())
  );

CREATE POLICY "customers_update"
  ON customers FOR UPDATE
  USING (
    business_id = get_current_business_id()
    AND (is_business_owner() OR is_super_admin())
  );

-- Staff cannot delete customers
CREATE POLICY "customers_delete"
  ON customers FOR DELETE
  USING (
    business_id = get_current_business_id()
    AND (is_business_owner() OR is_super_admin())
  );

-- =====================================================
-- RLS: services
-- =====================================================

CREATE POLICY "services_select"
  ON services FOR SELECT
  USING (user_has_business_access(business_id));

CREATE POLICY "services_insert"
  ON services FOR INSERT
  WITH CHECK (
    business_id = get_current_business_id()
    AND (is_business_owner() OR is_super_admin())
  );

CREATE POLICY "services_update"
  ON services FOR UPDATE
  USING (
    business_id = get_current_business_id()
    AND (is_business_owner() OR is_super_admin())
  );

CREATE POLICY "services_delete"
  ON services FOR DELETE
  USING (
    business_id = get_current_business_id()
    AND (is_business_owner() OR is_super_admin())
  );

-- =====================================================
-- RLS: bookings
-- =====================================================

CREATE POLICY "bookings_select"
  ON bookings FOR SELECT
  USING (user_has_business_access(business_id));

CREATE POLICY "bookings_insert"
  ON bookings FOR INSERT
  WITH CHECK (
    business_id = get_current_business_id()
    AND (is_business_owner() OR is_super_admin())
  );

-- Business owners and assigned staff can update bookings
CREATE POLICY "bookings_update"
  ON bookings FOR UPDATE
  USING (
    business_id = get_current_business_id()
    AND (
      is_business_owner()
      OR is_super_admin()
      OR assigned_staff_profile_id = get_current_profile_id()
    )
  );

CREATE POLICY "bookings_delete"
  ON bookings FOR DELETE
  USING (
    business_id = get_current_business_id()
    AND (is_business_owner() OR is_super_admin())
  );

-- =====================================================
-- RLS: quotes
-- =====================================================

CREATE POLICY "quotes_select"
  ON quotes FOR SELECT
  USING (user_has_business_access(business_id));

CREATE POLICY "quotes_insert"
  ON quotes FOR INSERT
  WITH CHECK (
    business_id = get_current_business_id()
    AND (is_business_owner() OR is_super_admin())
  );

CREATE POLICY "quotes_update"
  ON quotes FOR UPDATE
  USING (
    business_id = get_current_business_id()
    AND (is_business_owner() OR is_super_admin())
  );

CREATE POLICY "quotes_delete"
  ON quotes FOR DELETE
  USING (
    business_id = get_current_business_id()
    AND (is_business_owner() OR is_super_admin())
  );

-- =====================================================
-- RLS: quote_items (inherit from parent quote)
-- =====================================================

CREATE POLICY "quote_items_select"
  ON quote_items FOR SELECT
  USING (
    is_super_admin()
    OR EXISTS (
      SELECT 1 FROM quotes
      WHERE quotes.id = quote_items.quote_id
        AND quotes.business_id = get_current_business_id()
    )
  );

CREATE POLICY "quote_items_insert"
  ON quote_items FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM quotes
      WHERE quotes.id = quote_items.quote_id
        AND quotes.business_id = get_current_business_id()
        AND (is_business_owner() OR is_super_admin())
    )
  );

CREATE POLICY "quote_items_update"
  ON quote_items FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM quotes
      WHERE quotes.id = quote_items.quote_id
        AND quotes.business_id = get_current_business_id()
        AND (is_business_owner() OR is_super_admin())
    )
  );

CREATE POLICY "quote_items_delete"
  ON quote_items FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM quotes
      WHERE quotes.id = quote_items.quote_id
        AND quotes.business_id = get_current_business_id()
        AND (is_business_owner() OR is_super_admin())
    )
  );

-- =====================================================
-- RLS: invoices
-- =====================================================

CREATE POLICY "invoices_select"
  ON invoices FOR SELECT
  USING (user_has_business_access(business_id));

CREATE POLICY "invoices_insert"
  ON invoices FOR INSERT
  WITH CHECK (
    business_id = get_current_business_id()
    AND (is_business_owner() OR is_super_admin())
  );

CREATE POLICY "invoices_update"
  ON invoices FOR UPDATE
  USING (
    business_id = get_current_business_id()
    AND (is_business_owner() OR is_super_admin())
  );

-- Staff cannot delete invoices
CREATE POLICY "invoices_delete"
  ON invoices FOR DELETE
  USING (
    business_id = get_current_business_id()
    AND (is_business_owner() OR is_super_admin())
  );

-- =====================================================
-- RLS: invoice_items (inherit from parent invoice)
-- =====================================================

CREATE POLICY "invoice_items_select"
  ON invoice_items FOR SELECT
  USING (
    is_super_admin()
    OR EXISTS (
      SELECT 1 FROM invoices
      WHERE invoices.id = invoice_items.invoice_id
        AND invoices.business_id = get_current_business_id()
    )
  );

CREATE POLICY "invoice_items_insert"
  ON invoice_items FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM invoices
      WHERE invoices.id = invoice_items.invoice_id
        AND invoices.business_id = get_current_business_id()
        AND (is_business_owner() OR is_super_admin())
    )
  );

CREATE POLICY "invoice_items_update"
  ON invoice_items FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM invoices
      WHERE invoices.id = invoice_items.invoice_id
        AND invoices.business_id = get_current_business_id()
        AND (is_business_owner() OR is_super_admin())
    )
  );

CREATE POLICY "invoice_items_delete"
  ON invoice_items FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM invoices
      WHERE invoices.id = invoice_items.invoice_id
        AND invoices.business_id = get_current_business_id()
        AND (is_business_owner() OR is_super_admin())
    )
  );

-- =====================================================
-- RLS: payments
-- =====================================================

CREATE POLICY "payments_select"
  ON payments FOR SELECT
  USING (user_has_business_access(business_id));

CREATE POLICY "payments_insert"
  ON payments FOR INSERT
  WITH CHECK (
    business_id = get_current_business_id()
    AND (is_business_owner() OR is_super_admin())
  );

CREATE POLICY "payments_update"
  ON payments FOR UPDATE
  USING (
    business_id = get_current_business_id()
    AND (is_business_owner() OR is_super_admin())
  );

-- Staff cannot delete payments
CREATE POLICY "payments_delete"
  ON payments FOR DELETE
  USING (
    business_id = get_current_business_id()
    AND (is_business_owner() OR is_super_admin())
  );

-- =====================================================
-- RLS: reminders
-- =====================================================

CREATE POLICY "reminders_select"
  ON reminders FOR SELECT
  USING (user_has_business_access(business_id));

CREATE POLICY "reminders_insert"
  ON reminders FOR INSERT
  WITH CHECK (
    business_id = get_current_business_id()
    AND (is_business_owner() OR is_super_admin())
  );

CREATE POLICY "reminders_update"
  ON reminders FOR UPDATE
  USING (
    business_id = get_current_business_id()
    AND (is_business_owner() OR is_super_admin())
  );

CREATE POLICY "reminders_delete"
  ON reminders FOR DELETE
  USING (
    business_id = get_current_business_id()
    AND (is_business_owner() OR is_super_admin())
  );

-- =====================================================
-- RLS: message_templates
-- =====================================================

CREATE POLICY "message_templates_select"
  ON message_templates FOR SELECT
  USING (user_has_business_access(business_id));

CREATE POLICY "message_templates_insert"
  ON message_templates FOR INSERT
  WITH CHECK (
    business_id = get_current_business_id()
    AND (is_business_owner() OR is_super_admin())
  );

CREATE POLICY "message_templates_update"
  ON message_templates FOR UPDATE
  USING (
    business_id = get_current_business_id()
    AND (is_business_owner() OR is_super_admin())
  );

CREATE POLICY "message_templates_delete"
  ON message_templates FOR DELETE
  USING (
    business_id = get_current_business_id()
    AND (is_business_owner() OR is_super_admin())
  );

-- =====================================================
-- RLS: audit_logs
-- =====================================================

CREATE POLICY "audit_logs_select"
  ON audit_logs FOR SELECT
  USING (user_has_business_access(business_id));

CREATE POLICY "audit_logs_insert"
  ON audit_logs FOR INSERT
  WITH CHECK (
    business_id = get_current_business_id()
  );

-- Audit logs are append-only; no update or delete policies

-- =====================================================
-- DONE
-- =====================================================
