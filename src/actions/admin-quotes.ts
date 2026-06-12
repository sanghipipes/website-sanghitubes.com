'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { updateQuoteStatus } from '@/services/quote'
import { getAdminUser } from '@/services/admin'
import type { ActionResult, QuoteStatus } from '@/types'

async function requireAdminOrSales(): Promise<{ ok: false; error: string } | { ok: true }> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { ok: false, error: 'Authentication required.' }

  const adminUser = await getAdminUser(user.id)
  if (!adminUser || !['admin', 'sales'].includes(adminUser.role)) {
    return { ok: false, error: 'Access denied.' }
  }
  return { ok: true }
}

export async function updateQuoteStatusAction(
  id: string,
  status: QuoteStatus
): Promise<ActionResult> {
  const auth = await requireAdminOrSales()
  if (!auth.ok) return { success: false, error: auth.error }

  const validStatuses: QuoteStatus[] = ['pending', 'in_progress', 'completed', 'cancelled']
  if (!validStatuses.includes(status)) {
    return { success: false, error: 'Invalid status.' }
  }

  try {
    await updateQuoteStatus(id, status)
    revalidatePath('/admin/quotes')
    revalidatePath(`/admin/quotes/${id}`)
    return { success: true }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to update status.'
    return { success: false, error: message }
  }
}
