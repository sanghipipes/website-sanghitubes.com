'use server'

import { contactSubmissionSchema } from '@/lib/validations/contact'
import { storeContactMessage } from '@/services/contact'
import { sendContactEmail } from '@/services/email'
import type { ActionResult, ContactSubmissionPayload } from '@/types'

async function verifyTurnstile(token: string): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET_KEY
  if (!secret) return true

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

export async function submitContactAction(
  payload: ContactSubmissionPayload
): Promise<ActionResult> {
  const captchaOk = await verifyTurnstile(payload.turnstileToken)
  if (!captchaOk) {
    return { success: false, error: 'CAPTCHA verification failed. Please try again.' }
  }

  const parsed = contactSubmissionSchema.safeParse(payload)
  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message ?? 'Invalid form data.',
    }
  }

  const { firstName, lastName, email, subject, message } = parsed.data
  const fullName = `${firstName} ${lastName}`.trim()

  try {
    // Store message in database
    await storeContactMessage({
      name:    fullName,
      email,
      subject: subject || null,
      message,
    })

    // Send notification email (fire-and-forget)
    sendContactEmail({ name: fullName, email, subject: subject || null, message })
      .catch((err) => console.error('[Email] Contact email failed:', err))

    return { success: true }
  } catch (err) {
    console.error('[Action] submitContact error:', err)
    return { success: false, error: 'Failed to send message. Please try again later.' }
  }
}
