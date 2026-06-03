-- Phase 2: core schema, roles, RLS, triggers, analytics, indexes
-- Designed to scale to 10,000+ resources and thousands of users without schema changes.

create extension if not exists "pgcrypto";

-- ---------- Enums ----------
do $$ begin
  create type user_role as enum ('student', 'admin');
exception when duplicate_object then null; end $$;

do $$ begin
  create type resource_type as enum (
    'Quick Notes','Detailed Notes','MCQs','PYQs','Interview Questions',
    'Technical Questions','HR Questions','Interview Experience','Cheat Sheets',
    'Assignments','Aptitude Resources'
  );
exception when duplicate_object then null; end $$;

-- ---------- Profiles ----------
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  role user_role not null default 'student',
  study_streak int not null default 0,
  last_active timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ---------- Subjects ----------
create table if not exists public.subjects (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  icon text,
  description text,
  created_at timestamptz not null default now()
);

-- ---------- Companies ----------
create table if not exists public.companies (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  logo_url text,
  description text,
  created_at timestamptz not null default now()
);

-- ---------- Resources ----------
create table if not exists public.resources (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  description text,
  resource_type resource_type not null,
  subject_id uuid references public.subjects(id) on delete set null,
  company_id uuid references public.companies(id) on delete set null,
  drive_link text not null,
  thumbnail_url text,
  published boolean not null default false,
  view_count int not null default 0,
  download_count int not null default 0,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ---------- Bookmarks ----------
create table if not exists public.bookmarks (
  user_id uuid not null references auth.users(id) on delete cascade,
  resource_id uuid not null references public.resources(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, resource_id)
);

-- ---------- Analytics ----------
create table if not exists public.resource_views (
  id bigint generated always as identity primary key,
  resource_id uuid not null references public.resources(id) on delete cascade,
  user_id uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now()
);

create table if not exists public.resource_downloads (
  id bigint generated always as identity primary key,
  resource_id uuid not null references public.resources(id) on delete cascade,
  user_id uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now()
);

-- ---------- Indexes ----------
create index if not exists idx_resources_subject on public.resources(subject_id);
create index if not exists idx_resources_company on public.resources(company_id);
create index if not exists idx_resources_type on public.resources(resource_type);
create index if not exists idx_resources_published on public.resources(published);
create index if not exists idx_resources_created on public.resources(created_at desc);
create index if not exists idx_resources_fts on public.resources
  using gin (to_tsvector('english', coalesce(title,'') || ' ' || coalesce(description,'')));
create index if not exists idx_views_resource on public.resource_views(resource_id);
create index if not exists idx_views_user_created on public.resource_views(user_id, created_at desc);
create index if not exists idx_downloads_resource on public.resource_downloads(resource_id);

-- ---------- Triggers ----------
-- Auto-create a profile (role student) on signup.
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, coalesce(new.raw_user_meta_data->>'full_name', new.email));
  return new;
end; $$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Increment counters on view/download insert.
create or replace function public.bump_view_count()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  update public.resources set view_count = view_count + 1 where id = new.resource_id;
  return new;
end; $$;

drop trigger if exists on_resource_view on public.resource_views;
create trigger on_resource_view
  after insert on public.resource_views
  for each row execute function public.bump_view_count();

create or replace function public.bump_download_count()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  update public.resources set download_count = download_count + 1 where id = new.resource_id;
  return new;
end; $$;

drop trigger if exists on_resource_download on public.resource_downloads;
create trigger on_resource_download
  after insert on public.resource_downloads
  for each row execute function public.bump_download_count();

-- Helper: is current user an admin?
create or replace function public.is_admin()
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.profiles where id = auth.uid() and role = 'admin');
$$;
