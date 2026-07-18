'use server'

import { createAdminClient } from '@/lib/supabase/admin'
import { quoteSubmissionSchema } from '@/lib/validations/quote'
import { sendQuoteEmails } from '@/services/email'
import type { ActionResult } from '@/types'
import type { QuoteSubmissionPayload } from '@/types'

async function verifyTurnstile(token: string): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET_KEY
  if (!secret) return true // Skip verification in dev when key is missing

  const res = await fetch(
    'https://challenges.cloudflare.com/turnstile/v0/siteverify',
    {
      method:  'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body:    new URLSearchParams({ secret, response: token }),
      cache:   'no-store',
    }
  )
  const json = await res.json()
  return json.success === true
}

export async function submitQuoteAction(
  payload: QuoteSubmissionPayload
): Promise<ActionResult<{ quoteId: string }>> {
  // 1. Verify CAPTCHA
  const captchaOk = await verifyTurnstile(payload.turnstileToken)
  if (!captchaOk) {
    return { success: false, error: 'CAPTCHA verification failed. Please try again.' }
  }

  // 2. Validate input
  const parsed = quoteSubmissionSchema.safeParse(payload)
  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message ?? 'Invalid form data.',
    }
  }

  const { customerName, companyName, email, phone, city, message, items } = parsed.data

  try {
    const supabase = createAdminClient()

    // 3. Insert quote request
    const { data: quote, error: quoteError } = await supabase
      .from('quote_requests')
      .insert({
        customer_name: customerName,
        company_name:  companyName || null,
        email,
        phone,
        city:    city    || null,
        message: message || null,
        status:  'pending',
      })
      .select('id')
      .single()

    if (quoteError) throw quoteError

    // 4. Insert line items
    if (items.length > 0) {
      const { error: itemsError } = await supabase.from('quote_items').insert(
        items.map((item) => ({
          quote_request_id: quote.id,
          product_name:     item.productName,
          quantity:         item.quantity,
        }))
      )
      if (itemsError) throw itemsError
    }

    // 5. Fire-and-forget emails (errors are swallowed to not block the user)
    sendQuoteEmails({
      quoteId:      quote.id,
      customerName,
      companyName:  companyName || undefined,
      email,
      phone,
      city:         city    || undefined,
      message:      message || undefined,
      items:        items.map((i) => ({ productName: i.productName, quantity: i.quantity })),
    }).catch((err) => console.error('[Email] Quote emails failed:', err))

    return { success: true, data: { quoteId: quote.id } }
  } catch (err) {
    console.error('[Action] submitQuote error:', err)
    return { success: false, error: 'Failed to submit quote. Please try again later.' }
  }
}
