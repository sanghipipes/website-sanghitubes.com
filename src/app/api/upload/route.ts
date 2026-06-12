import { NextResponse, type NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { uploadProductImage } from '@/services/storage'
import { getAdminUser } from '@/services/admin'

// POST /api/upload — multipart/form-data
// Fields: file (File), slug (string)
export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const adminUser = await getAdminUser(user.id)
  if (!adminUser || !['admin', 'editor'].includes(adminUser.role)) {
    return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 })
  }

  let formData: FormData
  try {
    formData = await request.formData()
  } catch {
    return NextResponse.json({ error: 'Invalid multipart body' }, { status: 400 })
  }

  const file = formData.get('file') as File | null
  const slug = formData.get('slug') as string | null

  if (!file || !slug) {
    return NextResponse.json({ error: 'file and slug fields are required' }, { status: 400 })
  }

  try {
    const result = await uploadProductImage(file, slug)
    return NextResponse.json(result, { status: 201 })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Upload failed'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
