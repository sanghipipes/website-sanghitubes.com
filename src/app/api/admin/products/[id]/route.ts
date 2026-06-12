import { NextResponse, type NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getProductById, updateProduct, deleteProduct } from '@/services/product'
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

// GET /api/admin/products/[id]
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await authorise(request, ['admin', 'editor', 'sales'])
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  const product = await getProductById(id)
  if (!product) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json(product)
}

// PATCH /api/admin/products/[id]
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await authorise(request, ['admin', 'editor'])
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  const body = await request.json().catch(() => null)
  if (!body) return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })

  const parsed = productFormSchema.partial().safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? 'Validation failed' },
      { status: 422 }
    )
  }

  try {
    const updated = await updateProduct(id, parsed.data)
    return NextResponse.json(updated)
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Update failed'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

// DELETE /api/admin/products/[id]
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await authorise(request, ['admin'])
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  try {
    await deleteProduct(id)
    return new NextResponse(null, { status: 204 })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Delete failed'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
