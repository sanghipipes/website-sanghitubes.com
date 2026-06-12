'use server'

import { createClient } from '@/lib/supabase/server'
import { adminLoginSchema } from '@/lib/validations/auth'
import { getAdminUser } from '@/services/admin'
import type { ActionResult } from '@/types'

export async function adminLoginAction(
  email: string,
  password: string
): Promise<ActionResult<{ role: string }>> {
  const parsed = adminLoginSchema.safeParse({ email, password })
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? 'Invalid credentials.' }
  }

  const supabase = await createClient()

  const { data, error } = await supabase.auth.signInWithPassword({
    email:    parsed.data.email,
    password: parsed.data.password,
  })

  if (error || !data.user) {
    console.error('[Auth] signInWithPassword failed:', error?.message)
    return { success: false, error: 'Invalid email or password.' }
  }

  // Verify the user exists in admin_users
  const adminUser = await getAdminUser(data.user.id)
  if (!adminUser) {
    await supabase.auth.signOut()
    return { success: false, error: 'Access denied. This account is not authorised as an admin.' }
  }

  return { success: true, data: { role: adminUser.role } }
}

export async function adminLogoutAction(): Promise<ActionResult> {
  const supabase = await createClient()
  const { error } = await supabase.auth.signOut()
  if (error) return { success: false, error: error.message }
  return { success: true }
}

export async function getSessionAction(): Promise<{
  userId: string
  email: string
  role: string
} | null> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const adminUser = await getAdminUser(user.id)
  if (!adminUser) return null

  return { userId: user.id, email: adminUser.email, role: adminUser.role }
}
