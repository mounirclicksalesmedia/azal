export type LeadStatus =
  | 'new'
  | 'contacted'
  | 'answered'
  | 'no_answer'
  | 'booked'
  | 'showed_up'
  | 'no_show'
  | 'won'
  | 'lost';

export type AppRole = 'admin' | 'agent' | 'viewer';

export type LeadSource = 'website' | 'whatsapp' | 'phone' | 'referral' | 'other';

export type Lead = {
  id: string;
  full_name: string;
  phone: string;
  email: string;
  booking_date: string | null;
  language: 'en' | 'ar';
  source: LeadSource;
  status: LeadStatus;
  notes: string | null;
  assigned_to: string | null;
  created_at: string;
  updated_at: string;
};

export type LeadStatusEvent = {
  id: string;
  lead_id: string;
  from_status: LeadStatus | null;
  to_status: LeadStatus;
  note: string | null;
  changed_by: string | null;
  changed_at: string;
};

export type Profile = {
  id: string;
  email: string;
  full_name: string | null;
  role: AppRole;
  created_at: string;
  updated_at: string;
};

export const STATUS_META: Record<LeadStatus, { label: string; tone: string }> = {
  new:        { label: 'New',         tone: '#8A603E' },
  contacted:  { label: 'Contacted',   tone: '#9F7B5E' },
  answered:   { label: 'Answered',    tone: '#6F7C70' },
  no_answer:  { label: 'No answer',   tone: '#AE8C81' },
  booked:     { label: 'Booked',      tone: '#B8915E' },
  showed_up:  { label: 'Showed up',   tone: '#3F7A5C' },
  no_show:    { label: 'No-show',     tone: '#B0413E' },
  won:        { label: 'Won',         tone: '#2D6A4F' },
  lost:       { label: 'Lost',        tone: '#6E5145' },
};

export const STATUS_ORDER: LeadStatus[] = [
  'new',
  'contacted',
  'answered',
  'no_answer',
  'booked',
  'showed_up',
  'no_show',
  'won',
  'lost',
];
