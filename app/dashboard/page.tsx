import Link from 'next/link';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import StatusBadge from './components/StatusBadge';
import LeadsOverTimeChart from './components/LeadsOverTimeChart';
import StatusPieChart from './components/StatusPieChart';
import type { Lead, LeadStatus } from '@/lib/supabase/types';

type KpiRow = {
  total: number;
  today: number;
  last_7d: number;
  booked: number;
  showed_up: number;
  no_show: number;
  won: number;
  lost: number;
};

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  const supabase = await createSupabaseServerClient();

  const [{ data: kpiRows }, { data: byDay }, { data: byStatus }, { data: recent }] =
    await Promise.all([
      supabase.from('lead_kpis').select('*').limit(1),
      supabase.from('leads_by_day').select('day, count'),
      supabase.from('leads_by_status').select('status, count'),
      supabase
        .from('leads')
        .select('id, full_name, phone, email, booking_date, status, source, created_at')
        .order('created_at', { ascending: false })
        .limit(8),
    ]);

  const kpi: KpiRow =
    (kpiRows?.[0] as KpiRow | undefined) ?? {
      total: 0,
      today: 0,
      last_7d: 0,
      booked: 0,
      showed_up: 0,
      no_show: 0,
      won: 0,
      lost: 0,
    };

  const conversion = kpi.total > 0 ? Math.round((kpi.won / kpi.total) * 100) : 0;
  const showRate =
    kpi.booked > 0 ? Math.round((kpi.showed_up / kpi.booked) * 100) : 0;

  return (
    <>
      <header className="dash-page-head">
        <div>
          <div className="dash-eyebrow">Overview</div>
          <h1 className="dash-title">Pipeline at a glance</h1>
          <p className="dash-subtitle">
            Live data from Supabase — leads captured from azal.sa, booking outcomes,
            and conversion across the funnel.
          </p>
        </div>
        <Link href="/dashboard/leads" className="dash-btn dash-btn-primary">
          View all leads
        </Link>
      </header>

      <section className="dash-kpis">
        <Kpi label="Total leads" value={kpi.total} meta="All time" />
        <Kpi label="Today" value={kpi.today} meta="Captured today" />
        <Kpi label="Last 7 days" value={kpi.last_7d} meta="Rolling window" />
        <Kpi label="Booked" value={kpi.booked} meta="Awaiting visit" tone="dark" />
        <Kpi
          label="Show rate"
          value={`${showRate}%`}
          meta={`${kpi.showed_up} of ${kpi.booked} booked`}
        />
        <Kpi
          label="Conversion"
          value={`${conversion}%`}
          meta={`${kpi.won} won / ${kpi.lost} lost`}
        />
      </section>

      <section className="dash-row-2">
        <div className="dash-card">
          <div className="dash-section-head">
            <div>
              <div className="dash-section-title">Leads over time</div>
              <div className="dash-section-meta">Last 60 days</div>
            </div>
          </div>
          <LeadsOverTimeChart data={(byDay ?? []) as { day: string; count: number }[]} />
        </div>

        <div className="dash-card">
          <div className="dash-section-head">
            <div>
              <div className="dash-section-title">Status mix</div>
              <div className="dash-section-meta">Pipeline breakdown</div>
            </div>
          </div>
          <StatusPieChart
            data={(byStatus ?? []) as { status: LeadStatus; count: number }[]}
          />
        </div>
      </section>

      <section>
        <div className="dash-section-head">
          <div className="dash-section-title">Recent leads</div>
          <Link href="/dashboard/leads" className="dash-section-meta">
            View all →
          </Link>
        </div>
        <div className="dash-table-wrap">
          {recent && recent.length > 0 ? (
            <table className="dash-table">
              <thead>
                <tr>
                  <th>Created</th>
                  <th>Name</th>
                  <th>Phone</th>
                  <th>Booking</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {(recent as Lead[]).map((l) => (
                  <tr key={l.id}>
                    <td className="dash-mono">
                      {new Date(l.created_at).toLocaleDateString(undefined, {
                        month: 'short',
                        day: 'numeric',
                      })}
                    </td>
                    <td>{l.full_name}</td>
                    <td className="dash-mono" dir="ltr">
                      {l.phone}
                    </td>
                    <td className="dash-mono">{l.booking_date ?? '—'}</td>
                    <td>
                      <StatusBadge status={l.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="dash-empty">No leads yet — submissions will appear here.</div>
          )}
        </div>
      </section>
    </>
  );
}

function Kpi({
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
