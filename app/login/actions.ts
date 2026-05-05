'use server';

import { redirect } from 'next/navigation';
import { z } from 'zod';
import { createSupabaseServerClient } from '@/lib/supabase/server';

const SignInSchema = z.object({
  email: z.string().email().toLowerCase().trim(),
  password: z.string().min(1),
  next: z.string().optional(),
});

export type SignInState = { error?: string } | undefined;

export async function signIn(_prev: SignInState, formData: FormData): Promise<SignInState> {
  const parsed = SignInSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
    next: formData.get('next') ?? undefined,
  });

  if (!parsed.success) {
    return { error: 'Please enter a valid email and password.' };
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.signInWithPassword({
    email: parsed.data.email,
    password: parsed.data.password,
  });

  if (error) {
    return { error: error.message };
  }

  redirect(parsed.data.next?.startsWith('/dashboard') ? parsed.data.next : '/dashboard');
}
