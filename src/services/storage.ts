import { createAdminClient } from '@/lib/supabase/admin'

const BUCKET = 'product-images'
const MAX_SIZE_BYTES = 5 * 1024 * 1024 // 5 MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']

export interface UploadResult {
  url: string
  path: string
}

// Validates and uploads a product image. Returns the public URL.
export async function uploadProductImage(
  file: File,
  productSlug: string
): Promise<UploadResult> {
  if (!ALLOWED_TYPES.includes(file.type)) {
    throw new Error(`Invalid file type. Allowed: ${ALLOWED_TYPES.join(', ')}`)
  }
  if (file.size > MAX_SIZE_BYTES) {
    throw new Error('File too large. Maximum size is 5 MB.')
  }

  const ext  = file.name.split('.').pop() ?? 'jpg'
  const path = `${productSlug}/${Date.now()}.${ext}`

  const supabase = createAdminClient()

  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(path, file, { contentType: file.type, upsert: true })

  if (error) throw new Error(`Upload failed: ${error.message}`)

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path)

  return { url: data.publicUrl, path }
}

// Delete a previously uploaded product image by its storage path.
export async function deleteProductImage(path: string): Promise<void> {
  const supabase = createAdminClient()
  const { error } = await supabase.storage.from(BUCKET).remove([path])
  if (error) throw new Error(`Delete failed: ${error.message}`)
}

// Extract the storage path from a full public URL.
export function extractStoragePath(publicUrl: string): string | null {
  try {
    const url   = new URL(publicUrl)
    const parts = url.pathname.split(`/object/public/${BUCKET}/`)
    return parts[1] ?? null
  } catch {
    return null
  }
}
