import { createAdminClient } from '@/lib/supabase/admin'
import type { QuoteWithItems, QuoteStatus } from '@/types'

// Fetch all quote requests ordered by newest first.
export async function getAllQuotes(): Promise<QuoteWithItems[]> {
  const supabase = createAdminClient()

  const { data, error } = await supabase
    .from('quote_requests')
    .select(`
      id, customer_name, company_name, email, phone, city, message, status, created_at,
      items:quote_items ( id, product_name, quantity )
    `)
    .order('created_at', { ascending: false })

  if (error) throw new Error(error.message)
  return (data ?? []) as QuoteWithItems[]
}

// Fetch a single quote with its items.
export async function getQuoteById(id: string): Promise<QuoteWithItems | null> {
  const supabase = createAdminClient()

  const { data, error } = await supabase
    .from('quote_requests')
    .select(`
      id, customer_name, company_name, email, phone, city, message, status, created_at,
      items:quote_items ( id, product_name, quantity )
    `)
    .eq('id', id)
    .single()

  if (error) return null
  return data as QuoteWithItems
}

// Update only the status of a quote.
export async function updateQuoteStatus(
  id: string,
  status: QuoteStatus
): Promise<void> {
  const supabase = createAdminClient()
  const { error } = await supabase
    .from('quote_requests')
    .update({ status })
    .eq('id', id)
  if (error) throw new Error(error.message)
}

// Count quotes grouped by status — used for dashboard stats.
export async function getQuoteStats(): Promise<{
  total: number
  pending: number
  inProgress: number
  completed: number
}> {
  const supabase = createAdminClient()

  const { count: total }      = await supabase.from('quote_requests').select('*', { count: 'exact', head: true })
  const { count: pending }    = await supabase.from('quote_requests').select('*', { count: 'exact', head: true }).eq('status', 'pending')
  const { count: inProgress } = await supabase.from('quote_requests').select('*', { count: 'exact', head: true }).eq('status', 'in_progress')
  const { count: completed }  = await supabase.from('quote_requests').select('*', { count: 'exact', head: true }).eq('status', 'completed')

  return {
    total:      total ?? 0,
    pending:    pending ?? 0,
    inProgress: inProgress ?? 0,
    completed:  completed ?? 0,
  }
}
