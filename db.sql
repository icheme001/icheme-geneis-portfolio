-- ============================================
-- PORTFOLIO + ADMIN CMS DATABASE (SUPABASE)
-- CLEAN & ERROR-FREE VERSION
-- ============================================

-- EXTENSIONS
create extension if not exists "uuid-ossp";
create extension if not exists "pgcrypto";

-- ============================================
-- 1. ADMINS TABLE
-- ============================================
create table if not exists admins (
  id bigint generated always as identity primary key,
  email text unique not null,
  password text not null,
  created_at timestamp default now()
);

-- ============================================
-- 2. ADMIN SESSIONS TABLE
-- ============================================
create table if not exists admin_sessions (
  id uuid primary key default gen_random_uuid(),
  admin_id bigint references admins(id) on delete cascade,
  token text not null,
  created_at timestamp default now(),
  expires_at timestamp
);

-- ============================================
-- 3. PROJECTS TABLE
-- ============================================
create table if not exists projects (
  id bigint generated always as identity primary key,
  title text not null,
  description text,
  github text,
  url text,
  image text,
  tags text[],
  created_at timestamp default now()
);

-- ============================================
-- 4. MESSAGES TABLE
-- ============================================
create table if not exists messages (
  id bigint generated always as identity primary key,
  name text not null,
  email text not null,
  message text not null,
  created_at timestamp default now()
);

-- ============================================
-- 5. CV FILES TABLE
-- ============================================
create table if not exists cv_files (
  id bigint generated always as identity primary key,
  file_url text not null,
  uploaded_at timestamp default now()
);

-- ============================================
-- 6. PROFILE TABLE
-- ============================================
create table if not exists profile (
  id bigint generated always as identity primary key,
  name text,
  title text,
  bio text,
  profile_image text,
  tech_stack text[],
  updated_at timestamp default now()
);

-- ============================================
-- ENABLE RLS
-- ============================================
alter table projects enable row level security;
alter table messages enable row level security;
alter table cv_files enable row level security;
alter table profile enable row level security;

alter table admins disable row level security;
alter table admin_sessions disable row level security;

-- ============================================
-- RLS POLICIES (DROPPED THEN RECREATED)
-- ============================================

-- --------------------------
-- MESSAGES POLICIES
-- --------------------------
drop policy if exists "public_can_submit_messages" on messages;
create policy "public_can_submit_messages"
on messages
for insert
to public
with check (true);

drop policy if exists "admin_can_read_messages" on messages;
create policy "admin_can_read_messages"
on messages
for select
to authenticated
using (true);

-- --------------------------
-- PROJECTS POLICIES
-- --------------------------
drop policy if exists "public_can_read_projects" on projects;
create policy "public_can_read_projects"
on projects
for select
to public
using (true);

drop policy if exists "admin_can_write_projects" on projects;
create policy "admin_can_write_projects"
on projects
for all
to authenticated
using (true)
with check (true);

-- --------------------------
-- CV FILES POLICIES (MERGED INTO ONE CLEAN POLICY)
-- --------------------------
drop policy if exists "admin_can_manage_cv" on cv_files;
create policy "admin_can_manage_cv"
on cv_files
for all
to authenticated
using (true)
with check (true);

-- --------------------------
-- PROFILE POLICIES
-- --------------------------
drop policy if exists "public_can_read_profile" on profile;
create policy "public_can_read_profile"
on profile
for select
to public
using (true);

drop policy if exists "admin_can_write_profile" on profile;
create policy "admin_can_write_profile"
on profile
for all
to authenticated
using (true)
with check (true);

-- ============================================
-- DEFAULT ADMIN ACCOUNT (CHANGE AFTER FIRST LOGIN)
-- ============================================
insert into admins (email, password)
values (
  'admin@example.com',
  crypt('Admin@123', gen_salt('bf'))
);
