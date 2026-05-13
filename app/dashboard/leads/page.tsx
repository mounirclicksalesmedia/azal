import { createSupabaseAdminClient } from '@/lib/supabase/admin';
import { verifyStaffSession } from '@/lib/dashboard/dal';
import { resolveProject } from '@/lib/dashboard/project';
import LeadsTable from './components/LeadsTable';
import { PROJECT_LABEL, type Lead, type LeadStatusEvent } from '@/lib/supabase/types';

export const dynamic = 'force-dynamic';

export default async function LeadsPage({
  searchParams,
}: {
  searchParams: Promise<{ project?: string }>;
}) {
  const profile = await verifyStaffSession();
  const sp = await searchParams;
  const project = resolveProject(sp);
  const supabase = createSupabaseAdminClient();

  const leadsRes = await supabase
    .from('leads')
    .select('*')
    .eq('project', project)
    .order('created_at', { ascending: false })
    .limit(500);

  const leadIds = (leadsRes.data ?? []).map((l) => l.id);
  const eventsRes = leadIds.length
    ? await supabase
        .from('lead_status_events')
        .select('*')
        .in('lead_id', leadIds)
        .order('changed_at', { ascending: false })
        .limit(2000)
    : { data: [] as LeadStatusEvent[] };

  return (
    <>
      <header className="dash-page-head">
        <div>
          <div className="dash-eyebrow">{PROJECT_LABEL[project]} · Leads</div>
          <h1 className="dash-title">All submissions</h1>
          <p className="dash-subtitle">
            Click a row to see history and update status. Notes save automatically when
            you click out of the field.
          </p>
        </div>
      </header>

      <LeadsTable
        leads={(leadsRes.data ?? []) as Lead[]}
        events={(eventsRes.data ?? []) as LeadStatusEvent[]}
        canEdit={profile.role !== 'viewer'}
        project={project}
      />
    </>
  );
}
