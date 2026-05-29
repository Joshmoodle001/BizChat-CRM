# BizChat CRM

Simple bookings, invoices, and customer follow-ups for WhatsApp businesses.

Manage your customers, bookings, quotes, invoices, and reminders in one place — then send everything through WhatsApp. Built for South African small businesses.

## Tech stack

- **Framework:** Next.js (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4
- **Auth:** Supabase Auth
- **Database:** Supabase PostgreSQL
- **Storage:** Supabase Storage
- **Security:** Supabase Row Level Security
- **Deployment:** Vercel

## Local setup

### Prerequisites

- Node.js 18+
- npm 9+
- A [Supabase](https://supabase.com) account (free tier works)

### 1. Clone and install

```bash
git clone <repo-url>
cd bizchat
npm install
```

### 2. Environment variables

Copy the example env file and fill in your Supabase credentials:

```bash
cp .env.example .env.local
```

Fill in these values:

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL (e.g. `https://abc123.supabase.co`) |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase anon/public key |
| `SUPABASE_SERVICE_ROLE_KEY` | Your Supabase service role key (server-side only) |
| `NEXT_PUBLIC_APP_URL` | `http://localhost:3000` for local dev |

### 3. Supabase setup

#### Database migrations

Run the SQL migration file in your Supabase SQL Editor:

1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Open and run `supabase/migrations/001_schema.sql`
4. This creates all tables, RLS policies, triggers, and indexes

#### Storage bucket

1. Go to **Storage** in your Supabase dashboard
2. Create a new bucket named `business-assets`
3. Set it to **private** (not public)
4. Create a policy to allow authenticated users to read/write their business files

```sql
-- Run this in SQL Editor after creating the bucket
CREATE POLICY "Users can access their business files"
ON storage.objects
FOR ALL
USING (
  bucket_id = 'business-assets'
  AND auth.role() = 'authenticated'
  AND (storage.foldername(name))[1] = (
    SELECT business_id::text FROM profiles WHERE auth_user_id = auth.uid()
  )
);
```

### 4. Run the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### 5. Seed data (optional)

After registering your first business, run the seed SQL to populate demo data:

```bash
# In Supabase SQL Editor, run:
# supabase/seed.sql
```

Demo login after seeding:
- Email: owner@demostudio.co.za
- Password: (the password you set during registration)

## Project structure

```
bizchat/
├── app/
│   ├── layout.tsx          # Public layout (header, footer)
│   ├── page.tsx            # Landing page
│   ├── globals.css         # Tailwind + theme
│   ├── login/
│   │   └── page.tsx        # Login page
│   ├── register/
│   │   └── page.tsx        # Business registration
│   ├── privacy/
│   │   └── page.tsx        # Privacy notice
│   └── pricing/
│       └── page.tsx        # Pricing page
├── components/
│   ├── layout/
│   │   ├── public-header.tsx
│   │   └── public-footer.tsx
│   └── ui/
│       ├── button.tsx
│       ├── input.tsx
│       ├── card.tsx
│       ├── badge.tsx
│       └── empty-state.tsx
├── lib/
│   ├── supabase/
│   │   ├── client.ts       # Browser Supabase client
│   │   └── server.ts       # Server Supabase client
│   └── utils.ts            # Shared utilities
├── types/
│   └── index.ts            # TypeScript type definitions
├── supabase/
│   ├── migrations/
│   │   └── 001_schema.sql  # Database schema + RLS
│   └── seed.sql            # Demo seed data
├── .env.example
└── README.md
```

## Deployment to Vercel

1. Push the repo to GitHub
2. In Vercel, click **New Project** and import the repo
3. Set the environment variables in Vercel (same as .env.example)
4. Set the framework to **Next.js**
5. Deploy

## Known limitations (MVP)

- Payments are manually tracked (no payment gateway integration)
- WhatsApp messages use copy-to-clipboard / deep links (no WhatsApp Business API)
- No automated reminders (reminders are manual)
- No PDF generation for invoices yet
- No staff invite email flow (staff are added manually by the owner)

## Future roadmap

### Version 2
- Payment gateway integration (PayFast / Yoco)
- WhatsApp Business API direct integration
- Automated reminders via WhatsApp
- PDF invoice generation
- Staff commission calculations
- Recurring bookings
- Customer portal

### Version 3
- AI auto-replies
- WhatsApp chatbot
- Voice note summarisation
- Loyalty programme
- Multi-branch support
- Inventory management
- Advanced analytics
- Accounting integrations (Xero, QuickBooks)

---

Built for South African small businesses. BizChat CRM &copy; 2026.
