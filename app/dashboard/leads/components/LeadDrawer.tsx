'use client';

import { useEffect, useTransition } from 'react';
import { STATUS_META, STATUS_ORDER, type Lead, type LeadStatusEvent } from '@/lib/supabase/types';
import StatusBadge from '../../components/StatusBadge';
import { updateLeadStatus, updateLeadNotes } from '../actions';

type Props = {
  lead: Lead;
  events: LeadStatusEvent[];
  onClose: () => void;
  canEdit: boolean;
};

export default function LeadDrawer({ lead, events, onClose, canEdit }: Props) {
  const [pending, startTransition] = useTransition();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  const onStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const next = e.target.value;
    startTransition(async () => {
      const fd = new FormData();
      fd.set('id', lead.id);
      fd.set('status', next);
      await updateLeadStatus(fd);
    });
  };

  const onNotesBlur = (e: React.FocusEvent<HTMLTextAreaElement>) => {
    if (e.target.value === (lead.notes ?? '')) return;
    startTransition(async () => {
      const fd = new FormData();
      fd.set('id', lead.id);
      fd.set('notes', e.target.value);
      await updateLeadNotes(fd);
    });
  };

  return (
    <>
      <div className="dash-drawer-backdrop" onClick={onClose} />
      <aside className="dash-drawer" role="dialog" aria-label="Lead details">
        <div className="dash-drawer-head">
          <div>
            <div className="dash-eyebrow">Lead</div>
            <h2 className="dash-title" style={{ fontSize: '1.4rem', marginTop: '.25rem' }}>
              {lead.full_name}
            </h2>
            <div style={{ marginTop: '.45rem' }}>
              <StatusBadge status={lead.status} />
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="dash-btn"
            style={{ width: 38, padding: 0 }}
          >
            ✕
          </button>
        </div>

        <div className="dash-drawer-body">
          <dl style={{ display: 'grid', gap: '.65rem', margin: 0 }}>
            <div className="dash-drawer-row">
              <dt>Phone</dt>
              <dd dir="ltr">
                <a href={`tel:${lead.phone}`} className="dash-mono">
                  {lead.phone}
                </a>
              </dd>
            </div>
            <div className="dash-drawer-row">
              <dt>Email</dt>
              <dd dir="ltr">
                <a href={`mailto:${lead.email}`}>{lead.email}</a>
              </dd>
            </div>
            <div className="dash-drawer-row">
              <dt>Booking</dt>
              <dd className="dash-mono">{lead.booking_date ?? '—'}</dd>
            </div>
            <div className="dash-drawer-row">
              <dt>Source</dt>
              <dd style={{ textTransform: 'capitalize' }}>{lead.source}</dd>
            </div>
            <div className="dash-drawer-row">
              <dt>Language</dt>
              <dd>{lead.language === 'ar' ? 'Arabic' : 'English'}</dd>
            </div>
            <div className="dash-drawer-row">
              <dt>Captured</dt>
              <dd className="dash-mono">
                {new Date(lead.created_at).toLocaleString()}
              </dd>
            </div>
          </dl>

          {canEdit ? (
            <div>
              <label
                style={{
                  display: 'block',
                  fontSize: '.7rem',
                  letterSpacing: '.18em',
                  textTransform: 'uppercase',
                  color: 'rgba(27,19,13,0.5)',
                  marginBottom: '.4rem',
                }}
              >
                Update status
              </label>
              <select
                className="dash-select"
                value={lead.status}
                onChange={onStatusChange}
                disabled={pending}
                style={{ width: '100%' }}
              >
                {STATUS_ORDER.map((s) => (
                  <option key={s} value={s}>
                    {STATUS_META[s].label}
                  </option>
                ))}
              </select>
            </div>
          ) : null}

          <div>
            <label
              htmlFor="lead-notes"
              style={{
                display: 'block',
                fontSize: '.7rem',
                letterSpacing: '.18em',
                textTransform: 'uppercase',
                color: 'rgba(27,19,13,0.5)',
                marginBottom: '.4rem',
              }}
            >
              Notes
            </label>
            <textarea
              id="lead-notes"
              defaultValue={lead.notes ?? ''}
              disabled={!canEdit || pending}
              onBlur={onNotesBlur}
              placeholder={canEdit ? 'Internal notes (saved on blur)…' : 'Read only'}
              className="dash-input"
              style={{
                width: '100%',
                minHeight: 110,
                paddingBlock: '.7rem',
                lineHeight: 1.5,
                resize: 'vertical',
              }}
            />
          </div>

          <div>
            <div
              className="dash-section-meta"
              style={{ marginBottom: '.55rem' }}
            >
              History
            </div>
            <ul className="dash-timeline">
              {events.length === 0 ? (
                <li>
                  <div className="dash-timeline-meta">No events yet</div>
                </li>
              ) : (
                events.map((ev) => (
                  <li key={ev.id}>
                    <div className="dash-timeline-meta">
                      {new Date(ev.changed_at).toLocaleString()}
                    </div>
                    <div style={{ fontSize: '.92rem', fontWeight: 300 }}>
                      {ev.from_status
                        ? `${STATUS_META[ev.from_status].label} → ${STATUS_META[ev.to_status].label}`
                        : `Created as ${STATUS_META[ev.to_status].label}`}
                    </div>
                  </li>
                ))
              )}
            </ul>
          </div>
        </div>
      </aside>
    </>
  );
}
