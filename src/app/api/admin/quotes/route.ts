import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getAllQuotes } from '@/services/quote'
import { getAdminUser } from '@/services/admin'

async function authorise() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null
  const adminUser = await getAdminUser(user.id)
  if (!adminUser || !['admin', 'sales'].includes(adminUser.role)) return null
  return adminUser
}

// GET /api/admin/quotes
export async function GET() {
  const admin = await authorise()
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const quotes = await getAllQuotes()
    return NextResponse.json(quotes)
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
