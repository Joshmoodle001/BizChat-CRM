# Supabase Setup Guide — BizChat CRM

This guide covers setting up Supabase for BizChat CRM from scratch, including database, auth, storage, and seed data.

---

## 1. Create a Supabase project

1. Go to [https://supabase.com](https://supabase.com) and log in
2. Click **New project**
3. Enter a name (e.g. `bizchat-crm`)
4. Set a secure database password (save it)
5. Choose a region (preferably close to South Africa, e.g. `eu-west-1` or `ap-southeast-1`)
6. Wait for the project to provision (1-2 minutes)

---

## 2. Get your API keys

In your Supabase project dashboard:

1. Go to **Settings > API**
2. Copy these values into your `.env.local` file:

| Env variable | Where to find it |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Project URL field |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `anon` `public` key |
| `SUPABASE_SERVICE_ROLE_KEY` | `service_role` key (keep secret) |

```
# .env.local
NEXT_PUBLIC_SUPABASE_URL=https://abc123def.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOi...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOi...
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

## 3. Apply database migrations

Run the SQL files **in order** in the Supabase SQL Editor.

Go to **SQL Editor** in your Supabase dashboard.

### Step 3a — Initial schema (tables, indexes, triggers)

1. Click **New query**
2. Copy the contents of `supabase/migrations/001_initial_schema.sql`
3. Click **Run**

Expected output: `CREATE TABLE` for each of the 14 tables, plus indexes and triggers.

### Step 3b — RLS policies (helper functions + security)

1. Click **New query**
2. Copy the contents of `supabase/migrations/002_rls_policies.sql`
3. Click **Run**

Expected output: `CREATE POLICY` for each table across SELECT/INSERT/UPDATE/DELETE.

### Step 3c — Storage policies

1. First, create the storage bucket:
   - Go to **Storage** in the sidebar
   - Click **New bucket**
   - Name: `business-assets`
   - Uncheck **Public bucket** (keep it private)
   - File size limit: 10 MB
   - Allowed MIME types: `image/*, application/pdf`
   - Click **Create bucket**

2. Click **New query** in SQL Editor
3. Copy the contents of `supabase/migrations/003_storage.sql`
4. Click **Run**

Expected output: `CREATE POLICY` for storage objects.

---

## 4. Configure Supabase Auth

### Enable Email/Password auth

1. Go to **Authentication > Providers**
2. Ensure **Email** is enabled (it is by default)
3. Optionally disable **Confirm email** for development (go to **Authentication > Settings**, uncheck "Confirm email")

### For production

- Enable email confirmation
- Set up a custom SMTP provider for transactional emails
- Configure redirect URLs in **Authentication > URL Configuration**

---

## 5. Register your first business

1. Start the dev server: `npm run dev`
2. Go to `http://localhost:3000/register`
3. Fill in the registration form:
   - Business name: `Demo Beauty Studio`
   - Industry: `Beauty salon`
   - Full name: your name
   - Email: your email
   - Password: a secure password
4. Submit the form

This creates:
- An auth user in `auth.users`
- A business record in `businesses`
- A profile record in `profiles` with role `business_owner`

---

## 6. Load seed data

After registration, load demo data to populate the app:

1. Go to **SQL Editor** in Supabase
2. Copy the contents of `supabase/seed.sql`
3. Click **Run**

Expected output:

```
NOTICE: Seeding demo data for business: <uuid>
NOTICE: Seed complete for business: <uuid>
NOTICE: Services: 5 | Customers: 5 | Bookings: 5 | Quotes: 3 | Invoices: 4 | Payments: 2 | Reminders: 3 | Templates: 8
```

### Add a staff member (optional)

To test staff functionality:

1. **Option A — via app (Phase 3):**
   The dashboard will have a staff management page once Phase 3 is built.

2. **Option B — manual:**
   - Go to **Authentication > Users > Add user**
   - Enter staff email and password
   - Copy the new user's UUID
   - Run this SQL (replace the UUID):

```sql
INSERT INTO profiles (auth_user_id, business_id, full_name, email, role)
VALUES (
  'paste-staff-auth-uuid-here',
  (SELECT id FROM businesses LIMIT 1),
  'Thabo Ndlovu',
  'thabo@demostudio.co.za',
  'staff'
);
```

---

## 7. Verify the setup

Run these queries to confirm everything is working:

```sql
-- Check tables exist
SELECT table_name FROM information_schema.tables
WHERE table_schema = 'public'
ORDER BY table_name;

-- Expected: 14 tables (businesses, profiles, customers, services,
-- bookings, quotes, quote_items, invoices, invoice_items,
-- payments, reminders, message_templates, audit_logs)

-- Check RLS is enabled
SELECT tablename, rowsecurity FROM pg_tables
WHERE schemaname = 'public' AND tablename NOT LIKE '_prisma%'
ORDER BY tablename;

-- Expected: rowsecurity = true for all tables

-- Check policies exist
SELECT tablename, policyname, cmd FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, cmd;

-- Expected: 4 policies per table (SELECT, INSERT, UPDATE, DELETE)

-- Check demo data
SELECT 'businesses' AS tbl, count(*) FROM businesses
UNION ALL
SELECT 'profiles', count(*) FROM profiles
UNION ALL
SELECT 'customers', count(*) FROM customers
UNION ALL
SELECT 'services', count(*) FROM services
UNION ALL
SELECT 'bookings', count(*) FROM bookings
UNION ALL
SELECT 'quotes', count(*) FROM quotes
UNION ALL
SELECT 'invoices', count(*) FROM invoices
UNION ALL
SELECT 'payments', count(*) FROM payments
UNION ALL
SELECT 'reminders', count(*) FROM reminders
UNION ALL
SELECT 'message_templates', count(*) FROM message_templates;
```

---

## 8. Demo login

After setup, you can log in with the credentials you created during registration.

| Role | Email | Notes |
|---|---|---|
| Business owner | your-registered-email | Created via /register |
| Staff | thabo@demostudio.co.za | Created manually (step 6) |

---

## 9. Reset / redo

To start fresh:

1. Go to **SQL Editor** in Supabase
2. Run this to drop all tables and policies (destructive!):

```sql
DROP TABLE IF EXISTS audit_logs, message_templates, reminders, payments,
  invoice_items, invoices, quote_items, quotes, bookings, services,
  customers, profiles, businesses CASCADE;

DROP FUNCTION IF EXISTS update_updated_at_column, get_current_profile_id,
  get_current_business_id, get_current_role, is_super_admin,
  is_business_owner, is_staff, user_has_business_access;
```

3. Delete all auth users in **Authentication > Users**
4. Delete the storage bucket in **Storage**
5. Re-run migrations 001, 002, 003 and re-register

---

## Phase 2 checklist

- [x] 14 tables created with correct columns and types
- [x] All foreign keys in place
- [x] CHECK constraints on status/enum fields
- [x] `updated_at` triggers on 10 tables
- [x] 35+ indexes for performance
- [x] RLS enabled on all 13 user-data tables
- [x] 7 helper functions for role/permission checks
- [x] 4 RLS policies per table (SELECT/INSERT/UPDATE/DELETE)
- [x] Business owners isolated to own business
- [x] Staff restricted (no delete on customers/invoices/payments)
- [x] Staff can view assigned bookings
- [x] Super admins have platform-wide access
- [x] Quote/invoice items inherit from parent (via EXISTS)
- [x] Storage bucket policies for business-assets
- [x] Seed data: 5 customers, 5 services, 5 bookings, 3 quotes, 4 invoices, 2 payments, 3 reminders, 8 templates
