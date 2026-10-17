-- ============================================================
-- Portfolio database schema — run this once in the Supabase
-- SQL Editor (Dashboard → SQL Editor → New query → paste → Run)
-- ============================================================

-- ---------- PROJECTS ----------
create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  tag text not null default 'PROJECT',
  year text default '',
  role text default 'Full Stack Developer',
  wide boolean default false,
  sort_order int default 0,
  live_url text default '',
  repo_url text default '',
  image_url text default '',
  seed text default '',
  short text default '',
  brief jsonb default '[]'::jsonb,       -- paragraphs; may contain inline <b>text</b>
  stack jsonb default '[]'::jsonb,       -- tech tags
  challenges jsonb default '[]'::jsonb,
  future jsonb default '[]'::jsonb,
  created_at timestamptz default now()
);

-- ---------- INQUIRIES (contact form) ----------
create table if not exists public.inquiries (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  subject text default '',
  message text not null,
  is_read boolean default false,
  created_at timestamptz default now()
);

-- ---------- SITE SETTINGS (single JSON row) ----------
create table if not exists public.site_settings (
  key text primary key,
  value jsonb not null,
  updated_at timestamptz default now()
);

insert into public.site_settings (key, value)
values ('site', '{}'::jsonb)
on conflict (key) do nothing;

-- ============================================================
-- Row Level Security
-- All writes happen from the Next.js server using the
-- SERVICE_ROLE key (bypasses RLS). No anon policies are added,
-- so the public anon key can read nothing — the site itself
-- always reads through the server. Optionally enable public
-- read-only for the home page with:
--
-- create policy "public read projects"
--   on public.projects for select to anon using (true);
-- ============================================================
alter table public.projects enable row level security;
alter table public.inquiries enable row level security;
alter table public.site_settings enable row level security;
