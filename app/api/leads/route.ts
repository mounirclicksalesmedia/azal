import { NextResponse } from 'next/server';
import { z } from 'zod';
import { createSupabaseAdminClient } from '@/lib/supabase/admin';

const LeadInput = z.object({
  project: z.enum(['azal', 'arsh']).optional(),
  full_name: z.string().min(2).max(120).trim(),
  phone: z.string().min(6).max(40).trim(),
  email: z.string().email().max(160).trim().toLowerCase(),
  booking_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional().nullable(),
  language: z.enum(['en', 'ar']).optional(),
  source: z.enum(['website', 'whatsapp', 'phone', 'referral', 'other']).optional(),
  utm_source:   z.string().max(120).optional().nullable(),
  utm_medium:   z.string().max(120).optional().nullable(),
  utm_campaign: z.string().max(120).optional().nullable(),
  utm_term:     z.string().max(120).optional().nullable(),
  utm_content:  z.string().max(160).optional().nullable(),
  landing_page: z.string().max(500).optional().nullable(),
  referrer:     z.string().max(500).optional().nullable(),
});

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const parsed = LeadInput.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Validation failed', details: parsed.error.flatten() },
      { status: 422 },
    );
  }

  const supabase = createSupabaseAdminClient();
  const project = parsed.data.project ?? 'azal';

  // Match utm_source+campaign to a known utm_link for this project so the
  // dashboard can group by link without trusting client-provided IDs.
  let utm_link_id: string | null = null;
  if (parsed.data.utm_source && parsed.data.utm_campaign) {
    const { data: link } = await supabase
      .from('utm_links')
      .select('id')
      .eq('project', project)
      .eq('source', parsed.data.utm_source)
      .eq('campaign', parsed.data.utm_campaign)
      .is('archived_at', null)
      .maybeSingle();
    utm_link_id = link?.id ?? null;
  }

  const { data, error } = await supabase
    .from('leads')
    .insert({
      project,
      full_name: parsed.data.full_name,
      phone: parsed.data.phone,
      email: parsed.data.email,
      booking_date: parsed.data.booking_date ?? null,
      language: parsed.data.language ?? 'en',
      source: parsed.data.source ?? 'website',
      utm_source:   parsed.data.utm_source   ?? null,
      utm_medium:   parsed.data.utm_medium   ?? null,
      utm_campaign: parsed.data.utm_campaign ?? null,
      utm_term:     parsed.data.utm_term     ?? null,
      utm_content:  parsed.data.utm_content  ?? null,
      utm_link_id,
      landing_page: parsed.data.landing_page ?? null,
      referrer:     parsed.data.referrer     ?? null,
    })
    .select('id')
    .single();

  if (error) {
    console.error('lead insert failed', error);
    return NextResponse.json({ error: 'Could not save submission' }, { status: 500 });
  }

  return NextResponse.json({ ok: true, id: data.id }, { status: 201 });
}
