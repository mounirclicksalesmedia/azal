-- Hot-fix: the lead status-change trigger was BEFORE INSERT, which fired
-- before the leads row was committed. The status-event insert then failed
-- with a foreign-key violation (lead_id not yet in leads), so every
-- /api/leads submission returned 500.
--
-- Split into two triggers:
--   • BEFORE UPDATE → bumps leads.updated_at
--   • AFTER  INSERT/UPDATE → logs status events (row exists by then)
--
-- Paste into Supabase → SQL Editor → Run. Idempotent.

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

drop trigger if exists leads_set_updated_at on public.leads;
create trigger leads_set_updated_at
  before update on public.leads
  for each row execute function public.set_updated_at();

create or replace function public.log_lead_status_change()
returns trigger
language plpgsql
as $$
begin
  if (tg_op = 'INSERT') then
    insert into public.lead_status_events (lead_id, from_status, to_status, changed_by)
    values (new.id, null, new.status, new.assigned_to);
  elsif (tg_op = 'UPDATE') and new.status is distinct from old.status then
    insert into public.lead_status_events (lead_id, from_status, to_status, changed_by)
    values (new.id, old.status, new.status, new.assigned_to);
  end if;
  return null;
end;
$$;

-- Drop the old (BEFORE) trigger and the new name if it already exists.
drop trigger if exists on_lead_change on public.leads;
drop trigger if exists leads_log_status_change on public.leads;
create trigger leads_log_status_change
  after insert or update on public.leads
  for each row execute function public.log_lead_status_change();
