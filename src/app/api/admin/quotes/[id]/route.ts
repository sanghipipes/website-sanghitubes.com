import { NextResponse, type NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getQuoteById, updateQuoteStatus } from '@/services/quote'
import { getAdminUser } from '@/services/admin'
import type { QuoteStatus } from '@/types'

const VALID_STATUSES: QuoteStatus[] = ['pending', 'in_progress', 'completed', 'cancelled']

async function authorise() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null
  const adminUser = await getAdminUser(user.id)
  if (!adminUser || !['admin', 'sales'].includes(adminUser.role)) return null
  return adminUser
}

// GET /api/admin/quotes/[id]
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await authorise()
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  const quote = await getQuoteById(id)
  if (!quote) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json(quote)
}

// PATCH /api/admin/quotes/[id] — update status
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await authorise()
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  const body: { status?: string } = await request.json().catch(() => ({}))

  if (!body.status || !VALID_STATUSES.includes(body.status as QuoteStatus)) {
    return NextResponse.json({ error: 'Invalid or missing status' }, { status: 422 })
  }

  try {
    await updateQuoteStatus(id, body.status as QuoteStatus)
    return NextResponse.json({ success: true })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Update failed'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
