-- ============================================================
-- Migration 2: admin-managed Skills, Education & Experience
-- Run this once in the Supabase SQL Editor.
-- Idempotent: safe to re-run. Also seeds the content that is
-- currently on the site, so nothing changes until you edit it.
-- ============================================================

create table if not exists public.skill_categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  label text default '',
  icon text default '',
  sort_order int default 0,
  created_at timestamptz default now()
);

create table if not exists public.skills (
  id uuid primary key default gen_random_uuid(),
  category_id uuid not null references public.skill_categories(id) on delete cascade,
  icon text default '',
  name text not null,
  level int default 0,
  sort_order int default 0,
  created_at timestamptz default now()
);

create table if not exists public.education (
  id uuid primary key default gen_random_uuid(),
  period text default '',
  title text not null,
  institution text default '',
  result text default '',
  courses jsonb default '[]'::jsonb,
  sort_order int default 0,
  created_at timestamptz default now()
);

create table if not exists public.experience (
  id uuid primary key default gen_random_uuid(),
  role text not null,
  company text default '',
  period text default '',
  bullets jsonb default '[]'::jsonb,
  sort_order int default 0,
  created_at timestamptz default now()
);

alter table public.skill_categories enable row level security;
alter table public.skills enable row level security;
alter table public.education enable row level security;
alter table public.experience enable row level security;

-- ---------- seed the current on-site content ----------
insert into public.skill_categories (id, name, label, icon, sort_order) values
  ('11111111-1111-4111-8111-111111111101', 'Frontend',       'UI / CLIENT',   '{ }', 0),
  ('11111111-1111-4111-8111-111111111102', 'Backend',        'API / SERVER',  '⚙',   1),
  ('11111111-1111-4111-8111-111111111103', 'Tools & DevOps', 'WORKFLOW',      '$',   2)
on conflict (id) do nothing;

insert into public.skills (category_id, icon, name, level, sort_order) values
  ('11111111-1111-4111-8111-111111111101', '🎨', 'HTML & CSS',         95, 0),
  ('11111111-1111-4111-8111-111111111101', '⚛️', 'React.js',           90, 1),
  ('11111111-1111-4111-8111-111111111101', '💨', 'Tailwind CSS',       92, 2),
  ('11111111-1111-4111-8111-111111111101', '▲',  'Next.js',            85, 3),
  ('11111111-1111-4111-8111-111111111101', '🧩', 'TypeScript',         82, 4),
  ('11111111-1111-4111-8111-111111111101', '🗃️', 'Redux / Zustand',    80, 5),
  ('11111111-1111-4111-8111-111111111102', '🟩', 'Node.js',            88, 0),
  ('11111111-1111-4111-8111-111111111102', '🚂', 'Express.js',         90, 1),
  ('11111111-1111-4111-8111-111111111102', '🍃', 'MongoDB / Mongoose', 85, 2),
  ('11111111-1111-4111-8111-111111111102', '🐘', 'PostgreSQL',         75, 3),
  ('11111111-1111-4111-8111-111111111102', '🔌', 'REST & GraphQL',     80, 4),
  ('11111111-1111-4111-8111-111111111102', '🔐', 'Auth / JWT / OAuth', 85, 5),
  ('11111111-1111-4111-8111-111111111103', '🌿', 'Git & GitHub',       90, 0),
  ('11111111-1111-4111-8111-111111111103', '▲',  'Vercel / Netlify',   85, 1),
  ('11111111-1111-4111-8111-111111111103', '🎯', 'Figma → Code',       78, 2),
  ('11111111-1111-4111-8111-111111111103', '🧪', 'Postman / Testing',  80, 3),
  ('11111111-1111-4111-8111-111111111103', '🐳', 'Docker',             70, 4),
  ('11111111-1111-4111-8111-111111111103', '🐧', 'Linux / Bash',       72, 5)
on conflict do nothing;

insert into public.education (id, period, title, institution, result, sort_order) values
  ('22222222-2222-4222-8222-222222222201', '2021 — 2025', 'B.Sc. in Computer Science & Engineering', 'Daffodil International University · Khulna', 'CGPA: <b>3.72 / 4.00</b> · Vice-captain, DIU Computer & Coding Club', 0),
  ('22222222-2222-4222-8222-222222222202', '2018 — 2020', 'HSC — Science', 'Govt. Science College · Khulna', 'GPA: <b>5.00 / 5.00</b> · Physics, Chemistry, Higher Math', 1),
  ('22222222-2222-4222-8222-222222222203', '2018', 'SSC — Science', 'Ideal School & College · Khulna', 'GPA: <b>5.00 / 5.00</b> · First encounter with HTML, never recovered', 2)
on conflict (id) do nothing;

insert into public.experience (id, role, company, period, bullets, sort_order) values
  ('33333333-3333-4333-8333-333333333301', 'Full Stack Developer', 'TechNest Labs', 'Jan 2024 — Present',
   '["Building and maintaining MERN-based client dashboards used by 5,000+ monthly users.","Cut average page load time by 40% through code-splitting, lazy routes and image optimization.","Designed a reusable component library adopted across 3 internal products; mentoring 2 interns."]', 0),
  ('33333333-3333-4333-8333-333333333302', 'Web Developer Intern', 'Craftden Studio', 'Jun 2023 — Dec 2023',
   '["Shipped 6 client websites from Figma handoff to production, pixel-perfect and responsive.","Integrated REST APIs, payment gateways (bKash / Stripe) and CMS back-ends.","Introduced Git workflow & code reviews to a team of four, reducing merge conflicts to near zero."]', 1),
  ('33333333-3333-4333-8333-333333333303', 'Freelance Web Developer', 'Upwork · Fiverr', '2022 — Present',
   '["Delivered 15+ projects — landing pages, e-commerce stores, booking systems — with a 5.0★ average rating.","Handled the full cycle: scoping calls, estimation, development, deployment and post-launch support."]', 2)
on conflict (id) do nothing;
