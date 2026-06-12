import { getResend, FROM_EMAIL, COMPANY_EMAIL } from '@/lib/email/resend'
import {
  quoteNotificationHtml,
  quoteNotificationSubject,
} from '@/lib/email/templates/quote-notification'
import {
  quoteConfirmationHtml,
  quoteConfirmationSubject,
} from '@/lib/email/templates/quote-confirmation'
import {
  contactNotificationHtml,
  contactNotificationSubject,
} from '@/lib/email/templates/contact-notification'

interface QuoteEmailPayload {
  quoteId: string
  customerName: string
  companyName?: string
  email: string
  phone: string
  city?: string
  message?: string
  items: Array<{ productName: string; quantity: number }>
}

// Sends both company notification and customer confirmation in parallel.
export async function sendQuoteEmails(payload: QuoteEmailPayload): Promise<void> {
  const resend = getResend()
  const submittedAt = new Date().toLocaleString('en-IN', {
    timeZone: 'Asia/Kolkata',
    dateStyle: 'medium',
    timeStyle: 'short',
  })

  await Promise.allSettled([
    // 1. Notify the company
    resend.emails.send({
      from: FROM_EMAIL,
      to: [COMPANY_EMAIL],
      subject: quoteNotificationSubject(payload.customerName),
      html: quoteNotificationHtml({
        quoteId:      payload.quoteId,
        customerName: payload.customerName,
        companyName:  payload.companyName,
        email:        payload.email,
        phone:        payload.phone,
        city:         payload.city,
        message:      payload.message,
        items:        payload.items,
        submittedAt,
      }),
    }),
    // 2. Confirm to the customer
    resend.emails.send({
      from:    FROM_EMAIL,
      to:      [payload.email],
      subject: quoteConfirmationSubject(),
      html:    quoteConfirmationHtml({
        customerName: payload.customerName,
        items:        payload.items,
      }),
    }),
  ])
}

interface ContactEmailPayload {
  name: string
  email: string
  subject: string | null
  message: string
}

// Sends a contact message notification to the company.
export async function sendContactEmail(payload: ContactEmailPayload): Promise<void> {
  const resend = getResend()
  const receivedAt = new Date().toLocaleString('en-IN', {
    timeZone: 'Asia/Kolkata',
    dateStyle: 'medium',
    timeStyle: 'short',
  })

  await resend.emails.send({
    from:    FROM_EMAIL,
    to:      [COMPANY_EMAIL],
    subject: contactNotificationSubject(payload.name),
    html:    contactNotificationHtml({ ...payload, receivedAt }),
  })
}
