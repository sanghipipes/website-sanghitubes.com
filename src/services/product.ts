import { createAdminClient } from '@/lib/supabase/admin'
import type { ProductRow } from '@/types'
import type { ProductFormInput } from '@/lib/validations/product'

// Fetch all products ordered by created_at desc.
export async function getAllProducts(): Promise<ProductRow[]> {
  const supabase = createAdminClient()
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false })
  if (error) throw new Error(error.message)
  return data ?? []
}

// Fetch a single product by its database UUID.
export async function getProductById(id: string): Promise<ProductRow | null> {
  const supabase = createAdminClient()
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .single()
  if (error) return null
  return data
}

// Fetch a single product by slug (for public pages).
export async function getProductBySlug(slug: string): Promise<ProductRow | null> {
  const supabase = createAdminClient()
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('slug', slug)
    .single()
  if (error) return null
  return data
}

// Create a new product.
export async function createProduct(input: ProductFormInput): Promise<ProductRow> {
  const supabase = createAdminClient()
  const { data, error } = await supabase
    .from('products')
    .insert({
      name:        input.name,
      slug:        input.slug,
      category:    input.category,
      description: input.description || null,
      material:    input.material    || null,
      size:        input.size        || null,
      image_url:   input.imageUrl    || null,
      featured:    input.featured ?? false,
    })
    .select()
    .single()
  if (error) throw new Error(error.message)
  return data
}

// Update an existing product.
export async function updateProduct(id: string, input: Partial<ProductFormInput>): Promise<ProductRow> {
  const supabase = createAdminClient()
  const { data, error } = await supabase
    .from('products')
    .update({
      ...(input.name        !== undefined && { name:        input.name }),
      ...(input.slug        !== undefined && { slug:        input.slug }),
      ...(input.category    !== undefined && { category:    input.category }),
      ...(input.description !== undefined && { description: input.description || null }),
      ...(input.material    !== undefined && { material:    input.material    || null }),
      ...(input.size        !== undefined && { size:        input.size        || null }),
      ...(input.imageUrl    !== undefined && { image_url:   input.imageUrl    || null }),
      ...(input.featured    !== undefined && { featured:    input.featured }),
    })
    .eq('id', id)
    .select()
    .single()
  if (error) throw new Error(error.message)
  return data
}

// Delete a product by ID.
export async function deleteProduct(id: string): Promise<void> {
  const supabase = createAdminClient()
  const { error } = await supabase.from('products').delete().eq('id', id)
  if (error) throw new Error(error.message)
}
