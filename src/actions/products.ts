'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { productFormSchema } from '@/lib/validations/product'
import {
  createProduct,
  updateProduct,
  deleteProduct,
  getProductById,
} from '@/services/product'
import { getAdminUser } from '@/services/admin'
import type { ActionResult, ProductRow } from '@/types'
import type { ProductFormInput } from '@/lib/validations/product'

async function requireEditorOrAdmin(): Promise<{ ok: false; error: string } | { ok: true; role: string }> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { ok: false, error: 'Authentication required.' }

  const adminUser = await getAdminUser(user.id)
  if (!adminUser) return { ok: false, error: 'Access denied.' }
  if (!['admin', 'editor'].includes(adminUser.role)) {
    return { ok: false, error: 'Insufficient permissions.' }
  }
  return { ok: true, role: adminUser.role }
}

async function requireAdmin(): Promise<{ ok: false; error: string } | { ok: true }> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { ok: false, error: 'Authentication required.' }

  const adminUser = await getAdminUser(user.id)
  if (!adminUser || adminUser.role !== 'admin') {
    return { ok: false, error: 'Admin access required.' }
  }
  return { ok: true }
}

export async function createProductAction(
  input: ProductFormInput
): Promise<ActionResult<ProductRow>> {
  const auth = await requireEditorOrAdmin()
  if (!auth.ok) return { success: false, error: auth.error }

  const parsed = productFormSchema.safeParse(input)
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? 'Invalid data.' }
  }

  try {
    const product = await createProduct(parsed.data)
    revalidatePath('/admin/products')
    return { success: true, data: product }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to create product.'
    return { success: false, error: message }
  }
}

export async function updateProductAction(
  id: string,
  input: Partial<ProductFormInput>
): Promise<ActionResult<ProductRow>> {
  const auth = await requireEditorOrAdmin()
  if (!auth.ok) return { success: false, error: auth.error }

  try {
    const product = await updateProduct(id, input)
    revalidatePath('/admin/products')
    revalidatePath(`/admin/products/${id}/edit`)
    return { success: true, data: product }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to update product.'
    return { success: false, error: message }
  }
}

export async function deleteProductAction(id: string): Promise<ActionResult> {
  const auth = await requireAdmin()
  if (!auth.ok) return { success: false, error: auth.error }

  try {
    // Verify product exists first
    const existing = await getProductById(id)
    if (!existing) return { success: false, error: 'Product not found.' }

    await deleteProduct(id)
    revalidatePath('/admin/products')
    return { success: true }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to delete product.'
    return { success: false, error: message }
  }
}
