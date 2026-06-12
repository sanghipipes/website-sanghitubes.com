import { z } from 'zod'

const CATEGORIES = [
  'DI Pipes',
  'CI Pipes',
  'Valves',
  'DI Specials',
  'HDPE & Polymer',
  'MS & GI',
] as const

export const productFormSchema = z.object({
  name: z
    .string()
    .min(2, 'Product name must be at least 2 characters')
    .max(200)
    .trim(),
  slug: z
    .string()
    .min(2, 'Slug must be at least 2 characters')
    .max(200)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug must be lowercase letters, numbers, and hyphens only')
    .trim(),
  category: z.enum(CATEGORIES),
  description: z.string().max(2000).trim().optional().or(z.literal('')),
  material:    z.string().max(200).trim().optional().or(z.literal('')),
  size:        z.string().max(200).trim().optional().or(z.literal('')),
  imageUrl:    z.string().url('Please enter a valid URL').optional().or(z.literal('')),
  featured:    z.boolean().optional().default(false),
})

export type ProductFormInput = z.infer<typeof productFormSchema>
export { CATEGORIES }

// Utility: generate a URL-safe slug from any product name
export function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/^-+|-+$/g, '')
}
