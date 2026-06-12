import { createClient } from '@supabase/supabase-js'
import type { Database } from '@/types/database'

// Admin Supabase client — uses service role key, BYPASSES RLS.
// ONLY use in server-side code (Server Actions, Route Handlers).
// NEVER expose to the client or browser.
export function createAdminClient() {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL')
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY)  throw new Error('Missing SUPABASE_SERVICE_ROLE_KEY')

  return createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  )
}
