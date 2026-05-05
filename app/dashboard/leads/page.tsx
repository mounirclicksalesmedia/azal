import { createSupabaseAdminClient } from '@/lib/supabase/admin';
import { verifyStaffSession } from '@/lib/dashboard/dal';
import LeadsTable from './components/LeadsTable';
import type { Lead, LeadStatusEvent } from '@/lib/supabase/types';

export const dynamic = 'force-dynamic';

export default async function LeadsPage() {
  const profile = await verifyStaffSession();
  const supabase = createSupabaseAdminClient();

  const [{ data: leads }, { data: events }] = await Promise.all([
    supabase
      .from('leads')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(500),
    supabase
      .from('lead_status_events')
      .select('*')
      .order('changed_at', { ascending: false })
      .limit(2000),
  ]);

  return (
    <>
      <header className="dash-page-head">
        <div>
          <div className="dash-eyebrow">Leads</div>
          <h1 className="dash-title">All submissions</h1>
          <p className="dash-subtitle">
            Click a row to see history and update status. Notes save automatically when
            you click out of the field.
          </p>
        </div>
      </header>

      <LeadsTable
        leads={(leads ?? []) as Lead[]}
        events={(events ?? []) as LeadStatusEvent[]}
        canEdit={profile.role !== 'viewer'}
      />
    </>
  );
}
