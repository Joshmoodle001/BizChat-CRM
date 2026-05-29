# Phase 3 — Authentication, Roles, and Routing

## What Phase 3 adds

- Supabase Auth integration (email/password)
- Business registration flow with atomic creation (auth user + business + profile)
- Login with role-based redirects
- Logout
- Server-side route protection via `requireRole()` in layouts
- Middleware for session refresh and basic auth gating
- Protected route groups: `/dashboard`, `/staff`, `/super-admin`, `/onboarding`
- Onboarding flow for new business owners
- Default message templates auto-seeded on registration
- Audit log entries for business creation and onboarding
- Reusable role/permission helpers
- Client-side auth components (login/register forms, logout button, error display)
- App shell layout with sidebar navigation for each role

## Auth flow

```
User → /register → createUser + business + profile → /onboarding → /dashboard
User → /login → signInWithPassword → fetch profile → redirectByRole
User → /logout → signOut → /login
```

## Registration flow

1. User fills in business name, industry, full name, email, phone, password
2. Client validates (password match, min length)
3. Server action `registerBusiness`:
   - Creates auth user via service role client
   - Creates business record
   - Creates business_owner profile
   - Seeds 8 default message templates
   - Inserts audit log (business_created)
   - Redirects to `/onboarding`
4. On failure: rolls back auth user and business if created, returns error message

## Login flow

1. User enters email + password
2. Server action `login` authenticates via Supabase
3. Fetches profile by `auth_user_id`
4. Checks profile status, business status
5. Redirects by role using `redirectByRole()`

## Role redirect rules

| Role | Redirect path |
|---|---|
| `super_admin` | `/super-admin` |
| `business_owner` | `/dashboard` |
| `staff` | `/staff` |

## Protected route rules

| Route | Allowed roles | Unauthenticated → | Wrong role → |
|---|---|---|---|
| `/dashboard/*` | business_owner | /login | redirected by role |
| `/staff/*` | staff | /login | redirected by role |
| `/super-admin/*` | super_admin | /login | redirected by role |
| `/onboarding` | business_owner | /login | redirected by role |

## How to create a super admin

```sql
-- 1. Create auth user in Supabase Auth UI
-- 2. Create a platform business record
INSERT INTO businesses (name, email, subscription_plan, subscription_status, status)
VALUES ('BizChat CRM Platform', 'platform@bizchatcrm.co.za', 'enterprise', 'active', 'active');

-- 3. Create super admin profile
INSERT INTO profiles (auth_user_id, business_id, full_name, email, role)
VALUES (
  'paste-auth-user-uuid',
  'paste-business-uuid',
  'Admin Name',
  'admin@bizchatcrm.co.za',
  'super_admin'
);
```

## Staff user creation (Phase 4+)

Staff users must have:
- A Supabase auth user account
- A profile record with role = 'staff' linked to a business

Currently manual. Phase 4 will add the staff management UI.

## Testing checklist

- [x] User can register a business
- [x] Registration creates auth user
- [x] Registration creates business
- [x] Registration creates business_owner profile
- [x] Registration creates default message templates (8)
- [x] Registration redirects to onboarding
- [x] Onboarding updates business details
- [x] Onboarding redirects to dashboard
- [x] User can log out
- [x] User can log in again
- [x] Login redirects business_owner to /dashboard
- [x] Staff user redirects to /staff
- [x] Super admin redirects to /super-admin
- [x] Unauthenticated user redirected from /dashboard
- [x] Unauthenticated user redirected from /staff
- [x] Unauthenticated user redirected from /super-admin
- [x] Wrong role redirected from /dashboard
- [x] Wrong role redirected from /staff
- [x] Wrong role redirected from /super-admin
- [x] Public routes remain public
- [x] Logout clears session

## Known limitations

- Staff invite emails not implemented (manual creation only)
- No email verification flow (auto-confirmed for dev)
- Middleware only does session refresh + basic auth gating (role checks in layouts)
- No "remember me" or password reset UI (Phase 4+)

## Phase 4 handoff

Phase 4 should build:
- Business owner dashboard cards (real data)
- Customers CRUD (list, create, edit, detail)
- Services CRUD
- Staff management (list, create, edit)
- Business settings page
- Forms and validation
- Empty states throughout
- CSV export foundation

### Files to reference
- `lib/supabase/server.ts` — server client + service role client
- `lib/auth/` — auth helpers ready for reuse
- `lib/permissions/` — role/permission helpers
- `components/auth/` — form components pattern
- `components/layouts/` — app shell and sidebar pattern
- `middleware.ts` — session refresh in place
- `types/index.ts` — all type definitions
