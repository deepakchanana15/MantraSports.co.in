import type { NavItem } from '@/types'

// ─── Core Site Configuration ─────────────────────────────────────────────────
export const SITE_CONFIG = {
  name: 'Mantra Sports India',
  tagline: 'Performance. Got. Simplified.',
  description:
    'Mantra Sports India — premium English willow cricket bats, protective gear, balls, teamwear and accessories. Built for performance. Trusted worldwide.',
  // Canonical production origin — the apex domain redirects here, so all
  // absolute URLs (metadataBase, canonicals, sitemap, robots, JSON-LD) use this host.
  url: 'https://www.mantrasports.co.in',
  locale: 'en-IN',
  region: 'in',
  currency: 'INR',
  currencySymbol: '₹',

  contact: {
    email: 'support@mantrasports.com.au',
    phone: '+91 83689 15399',
    address: '75, Judges Enclave, Ahimsa Khand - 2, Indirapuram, Ghaziabad, Uttar Pradesh 201014, India',
    whatsapp: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? '918368915399',
  },

  // Operating business (seller of record in India)
  company: {
    legalName: 'Mantra Sports International',
    entityType: 'Sole Proprietorship',
    gstin: '09IVBPS2213F1ZM',
    street: '75, Judges Enclave, Ahimsa Khand - 2, Indirapuram',
    postalCode: '201014',
    city: 'Ghaziabad',
    region: 'Uttar Pradesh',
    regionCode: 'UP',
    country: 'India',
    countryCode: 'IN',
  },

  // Grievance Officer — Consumer Protection (E-Commerce) Rules, 2020
  grievanceOfficer: {
    name: 'Ravi Kumar Singh',
    designation: 'Manager',
    phone: '+91 83689 15399',
    email: 'support@mantrasports.com.au',
  },

  social: {
    instagram: '#',
    facebook: '#',
    linkedin: '#',
    youtube: '#',
  },

  seo: {
    titleTemplate: '%s | Mantra Sports India',
    defaultTitle: 'Mantra Sports India — Premium English Willow Cricket Bats & Gear',
    defaultDescription:
      'Shop premium English willow cricket bats, protective gear, leather balls, teamwear and accessories from Mantra Sports India. Free delivery across India. B2B & wholesale enquiries welcome.',
    defaultOgImage: '/images/og-default.jpg',
    twitterHandle: '@mantrasports',
  },
} as const

// ─── WhatsApp Helpers ─────────────────────────────────────────────────────────

export function getWhatsAppUrl(message?: string): string {
  const number = SITE_CONFIG.contact.whatsapp.replace(/\D/g, '')
  const encoded = encodeURIComponent(
    message ?? "Hi, I'd like to know more about Mantra Sports products."
  )
  return `https://wa.me/${number}?text=${encoded}`
}

export function getProductWhatsAppUrl(productName: string): string {
  const message = `Hi, I'm interested in the ${productName}. Could you share more details?`
  return getWhatsAppUrl(message)
}

// ─── Navigation ───────────────────────────────────────────────────────────────

export const MAIN_NAV: NavItem[] = [
  {
    label: 'Shop',
    href: '/shop',
    children: [
      { label: 'All Products', href: '/shop' },
      { label: 'Cricket Bats', href: '/categories/cricket-bats' },
      { label: 'Protective Gear', href: '/categories/protective-gear' },
      { label: 'Balls', href: '/categories/balls' },
      { label: 'Accessories', href: '/categories/accessories' },
      { label: 'Teamwear', href: '/categories/teamwear' },
      { label: 'Custom Apparel', href: '/categories/custom-apparel' },
    ],
  },
  {
    label: 'Collections',
    href: '/collections',
  },
  {
    label: 'Wholesale',
    href: '/wholesale',
    children: [
      { label: 'Wholesale Enquiry', href: '/wholesale' },
      { label: 'B2B Partnerships', href: '/b2b' },
      { label: 'Become a Dealer', href: '/become-a-dealer' },
    ],
  },
  {
    label: 'About',
    href: '/about',
  },
  {
    label: 'Blog',
    href: '/blog',
  },
  {
    label: 'Contact',
    href: '/contact',
  },
]

