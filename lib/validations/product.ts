import { z } from 'zod'

export const productSchema = z.object({
  name: z
    .string({ required_error: 'Product name is required' })
    .min(2, 'Name must be at least 2 characters')
    .max(255, 'Name is too long')
    .trim(),

  slug: z
    .string()
    .max(255, 'Slug is too long')
    .regex(/^[a-z0-9-]+$/, 'Slug can only contain lowercase letters, numbers and hyphens')
    .optional(),

  sku: z
    .string()
    .max(100, 'SKU is too long')
    .trim()
    .optional(),

  description: z.string().optional(),
  features: z.string().optional(),

  specifications: z
    .array(z.object({ label: z.string(), value: z.string() }))
    .optional(),

  status: z.enum(['ACTIVE', 'HIDDEN', 'ARCHIVED', 'DRAFT']).default('DRAFT'),

  isFeatured: z.boolean().default(false),
  isNewArrival: z.boolean().default(false),
  isBestSeller: z.boolean().default(false),

  price: z
    .number()
    .positive('Price must be greater than 0')
    .optional()
    .nullable(),

  salePrice: z
    .number()
    .positive('Sale price must be greater than 0')
    .optional()
    .nullable(),

  currency: z.string().length(3).default('EUR'),

  stockStatus: z.enum(['IN_STOCK', 'OUT_OF_STOCK', 'ON_REQUEST']).default('IN_STOCK'),

  stockQty: z.number().int().min(0).optional().nullable(),

  tags: z.array(z.string()).default([]),

  metaTitle: z.string().max(70).trim().optional(),
  metaDescription: z.string().max(160).trim().optional(),
  metaKeywords: z.array(z.string()).default([]),

  categoryId: z.string().uuid().optional().nullable(),
})

export type ProductInput = z.infer<typeof productSchema>
