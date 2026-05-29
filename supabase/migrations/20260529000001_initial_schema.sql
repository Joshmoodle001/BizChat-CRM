-- =====================================================
-- BizChat CRM — 001_initial_schema.sql
-- Tables, constraints, triggers, indexes
-- Run FIRST in Supabase SQL Editor
-- =====================================================

-- =====================================================
-- CLEANUP: drop existing tables from prior setup
-- =====================================================
DROP TABLE IF EXISTS audit_logs, message_templates, reminders, payments, invoice_items, invoices, quote_items, quotes, bookings, services, customers, profiles, businesses CASCADE;
DROP FUNCTION IF EXISTS update_updated_at_column CASCADE;
DROP FUNCTION IF EXISTS get_current_business_id CASCADE;
DROP FUNCTION IF EXISTS get_current_role CASCADE;
DROP FUNCTION IF EXISTS get_current_profile_id CASCADE;
DROP FUNCTION IF EXISTS is_super_admin CASCADE;
DROP FUNCTION IF EXISTS is_business_owner CASCADE;
DROP FUNCTION IF EXISTS is_staff CASCADE;
DROP FUNCTION IF EXISTS user_has_business_access CASCADE;

-- =====================================================
-- EXTENSIONS
-- =====================================================
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =====================================================
-- HELPER: updated_at trigger function
-- =====================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- TABLE: businesses
-- =====================================================
CREATE TABLE businesses (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name              TEXT NOT NULL,
  industry          TEXT,
  phone             TEXT,
  email             TEXT,
  address           TEXT,
  logo_url          TEXT,
  timezone          TEXT NOT NULL DEFAULT 'Africa/Johannesburg',
  currency          TEXT NOT NULL DEFAULT 'ZAR',
  subscription_plan TEXT NOT NULL DEFAULT 'trial'
                    CHECK (subscription_plan IN ('trial', 'starter', 'business', 'pro', 'enterprise')),
  subscription_status TEXT NOT NULL DEFAULT 'active'
                    CHECK (subscription_status IN ('trial', 'active', 'past_due', 'cancelled')),
  status            TEXT NOT NULL DEFAULT 'active'
                    CHECK (status IN ('active', 'suspended')),
  created_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TRIGGER businesses_updated_at
  BEFORE UPDATE ON businesses
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- TABLE: profiles
-- =====================================================
CREATE TABLE profiles (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  auth_user_id UUID UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  business_id  UUID REFERENCES businesses(id) ON DELETE CASCADE,
  full_name    TEXT NOT NULL,
  email        TEXT NOT NULL,
  phone        TEXT,
  role         TEXT NOT NULL
               CHECK (role IN ('super_admin', 'business_owner', 'staff')),
  status       TEXT NOT NULL DEFAULT 'active'
               CHECK (status IN ('active', 'invite_pending', 'suspended')),
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- TABLE: customers
-- =====================================================
CREATE TABLE customers (
  id                   UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id          UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  full_name            TEXT NOT NULL,
  phone                TEXT NOT NULL,
  email                TEXT,
  address              TEXT,
  notes                TEXT,
  source               TEXT,
  tags                 JSONB NOT NULL DEFAULT '[]'::jsonb,
  communication_opt_in BOOLEAN NOT NULL DEFAULT true,
  do_not_contact       BOOLEAN NOT NULL DEFAULT false,
  status               TEXT NOT NULL DEFAULT 'active'
                       CHECK (status IN ('active', 'inactive', 'archived')),
  created_at           TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at           TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TRIGGER customers_updated_at
  BEFORE UPDATE ON customers
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- TABLE: services
-- =====================================================
CREATE TABLE services (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id      UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  name             TEXT NOT NULL,
  description      TEXT,
  duration_minutes INTEGER NOT NULL DEFAULT 60 CHECK (duration_minutes > 0),
  price            NUMERIC NOT NULL DEFAULT 0 CHECK (price >= 0),
  category         TEXT,
  status           TEXT NOT NULL DEFAULT 'active'
                   CHECK (status IN ('active', 'inactive')),
  created_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TRIGGER services_updated_at
  BEFORE UPDATE ON services
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- TABLE: bookings
-- =====================================================
CREATE TABLE bookings (
  id                       UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id              UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  customer_id              UUID REFERENCES customers(id) ON DELETE SET NULL,
  service_id               UUID REFERENCES services(id) ON DELETE SET NULL,
  assigned_staff_profile_id UUID REFERENCES profiles(id),
  booking_date             DATE NOT NULL,
  start_time               TIME NOT NULL,
  end_time                 TIME,
  status                   TEXT NOT NULL DEFAULT 'scheduled'
                           CHECK (status IN ('scheduled', 'confirmed', 'completed', 'cancelled', 'no_show')),
  customer_notes           TEXT,
  internal_notes           TEXT,
  reminder_sent            BOOLEAN NOT NULL DEFAULT false,
  confirmation_sent        BOOLEAN NOT NULL DEFAULT false,
  created_at               TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at               TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TRIGGER bookings_updated_at
  BEFORE UPDATE ON bookings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- TABLE: quotes
-- =====================================================
CREATE TABLE quotes (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id     UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  customer_id     UUID REFERENCES customers(id) ON DELETE SET NULL,
  quote_number    TEXT NOT NULL,
  status          TEXT NOT NULL DEFAULT 'draft'
                  CHECK (status IN ('draft', 'sent', 'accepted', 'rejected', 'expired', 'converted')),
  subtotal        NUMERIC NOT NULL DEFAULT 0 CHECK (subtotal >= 0),
  discount_amount NUMERIC NOT NULL DEFAULT 0 CHECK (discount_amount >= 0),
  tax_amount      NUMERIC NOT NULL DEFAULT 0 CHECK (tax_amount >= 0),
  total_amount    NUMERIC NOT NULL DEFAULT 0 CHECK (total_amount >= 0),
  valid_until     DATE,
  notes           TEXT,
  terms           TEXT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TRIGGER quotes_updated_at
  BEFORE UPDATE ON quotes
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- TABLE: quote_items
-- =====================================================
CREATE TABLE quote_items (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quote_id    UUID NOT NULL REFERENCES quotes(id) ON DELETE CASCADE,
  description TEXT NOT NULL,
  quantity    NUMERIC NOT NULL DEFAULT 1 CHECK (quantity > 0),
  unit_price  NUMERIC NOT NULL DEFAULT 0 CHECK (unit_price >= 0),
  line_total  NUMERIC NOT NULL DEFAULT 0,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- =====================================================
-- TABLE: invoices
-- =====================================================
CREATE TABLE invoices (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id     UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  customer_id     UUID REFERENCES customers(id) ON DELETE SET NULL,
  quote_id        UUID REFERENCES quotes(id) ON DELETE SET NULL,
  booking_id      UUID REFERENCES bookings(id) ON DELETE SET NULL,
  invoice_number  TEXT NOT NULL,
  status          TEXT NOT NULL DEFAULT 'draft'
                  CHECK (status IN ('draft', 'sent', 'cancelled')),
  payment_status  TEXT NOT NULL DEFAULT 'unpaid'
                  CHECK (payment_status IN ('unpaid', 'partially_paid', 'paid', 'overdue')),
  subtotal        NUMERIC NOT NULL DEFAULT 0 CHECK (subtotal >= 0),
  discount_amount NUMERIC NOT NULL DEFAULT 0 CHECK (discount_amount >= 0),
  tax_amount      NUMERIC NOT NULL DEFAULT 0 CHECK (tax_amount >= 0),
  total_amount    NUMERIC NOT NULL DEFAULT 0 CHECK (total_amount >= 0),
  amount_paid     NUMERIC NOT NULL DEFAULT 0 CHECK (amount_paid >= 0),
  amount_due      NUMERIC NOT NULL DEFAULT 0 CHECK (amount_due >= 0),
  due_date        DATE,
  paid_at         TIMESTAMPTZ,
  notes           TEXT,
  terms           TEXT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TRIGGER invoices_updated_at
  BEFORE UPDATE ON invoices
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- TABLE: invoice_items
-- =====================================================
CREATE TABLE invoice_items (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_id  UUID NOT NULL REFERENCES invoices(id) ON DELETE CASCADE,
  description TEXT NOT NULL,
  quantity    NUMERIC NOT NULL DEFAULT 1 CHECK (quantity > 0),
  unit_price  NUMERIC NOT NULL DEFAULT 0 CHECK (unit_price >= 0),
  line_total  NUMERIC NOT NULL DEFAULT 0,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- =====================================================
-- TABLE: payments
-- =====================================================
CREATE TABLE payments (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id       UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  invoice_id        UUID NOT NULL REFERENCES invoices(id) ON DELETE CASCADE,
  customer_id       UUID REFERENCES customers(id) ON DELETE SET NULL,
  amount            NUMERIC NOT NULL CHECK (amount > 0),
  payment_method    TEXT CHECK (payment_method IN ('Cash', 'EFT', 'Card', 'Payment link', 'Other')),
  payment_reference TEXT,
  payment_date      DATE NOT NULL DEFAULT CURRENT_DATE,
  notes             TEXT,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TRIGGER payments_updated_at
  BEFORE UPDATE ON payments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- TABLE: reminders
-- =====================================================
CREATE TABLE reminders (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id   UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  customer_id   UUID REFERENCES customers(id) ON DELETE SET NULL,
  booking_id    UUID REFERENCES bookings(id) ON DELETE SET NULL,
  invoice_id    UUID REFERENCES invoices(id) ON DELETE SET NULL,
  title         TEXT NOT NULL,
  reminder_type TEXT NOT NULL
                CHECK (reminder_type IN ('booking_follow_up', 'payment_follow_up', 'quote_follow_up', 'customer_reactivation', 'custom')),
  due_at        TIMESTAMPTZ NOT NULL,
  status        TEXT NOT NULL DEFAULT 'pending'
                CHECK (status IN ('pending', 'completed', 'overdue', 'snoozed')),
  completed_at  TIMESTAMPTZ,
  notes         TEXT,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TRIGGER reminders_updated_at
  BEFORE UPDATE ON reminders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- TABLE: message_templates
-- =====================================================
CREATE TABLE message_templates (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id   UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  name          TEXT NOT NULL,
  template_type TEXT NOT NULL
                CHECK (template_type IN ('booking_confirmation', 'booking_reminder', 'quote_message', 'invoice_message', 'payment_reminder', 'thank_you', 'follow_up', 'reactivation')),
  content       TEXT NOT NULL,
  status        TEXT NOT NULL DEFAULT 'active'
                CHECK (status IN ('active', 'inactive')),
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TRIGGER message_templates_updated_at
  BEFORE UPDATE ON message_templates
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- TABLE: audit_logs
-- =====================================================
CREATE TABLE audit_logs (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id      UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  actor_profile_id UUID REFERENCES profiles(id),
  action           TEXT NOT NULL,
  entity_type      TEXT,
  entity_id        UUID,
  metadata         JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- =====================================================
-- INDEXES
-- =====================================================
CREATE INDEX idx_businesses_status           ON businesses(status);
CREATE INDEX idx_profiles_auth_user_id       ON profiles(auth_user_id);
CREATE INDEX idx_profiles_business_id        ON profiles(business_id);
CREATE INDEX idx_profiles_role               ON profiles(role);
CREATE INDEX idx_customers_business_id       ON customers(business_id);
CREATE INDEX idx_customers_phone             ON customers(phone);
CREATE INDEX idx_customers_full_name         ON customers(full_name);
CREATE INDEX idx_customers_status            ON customers(status);
CREATE INDEX idx_services_business_id        ON services(business_id);
CREATE INDEX idx_bookings_business_id        ON bookings(business_id);
CREATE INDEX idx_bookings_customer_id        ON bookings(customer_id);
CREATE INDEX idx_bookings_staff              ON bookings(assigned_staff_profile_id);
CREATE INDEX idx_bookings_date               ON bookings(booking_date);
CREATE INDEX idx_bookings_status             ON bookings(status);
CREATE INDEX idx_quotes_business_id          ON quotes(business_id);
CREATE INDEX idx_quotes_customer_id          ON quotes(customer_id);
CREATE INDEX idx_quotes_number               ON quotes(quote_number);
CREATE INDEX idx_quotes_status               ON quotes(status);
CREATE INDEX idx_invoices_business_id        ON invoices(business_id);
CREATE INDEX idx_invoices_customer_id        ON invoices(customer_id);
CREATE INDEX idx_invoices_quote_id           ON invoices(quote_id);
CREATE INDEX idx_invoices_booking_id         ON invoices(booking_id);
CREATE INDEX idx_invoices_number             ON invoices(invoice_number);
CREATE INDEX idx_invoices_payment_status     ON invoices(payment_status);
CREATE INDEX idx_invoices_due_date           ON invoices(due_date);
CREATE INDEX idx_payments_business_id        ON payments(business_id);
CREATE INDEX idx_payments_invoice_id         ON payments(invoice_id);
CREATE INDEX idx_payments_customer_id        ON payments(customer_id);
CREATE INDEX idx_reminders_business_id       ON reminders(business_id);
CREATE INDEX idx_reminders_due_at            ON reminders(due_at);
CREATE INDEX idx_reminders_status            ON reminders(status);
CREATE INDEX idx_message_templates_business_id ON message_templates(business_id);
CREATE INDEX idx_audit_logs_business_id      ON audit_logs(business_id);
CREATE INDEX idx_audit_logs_actor            ON audit_logs(actor_profile_id);

-- =====================================================
-- DONE
-- =====================================================
