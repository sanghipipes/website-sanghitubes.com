import { createAdminClient } from '@/lib/supabase/admin'
import type { AdminUserRow, AdminRole } from '@/types'

// Get admin user record by their auth UID.
export async function getAdminUser(uid: string): Promise<AdminUserRow | null> {
  const supabase = createAdminClient()
  const { data } = await supabase
    .from('admin_users')
    .select('*')
    .eq('id', uid)
    .single()
  return data ?? null
}

// List all admin users.
export async function listAdminUsers(): Promise<AdminUserRow[]> {
  const supabase = createAdminClient()
  const { data, error } = await supabase
    .from('admin_users')
    .select('*')
    .order('created_at', { ascending: true })
  if (error) throw new Error(error.message)
  return data ?? []
}

// Provision a new admin user — requires Supabase Auth user to already exist.
export async function provisionAdminUser(
  uid: string,
  email: string,
  role: AdminRole = 'sales'
): Promise<AdminUserRow> {
  const supabase = createAdminClient()
  const { data, error } = await supabase
    .from('admin_users')
    .insert({ id: uid, email, role })
    .select()
    .single()
  if (error) throw new Error(error.message)
  return data
}

// Update role for an existing admin user.
export async function updateAdminRole(uid: string, role: AdminRole): Promise<void> {
  const supabase = createAdminClient()
  const { error } = await supabase
    .from('admin_users')
    .update({ role })
    .eq('id', uid)
  if (error) throw new Error(error.message)
}
