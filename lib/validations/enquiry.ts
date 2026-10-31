import { z } from 'zod'

export const enquirySchema = z.object({
  type: z.enum(['QUOTE', 'WHOLESALE', 'GENERAL']).default('GENERAL'),

  name: z
    .string({ required_error: 'Name is required' })
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name is too long')
    .trim(),

  company: z
    .string()
    .max(100, 'Company name is too long')
    .trim()
    .optional(),

  country: z
    .string()
    .max(100, 'Country name is too long')
    .trim()
    .optional(),

  email: z
    .string({ required_error: 'Email is required' })
    .email('Please enter a valid email address')
    .toLowerCase()
    .trim(),

  phone: z
    .string()
    .max(50, 'Phone number is too long')
    .trim()
    .optional(),

  whatsapp: z
    .string()
    .max(50, 'WhatsApp number is too long')
    .trim()
    .optional(),

  productId: z.string().uuid().optional(),

  productName: z
    .string()
    .max(255, 'Product name is too long')
    .trim()
    .optional(),

  quantity: z
    .number()
    .int()
    .positive('Quantity must be a positive number')
    .optional(),

  message: z
    .string()
    .max(2000, 'Message is too long (max 2000 characters)')
    .trim()
    .optional(),

  // Honeypot field — must be empty. Bots typically fill all fields.
  website: z.string().max(0, 'Bot detected').optional(),
})

export type EnquiryInput = z.infer<typeof enquirySchema>
