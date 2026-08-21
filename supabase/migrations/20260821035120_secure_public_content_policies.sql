revoke execute on function public.rls_auto_enable() from public, anon, authenticated;

drop policy if exists "public can read visible projects" on public.projects;
drop policy if exists "admins can manage projects" on public.projects;
create policy "public can read visible projects" on public.projects
	for select to anon, authenticated
	using (visible = true or (select coalesce(auth.jwt() -> 'app_metadata' ->> 'role', '')) = 'admin');
create policy "admins can manage projects" on public.projects
	for all to authenticated
	using ((select coalesce(auth.jwt() -> 'app_metadata' ->> 'role', '')) = 'admin')
	with check ((select coalesce(auth.jwt() -> 'app_metadata' ->> 'role', '')) = 'admin');

drop policy if exists "public can read published blogs" on public.blogs;
drop policy if exists "admins can manage blogs" on public.blogs;
create policy "public can read published blogs" on public.blogs
	for select to anon, authenticated
	using (published = true or (select coalesce(auth.jwt() -> 'app_metadata' ->> 'role', '')) = 'admin');
create policy "admins can manage blogs" on public.blogs
	for all to authenticated
	using ((select coalesce(auth.jwt() -> 'app_metadata' ->> 'role', '')) = 'admin')
	with check ((select coalesce(auth.jwt() -> 'app_metadata' ->> 'role', '')) = 'admin');

drop policy if exists "public can read site settings" on public.site_settings;
drop policy if exists "admins can manage site settings" on public.site_settings;
create policy "public can read site settings" on public.site_settings
	for select to anon, authenticated using (true);
create policy "admins can manage site settings" on public.site_settings
	for all to authenticated
	using ((select coalesce(auth.jwt() -> 'app_metadata' ->> 'role', '')) = 'admin')
	with check ((select coalesce(auth.jwt() -> 'app_metadata' ->> 'role', '')) = 'admin');

drop policy if exists "public can submit messages" on public.messages;
drop policy if exists "admins can manage messages" on public.messages;
create policy "public can submit messages" on public.messages
	for insert to anon, authenticated with check (true);
create policy "admins can manage messages" on public.messages
	for all to authenticated
	using ((select coalesce(auth.jwt() -> 'app_metadata' ->> 'role', '')) = 'admin')
	with check ((select coalesce(auth.jwt() -> 'app_metadata' ->> 'role', '')) = 'admin');

drop policy if exists "public can submit contacts" on public.contacts;
drop policy if exists "admins can manage contacts" on public.contacts;
create policy "public can submit contacts" on public.contacts
	for insert to anon, authenticated with check (true);
create policy "admins can manage contacts" on public.contacts
	for all to authenticated
	using ((select coalesce(auth.jwt() -> 'app_metadata' ->> 'role', '')) = 'admin')
	with check ((select coalesce(auth.jwt() -> 'app_metadata' ->> 'role', '')) = 'admin');
