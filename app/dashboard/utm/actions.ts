'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { createSupabaseAdminClient } from '@/lib/supabase/admin';
import { verifyStaffSession } from '@/lib/dashboard/dal';

const slugRule = /^[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/;

const CreateUtmSchema = z.object({
  project: z.enum(['azal', 'arsh']),
  name: z.string().min(2).max(120).trim(),
  slug: z.string().min(1).max(60).trim().toLowerCase().regex(slugRule, {
    message: 'Use lowercase letters, numbers, and dashes only.',
  }),
  source: z.string().min(1).max(120).trim().toLowerCase(),
  medium: z.string().min(1).max(120).trim().toLowerCase(),
  campaign: z.string().min(1).max(120).trim().toLowerCase(),
  term: z.string().max(120).optional().nullable(),
  content: z.string().max(160).optional().nullable(),
  destination: z.string().min(1).max(500).trim(),
});

export async function createUtmLink(formData: FormData) {
  const profile = await verifyStaffSession();
  if (profile.role === 'viewer') {
    return { error: 'You do not have permission to create UTM links.' };
  }

  const parsed = CreateUtmSchema.safeParse({
    project: formData.get('project'),
    name: formData.get('name'),
    slug: formData.get('slug'),
    source: formData.get('source'),
    medium: formData.get('medium'),
    campaign: formData.get('campaign'),
    term: formData.get('term') || null,
    content: formData.get('content') || null,
    destination: formData.get('destination'),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? 'Invalid input.' };
  }

  const supabase = createSupabaseAdminClient();
  const { error } = await supabase.from('utm_links').insert({
    project: parsed.data.project,
    name: parsed.data.name,
    slug: parsed.data.slug,
    source: parsed.data.source,
    medium: parsed.data.medium,
    campaign: parsed.data.campaign,
    term: parsed.data.term,
    content: parsed.data.content,
    destination: parsed.data.destination,
    created_by: profile.id,
  });

  if (error) {
    if (error.code === '23505') {
      return { error: 'A link with that slug already exists for this project.' };
    }
    return { error: error.message };
  }

  revalidatePath('/dashboard/utm');
  return { ok: true };
}

const IdSchema = z.object({ id: z.string().uuid() });

export async function archiveUtmLink(formData: FormData) {
  const profile = await verifyStaffSession();
  if (profile.role === 'viewer') return { error: 'No permission.' };
  const parsed = IdSchema.safeParse({ id: formData.get('id') });
  if (!parsed.success) return { error: 'Invalid input.' };

  const supabase = createSupabaseAdminClient();
  const { error } = await supabase
    .from('utm_links')
    .update({ archived_at: new Date().toISOString() })
    .eq('id', parsed.data.id);
  if (error) return { error: error.message };

  revalidatePath('/dashboard/utm');
  return { ok: true };
}

export async function restoreUtmLink(formData: FormData) {
  const profile = await verifyStaffSession();
  if (profile.role === 'viewer') return { error: 'No permission.' };
  const parsed = IdSchema.safeParse({ id: formData.get('id') });
  if (!parsed.success) return { error: 'Invalid input.' };

  const supabase = createSupabaseAdminClient();
  const { error } = await supabase
    .from('utm_links')
    .update({ archived_at: null })
    .eq('id', parsed.data.id);
  if (error) return { error: error.message };

  revalidatePath('/dashboard/utm');
  return { ok: true };
}
