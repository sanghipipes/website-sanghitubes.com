import { Resend } from 'resend'

// Singleton Resend client — lazily initialised so missing env vars
// only throw at call-time (not at import time during build).
let _resend: Resend | null = null

export function getResend(): Resend {
  if (!_resend) {
    if (!process.env.RESEND_API_KEY) throw new Error('Missing RESEND_API_KEY')
    _resend = new Resend(process.env.RESEND_API_KEY)
  }
  return _resend
}

export const FROM_EMAIL = process.env.RESEND_FROM_EMAIL ?? 'noreply@sanghitubes.com'
export const COMPANY_EMAIL = process.env.COMPANY_NOTIFICATION_EMAIL ?? 'info@sanghitubes.com'
