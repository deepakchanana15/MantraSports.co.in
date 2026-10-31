// ─── Shared TypeScript types for Mantra Sports DE ────────────────────────────
// These mirror the Prisma schema but are decoupled from the ORM layer
// so they can be used in both server and client components safely.

// ─── Enums ───────────────────────────────────────────────────────────────────

export type ProductStatus = 'ACTIVE' | 'HIDDEN' | 'ARCHIVED' | 'DRAFT'
export type StockStatus = 'IN_STOCK' | 'OUT_OF_STOCK' | 'ON_REQUEST'
export type EnquiryType = 'QUOTE' | 'WHOLESALE' | 'GENERAL'
export type EnquiryStatus = 'NEW' | 'READ' | 'REPLIED' | 'CLOSED'
export type AdminRole = 'SUPER_ADMIN' | 'ADMIN' | 'EDITOR'
export type BlogStatus = 'DRAFT' | 'PUBLISHED' | 'ARCHIVED'

// ─── Product ──────────────────────────────────────────────────────────────────

export interface ProductImage {
  id: string
  url: string
  altText: string | null
  isPrimary: boolean
  sortOrder: number
}

export interface ProductVariant {
  id: string
  name: string
  value: string
  sku: string | null
  price: number | null
  stockQty: number | null
  sortOrder: number
}

export interface Specification {
  label: string
  value: string
}

export interface Product {
  id: string
  name: string
  slug: string
  sku: string | null
  description: string | null
  features: string | null
  specifications: Specification[] | null
  status: ProductStatus
  isFeatured: boolean
  isNewArrival: boolean
  isBestSeller: boolean
  price: number | null
  salePrice: number | null
  currency: string
  stockStatus: StockStatus
  stockQty: number | null
  tags: string[]
  metaTitle: string | null
  metaDescription: string | null
  metaKeywords: string[]
  regions: string[]
  categoryId: string | null
  createdAt: Date
  updatedAt: Date
  // Relations (populated on demand)
  images?: ProductImage[]
  variants?: ProductVariant[]
  category?: Category | null
}

export type ProductCard = Pick<
  Product,
  | 'id'
  | 'name'
  | 'slug'
  | 'price'
  | 'salePrice'
  | 'currency'
  | 'stockStatus'
  | 'isFeatured'
  | 'isNewArrival'
  | 'isBestSeller'
  | 'status'
  | 'tags'
> & {
  primaryImage: ProductImage | null
  category: Pick<Category, 'name' | 'slug'> | null
}

// ─── Category ─────────────────────────────────────────────────────────────────

export interface Category {
  id: string
  name: string
  slug: string
  description: string | null
  imageUrl: string | null
  parentId: string | null
  metaTitle: string | null
  metaDescription: string | null
  sortOrder: number
  children?: Category[]
}

// ─── Collection ───────────────────────────────────────────────────────────────

export interface Collection {
  id: string
  name: string
  slug: string
  description: string | null
  bannerUrl: string | null
  isFeatured: boolean
  metaTitle: string | null
  metaDescription: string | null
  sortOrder: number
  productCount?: number
  products?: ProductCard[]
}

// ─── Enquiry ──────────────────────────────────────────────────────────────────

export interface Enquiry {
  id: string
  type: EnquiryType
  name: string
  company: string | null
  country: string | null
  email: string
  phone: string | null
  whatsapp: string | null
  productId: string | null
  productName: string | null
  quantity: number | null
  message: string | null
  status: EnquiryStatus
  createdAt: Date
  updatedAt: Date
}

export interface EnquiryFormData {
  type: EnquiryType
  name: string
  company?: string
  country?: string
  email: string
  phone?: string
  whatsapp?: string
  productId?: string
  productName?: string
  quantity?: number
  message?: string
  // Honeypot — must be empty to pass
  website?: string
}

// ─── Blog ─────────────────────────────────────────────────────────────────────

export interface BlogPost {
  id: string
  title: string
  slug: string
  excerpt: string | null
  content: string | null
  featuredImageUrl: string | null
  status: BlogStatus
  publishedAt: Date | null
  metaTitle: string | null
  metaDescription: string | null
  metaKeywords: string[]
  createdAt: Date
  updatedAt: Date
  author?: { name: string; email: string } | null
  categories?: BlogCategory[]
  tags?: BlogTag[]
}

export interface BlogCategory {
  id: string
  name: string
  slug: string
}

export interface BlogTag {
  id: string
  name: string
}

// ─── SEO ──────────────────────────────────────────────────────────────────────

export interface SeoMeta {
  title: string
  description: string
  canonical?: string
  ogImage?: string
  noIndex?: boolean
}

export interface JsonLdProps {
  data: Record<string, unknown>
}

// ─── Site Settings ────────────────────────────────────────────────────────────

export interface SiteSettings {
  siteName: string
  siteTagline: string
  contactEmail: string
  contactPhone: string
  contactAddress: string
  whatsappNumber: string
  socialInstagram: string
  socialFacebook: string
  socialLinkedin: string
  socialYoutube: string
  footerText: string
  metaTitle: string
  metaDescription: string
}

// ─── Admin ────────────────────────────────────────────────────────────────────

export interface AdminUser {
  id: string
  name: string
  email: string
  role: AdminRole
  lastLoginAt: Date | null
  createdAt: Date
}

// ─── Navigation ───────────────────────────────────────────────────────────────

export interface NavItem {
  label: string
  href: string
  children?: NavItem[]
}

// ─── Pagination ───────────────────────────────────────────────────────────────

export interface PaginatedResult<T> {
  data: T[]
  total: number
  page: number
  perPage: number
  totalPages: number
}

// ─── API Response ─────────────────────────────────────────────────────────────

export type ApiResponse<T = void> =
  | { success: true; data: T; message?: string }
  | { success: false; error: string; fieldErrors?: Record<string, string[]> }

// ─── Media ───────────────────────────────────────────────────────────────────

export interface MediaItem {
  id: string
  filename: string
  url: string
  mimeType: string
  size: number
  altText: string | null
  createdAt: Date
}
