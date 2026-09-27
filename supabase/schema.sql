-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Projects table
create table if not exists public.projects (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  description text,
  techstack text[] default '{}',
  images text[] default '{}',
  videourl text,
  githuburl text,
  liveurl text,
  ratings jsonb default '[]',
  averagerating numeric default 0,
  comments jsonb default '[]',
  createdat timestamptz default now(),
  featured boolean default false,
  visible boolean default true
);

-- Blogs table
create table if not exists public.blogs (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  slug text unique not null,
  content text,
  excerpt text,
  coverimage text,
  category text,
  tags text[] default '{}',
  comments jsonb default '[]',
  createdat timestamptz default now(),
  published boolean default true
);

-- Site settings table
create table if not exists public.site_settings (
  id text primary key default 'site-settings',
  herotitle text,
  herosubtitle text,
  abouttext text,
  skills jsonb default '[]',
  sociallinks jsonb default '[]',
  profileimage text default '/sa-1.png',
  cvurl text,
  email text,
  phone text,
  location text,
  name text,
  bio text,
  avatarurl text default '/sa-1.png',
  sitetitle text,
  tagline text
);

-- Messages table
create table if not exists public.messages (
  id uuid default gen_random_uuid() primary key,
  name text,
  email text,
  message text,
  createdat timestamptz default now(),
  read boolean default false,
  response text
);

-- Contacts table
create table if not exists public.contacts (
  id uuid default gen_random_uuid() primary key,
  name text,
  email text,
  message text,
  createdat timestamptz default now()
);

-- Insert default site settings if not exists
insert into public.site_settings (id, herotitle, herosubtitle, abouttext, email, phone, location, name, tagline)
values ('site-settings', 'SA-Tech Startup', 'We build clear, reliable digital products for ambitious businesses and growing teams.', 'SA-Tech Startup combines thoughtful design, modern engineering, and practical strategy to help businesses launch and grow online.', 'dagia2061@gmail.com', '+251-996-881-232', 'Addis Ababa, Ethiopia', 'SA-Tech Startup', 'Digital products and technology services')
on conflict (id) do nothing;

-- Insert default social links if not exists
update public.site_settings
set sociallinks = '[{"platform":"GitHub","url":"https://github.com","icon":"github"},{"platform":"LinkedIn","url":"https://linkedin.com","icon":"linkedin"},{"platform":"Twitter","url":"https://twitter.com","icon":"twitter"},{"platform":"YouTube","url":"https://youtube.com","icon":"youtube"}]'
where id = 'site-settings'
and sociallinks is null;

-- Revoke default execute on RLS function
revoke execute on function public.rls_auto_enable() from public, anon, authenticated;

-- Drop old policies if they exist
drop policy if exists "public can read visible projects" on public.projects;
drop policy if exists "admins can manage projects" on public.projects;
drop policy if exists "public can read published blogs" on public.blogs;
drop policy if exists "admins can manage blogs" on public.blogs;
drop policy if exists "public can read site settings" on public.site_settings;
drop policy if exists "admins can manage site settings" on public.site_settings;
drop policy if exists "public can submit messages" on public.messages;
drop policy if exists "admins can manage messages" on public.messages;
drop policy if exists "public can submit contacts" on public.contacts;
drop policy if exists "admins can manage contacts" on public.contacts;

-- Projects policies
create policy "public can read visible projects"
  on public.projects for select
  to anon, authenticated
  using (visible = true or (select coalesce(auth.jwt() -> 'app_metadata' ->> 'role', '') = 'admin'));

create policy "admins can manage projects"
  on public.projects for all
  to authenticated
  using ((select coalesce(auth.jwt() -> 'app_metadata' ->> 'role', '') = 'admin'))
  with check ((select coalesce(auth.jwt() -> 'app_metadata' ->> 'role', '') = 'admin'));

-- Blogs policies
create policy "public can read published blogs"
  on public.blogs for select
  to anon, authenticated
  using (published = true or (select coalesce(auth.jwt() -> 'app_metadata' ->> 'role', '') = 'admin'));

create policy "admins can manage blogs"
  on public.blogs for all
  to authenticated
  using ((select coalesce(auth.jwt() -> 'app_metadata' ->> 'role', '') = 'admin'))
  with check ((select coalesce(auth.jwt() -> 'app_metadata' ->> 'role', '') = 'admin'));

-- Site settings policies
create policy "public can read site settings"
  on public.site_settings for select
  to anon, authenticated
  using (true);

create policy "admins can manage site settings"
  on public.site_settings for all
  to authenticated
  using ((select coalesce(auth.jwt() -> 'app_metadata' ->> 'role', '') = 'admin'))
  with check ((select coalesce(auth.jwt() -> 'app_metadata' ->> 'role', '') = 'admin'));

-- Messages policies
create policy "public can submit messages"
  on public.messages for insert
  to anon, authenticated
  with check (true);

create policy "admins can manage messages"
  on public.messages for all
  to authenticated
  using ((select coalesce(auth.jwt() -> 'app_metadata' ->> 'role', '') = 'admin'))
  with check ((select coalesce(auth.jwt() -> 'app_metadata' ->> 'role', '') = 'admin'));

-- Contacts policies
create policy "public can submit contacts"
  on public.contacts for insert
  to anon, authenticated
  with check (true);

create policy "admins can manage contacts"
  on public.contacts for all
  to authenticated
  using ((select coalesce(auth.jwt() -> 'app_metadata' ->> 'role', '') = 'admin'))
  with check ((select coalesce(auth.jwt() -> 'app_metadata' ->> 'role', '') = 'admin'));
