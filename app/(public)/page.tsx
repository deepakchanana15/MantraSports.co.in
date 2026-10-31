import type { Metadata } from 'next'
import { prisma } from '@/lib/db/prisma'
import { HomePageClient } from '@/components/home/HomePageClient'
import type { CategoryDisplay, ProductDisplay, HeroProduct } from '@/components/home/HomePageClient'
import { getSiteSettings } from '@/lib/utils/settings'
import { getGoogleReviews } from '@/lib/google-reviews'

export const metadata: Metadata = {
  title: { absolute: 'Mantra Sports India — Premium English Willow Cricket Bats & Gear' },
  description:
    'Shop premium English willow cricket bats, protective gear, leather balls, teamwear and accessories from Mantra Sports India. Free delivery across India. B2B & wholesale enquiries welcome.',
}

function toDisplay(p: {
  id: string
  name: string
  slug: string
  price: { toNumber(): number } | null
  salePrice: { toNumber(): number } | null
  category: { name: string } | null
  images: Array<{ url: string; altText: string | null }>
}): ProductDisplay {
  return {
    id: p.id,
    name: p.name,
    brand: p.category?.name ?? '',
    slug: p.slug,
    price: p.price ? p.price.toNumber() : null,
    salePrice: p.salePrice ? p.salePrice.toNumber() : null,
    imageUrl: p.images[0]?.url ?? null,
    imageAlt: p.images[0]?.altText ?? p.name,
  }
}

const productSelect = {
  id: true,
  name: true,
  slug: true,
  price: true,
  salePrice: true,
  category: { select: { name: true } },
  images: {
    where: { isPrimary: true },
    take: 1,
    select: { url: true, altText: true },
  },
} as const

export default async function HomePage() {
  let heroImageUrl = ''
  let heroProduct: HeroProduct | null = null
  let willowImageUrl: string | null = null
  let categories: CategoryDisplay[] = []
  let tabProducts = {
    new: [] as ProductDisplay[],
    bestseller: [] as ProductDisplay[],
    willow: [] as ProductDisplay[],
    sale: [] as ProductDisplay[],
  }

  try {
    const [heroSetting, cats, newArrivals, bestsellers, batProds, saleProds, featured, willowProduct] =
      await Promise.all([
        prisma.siteSetting.findUnique({ where: { key: 'hero_image_url' } }),

        prisma.category.findMany({
          orderBy: { sortOrder: 'asc' },
          select: {
            id: true,
            name: true,
            slug: true,
            imageUrl: true,
            _count: { select: { products: { where: { status: 'ACTIVE' } } } },
            products: {
              where: { status: 'ACTIVE' },
              take: 1,
              orderBy: { createdAt: 'desc' },
              select: {
                images: {
                  where: { isPrimary: true },
                  take: 1,
                  select: { url: true },
                },
              },
            },
          },
        }),

        prisma.product.findMany({
          where: { status: 'ACTIVE', isNewArrival: true },
          take: 4,
          orderBy: { createdAt: 'desc' },
          select: productSelect,
        }),

        prisma.product.findMany({
          where: { status: 'ACTIVE', isBestSeller: true },
          take: 4,
          orderBy: { createdAt: 'desc' },
          select: productSelect,
        }),

        prisma.product.findMany({
          where: { status: 'ACTIVE', category: { slug: 'cricket-bats' } },
          take: 4,
          orderBy: { createdAt: 'desc' },
          select: productSelect,
        }),

        prisma.product.findMany({
          where: { status: 'ACTIVE', NOT: { salePrice: null } },
          take: 4,
          orderBy: { createdAt: 'desc' },
          select: productSelect,
        }),

        prisma.product.findFirst({
          where: { status: 'ACTIVE', isFeatured: true },
          select: {
            name: true,
            slug: true,
            price: true,
            images: { where: { isPrimary: true }, take: 1, select: { url: true } },
          },
        }),

        // Featured cricket bat image for the English Willow dark section
        prisma.product.findFirst({
          where: { status: 'ACTIVE', category: { slug: 'cricket-bats' } },
          orderBy: [{ isFeatured: 'desc' }, { createdAt: 'desc' }],
          select: { images: { where: { isPrimary: true }, take: 1, select: { url: true } } },
        }),
      ])

    heroImageUrl = heroSetting?.value ?? ''

    categories = cats.map((cat) => ({
      id: cat.id,
      name: cat.name,
      slug: cat.slug,
      imageUrl: cat.imageUrl ?? cat.products[0]?.images[0]?.url ?? null,
      productCount: cat._count.products,
    }))

    tabProducts = {
      new: newArrivals.map(toDisplay),
      bestseller: bestsellers.map(toDisplay),
      willow: batProds.map(toDisplay),
      sale: saleProds.map(toDisplay),
    }

    if (featured) {
      heroProduct = {
        name: featured.name,
        slug: featured.slug,
        price: featured.price ? featured.price.toNumber() : null,
        imageUrl: featured.images[0]?.url ?? null,
      }
    }

    willowImageUrl = willowProduct?.images[0]?.url ?? null
  } catch {
    // DB unavailable — render with placeholder / static data
  }

  const [{ return_window_days }, reviews] = await Promise.all([
    getSiteSettings(['return_window_days']),
    getGoogleReviews(),
  ])

  return (
    <HomePageClient
      heroImageUrl={heroImageUrl}
      heroProduct={heroProduct}
      willowImageUrl={willowImageUrl}
      categories={categories}
      tabProducts={tabProducts}
      returnWindowDays={return_window_days}
      reviews={reviews}
    />
  )
}
