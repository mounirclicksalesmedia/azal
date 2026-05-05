-- Hot-fix: replace the recursive RLS policies on `profiles` and `leads`
-- with a SECURITY DEFINER role-lookup helper. Safe to re-run.
-- Paste this into Supabase → SQL Editor → Run.

-- 1) SECURITY DEFINER helper — bypasses RLS for the role lookup,
--    so policies on `leads` no longer recurse through `profiles`.
create or replace function public.current_user_role()
returns app_role
language sql
stable
security definer
set search_path = public
as $$
  select role from public.profiles where id = auth.uid();
$$;

revoke all on function public.current_user_role() from public;
grant execute on function public.current_user_role() to authenticated;

-- 2) Profiles: drop the recursive admin-read policy.
--    The "self read" policy is enough — admins still see their own row,
--    and cross-user reads happen server-side via the secret key.
drop policy if exists "profiles admin read" on public.profiles;

-- 3) Leads: rewrite policies to use the helper instead of `EXISTS (SELECT … FROM profiles)`.
drop policy if exists "leads staff read"   on public.leads;
drop policy if exists "leads staff write"  on public.leads;
drop policy if exists "leads staff update" on public.leads;
drop policy if exists "leads staff delete" on public.leads;

create policy "leads staff read" on public.leads
  for select using (public.current_user_role() in ('admin','agent','viewer'));

create policy "leads staff write" on public.leads
  for insert with check (public.current_user_role() in ('admin','agent'));

create policy "leads staff update" on public.leads
  for update using (public.current_user_role() in ('admin','agent'));

create policy "leads staff delete" on public.leads
  for delete using (public.current_user_role() = 'admin');

-- 4) Status events: same fix.
drop policy if exists "status events staff read" on public.lead_status_events;
create policy "status events staff read" on public.lead_status_events
  for select using (public.current_user_role() in ('admin','agent','viewer'));
