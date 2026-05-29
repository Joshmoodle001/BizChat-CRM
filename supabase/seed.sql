-- =====================================================
-- BizChat CRM — seed.sql
-- Demo data for development and testing
-- =====================================================
--
-- PREREQUISITES:
-- 1. Run migrations 001, 002, 003 first
-- 2. Register a business owner through the app
-- 3. Get the business_id and owner profile_id
-- 4. Update the variables below or rely on auto-detection
--
-- To create a staff member:
--   1. Create a new auth user in Supabase Auth
--   2. Update the staff_auth_uuid below
--   3. Run this seed script
--
-- =====================================================

DO $$
DECLARE
  business_uuid        UUID;
  owner_profile_uuid   UUID;
  staff_profile_uuid   UUID;
  service_haircut      UUID;
  service_colour       UUID;
  service_manicure     UUID;
  service_carwash      UUID;
  service_tutoring     UUID;
  customer_lerato      UUID;
  customer_aisha       UUID;
  customer_sipho       UUID;
  customer_sarah       UUID;
  customer_john        UUID;
  inv_unpaid            UUID;
  inv_partial           UUID;
  inv_paid              UUID;
  inv_overdue           UUID;
BEGIN
  -- =====================================================
  -- DETECT BUSINESS (first business found)
  -- =====================================================
  SELECT id INTO business_uuid FROM businesses ORDER BY created_at DESC LIMIT 1;

  IF business_uuid IS NULL THEN
    RAISE EXCEPTION 'No business found. Register a business through the app first.';
  END IF;

  -- Get the business owner profile
  SELECT id INTO owner_profile_uuid
  FROM profiles
  WHERE business_id = business_uuid AND role = 'business_owner'
  ORDER BY created_at ASC
  LIMIT 1;

  IF owner_profile_uuid IS NULL THEN
    RAISE EXCEPTION 'No business owner profile found. Complete registration first.';
  END IF;

  -- =====================================================
  -- STAFF PROFILE (optional)
  -- =====================================================
  -- Uncomment and set the auth user UUID for your staff member:
  -- INSERT INTO profiles (auth_user_id, business_id, full_name, email, role, status)
  -- VALUES ('STAFF_AUTH_USER_UUID_HERE', business_uuid, 'Thabo Ndlovu', 'thabo@demostudio.co.za', 'staff', 'active')
  -- RETURNING id INTO staff_profile_uuid;
  --
  -- If no staff auth user exists yet, leave staff_profile_uuid as NULL
  staff_profile_uuid := NULL;

  RAISE NOTICE 'Seeding demo data for business: %', business_uuid;

  -- =====================================================
  -- SERVICES
  -- =====================================================
  INSERT INTO services (business_id, name, description, duration_minutes, price, category, status) VALUES
    (business_uuid, 'Haircut', 'Standard haircut and style', 45, 150, 'Hair', 'active')
    RETURNING id INTO service_haircut;

  INSERT INTO services (business_id, name, description, duration_minutes, price, category, status) VALUES
    (business_uuid, 'Hair colour', 'Full colour treatment', 120, 650, 'Hair', 'active')
    RETURNING id INTO service_colour;

  INSERT INTO services (business_id, name, description, duration_minutes, price, category, status) VALUES
    (business_uuid, 'Manicure', 'Classic manicure with gel polish', 60, 250, 'Nails', 'active')
    RETURNING id INTO service_manicure;

  INSERT INTO services (business_id, name, description, duration_minutes, price, category, status) VALUES
    (business_uuid, 'Mobile car wash', 'Exterior wash and interior clean', 45, 120, 'Car', 'active')
    RETURNING id INTO service_carwash;

  INSERT INTO services (business_id, name, description, duration_minutes, price, category, status) VALUES
    (business_uuid, 'Tutoring session', 'One-on-one tutoring (60 min)', 60, 200, 'Education', 'active')
    RETURNING id INTO service_tutoring;

  -- =====================================================
  -- CUSTOMERS
  -- =====================================================
  INSERT INTO customers (business_id, full_name, phone, email, notes, source, tags, communication_opt_in) VALUES
    (business_uuid, 'Lerato Mokoena', '0712345678', 'lerato@example.com', 'Prefers morning appointments', 'referral', '["VIP","Repeat customer"]', true)
    RETURNING id INTO customer_lerato;

  INSERT INTO customers (business_id, full_name, phone, email, notes, source, tags, communication_opt_in) VALUES
    (business_uuid, 'Aisha Naidoo', '0823456789', 'aisha@example.com', 'Allergic to certain products', 'whatsapp', '["Repeat customer"]', true)
    RETURNING id INTO customer_aisha;

  INSERT INTO customers (business_id, full_name, phone, email, source, tags, communication_opt_in) VALUES
    (business_uuid, 'Sipho Dlamini', '0734567890', 'sipho@example.com', 'social_media', '["New customer"]', true)
    RETURNING id INTO customer_sipho;

  INSERT INTO customers (business_id, full_name, phone, email, source, tags, communication_opt_in) VALUES
    (business_uuid, 'Sarah Khumalo', '0612345678', 'sarah@example.com', 'walk_in', '["VIP","High value"]', true)
    RETURNING id INTO customer_sarah;

  INSERT INTO customers (business_id, full_name, phone, notes, source, tags, communication_opt_in) VALUES
    (business_uuid, 'John Smith', '0845678901', 'Late payer — needs reminders', 'google', '["Needs follow-up","Late payer"]', true)
    RETURNING id INTO customer_john;

  -- =====================================================
  -- BOOKINGS
  -- =====================================================
  -- Scheduled for today
  INSERT INTO bookings (business_id, customer_id, service_id, booking_date, start_time, end_time, status) VALUES
    (business_uuid, customer_lerato, service_haircut, CURRENT_DATE, '10:00', '10:45', 'scheduled');

  -- Confirmed for today
  INSERT INTO bookings (business_id, customer_id, service_id, booking_date, start_time, end_time, status, confirmation_sent) VALUES
    (business_uuid, customer_aisha, service_colour, CURRENT_DATE, '13:00', '15:00', 'confirmed', true);

  -- Completed yesterday
  INSERT INTO bookings (business_id, customer_id, service_id, booking_date, start_time, end_time, status) VALUES
    (business_uuid, customer_sarah, service_manicure, CURRENT_DATE - 1, '09:00', '10:00', 'completed');

  -- Cancelled (future)
  INSERT INTO bookings (business_id, customer_id, service_id, booking_date, start_time, end_time, status) VALUES
    (business_uuid, customer_sipho, service_carwash, CURRENT_DATE + 1, '11:00', '11:45', 'cancelled');

  -- No-show (past)
  INSERT INTO bookings (business_id, customer_id, service_id, booking_date, start_time, end_time, status, reminder_sent) VALUES
    (business_uuid, customer_john, service_tutoring, CURRENT_DATE - 2, '14:00', '15:00', 'no_show', true);

  -- =====================================================
  -- QUOTES + QUOTE ITEMS
  -- =====================================================
  -- Draft quote
  WITH new_quote AS (
    INSERT INTO quotes (business_id, customer_id, quote_number, status, subtotal, total_amount, valid_until, notes)
    VALUES (business_uuid, customer_lerato, 'Q-1001', 'draft', 650, 650, CURRENT_DATE + 14, 'Hair colour quote for Lerato')
    RETURNING id
  )
  INSERT INTO quote_items (quote_id, description, quantity, unit_price, line_total)
  SELECT id, 'Full hair colour treatment', 1, 650, 650 FROM new_quote;

  -- Sent quote
  WITH new_quote AS (
    INSERT INTO quotes (business_id, customer_id, quote_number, status, subtotal, discount_amount, total_amount, valid_until, notes)
    VALUES (business_uuid, customer_aisha, 'Q-1002', 'sent', 250, 0, 250, CURRENT_DATE + 7, 'Manicure quote for Aisha')
    RETURNING id
  )
  INSERT INTO quote_items (quote_id, description, quantity, unit_price, line_total)
  SELECT id, 'Classic manicure with gel polish', 1, 250, 250 FROM new_quote;

  -- Accepted quote
  WITH new_quote AS (
    INSERT INTO quotes (business_id, customer_id, quote_number, status, subtotal, total_amount, valid_until, notes)
    VALUES (business_uuid, customer_sarah, 'Q-1003', 'accepted', 200, 200, CURRENT_DATE + 7, 'Tutoring session quote')
    RETURNING id
  )
  INSERT INTO quote_items (quote_id, description, quantity, unit_price, line_total)
  SELECT id, 'Tutoring session — 60 minutes', 1, 200, 200 FROM new_quote;

  -- =====================================================
  -- INVOICES + INVOICE ITEMS
  -- =====================================================
  -- Unpaid invoice
  INSERT INTO invoices (business_id, customer_id, invoice_number, status, payment_status, subtotal, total_amount, amount_paid, amount_due, due_date, notes)
  VALUES (business_uuid, customer_sipho, 'INV-1001', 'sent', 'unpaid', 120, 120, 0, 120, CURRENT_DATE + 7, 'Mobile car wash — exterior only')
  RETURNING id INTO inv_unpaid;

  INSERT INTO invoice_items (invoice_id, description, quantity, unit_price, line_total)
  VALUES (inv_unpaid, 'Mobile car wash service', 1, 120, 120);

  -- Partially paid invoice
  INSERT INTO invoices (business_id, customer_id, invoice_number, status, payment_status, subtotal, total_amount, amount_paid, amount_due, due_date)
  VALUES (business_uuid, customer_lerato, 'INV-1002', 'sent', 'partially_paid', 150, 150, 50, 100, CURRENT_DATE + 7)
  RETURNING id INTO inv_partial;

  INSERT INTO invoice_items (invoice_id, description, quantity, unit_price, line_total)
  VALUES (inv_partial, 'Haircut — standard', 1, 150, 150);

  -- Paid invoice
  INSERT INTO invoices (business_id, customer_id, invoice_number, status, payment_status, subtotal, total_amount, amount_paid, amount_due, due_date, paid_at)
  VALUES (business_uuid, customer_sarah, 'INV-1003', 'sent', 'paid', 250, 250, 250, 0, CURRENT_DATE - 7, CURRENT_DATE - 7)
  RETURNING id INTO inv_paid;

  INSERT INTO invoice_items (invoice_id, description, quantity, unit_price, line_total)
  VALUES (inv_paid, 'Manicure — gel polish', 1, 250, 250);

  -- Overdue invoice
  INSERT INTO invoices (business_id, customer_id, invoice_number, status, payment_status, subtotal, total_amount, amount_paid, amount_due, due_date, notes)
  VALUES (business_uuid, customer_john, 'INV-1004', 'sent', 'overdue', 200, 200, 0, 200, CURRENT_DATE - 14, 'Tutoring session — overdue, needs follow-up')
  RETURNING id INTO inv_overdue;

  INSERT INTO invoice_items (invoice_id, description, quantity, unit_price, line_total)
  VALUES (inv_overdue, 'Tutoring session — 60 minutes', 1, 200, 200);

  -- =====================================================
  -- PAYMENTS
  -- =====================================================
  -- Full payment (for paid invoice INV-1003)
  INSERT INTO payments (business_id, invoice_id, customer_id, amount, payment_method, payment_reference, payment_date, notes)
  VALUES (business_uuid, inv_paid, customer_sarah, 250, 'EFT', 'EFT-REF-001', CURRENT_DATE - 7, 'Full payment received');

  -- Partial payment (for partially paid invoice INV-1002)
  INSERT INTO payments (business_id, invoice_id, customer_id, amount, payment_method, payment_date, notes)
  VALUES (business_uuid, inv_partial, customer_lerato, 50, 'Cash', CURRENT_DATE - 1, 'Deposit paid — remainder due');

  -- =====================================================
  -- REMINDERS
  -- =====================================================
  INSERT INTO reminders (business_id, customer_id, invoice_id, title, reminder_type, due_at, status)
  VALUES (business_uuid, customer_john, inv_overdue, 'Payment follow-up — John Smith', 'payment_follow_up', CURRENT_DATE + 1, 'pending');

  INSERT INTO reminders (business_id, customer_id, title, reminder_type, due_at, status, notes)
  VALUES (business_uuid, customer_lerato, 'Booking reminder — Lerato Mokoena', 'booking_follow_up', CURRENT_DATE, 'pending', 'Send morning-of reminder');

  INSERT INTO reminders (business_id, customer_id, title, reminder_type, due_at, status)
  VALUES (business_uuid, customer_sipho, 'Customer reactivation — Sipho Dlamini', 'customer_reactivation', CURRENT_DATE + 3, 'pending');

  -- =====================================================
  -- MESSAGE TEMPLATES
  -- =====================================================
  INSERT INTO message_templates (business_id, name, template_type, content) VALUES
    (business_uuid, 'Booking confirmation', 'booking_confirmation',
     'Hi {{customer_name}}, your booking with {{business_name}} is confirmed for {{booking_date}} at {{booking_time}} for {{service_name}}. Please reply YES to confirm.');

  INSERT INTO message_templates (business_id, name, template_type, content) VALUES
    (business_uuid, 'Booking reminder', 'booking_reminder',
     'Hi {{customer_name}}, reminder for your booking with {{business_name}} tomorrow at {{booking_time}} for {{service_name}}. See you soon.');

  INSERT INTO message_templates (business_id, name, template_type, content) VALUES
    (business_uuid, 'Quote message', 'quote_message',
     'Hi {{customer_name}}, here is your quote from {{business_name}}. Quote total: R{{quote_total}}. Please reply if you would like to go ahead.');

  INSERT INTO message_templates (business_id, name, template_type, content) VALUES
    (business_uuid, 'Invoice message', 'invoice_message',
     'Hi {{customer_name}}, here is your invoice from {{business_name}}. Invoice number: {{invoice_number}}. Amount due: R{{amount_due}}. Due date: {{due_date}}.');

  INSERT INTO message_templates (business_id, name, template_type, content) VALUES
    (business_uuid, 'Payment reminder', 'payment_reminder',
     'Hi {{customer_name}}, friendly reminder that invoice {{invoice_number}} from {{business_name}} has an outstanding amount of R{{amount_due}} due on {{due_date}}.');

  INSERT INTO message_templates (business_id, name, template_type, content) VALUES
    (business_uuid, 'Thank-you message', 'thank_you',
     'Hi {{customer_name}}, thank you for choosing {{business_name}}. We appreciate your support.');

  INSERT INTO message_templates (business_id, name, template_type, content) VALUES
    (business_uuid, 'Follow-up message', 'follow_up',
     'Hi {{customer_name}}, just following up from {{business_name}}. Let us know if you would like to book again or need anything else.');

  INSERT INTO message_templates (business_id, name, template_type, content) VALUES
    (business_uuid, 'Reactivation message', 'reactivation',
     'Hi {{customer_name}}, we miss you at {{business_name}}. Book your next appointment with us.');

  RAISE NOTICE 'Seed complete for business: %', business_uuid;
  RAISE NOTICE 'Services: 5 | Customers: 5 | Bookings: 5 | Quotes: 3 | Invoices: 4 | Payments: 2 | Reminders: 3 | Templates: 8';
END
$$;
