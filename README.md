# FoundHere

Official lost-and-found service for Kogon City Specialized School. This is a Vite + React + TanStack Start app with Supabase Auth and database storage.

## Setup

1. Install dependencies with `npm install`.
2. Copy `.env.example` to `.env.local` and set `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`.
3. Run `npm run dev`.

Never commit `.env` files or service-role keys. The browser must use only the Supabase URL and anon/publishable key.

## One-time Supabase cleanup and admin setup

Run `supabase/cleanup-and-admin.sql` once in the Supabase SQL Editor. It deletes all rows from reports, claims, matches, notifications, and all objects in the `item-photos` bucket. It keeps auth users and profiles. It also creates the backend `user_roles` table, marks `akobirsaidov023@gmail.com` as admin, and installs owner/admin RLS policies.

Review the existing table names and take a backup before running destructive SQL.

## Google OAuth

In Google Cloud, use the Supabase callback as the Authorized redirect URI:
`https://YOUR_PROJECT_REF.supabase.co/auth/v1/callback`

Add the production and preview app origins as Authorized JavaScript origins. In Supabase Authentication URL Configuration, set the published Site URL and allow the published URL plus each preview `/login` redirect URL.

## Verification and deployment

- `npm run lint`
- `npm test -- --run`
- `npm run build`

Deploy the Vite app to Vercel. `vercel.json` rewrites SPA routes to `/` so direct links and refreshes resolve correctly.
