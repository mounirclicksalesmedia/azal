import { createSupabaseAdminClient } from '@/lib/supabase/admin';
import { verifyStaffSession } from '@/lib/dashboard/dal';
import FunnelChart from './components/FunnelChart';
import type { Lead, LeadStatus, LeadSource } from '@/lib/supabase/types';

export const dynamic = 'force-dynamic';

const FUNNEL_STAGES: { stage: string; statuses: LeadStatus[] }[] = [
  { stage: 'Captured',  statuses: ['new', 'contacted', 'answered', 'no_answer', 'booked', 'showed_up', 'no_show', 'won', 'lost'] },
  { stage: 'Contacted', statuses: ['contacted', 'answered', 'no_answer', 'booked', 'showed_up', 'no_show', 'won', 'lost'] },
  { stage: 'Answered',  statuses: ['answered', 'booked', 'showed_up', 'no_show', 'won', 'lost'] },
  { stage: 'Booked',    statuses: ['booked', 'showed_up', 'no_show', 'won', 'lost'] },
  { stage: 'Showed up', statuses: ['showed_up', 'won', 'lost'] },
  { stage: 'Won',       statuses: ['won'] },
];

export default async function ReportsPage({
  searchParams,
}: {
  searchParams: Promise<{ from?: string; to?: string }>;
}) {
  const { from, to } = await searchParams;
  const fromDate = from || isoDaysAgo(30);
  const toDate = to || new Date().toISOString().slice(0, 10);

  await verifyStaffSession();
  const supabase = createSupabaseAdminClient();

  const { data: leads } = await supabase
    .from('leads')
    .select('*')
    .gte('created_at', `${fromDate}T00:00:00`)
    .lte('created_at', `${toDate}T23:59:59`)
    .order('created_at', { ascending: false });

  const allLeads = (leads ?? []) as Lead[];
  const total = allLeads.length;

  const funnel = FUNNEL_STAGES.map(({ stage, statuses }) => {
    const count = allLeads.filter((l) => statuses.includes(l.status)).length;
    const rate = total > 0 ? Math.round((count / total) * 100) : 0;
    return { stage, count, rate };
  });

  const sources = groupCount(allLeads, (l) => l.source);

  return (
    <>
      <header className="dash-page-head">
        <div>
          <div className="dash-eyebrow">Reports</div>
          <h1 className="dash-title">Performance breakdown</h1>
          <p className="dash-subtitle">
            Filter the date range to compare conversion across periods. Numbers reflect
            leads captured during the selected window.
          </p>
        </div>

        <form
          method="get"
          className="dash-date-form"
        >
          <input
            type="date"
            name="from"
            defaultValue={fromDate}
            className="dash-input"
          />
          <span className="dash-range-separator">→</span>
          <input
            type="date"
            name="to"
            defaultValue={toDate}
            className="dash-input"
          />
          <button type="submit" className="dash-btn dash-btn-primary">
            Apply
          </button>
        </form>
      </header>

      <section className="dash-kpis">
        <KpiCard label="Leads in range" value={total} meta={`${fromDate} → ${toDate}`} />
        <KpiCard
          label="Booking rate"
          value={`${rateOf(allLeads, ['booked', 'showed_up', 'no_show', 'won', 'lost'])}%`}
          meta="Captured → Booked"
        />
        <KpiCard
          label="Show rate"
          value={`${rateOf(
            allLeads.filter((l) =>
              ['booked', 'showed_up', 'no_show', 'won', 'lost'].includes(l.status),
            ),
            ['showed_up', 'won', 'lost'],
          )}%`}
          meta="Booked → Showed"
        />
        <KpiCard
          label="Win rate"
          value={`${rateOf(allLeads, ['won'])}%`}
          meta="Captured → Won"
          tone="dark"
        />
      </section>

      <section className="dash-card">
        <div className="dash-section-head">
          <div>
            <div className="dash-section-title">Funnel</div>
            <div className="dash-section-meta">Drop-off across stages</div>
          </div>
        </div>
        <FunnelChart data={funnel} />
      </section>

      <section className="dash-card">
        <div className="dash-section-head">
          <div>
            <div className="dash-section-title">Sources</div>
            <div className="dash-section-meta">Where leads come from</div>
          </div>
        </div>
        <table className="dash-table dash-table-spaced">
          <thead>
            <tr>
              <th>Source</th>
              <th style={{ width: 100 }}>Leads</th>
              <th style={{ width: 100 }}>Share</th>
            </tr>
          </thead>
          <tbody>
            {sources.length === 0 ? (
              <tr>
                <td colSpan={3} className="dash-empty">
                  No data in this range.
                </td>
              </tr>
            ) : (
              sources.map((s) => (
                <tr key={s.key}>
                  <td className="dash-capitalize">{s.key}</td>
                  <td className="dash-mono">{s.count}</td>
                  <td className="dash-mono">
                    {total > 0 ? Math.round((s.count / total) * 100) : 0}%
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </section>
    </>
  );
}

function KpiCard({
  label,
  value,
  meta,
  tone,
}: {
  label: string;
  value: string | number;
  meta?: string;
  tone?: 'dark';
}) {
  return (
    <div className="dash-card" data-tone={tone}>
      <div className="dash-kpi-label">{label}</div>
      <div className="dash-kpi-value">{value}</div>
      {meta ? <div className="dash-kpi-meta">{meta}</div> : null}
    </div>
  );
}

function isoDaysAgo(days: number) {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return d.toISOString().slice(0, 10);
}

function rateOf(leads: Lead[], counted: LeadStatus[]) {
  if (leads.length === 0) return 0;
  const hits = leads.filter((l) => counted.includes(l.status)).length;
  return Math.round((hits / leads.length) * 100);
}

function groupCount<T>(arr: T[], key: (item: T) => string) {
  const m = new Map<string, number>();
  for (const item of arr) {
    const k = key(item);
    m.set(k, (m.get(k) ?? 0) + 1);
  }
  return Array.from(m.entries())
    .map(([key, count]) => ({ key: key as LeadSource | string, count }))
    .sort((a, b) => b.count - a.count);
}
