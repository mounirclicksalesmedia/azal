import 'server-only';

import { createClient } from '@supabase/supabase-js';

// Service-role client — bypasses RLS. Use ONLY in trusted server code
// (route handlers, server actions). Never import from client components.
export function createSupabaseAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SECRET_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    },
  );
}
