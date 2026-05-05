-- Azal / Rawajeh — leads + dashboard schema
-- Paste this into Supabase SQL Editor and run.
-- Idempotent: safe to re-run.

-- ─────────────────────────────────────────────────────────
-- 1. Enums
-- ─────────────────────────────────────────────────────────
do $$
begin
  if not exists (select 1 from pg_type where typname = 'lead_status') then
    create type lead_status as enum (
      'new',
      'contacted',
      'answered',
      'no_answer',
      'booked',
      'showed_up',
      'no_show',
      'won',
      'lost'
    );
  end if;

  if not exists (select 1 from pg_type where typname = 'app_role') then
    create type app_role as enum ('admin', 'agent', 'viewer');
  end if;

  if not exists (select 1 from pg_type where typname = 'lead_source') then
    create type lead_source as enum ('website', 'whatsapp', 'phone', 'referral', 'other');
  end if;
end$$;

-- ─────────────────────────────────────────────────────────
-- 2. Profiles  (mirrors auth.users)
-- ─────────────────────────────────────────────────────────
create table if not exists public.profiles (
  id          uuid primary key references auth.users(id) on delete cascade,
  email       text unique not null,
  full_name   text,
  role        app_role not null default 'viewer',
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- Auto-create a profile when an auth user is created.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name, role)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    -- bootstrap admins
    case
      when new.email in ('clicksalesmedia@gmail.com', 'admin@rawajeh.com')
        then 'admin'::app_role
      else 'viewer'::app_role
    end
  )
  on conflict (id) do update
    set email = excluded.email;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Backfill profile rows for any auth.users that already exist
-- (so users created before this migration also get a profile + correct role).
insert into public.profiles (id, email, full_name, role)
select
  u.id,
  u.email,
  coalesce(u.raw_user_meta_data->>'full_name', split_part(u.email, '@', 1)),
  case
    when u.email in ('clicksalesmedia@gmail.com', 'admin@rawajeh.com')
      then 'admin'::app_role
    else 'viewer'::app_role
  end
from auth.users u
on conflict (id) do update
  set role = excluded.role,
      email = excluded.email;

-- ─────────────────────────────────────────────────────────
-- 3. Leads
-- ─────────────────────────────────────────────────────────
create table if not exists public.leads (
  id            uuid primary key default gen_random_uuid(),
  full_name     text not null,
  phone         text not null,
  email         text not null,
  booking_date  date,
  language      text default 'en' check (language in ('en', 'ar')),
  source        lead_source not null default 'website',
  status        lead_status not null default 'new',
  notes         text,
  assigned_to   uuid references public.profiles(id) on delete set null,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create index if not exists leads_status_idx       on public.leads (status);
create index if not exists leads_created_at_idx   on public.leads (created_at desc);
create index if not exists leads_assigned_to_idx  on public.leads (assigned_to);
create index if not exists leads_booking_date_idx on public.leads (booking_date);

-- ─────────────────────────────────────────────────────────
-- 4. Status events (audit trail)
-- ─────────────────────────────────────────────────────────
create table if not exists public.lead_status_events (
  id          uuid primary key default gen_random_uuid(),
  lead_id     uuid not null references public.leads(id) on delete cascade,
  from_status lead_status,
  to_status   lead_status not null,
  note        text,
  changed_by  uuid references public.profiles(id) on delete set null,
  changed_at  timestamptz not null default now()
);

create index if not exists status_events_lead_idx on public.lead_status_events (lead_id, changed_at desc);

-- Auto-record an event whenever leads.status changes (or on insert).
create or replace function public.log_lead_status_change()
returns trigger
language plpgsql
as $$
begin
  if (tg_op = 'INSERT') then
    insert into public.lead_status_events (lead_id, from_status, to_status, changed_by)
    values (new.id, null, new.status, new.assigned_to);
    return new;
  elsif (tg_op = 'UPDATE') and new.status is distinct from old.status then
    insert into public.lead_status_events (lead_id, from_status, to_status, changed_by)
    values (new.id, old.status, new.status, new.assigned_to);
    new.updated_at := now();
    return new;
  end if;
  new.updated_at := now();
  return new;
end;
$$;

drop trigger if exists on_lead_change on public.leads;
create trigger on_lead_change
  before insert or update on public.leads
  for each row execute function public.log_lead_status_change();

-- ─────────────────────────────────────────────────────────
-- 5. RLS — locked down by default, server uses secret key
-- ─────────────────────────────────────────────────────────
alter table public.profiles            enable row level security;
alter table public.leads               enable row level security;
alter table public.lead_status_events  enable row level security;

-- Profiles: any signed-in user reads their own; admins read all.
drop policy if exists "profiles self read"  on public.profiles;
drop policy if exists "profiles admin read" on public.profiles;
drop policy if exists "profiles self update" on public.profiles;

create policy "profiles self read" on public.profiles
  for select using (auth.uid() = id);

create policy "profiles admin read" on public.profiles
  for select using (
    exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin')
  );

create policy "profiles self update" on public.profiles
  for update using (auth.uid() = id) with check (auth.uid() = id);

-- Leads: signed-in admins/agents read & write everything.
-- The website form INSERT is done with the secret key (server route), so no anon insert policy is needed.
drop policy if exists "leads staff read"   on public.leads;
drop policy if exists "leads staff write"  on public.leads;
drop policy if exists "leads staff update" on public.leads;
drop policy if exists "leads staff delete" on public.leads;

create policy "leads staff read" on public.leads
  for select using (
    exists (select 1 from public.profiles p where p.id = auth.uid() and p.role in ('admin','agent','viewer'))
  );

create policy "leads staff write" on public.leads
  for insert with check (
    exists (select 1 from public.profiles p where p.id = auth.uid() and p.role in ('admin','agent'))
  );

create policy "leads staff update" on public.leads
  for update using (
    exists (select 1 from public.profiles p where p.id = auth.uid() and p.role in ('admin','agent'))
  );

create policy "leads staff delete" on public.leads
  for delete using (
    exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin')
  );

-- Status events: same staff read; inserts only via trigger (table is read-only to clients).
drop policy if exists "status events staff read" on public.lead_status_events;
create policy "status events staff read" on public.lead_status_events
  for select using (
    exists (select 1 from public.profiles p where p.id = auth.uid() and p.role in ('admin','agent','viewer'))
  );

-- ─────────────────────────────────────────────────────────
-- 6. Helpful views for the dashboard
-- ─────────────────────────────────────────────────────────
create or replace view public.lead_kpis as
select
  count(*)::int                                                                          as total,
  count(*) filter (where created_at >= date_trunc('day', now()))::int                    as today,
  count(*) filter (where created_at >= date_trunc('day', now() - interval '7 days'))::int as last_7d,
  count(*) filter (where status = 'booked')::int                                         as booked,
  count(*) filter (where status = 'showed_up')::int                                      as showed_up,
  count(*) filter (where status = 'no_show')::int                                        as no_show,
  count(*) filter (where status = 'won')::int                                            as won,
  count(*) filter (where status = 'lost')::int                                           as lost
from public.leads;

create or replace view public.leads_by_day as
select
  date_trunc('day', created_at)::date as day,
  count(*)::int                       as count
from public.leads
where created_at >= now() - interval '60 days'
group by 1
order by 1;

create or replace view public.leads_by_status as
select status, count(*)::int as count
from public.leads
group by status;

-- views inherit the table RLS — no extra grants needed.
