# Backend setup (Supabase + Cloudinary + Resend)

The site runs fine with no configuration — it falls back to the bundled sample
data and the contact form opens the visitor's mail client. Add the keys below
in `.env.local` (copied from `.env.example`) to light everything up, then
restart `npm run dev`.

## 1. Supabase — database

1. Create a project at https://supabase.com
2. Run `supabase/schema.sql` once: Dashboard → SQL Editor → New query → paste → Run.
   (Creates `projects`, `inquiries`, `site_settings`; RLS enabled, no anon policies.)
3. Dashboard → Project Settings → API → copy the **Project URL** and
   **service_role secret**:
   ```
   SUPABASE_URL=https://xxxx.supabase.co
   SUPABASE_SERVICE_ROLE_KEY=eyJ...
   ```
4. Start `npm run dev`, open `/admin/projects` and click
   **“Load the 4 sample projects”** to seed the database once.
   After that the home page renders projects from the database.

All DB access happens on the server with the service-role key; the browser
never sees it. That is why there are no anon policies in the schema.

## 2. Cloudinary — images

1. Create a free account at https://cloudinary.com → Dashboard → copy
   **Cloud name / API key / API secret** into `.env.local`.
2. In `/admin/projects/new` (or the edit page) use the file picker — the image
   uploads to Cloudinary and the returned URL is saved with the project.

## 3. Resend — inquiry emails

1. Create an account at https://resend.com → API Keys → create a key.
2. For real delivery, add and verify your domain (Dashboard → Domains), then
   set:
   ```
   RESEND_API_KEY=re_...
   MAIL_FROM="Portfolio <hello@yourdomain.com>"
   MAIL_TO=hello@yourdomain.com
   ```
   While testing you can skip `MAIL_FROM` — it defaults to Resend's sandbox
   sender `onboarding@resend.dev`, which can only deliver to your own account
   email unless your domain is verified.
3. Every contact-form submission is stored in `inquiries` **and** emailed to
   `MAIL_TO`.

## 4. Admin panel

- `/admin` → login with `ADMIN_PASSWORD` from `.env.local` (add one first).
- Sections: **Dashboard** (config checklist + counts), **Projects** (add /
  edit / delete / wide-card / ordering / image upload), **Inquiries** (mark
  read–unread, delete), **Settings** (contact email & phone, WhatsApp number
  and message, location, social links, hero rotating roles, hero stats).
- Sessions last 7 days; “Sign out” clears the cookie.

## What the site does without any keys

| Feature            | Behaviour                                    |
| ------------------ | -------------------------------------------- |
| Home page          | Renders the bundled sample projects/data     |
| `/admin`           | reachable but login impossible until password set |
| Contact form       | falls back to the visitor's mail client      |
| Image upload       | returns a “Cloudinary is not configured” hint |

## Files

- `supabase/schema.sql` — tables + RLS
- `src/lib/*` — supabase client, cloudinary, auth, settings defaults
- `src/app/api/*` — inquiry, admin login/logout/upload
- `src/app/admin/*` — panel pages and server actions
