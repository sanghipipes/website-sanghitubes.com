import { z } from 'zod'

export const contactSubmissionSchema = z.object({
  firstName: z.string().min(1, 'First name is required').max(50).trim(),
  lastName:  z.string().min(1, 'Last name is required').max(50).trim(),
  email: z
    .string()
    .email('Please enter a valid email address')
    .max(254)
    .toLowerCase()
    .trim(),
  subject: z
    .string()
    .min(1, 'Subject is required')
    .max(200)
    .trim(),
  message: z
    .string()
    .min(10, 'Message must be at least 10 characters')
    .max(3000)
    .trim(),
  turnstileToken: z.string().min(1, 'CAPTCHA token is required'),
})

export type ContactSubmissionInput = z.infer<typeof contactSubmissionSchema>
