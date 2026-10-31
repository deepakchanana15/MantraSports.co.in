import type { NavItem } from '@/types'

// ─── Core Site Configuration ─────────────────────────────────────────────────
export const SITE_CONFIG = {
  name: 'Mantra Sports NL',
  tagline: 'Speel zonder grenzen.',
  description:
    'Mantra Sports NL — Premium cricketbats, beschermende uitrusting, ballen, teamkleding en accessoires. Gebouwd voor prestaties. Wereldwijd vertrouwd.',
  // Canonical production origin — the apex domain 308-redirects here, so all
  // absolute URLs (metadataBase, canonicals, sitemap, robots, JSON-LD) use this host.
  url: 'https://www.mantrasports.nl',
  locale: 'nl-NL',
  region: 'nl',
  currency: 'EUR',
  currencySymbol: '€',

  contact: {
    email: 'info@mantrasports.nl',
    phone: '+61 46 624 2222',
    address: 'Unit 2, 5 Ford Court, Newnham TAS 7248, Australië',
    whatsapp: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? 'TO_BE_PROVIDED',
  },

  // Operating company (parent company, Australia)
  company: {
    legalName: 'Mantra Corporation Pty Ltd',
    abn: '13 675 757 838',
    street: 'Unit 2, 5 Ford Court',
    postalCode: '7248',
    city: 'Newnham, Launceston',
    region: 'Tasmanië',
    country: 'Australië',
    countryCode: 'AU',
  },

  social: {
    instagram: '#',
    facebook: '#',
    linkedin: '#',
    youtube: '#',
  },

  seo: {
    titleTemplate: '%s | Mantra Sports NL',
    defaultTitle: 'Mantra Sports NL — Premium Cricket Uitrusting',
    defaultDescription:
      'Premium cricketbats, beschermende uitrusting, teamkleding en accessoires bij Mantra Sports Nederland. Groothandel & B2B-aanvragen welkom.',
    defaultOgImage: '/images/og-default.jpg',
    twitterHandle: '@mantrasports',
  },
} as const

// ─── WhatsApp Helpers ─────────────────────────────────────────────────────────

export function getWhatsAppUrl(message?: string): string {
  const number = SITE_CONFIG.contact.whatsapp.replace(/\D/g, '')
  const encoded = encodeURIComponent(
    message ?? 'Hallo, ik wil graag informeren over Mantra Sports producten.'
  )
  return `https://wa.me/${number}?text=${encoded}`
}

export function getProductWhatsAppUrl(productName: string): string {
  const message = `Hallo, ik ben geïnteresseerd in ${productName}. Kunt u mij meer informatie geven?`
  return getWhatsAppUrl(message)
}

// ─── Navigation (Dutch frontend) ──────────────────────────────────────────────

export const MAIN_NAV: NavItem[] = [
  {
    label: 'Shop',
    href: '/shop',
    children: [
      { label: 'Alle Producten', href: '/shop' },
      { label: 'Cricketbats', href: '/categories/cricket-bats' },
      { label: 'Beschermende Uitrusting', href: '/categories/protective-gear' },
      { label: 'Ballen', href: '/categories/balls' },
      { label: 'Accessoires', href: '/categories/accessories' },
      { label: 'Teamkleding', href: '/categories/teamwear' },
      { label: 'Aangepaste Kleding', href: '/categories/custom-apparel' },
    ],
  },
  {
    label: 'Collecties',
    href: '/collections',
  },
  {
    label: 'Groothandel',
    href: '/wholesale',
    children: [
      { label: 'Groothandelsaanvraag', href: '/wholesale' },
      { label: 'B2B-Partnerschappen', href: '/b2b' },
      { label: 'Word Dealer', href: '/become-a-dealer' },
    ],
  },
  {
    label: 'Over Ons',
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
    title: 'Producten',
    links: [
      { label: 'Cricketbats', href: '/categories/cricket-bats' },
      { label: 'Beschermende Uitrusting', href: '/categories/protective-gear' },
      { label: 'Ballen', href: '/categories/balls' },
      { label: 'Accessoires', href: '/categories/accessories' },
      { label: 'Teamkleding', href: '/categories/teamwear' },
      { label: 'Aangepaste Kleding', href: '/categories/custom-apparel' },
    ],
  },
  company: {
    title: 'Bedrijf',
    links: [
      { label: 'Over Ons', href: '/about' },
      { label: 'Groothandel', href: '/wholesale' },
      { label: 'B2B-Partnerschappen', href: '/b2b' },
      { label: 'Word Dealer', href: '/become-a-dealer' },
      { label: 'Blog', href: '/blog' },
      { label: 'Contact', href: '/contact' },
    ],
  },
  support: {
    title: 'Hulp & Ondersteuning',
    links: [
      { label: 'FAQ', href: '/faq' },
      { label: 'Verzendbeleid', href: '/shipping-policy' },
      { label: 'Retourbeleid', href: '/returns-policy' },
      { label: 'Privacybeleid', href: '/privacy-policy' },
      { label: 'Algemene Voorwaarden', href: '/terms-and-conditions' },
      { label: 'Sitemap', href: '/sitemap.xml' },
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

// Dutch display names — category names in the DB are stored in English
export const CATEGORY_NAMES_NL: Record<string, string> = {
  'cricket-bats':    'Cricketbats',
  'balls':           'Ballen',
  'protective-gear': 'Beschermende Uitrusting',
  'accessories':     'Accessoires',
  'teamwear':        'Teamkleding',
  'custom-apparel':  'Aangepaste Kleding',
}

export function categoryNameNl(slug: string, fallback: string): string {
  return CATEGORY_NAMES_NL[slug] ?? fallback
}

// ─── Default Site Settings ────────────────────────────────────────────────────

export const DEFAULT_SITE_SETTINGS = {
  hero_image_url: '',
  site_name: 'Mantra Sports NL',
  site_tagline: 'Speel zonder grenzen.',
  site_description: SITE_CONFIG.description,
  contact_email: 'info@mantrasports.nl',
  contact_phone: SITE_CONFIG.contact.phone,
  contact_address: SITE_CONFIG.contact.address,
  whatsapp_number: 'TO_BE_PROVIDED',
  social_instagram: '',
  social_facebook: '',
  social_linkedin: '',
  social_youtube: '',
  social_twitter: '',
  social_tiktok: '',
  social_pinterest: '',
  footer_text: `© ${new Date().getFullYear()} Mantra Sports. Alle rechten voorbehouden.`,
  meta_title: SITE_CONFIG.seo.defaultTitle,
  meta_description: SITE_CONFIG.seo.defaultDescription,
} as const
