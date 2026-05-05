import { STATUS_META, type LeadStatus } from '@/lib/supabase/types';

export default function StatusBadge({ status }: { status: LeadStatus }) {
  const meta = STATUS_META[status];
  return (
    <span className="dash-badge" style={{ color: meta.tone }}>
      {meta.label}
    </span>
  );
}
