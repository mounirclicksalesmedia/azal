'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { verifyStaffSession } from '@/lib/dashboard/dal';

const STATUSES = [
  'new',
  'contacted',
  'answered',
  'no_answer',
  'booked',
  'showed_up',
  'no_show',
  'won',
  'lost',
] as const;

const UpdateStatusSchema = z.object({
  id: z.string().uuid(),
  status: z.enum(STATUSES),
});

export async function updateLeadStatus(formData: FormData) {
  const profile = await verifyStaffSession();
  if (profile.role === 'viewer') {
    return { error: 'You do not have permission to change leads.' };
  }

  const parsed = UpdateStatusSchema.safeParse({
    id: formData.get('id'),
    status: formData.get('status'),
  });
  if (!parsed.success) return { error: 'Invalid input.' };

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase
    .from('leads')
    .update({ status: parsed.data.status })
    .eq('id', parsed.data.id);

  if (error) return { error: error.message };

  revalidatePath('/dashboard');
  revalidatePath('/dashboard/leads');
  return { ok: true };
}

const NotesSchema = z.object({
  id: z.string().uuid(),
  notes: z.string().max(2000).optional().nullable(),
});

export async function updateLeadNotes(formData: FormData) {
  const profile = await verifyStaffSession();
  if (profile.role === 'viewer') {
    return { error: 'You do not have permission to edit notes.' };
  }

  const parsed = NotesSchema.safeParse({
    id: formData.get('id'),
    notes: formData.get('notes'),
  });
  if (!parsed.success) return { error: 'Invalid input.' };

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase
    .from('leads')
    .update({ notes: parsed.data.notes ?? null })
    .eq('id', parsed.data.id);

  if (error) return { error: error.message };

  revalidatePath('/dashboard/leads');
  return { ok: true };
}
