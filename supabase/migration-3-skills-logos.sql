-- ============================================================
-- Migration 3: brand logos for skills
-- Run once in the Supabase SQL Editor after migration 2.
-- ============================================================

alter table public.skills add column if not exists logo text default '';

-- fill the Simple Icons slugs for the seeded rows
update public.skills set logo = 'html5/html5-original'       where name = 'HTML & CSS'        and coalesce(logo, '') = '';
update public.skills set logo = 'react/react-original'       where name = 'React.js'          and coalesce(logo, '') = '';
update public.skills set logo = 'tailwindcss/tailwindcss-original' where name = 'Tailwind CSS'      and coalesce(logo, '') = '';
update public.skills set logo = 'nextjs/nextjs-original'   where name = 'Next.js'           and coalesce(logo, '') = '';
update public.skills set logo = 'typescript/typescript-original'  where name = 'TypeScript'        and coalesce(logo, '') = '';
update public.skills set logo = 'redux/redux-original'       where name = 'Redux / Zustand'   and coalesce(logo, '') = '';
update public.skills set logo = 'nodejs/nodejs-original'   where name = 'Node.js'           and coalesce(logo, '') = '';
update public.skills set logo = 'mongodb/mongodb-original'     where name = 'MongoDB / Mongoose' and coalesce(logo, '') = '';
update public.skills set logo = 'postgresql/postgresql-original'  where name = 'PostgreSQL'        and coalesce(logo, '') = '';
update public.skills set logo = 'graphql/graphql-plain'     where name = 'REST & GraphQL'    and coalesce(logo, '') = '';
update public.skills set logo = 'git/git-original'         where name = 'Git & GitHub'      and coalesce(logo, '') = '';
update public.skills set logo = 'vercel/vercel-original'      where name = 'Vercel / Netlify'  and coalesce(logo, '') = '';
update public.skills set logo = 'figma/figma-original'       where name = 'Figma → Code'      and coalesce(logo, '') = '';
update public.skills set logo = 'postman/postman-original'     where name = 'Postman / Testing' and coalesce(logo, '') = '';
update public.skills set logo = 'docker/docker-original'      where name = 'Docker'            and coalesce(logo, '') = '';
update public.skills set logo = 'bash/bash-plain'     where name = 'Linux / Bash'      and coalesce(logo, '') = '';
