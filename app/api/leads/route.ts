import { NextResponse } from 'next/server';
import { z } from 'zod';
import { createSupabaseAdminClient } from '@/lib/supabase/admin';

const LeadInput = z.object({
  full_name: z.string().min(2).max(120).trim(),
  phone: z.string().min(6).max(40).trim(),
  email: z.string().email().max(160).trim().toLowerCase(),
  booking_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional().nullable(),
  language: z.enum(['en', 'ar']).optional(),
  source: z.enum(['website', 'whatsapp', 'phone', 'referral', 'other']).optional(),
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
  const { data, error } = await supabase
    .from('leads')
    .insert({
      full_name: parsed.data.full_name,
      phone: parsed.data.phone,
      email: parsed.data.email,
      booking_date: parsed.data.booking_date ?? null,
      language: parsed.data.language ?? 'en',
      source: parsed.data.source ?? 'website',
    })
    .select('id')
    .single();

  if (error) {
    console.error('lead insert failed', error);
    return NextResponse.json({ error: 'Could not save submission' }, { status: 500 });
  }

  return NextResponse.json({ ok: true, id: data.id }, { status: 201 });
}
