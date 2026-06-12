import { z } from 'zod'

export const quoteItemSchema = z.object({
  productId:   z.string().min(1, 'Product ID is required'),
  productName: z.string().min(1, 'Product name is required'),
  quantity:    z.number().int().positive('Quantity must be at least 1').max(9999),
})

export const quoteSubmissionSchema = z.object({
  customerName: z
    .string()
    .min(2, 'Full name must be at least 2 characters')
    .max(100)
    .trim(),
  companyName: z.string().max(150).trim().optional().or(z.literal('')),
  email: z
    .string()
    .email('Please enter a valid email address')
    .max(254)
    .toLowerCase()
    .trim(),
  phone: z
    .string()
    .min(7, 'Please enter a valid phone number')
    .max(20)
    .regex(/^[+\d\s\-().]+$/, 'Phone number contains invalid characters')
    .trim(),
  city:    z.string().max(100).trim().optional().or(z.literal('')),
  message: z.string().max(2000).trim().optional().or(z.literal('')),
  items:   z
    .array(quoteItemSchema)
    .min(1, 'Please add at least one product to your quote'),
  turnstileToken: z.string().min(1, 'CAPTCHA token is required'),
})

export type QuoteSubmissionInput = z.infer<typeof quoteSubmissionSchema>
