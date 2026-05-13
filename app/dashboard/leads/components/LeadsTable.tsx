'use client';

import { useMemo, useState } from 'react';
import {
  STATUS_META,
  STATUS_ORDER,
  type Lead,
  type LeadStatus,
  type LeadStatusEvent,
  type Project,
} from '@/lib/supabase/types';
import StatusBadge from '../../components/StatusBadge';
import LeadDrawer from './LeadDrawer';

type Props = {
  leads: Lead[];
  events: LeadStatusEvent[];
  canEdit: boolean;
  project: Project;
};

export default function LeadsTable({ leads, events, canEdit, project }: Props) {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | LeadStatus>('all');
  const [sourceFilter, setSourceFilter] = useState<'all' | string>('all');
  const [activeId, setActiveId] = useState<string | null>(null);

  const utmSources = useMemo(() => {
    const set = new Set<string>();
    for (const l of leads) if (l.utm_source) set.add(l.utm_source);
    return Array.from(set).sort();
  }, [leads]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return leads.filter((l) => {
      if (statusFilter !== 'all' && l.status !== statusFilter) return false;
      if (sourceFilter !== 'all') {
        if (sourceFilter === '__none__') {
          if (l.utm_source) return false;
        } else if (l.utm_source !== sourceFilter) {
          return false;
        }
      }
      if (!q) return true;
      return (
        l.full_name.toLowerCase().includes(q) ||
        l.email.toLowerCase().includes(q) ||
        l.phone.toLowerCase().includes(q) ||
        (l.utm_campaign?.toLowerCase().includes(q) ?? false)
      );
    });
  }, [leads, search, statusFilter, sourceFilter]);

  const exportCsv = () => {
    const header = [
      'created_at',
      'project',
      'full_name',
      'phone',
      'email',
      'booking_date',
      'status',
      'source',
      'utm_source',
      'utm_medium',
      'utm_campaign',
      'utm_term',
      'utm_content',
      'landing_page',
      'referrer',
      'language',
      'notes',
    ];
    const rows = filtered.map((l) =>
      header
        .map((k) => {
          const v = (l as unknown as Record<string, unknown>)[k] ?? '';
          return `"${String(v).replaceAll('"', '""')}"`;
        })
        .join(','),
    );
    const csv = [header.join(','), ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${project}-leads-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const active = activeId ? leads.find((l) => l.id === activeId) ?? null : null;
  const activeEvents = active
    ? events.filter((e) => e.lead_id === active.id)
    : [];

  return (
    <>
      <div className="dash-table-wrap">
        <div className="dash-table-toolbar">
          <input
            className="dash-input"
            placeholder="Search by name, phone, email, or campaign…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select
            className="dash-select"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as 'all' | LeadStatus)}
          >
            <option value="all">All statuses</option>
            {STATUS_ORDER.map((s) => (
              <option key={s} value={s}>
                {STATUS_META[s].label}
              </option>
            ))}
          </select>
          <select
            className="dash-select"
            value={sourceFilter}
            onChange={(e) => setSourceFilter(e.target.value)}
          >
            <option value="all">All sources</option>
            <option value="__none__">Direct / no UTM</option>
            {utmSources.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
          <button type="button" className="dash-btn" onClick={exportCsv}>
            Export CSV ({filtered.length})
          </button>
        </div>

        {filtered.length === 0 ? (
          <div className="dash-empty">
            No leads match — clear filters or wait for new submissions.
          </div>
        ) : (
          <table className="dash-table">
            <thead>
              <tr>
                <th>Created</th>
                <th>Name</th>
                <th>Phone</th>
                <th>Email</th>
                <th>Booking</th>
                <th>Source</th>
                <th>Campaign</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((l) => (
                <tr key={l.id} onClick={() => setActiveId(l.id)}>
                  <td className="dash-mono">
                    {new Date(l.created_at).toLocaleDateString(undefined, {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </td>
                  <td>{l.full_name}</td>
                  <td className="dash-mono" dir="ltr">
                    {l.phone}
                  </td>
                  <td dir="ltr" className="dash-muted-cell">
                    {l.email}
                  </td>
                  <td className="dash-mono">{l.booking_date ?? '—'}</td>
                  <td className="dash-capitalize">
                    {l.utm_source ? (
                      <>
                        {l.utm_source}
                        {l.utm_medium ? (
                          <span style={{ opacity: 0.55 }}> · {l.utm_medium}</span>
                        ) : null}
                      </>
                    ) : (
                      l.source
                    )}
                  </td>
                  <td className="dash-mono" style={{ fontSize: '0.78rem' }}>
                    {l.utm_campaign ?? '—'}
                  </td>
                  <td>
                    <StatusBadge status={l.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {active ? (
        <LeadDrawer
          lead={active}
          events={activeEvents}
          onClose={() => setActiveId(null)}
          canEdit={canEdit}
        />
      ) : null}
    </>
  );
}