export const FOOTER_NAV = {
  products: {
    title: 'Products',
    links: [
      { label: 'Cricket Bats', href: '/categories/cricket-bats' },
      { label: 'Protective Gear', href: '/categories/protective-gear' },
      { label: 'Balls', href: '/categories/balls' },
      { label: 'Accessories', href: '/categories/accessories' },
      { label: 'Teamwear', href: '/categories/teamwear' },
      { label: 'Custom Apparel', href: '/categories/custom-apparel' },
    ],
  },
  company: {
    title: 'Company',
    links: [
      { label: 'About Us', href: '/about' },
      { label: 'Wholesale', href: '/wholesale' },
      { label: 'B2B Partnerships', href: '/b2b' },
      { label: 'Become a Dealer', href: '/become-a-dealer' },
      { label: 'Blog', href: '/blog' },
      { label: 'Contact', href: '/contact' },
    ],
  },
  support: {
    title: 'Help & Support',
    links: [
      { label: 'FAQ', href: '/faq' },
      { label: 'Track Your Order', href: '/order-status' },
      { label: 'Shipping Policy', href: '/shipping-policy' },
      { label: 'Returns & Refunds', href: '/returns-policy' },
      { label: 'Privacy Policy', href: '/privacy-policy' },
      { label: 'Terms & Conditions', href: '/terms-and-conditions' },
      { label: 'Grievance Redressal', href: '/company-information#grievance-officer' },
    ],
  },
}

// ─── Product Categories ───────────────────────────────────────────────────────

export const DEFAULT_CATEGORIES = [
  { name: 'Cricket Bats', slug: 'cricket-bats', sortOrder: 1 },
  { name: 'Protective Gear', slug: 'protective-gear', sortOrder: 2 },
  { name: 'Balls', slug: 'balls', sortOrder: 3 },
  { name: 'Accessories', slug: 'accessories', sortOrder: 4 },
  { name: 'Teamwear', slug: 'teamwear', sortOrder: 5 },
  { name: 'Custom Apparel', slug: 'custom-apparel', sortOrder: 6 },
] as const

// ─── Default Site Settings ────────────────────────────────────────────────────
// Editable in /admin/settings. Values here are used until a setting is saved.

export const DEFAULT_SITE_SETTINGS = {
  hero_image_url: '',
  site_name: 'Mantra Sports India',
  site_tagline: 'Performance. Got. Simplified.',
  site_description: SITE_CONFIG.description,
  contact_email: SITE_CONFIG.contact.email,
  contact_phone: SITE_CONFIG.contact.phone,
  contact_address: SITE_CONFIG.contact.address,
  whatsapp_number: '918368915399',
  social_instagram: '',
  social_facebook: '',
  social_linkedin: '',
  social_youtube: '',
  social_twitter: '',
  social_tiktok: '',
  social_pinterest: '',
  footer_text: `© ${new Date().getFullYear()} Mantra Sports International. All rights reserved.`,
  meta_title: SITE_CONFIG.seo.defaultTitle,
  meta_description: SITE_CONFIG.seo.defaultDescription,
  // Shipping & returns — shown on policy pages, FAQ, checkout and the trust bar
  shipping_processing_time: '1–2 business days',
  shipping_delivery_time: '3–7 business days within India (up to 15 business days for items shipped from Australia)',
  return_window_days: '7',
  response_time_hours: '24',
  announcement_text: 'Free delivery across India on all orders',
  // GST invoice defaults — used when a product has no HSN code / GST rate of its own
  default_gst_rate: '',
  default_hsn_code: '',
  // Google reviews (Google Business Profile) — see /admin/settings
  google_place_id: '',
  google_reviews_url: '',
  google_reviews_enabled: 'false',
} as const
