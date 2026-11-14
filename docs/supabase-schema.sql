-- Antastha Studio CMS — run this entire file in Supabase SQL Editor.
-- RLS is enabled on every public table. No anonymous write access is granted.

create extension if not exists pgcrypto;

create table if not exists public.admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

create or replace function public.is_antastha_admin()
returns boolean
language sql stable security definer
set search_path = public
as $$
  select exists (select 1 from public.admin_users where user_id = auth.uid());
$$;
revoke all on function public.is_antastha_admin() from public;
grant execute on function public.is_antastha_admin() to anon, authenticated;

create table if not exists public.content_items (
  id uuid primary key default gen_random_uuid(),
  type text not null check (type in ('project','photography','product','video','award')),
  title text not null,
  title_bn text,
  slug text not null unique,
  description text,
  description_bn text,
  image_url text,
  image_alt text,
  seo_title text,
  seo_description text,
  external_url text,
  sort_order integer not null default 0,
  is_published boolean not null default false,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists content_items_public_order on public.content_items(type,is_published,sort_order);

create table if not exists public.site_settings (
  key text primary key,
  value text not null,
  updated_by uuid references auth.users(id) on delete set null,
  updated_at timestamptz not null default now()
);
insert into public.site_settings(key,value) values
 ('site_name','Antastha Studio'),('site_name_bn','অন্তস্থ'),('default_language','en')
on conflict (key) do nothing;

alter table public.admin_users enable row level security;
alter table public.content_items enable row level security;
alter table public.site_settings enable row level security;

drop policy if exists "Admins can read admin allowlist" on public.admin_users;
create policy "Admins can read admin allowlist" on public.admin_users
for select to authenticated using (public.is_antastha_admin());

 drop policy if exists "Public can read published content" on public.content_items;
create policy "Public can read published content" on public.content_items
for select to anon, authenticated using (is_published or public.is_antastha_admin());
drop policy if exists "Admins can insert content" on public.content_items;
create policy "Admins can insert content" on public.content_items
for insert to authenticated with check (public.is_antastha_admin());
drop policy if exists "Admins can update content" on public.content_items;
create policy "Admins can update content" on public.content_items
for update to authenticated using (public.is_antastha_admin()) with check (public.is_antastha_admin());
drop policy if exists "Admins can delete content" on public.content_items;
create policy "Admins can delete content" on public.content_items
for delete to authenticated using (public.is_antastha_admin());

drop policy if exists "Public can read site settings" on public.site_settings;
create policy "Public can read site settings" on public.site_settings
for select to anon, authenticated using (true);
drop policy if exists "Admins can insert site settings" on public.site_settings;
create policy "Admins can insert site settings" on public.site_settings
for insert to authenticated with check (public.is_antastha_admin());
drop policy if exists "Admins can update site settings" on public.site_settings;
create policy "Admins can update site settings" on public.site_settings
for update to authenticated using (public.is_antastha_admin()) with check (public.is_antastha_admin());

-- Public image delivery; only allowlisted admins can upload, update or delete.
insert into storage.buckets(id,name,public,file_size_limit,allowed_mime_types)
values ('antastha-media','antastha-media',true,12582912,array['image/jpeg','image/png','image/webp','image/gif','image/avif'])
on conflict (id) do update set public=true,file_size_limit=12582912,allowed_mime_types=excluded.allowed_mime_types;

drop policy if exists "Public can view Antastha media" on storage.objects;
create policy "Public can view Antastha media" on storage.objects
for select to anon, authenticated using (bucket_id='antastha-media');
drop policy if exists "Admins can upload Antastha media" on storage.objects;
create policy "Admins can upload Antastha media" on storage.objects
for insert to authenticated with check (bucket_id='antastha-media' and public.is_antastha_admin());
drop policy if exists "Admins can update Antastha media" on storage.objects;
create policy "Admins can update Antastha media" on storage.objects
for update to authenticated using (bucket_id='antastha-media' and public.is_antastha_admin()) with check (bucket_id='antastha-media' and public.is_antastha_admin());
drop policy if exists "Admins can delete Antastha media" on storage.objects;
create policy "Admins can delete Antastha media" on storage.objects
for delete to authenticated using (bucket_id='antastha-media' and public.is_antastha_admin());

-- IMPORTANT: after inviting your own account in Authentication > Users,
-- run this separately with your actual Auth user UUID:
-- insert into public.admin_users(user_id) values ('YOUR-AUTH-USER-UUID');

-- Safe migration for projects where content_items was created before SEO fields were added.
alter table public.content_items add column if not exists image_alt text;
alter table public.content_items add column if not exists seo_title text;
alter table public.content_items add column if not exists seo_description text;
