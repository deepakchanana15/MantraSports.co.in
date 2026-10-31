import { SITE_CONFIG } from '@/lib/config/site'

// Generic JSON-LD injector
interface JsonLdProps {
  data: Record<string, unknown>
}

export function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  )
}

// ─── Pre-composed Schema types ────────────────────────────────────────────────

export function OrganizationSchema() {
  return (
    <JsonLd
      data={{
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: SITE_CONFIG.name,
        legalName: SITE_CONFIG.company.legalName,
        url: SITE_CONFIG.url,
        logo: `${SITE_CONFIG.url}/images/brand/logo.png`,
        email: SITE_CONFIG.contact.email,
        telephone: SITE_CONFIG.contact.phone,
        address: {
          '@type': 'PostalAddress',
          streetAddress: SITE_CONFIG.company.street,
          addressLocality: SITE_CONFIG.company.city,
          addressRegion: 'TAS',
          postalCode: SITE_CONFIG.company.postalCode,
          addressCountry: SITE_CONFIG.company.countryCode,
        },
        contactPoint: {
          '@type': 'ContactPoint',
          contactType: 'customer service',
          email: SITE_CONFIG.contact.email,
          availableLanguage: ['Dutch', 'English'],
        },
        sameAs: [
          SITE_CONFIG.social.instagram,
          SITE_CONFIG.social.facebook,
          SITE_CONFIG.social.linkedin,
        ].filter((s) => s && s !== '#'),
      }}
    />
  )
}

export function WebsiteSchema() {
  return (
    <JsonLd
      data={{
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: SITE_CONFIG.name,
        url: SITE_CONFIG.url,
        potentialAction: {
          '@type': 'SearchAction',
          target: {
            '@type': 'EntryPoint',
            urlTemplate: `${SITE_CONFIG.url}/shop?q={search_term_string}`,
          },
          'query-input': 'required name=search_term_string',
        },
      }}
    />
  )
}

interface ProductSchemaProps {
  name: string
  description?: string
  image?: string
  price?: number
  currency?: string
  sku?: string
  availability?: 'InStock' | 'OutOfStock' | 'PreOrder'
  url: string
  brand?: string
}

export function ProductSchema({
  name,
  description,
  image,
  price,
  currency = 'EUR',
  sku,
  availability = 'InStock',
  url,
  brand = 'Mantra Sports',
}: ProductSchemaProps) {
  return (
    <JsonLd
      data={{
        '@context': 'https://schema.org',
        '@type': 'Product',
        name,
        description,
        image,
        sku,
        brand: { '@type': 'Brand', name: brand },
        url: `${SITE_CONFIG.url}${url}`,
        ...(price != null && {
          offers: {
            '@type': 'Offer',
            price: price.toFixed(2),
            priceCurrency: currency,
            availability: `https://schema.org/${availability}`,
            seller: { '@type': 'Organization', name: SITE_CONFIG.name },
          },
        }),
      }}
    />
  )
}

interface ArticleSchemaProps {
  title: string
  description?: string
  image?: string
  publishedAt: Date
  updatedAt?: Date
  author?: string
  url: string
}

export function ArticleSchema({
  title,
  description,
  image,
  publishedAt,
  updatedAt,
  author,
  url,
}: ArticleSchemaProps) {
  return (
    <JsonLd
      data={{
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: title,
        description,
        image,
        datePublished: publishedAt.toISOString(),
        dateModified: (updatedAt ?? publishedAt).toISOString(),
        author: { '@type': 'Person', name: author ?? SITE_CONFIG.name },
        publisher: {
          '@type': 'Organization',
          name: SITE_CONFIG.name,
          logo: `${SITE_CONFIG.url}/images/brand/logo.png`,
        },
        mainEntityOfPage: { '@type': 'WebPage', '@id': `${SITE_CONFIG.url}${url}` },
      }}
    />
  )
}

interface FAQItem {
  question: string
  answer: string
}

export function FAQSchema({ items }: { items: FAQItem[] }) {
  return (
    <JsonLd
      data={{
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: items.map((item) => ({
          '@type': 'Question',
          name: item.question,
          acceptedAnswer: {
            '@type': 'Answer',
            text: item.answer,
          },
        })),
      }}
    />
  )
}
