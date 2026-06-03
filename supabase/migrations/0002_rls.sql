-- Phase 2: Row Level Security policies

alter table public.profiles enable row level security;
alter table public.subjects enable row level security;
alter table public.companies enable row level security;
alter table public.resources enable row level security;
alter table public.bookmarks enable row level security;
alter table public.resource_views enable row level security;
alter table public.resource_downloads enable row level security;

-- Profiles: users read/update their own; admins read all.
create policy "profiles_select_own" on public.profiles
  for select using (auth.uid() = id or public.is_admin());
create policy "profiles_update_own" on public.profiles
  for update using (auth.uid() = id);

-- Subjects & companies: public read; only admins write.
create policy "subjects_public_read" on public.subjects for select using (true);
create policy "subjects_admin_write" on public.subjects
  for all using (public.is_admin()) with check (public.is_admin());

create policy "companies_public_read" on public.companies for select using (true);
create policy "companies_admin_write" on public.companies
  for all using (public.is_admin()) with check (public.is_admin());

-- Resources: anyone reads PUBLISHED; admins read/write everything.
create policy "resources_public_read_published" on public.resources
  for select using (published = true or public.is_admin());
create policy "resources_admin_write" on public.resources
  for all using (public.is_admin()) with check (public.is_admin());

-- Bookmarks: users manage their own only.
create policy "bookmarks_select_own" on public.bookmarks
  for select using (auth.uid() = user_id);
create policy "bookmarks_insert_own" on public.bookmarks
  for insert with check (auth.uid() = user_id);
create policy "bookmarks_delete_own" on public.bookmarks
  for delete using (auth.uid() = user_id);

-- Views: anyone (incl. anon) can insert; users read their own, admins read all.
create policy "views_insert_any" on public.resource_views for insert with check (true);
create policy "views_select_own_or_admin" on public.resource_views
  for select using (auth.uid() = user_id or public.is_admin());

-- Downloads: same pattern.
create policy "downloads_insert_any" on public.resource_downloads for insert with check (true);
create policy "downloads_select_own_or_admin" on public.resource_downloads
  for select using (auth.uid() = user_id or public.is_admin());
