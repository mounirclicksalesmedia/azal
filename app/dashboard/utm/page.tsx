import { headers } from 'next/headers';
import { createSupabaseAdminClient } from '@/lib/supabase/admin';
import { verifyStaffSession } from '@/lib/dashboard/dal';
import { resolveProject } from '@/lib/dashboard/project';
import { PROJECT_LABEL, type UtmLink } from '@/lib/supabase/types';
import UtmCreateForm from './components/UtmCreateForm';
import UtmTable from './components/UtmTable';

export const dynamic = 'force-dynamic';

export default async function UtmPage({
  searchParams,
}: {
  searchParams: Promise<{ project?: string }>;
}) {
  const profile = await verifyStaffSession();
  const sp = await searchParams;
  const project = resolveProject(sp);
  const supabase = createSupabaseAdminClient();

  // Best-effort origin for building public URLs (falls back to azal.sa).
  const h = await headers();
  const host = h.get('x-forwarded-host') ?? h.get('host');
  const proto = h.get('x-forwarded-proto') ?? 'https';
  const origin = host ? `${proto}://${host}` : 'https://azal.sa';

  const { data: links } = await supabase
    .from('utm_links')
    .select('*')
    .eq('project', project)
    .order('archived_at', { ascending: true, nullsFirst: true })
    .order('created_at', { ascending: false });

  const { data: leadCountsRaw } = await supabase
    .from('leads')
    .select('utm_link_id')
    .eq('project', project)
    .not('utm_link_id', 'is', null);

  const leadCounts = new Map<string, number>();
  for (const row of (leadCountsRaw ?? []) as { utm_link_id: string }[]) {
    leadCounts.set(row.utm_link_id, (leadCounts.get(row.utm_link_id) ?? 0) + 1);
  }

  const canEdit = profile.role !== 'viewer';

  return (
    <>
      <header className="dash-page-head">
        <div>
          <div className="dash-eyebrow">{PROJECT_LABEL[project]} · UTM links</div>
          <h1 className="dash-title">Campaign tracking</h1>
          <p className="dash-subtitle">
            Tagged URLs to share on each channel. Every lead captured through one of
            these links is attributed back to it.
          </p>
        </div>
      </header>

      {canEdit ? <UtmCreateForm project={project} /> : null}

      <UtmTable
        links={(links ?? []) as UtmLink[]}
        leadCounts={Object.fromEntries(leadCounts)}
        origin={origin}
        canEdit={canEdit}
      />
    </>
  );
}
