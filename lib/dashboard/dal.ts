import 'server-only';

import { cache } from 'react';
import { redirect } from 'next/navigation';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { createSupabaseAdminClient } from '@/lib/supabase/admin';
import type { Profile } from '@/lib/supabase/types';

/**
 * Verify the user has a session AND a staff profile.
 *
 * Uses the cookie-bound server client to read the user (so RLS still
 * applies for the auth check), then looks up the profile with the
 * admin client to bypass RLS — the dashboard is staff-only and we've
 * already verified the JWT, so reading the role privately is safe.
 */
export const verifyStaffSession = cache(async (): Promise<Profile> => {
  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const admin = createSupabaseAdminClient();
  const { data: profile, error } = await admin
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .maybeSingle();

  if (error) {
    console.error('verifyStaffSession profile lookup failed', error);
    redirect('/login?error=profile-lookup');
  }

  if (!profile) {
    redirect('/login?error=no-profile');
  }

  return profile as Profile;
});
