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

export type Project = 'azal' | 'arsh';

export const PROJECTS: { slug: Project; name: string }[] = [
  { slug: 'azal', name: 'Azal' },
  { slug: 'arsh', name: 'Arsh' },
];

export const PROJECT_LABEL: Record<Project, string> = {
  azal: 'Azal',
  arsh: 'Arsh',
};

export const DEFAULT_PROJECT: Project = 'azal';

export const isProject = (v: string | null | undefined): v is Project =>
  v === 'azal' || v === 'arsh';

export type Lead = {
  id: string;
  project: Project;
  full_name: string;
  phone: string;
  email: string;
  booking_date: string | null;
  language: 'en' | 'ar';
  source: LeadSource;
  status: LeadStatus;
  notes: string | null;
  assigned_to: string | null;
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  utm_term: string | null;
  utm_content: string | null;
  utm_link_id: string | null;
  landing_page: string | null;
  referrer: string | null;
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

export type UtmLink = {
  id: string;
  project: Project;
  slug: string;
  name: string;
  source: string;
  medium: string;
  campaign: string;
  term: string | null;
  content: string | null;
  destination: string;
  created_by: string | null;
  created_at: string;
  updated_at: string;
  archived_at: string | null;
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

/** Build the public, tagged URL a marketer can share. */
export function buildUtmUrl(link: UtmLink, origin: string): string {
  const params = new URLSearchParams();
  params.set('utm_source', link.source);
  params.set('utm_medium', link.medium);
  params.set('utm_campaign', link.campaign);
  if (link.term) params.set('utm_term', link.term);
  if (link.content) params.set('utm_content', link.content);

  const dest = link.destination.startsWith('http')
    ? link.destination
    : `${origin.replace(/\/$/, '')}${link.destination.startsWith('/') ? '' : '/'}${link.destination}`;

  const sep = dest.includes('?') ? '&' : '?';
  return `${dest}${sep}${params.toString()}`;
}
