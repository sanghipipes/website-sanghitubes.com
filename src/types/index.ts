export type { Database, QuoteStatus, AdminRole, ProductRow, QuoteRequestRow, QuoteItemRow, ContactMessageRow, AdminUserRow } from './database'

// -------------------------------------------------------
// Application-level types (not tied 1:1 to DB rows)
// -------------------------------------------------------

export interface QuoteCartItem {
  productId: string
  productName: string
  quantity: number
}

export interface QuoteSubmissionPayload {
  customerName: string
  companyName: string
  email: string
  phone: string
  city?: string
  message?: string
  items: QuoteCartItem[]
  turnstileToken: string
}

export interface ContactSubmissionPayload {
  firstName: string
  lastName: string
  email: string
  subject: string
  message: string
  turnstileToken: string
}

export interface ProductFormPayload {
  name: string
  slug: string
  category: string
  description?: string
  material?: string
  size?: string
  imageUrl?: string
  featured?: boolean
}

export interface ActionResult<T = undefined> {
  success: boolean
  error?: string
  data?: T
}

// Quote with items joined
export interface QuoteWithItems {
  id: string
  customer_name: string
  company_name: string | null
  email: string
  phone: string
  city: string | null
  message: string | null
  status: import('./database').QuoteStatus
  created_at: string
  items: Array<{
    id: string
    product_name: string
    quantity: number
  }>
}
