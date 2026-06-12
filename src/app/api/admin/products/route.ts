import { NextResponse, type NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getAllProducts } from '@/services/product'
import { createProduct } from '@/services/product'
import { productFormSchema } from '@/lib/validations/product'
import { getAdminUser } from '@/services/admin'

async function authorise(request: NextRequest, allowedRoles: string[]) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null
  const adminUser = await getAdminUser(user.id)
  if (!adminUser || !allowedRoles.includes(adminUser.role)) return null
  return adminUser
}

// GET /api/admin/products
export async function GET(request: NextRequest) {
  const admin = await authorise(request, ['admin', 'editor', 'sales'])
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const products = await getAllProducts()
    return NextResponse.json(products)
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST /api/admin/products
export async function POST(request: NextRequest) {
  const admin = await authorise(request, ['admin', 'editor'])
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await request.json().catch(() => null)
  if (!body) return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })

  const parsed = productFormSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? 'Validation failed' },
      { status: 422 }
    )
  }

  try {
    const product = await createProduct(parsed.data)
    return NextResponse.json(product, { status: 201 })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to create product'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
