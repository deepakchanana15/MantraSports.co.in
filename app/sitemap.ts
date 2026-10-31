import type { MetadataRoute } from 'next'
import { prisma } from '@/lib/db/prisma'
import { SITE_CONFIG } from '@/lib/config/site'

// Rebuilt at most once per hour so new/archived products show up without a deploy
export const revalidate = 3600

const BASE = SITE_CONFIG.url

function latest(dates: Date[]): Date | undefined {
  if (dates.length === 0) return undefined
  return new Date(Math.max(...dates.map((d) => d.getTime())))
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Static, always-indexable pages
  const staticEntries: MetadataRoute.Sitemap = [
    '/about',
    '/contact',
    '/wholesale',
    '/b2b',
    '/become-a-dealer',
    '/faq',
    '/shipping-policy',
    '/returns-policy',
    '/privacy-policy',
    '/terms-and-conditions',
    '/company-information',
  ].map((path) => ({ url: `${BASE}${path}` }))

  try {
    const [products, categories, collections, posts] = await Promise.all([
      prisma.product.findMany({
        where: { status: 'ACTIVE' },
        select: { slug: true, updatedAt: true, categoryId: true },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.category.findMany({
        select: { id: true, slug: true },
        orderBy: { sortOrder: 'asc' },
      }),
      prisma.collection.findMany({
        select: {
          slug: true,
          collectionProducts: {
            where: { product: { status: 'ACTIVE' } },
            select: { product: { select: { updatedAt: true } } },
          },
        },
        orderBy: [{ isFeatured: 'desc' }, { sortOrder: 'asc' }],
      }),
      prisma.blogPost.findMany({
        where: { status: 'PUBLISHED', publishedAt: { lte: new Date() } },
        select: { slug: true, updatedAt: true },
        orderBy: { publishedAt: 'desc' },
      }),
    ])

    const catalogUpdated = latest(products.map((p) => p.updatedAt))

    // Only list categories/collections with at least one ACTIVE product —
    // empty listing pages are thin content and shouldn't be submitted for indexing.
    const categoryEntries: MetadataRoute.Sitemap = categories.flatMap((cat) => {
      const catProducts = products.filter((p) => p.categoryId === cat.id)
      if (catProducts.length === 0) return []
      return [{
        url: `${BASE}/categories/${cat.slug}`,
        lastModified: latest(catProducts.map((p) => p.updatedAt)),
      }]
    })

    const collectionEntries: MetadataRoute.Sitemap = collections.flatMap((col) => {
      if (col.collectionProducts.length === 0) return []
      return [{
        url: `${BASE}/collections/${col.slug}`,
        lastModified: latest(col.collectionProducts.map((cp) => cp.product.updatedAt)),
      }]
    })

    const productEntries: MetadataRoute.Sitemap = products.map((p) => ({
      url: `${BASE}/shop/${p.slug}`,
      lastModified: p.updatedAt,
    }))

    const blogEntries: MetadataRoute.Sitemap = posts.map((post) => ({
      url: `${BASE}/blog/${post.slug}`,
      lastModified: post.updatedAt,
    }))

    return [
      { url: BASE, lastModified: catalogUpdated },
      { url: `${BASE}/shop`, lastModified: catalogUpdated },
      ...categoryEntries,
      ...(collectionEntries.length > 0 ? [{ url: `${BASE}/collections` }] : []),
      ...collectionEntries,
      ...staticEntries,
      ...productEntries,
      // Blog index only once there is something to read
      ...(blogEntries.length > 0 ? [{ url: `${BASE}/blog`, lastModified: latest(posts.map((p) => p.updatedAt)) }] : []),
      ...blogEntries,
    ]
  } catch (err) {
    // DB unavailable — still serve a valid sitemap with the static pages
    console.error('[sitemap] database query failed:', err)
    return [{ url: BASE }, { url: `${BASE}/shop` }, ...staticEntries]
  }
}
