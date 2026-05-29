# Phase 4 — Core CRM Modules

## What Phase 4 adds

- Business owner dashboard with real data cards (customers, services, staff counts from DB)
- Customers CRUD: list, add, view detail, edit, deactivate
- Services CRUD: list, add, view detail, edit, deactivate
- Staff management: list, add placeholder, view detail, deactivate
- Business settings: view and update business profile
- Reusable UI components: StatusBadge, SearchInput, FormField, LoadingState, ErrorState
- Reusable form components: CustomerForm, ServiceForm, StaffForm, BusinessSettingsForm
- Query helpers for each module
- Server actions for all mutations with audit logging
- Input validation for all forms
- Mobile-responsive tables/cards on all list pages
- WhatsApp one-click button on customer detail (South African phone format)

## Files created/updated

| Category | Files |
|---|---|
| **Dashboard** | `app/dashboard/page.tsx`, `components/dashboard/dashboard-card.tsx`, `components/dashboard/quick-action-card.tsx` |
| **Customers** | 4 pages (list, new, detail, edit), `actions.ts`, `CustomerForm`, `lib/customers/queries.ts`, `types/customer.ts` |
| **Services** | 4 pages (list, new, detail, edit), `actions.ts`, `ServiceForm`, `lib/services/queries.ts`, `types/service.ts` |
| **Staff** | 3 pages (list, new, detail), `actions.ts`, `StaffForm`, `lib/staff/queries.ts`, `types/staff.ts` |
| **Settings** | `app/dashboard/settings/page.tsx`, `actions.ts`, `BusinessSettingsForm`, `lib/settings/queries.ts` |
| **Validation** | `lib/validation/customer.ts`, `service.ts`, `staff.ts`, `business-settings.ts` |
| **UI components** | `loading-state.tsx`, `error-state.tsx`, `status-badge.tsx`, `search-input.tsx`, `form-field.tsx` |
| **Types** | `types/customer.ts`, `service.ts`, `staff.ts`, `dashboard.ts` |
| **Lib** | `lib/dashboard/queries.ts`, `lib/customers/queries.ts`, `lib/services/queries.ts`, `lib/staff/queries.ts`, `lib/settings/queries.ts` |

## Route map

```
/dashboard                 → Dashboard with real stats
/dashboard/customers       → Customer list (search, filter, table/cards)
/dashboard/customers/new   → Add customer form
/dashboard/customers/[id]  → Customer detail + WhatsApp + placeholders
/dashboard/customers/[id]/edit → Edit customer form
/dashboard/services        → Service list
/dashboard/services/new    → Add service form
/dashboard/services/[id]   → Service detail + placeholders
/dashboard/services/[id]/edit → Edit service form
/dashboard/staff           → Staff list (owners + staff)
/dashboard/staff/new       → Add staff placeholder
/dashboard/staff/[id]      → Staff detail + placeholders
/dashboard/settings        → Business settings form + account info
```

## Security model

- All pages call `requireRole(["business_owner"])` for server-side auth
- All queries scope to `profile.business_id` from current profile
- RLS on all tables provides defense-in-depth
- Staff users redirected away from `/dashboard/*` by Phase 3 route protection
- Audit logs created for all mutations
- No hard deletes — soft status changes only (active → inactive)

## Data flow pattern

```
Page (server component)
  → requireRole() → get profile + business_id
  → module queries (getCustomers, getServices, etc.)
  → render UI with data

Form (client component)
  → user fills form → onSubmit
  → server action (createCustomerAction, etc.)
  → validates input
  → DB write (scoped to business_id)
  → audit log insert
  → revalidatePath() for affected routes
  → redirect to detail page
```

## Known limitations

- Staff creation adds a profile without an auth user (auth_user_id = null)
- Staff invite emails not yet implemented
- No PDF or image upload for business logo
- File upload not implemented (logo_url is text field)
- No bulk import/CSV import for customers
- No customer communication preference enforcement yet

## Phase 5 handoff

Phase 5 should build:
- Booking calendar/list
- Create booking flow (customer, service, staff, date, time)
- Booking detail page
- Booking status management (scheduled → confirmed → completed → cancelled)
- Staff assignment to bookings
- WhatsApp booking confirmation message template
- Copy message button / Open WhatsApp button for bookings
- Booking reminders placeholder
- Customer booking history integration (replace placeholder on customer detail)
- Staff assigned bookings page
- Staff schedule view

### Key files to reference
- `lib/dashboard/queries.ts` — pattern for real data
- `lib/customers/queries.ts` — scoped query pattern
- `app/dashboard/customers/actions.ts` — server action pattern with audit
- `components/customers/customer-form.tsx` — form pattern
- `components/ui/` — all reusable components
