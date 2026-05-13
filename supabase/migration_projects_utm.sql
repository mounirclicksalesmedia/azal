-- Rawajeh portal — project isolation + UTM tracking.
-- Idempotent: safe to re-run.

-- ─────────────────────────────────────────────────────────
-- 1. leads.project (multi-project isolation)
-- ─────────────────────────────────────────────────────────
alter table public.leads
  add column if not exists project text not null default 'azal';

create index if not exists leads_project_idx on public.leads (project);

-- ─────────────────────────────────────────────────────────
-- 2. UTM fields on leads (capture per-submission attribution)
-- ─────────────────────────────────────────────────────────
alter table public.leads
  add column if not exists utm_source   text,
  add column if not exists utm_medium   text,
  add column if not exists utm_campaign text,
  add column if not exists utm_term     text,
  add column if not exists utm_content  text,
  add column if not exists utm_link_id  uuid,
  add column if not exists landing_page text,
  add column if not exists referrer     text;

create index if not exists leads_utm_source_idx   on public.leads (utm_source);
create index if not exists leads_utm_campaign_idx on public.leads (utm_campaign);
create index if not exists leads_utm_link_idx     on public.leads (utm_link_id);

-- ─────────────────────────────────────────────────────────
-- 3. utm_links — one row per shareable, tagged URL
-- ─────────────────────────────────────────────────────────
create table if not exists public.utm_links (
  id           uuid primary key default gen_random_uuid(),
  project      text not null,
  slug         text not null,
  name         text not null,
  source       text not null,
  medium       text not null,
  campaign     text not null,
  term         text,
  content      text,
  destination  text not null,            -- absolute or path, e.g. /azal/ar
  created_by   uuid references public.profiles(id) on delete set null,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now(),
  archived_at  timestamptz,
  unique (project, slug)
);

create index if not exists utm_links_project_idx on public.utm_links (project, archived_at);

-- FK from leads.utm_link_id → utm_links.id (added after the table exists)
do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'leads_utm_link_fk'
  ) then
    alter table public.leads
      add constraint leads_utm_link_fk
      foreign key (utm_link_id) references public.utm_links(id) on delete set null;
  end if;
end$$;

-- updated_at trigger reuses the existing helper
drop trigger if exists utm_links_set_updated_at on public.utm_links;
create trigger utm_links_set_updated_at
  before update on public.utm_links
  for each row execute function public.set_updated_at();

-- ─────────────────────────────────────────────────────────
-- 4. RLS for utm_links — staff read, admin/agent write, admin delete
-- ─────────────────────────────────────────────────────────
alter table public.utm_links enable row level security;

drop policy if exists "utm_links staff read"   on public.utm_links;
drop policy if exists "utm_links staff write"  on public.utm_links;
drop policy if exists "utm_links staff update" on public.utm_links;
drop policy if exists "utm_links staff delete" on public.utm_links;

create policy "utm_links staff read" on public.utm_links
  for select using (public.current_user_role() in ('admin','agent','viewer'));

create policy "utm_links staff write" on public.utm_links
  for insert with check (public.current_user_role() in ('admin','agent'));

create policy "utm_links staff update" on public.utm_links
  for update using (public.current_user_role() in ('admin','agent'));

create policy "utm_links staff delete" on public.utm_links
  for delete using (public.current_user_role() = 'admin');

-- ─────────────────────────────────────────────────────────
-- 5. Project-aware views
-- ─────────────────────────────────────────────────────────
create or replace view public.lead_kpis_by_project as
select
  project,
  count(*)::int                                                                          as total,
  count(*) filter (where created_at >= date_trunc('day', now()))::int                    as today,
  count(*) filter (where created_at >= date_trunc('day', now() - interval '7 days'))::int as last_7d,
  count(*) filter (where status = 'booked')::int                                         as booked,
  count(*) filter (where status = 'showed_up')::int                                      as showed_up,
  count(*) filter (where status = 'no_show')::int                                        as no_show,
  count(*) filter (where status = 'won')::int                                            as won,
  count(*) filter (where status = 'lost')::int                                           as lost
from public.leads
group by project;

create or replace view public.leads_by_day_by_project as
select
  project,
  date_trunc('day', created_at)::date as day,
  count(*)::int                       as count
from public.leads
where created_at >= now() - interval '60 days'
group by project, 1
order by project, 1;

create or replace view public.leads_by_status_by_project as
select project, status, count(*)::int as count
from public.leads
group by project, status;

-- ─────────────────────────────────────────────────────────
-- 6. Seed Azal social UTM links — Instagram, X, Google Ads, TikTok, Snapchat
-- ─────────────────────────────────────────────────────────
insert into public.utm_links (project, slug, name, source, medium, campaign, destination)
values
  ('azal', 'instagram',  'Azal — Instagram',  'instagram',  'social', 'azal_launch', '/azal/ar'),
  ('azal', 'x',          'Azal — X',          'x',          'social', 'azal_launch', '/azal/ar'),
  ('azal', 'google-ads', 'Azal — Google Ads', 'google',     'cpc',    'azal_launch', '/azal/ar'),
  ('azal', 'tiktok',     'Azal — TikTok',     'tiktok',     'social', 'azal_launch', '/azal/ar'),
  ('azal', 'snapchat',   'Azal — Snapchat',   'snapchat',   'social', 'azal_launch', '/azal/ar')
on conflict (project, slug) do nothing;
