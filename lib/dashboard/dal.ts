import 'server-only';

import { cache } from 'react';
import { redirect } from 'next/navigation';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import type { Profile } from '@/lib/supabase/types';

/**
 * Verify the user has a session AND a staff profile.
 * Use in dashboard server components and route handlers.
 */
export const verifyStaffSession = cache(async (): Promise<Profile> => {
  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .maybeSingle();

  if (!profile) {
    redirect('/login?error=no-profile');
  }

  return profile as Profile;
});
