import { createAdminClient } from '@/lib/supabase/admin'
import type { ContactMessageRow } from '@/types'

export async function storeContactMessage(payload: {
  name: string
  email: string
  subject: string | null
  message: string
}): Promise<ContactMessageRow> {
  const supabase = createAdminClient()

  const { data, error } = await supabase
    .from('contact_messages')
    .insert(payload)
    .select()
    .single()

  if (error) throw new Error(error.message)
  return data
}

export async function getAllContactMessages(): Promise<ContactMessageRow[]> {
  const supabase = createAdminClient()
  const { data, error } = await supabase
    .from('contact_messages')
    .select('*')
    .order('created_at', { ascending: false })
  if (error) throw new Error(error.message)
  return data ?? []
}
