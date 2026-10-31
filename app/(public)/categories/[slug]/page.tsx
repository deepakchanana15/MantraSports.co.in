import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { prisma } from '@/lib/db/prisma'
import { ProductCard } from '@/components/shop/ProductCard'

type Props = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  try {
    const cat = await prisma.category.findUnique({
      where: { slug },
      select: { name: true, metaTitle: true, metaDescription: true, description: true },
    })
    if (!cat) return {}
    const seo = CATEGORY_SEO[slug]
    // DB meta fields for categories are generic seed data — India SEO copy lives here
    return {
      title: seo?.title ?? `Buy ${cat.name} Online in India`,
      description: seo?.description ?? `Shop ${cat.name.toLowerCase()} from Mantra Sports India. Premium cricket gear with free delivery across India.`,
    }
  } catch {
    return {}
  }
}

const CATEGORY_SEO: Record<string, { title: string; description: string }> = {
  'cricket-bats': {
    title: 'English Willow Cricket Bats — Buy Online in India',
    description: 'Shop Mantra Sports English willow cricket bats — Magnitude, Raptor and Cobra ranges. 12-month bat warranty and free delivery across India.',
  },
  'protective-gear': {
    title: 'Cricket Protective Gear — Batting Pads, Gloves & Helmets',
    description: 'Buy cricket batting pads, batting gloves, wicket-keeping gloves and helmets from Mantra Sports India. Free delivery across India.',
  },
  'balls': {
    title: 'Leather Cricket Balls — Red, White & Pink',
    description: 'Shop leather cricket balls in red, white, pink and yellow from Mantra Sports India for matches and training. Free delivery across India.',
  },
  'accessories': {
    title: 'Cricket Accessories — Grips, Mallets & Kit Bags',
    description: 'Cricket bat grips, grip cones, bat mallets, scuff sheets and kit bags from Mantra Sports India. Free delivery across India.',
  },
  'teamwear': {
    title: 'Cricket Teamwear for Clubs & Academies',
    description: 'Cricket teamwear for clubs, schools and academies from Mantra Sports India. Request a team quote.',
  },
  'custom-apparel': {
    title: 'Custom Cricket Teamwear & Apparel',
    description: 'Custom cricket jerseys, trousers and team kit made to order for clubs, schools and academies across India. Request a B2B quote from Mantra Sports.',
  },
}

const SORT_OPTIONS = [
  { value: 'newest',     label: 'Newest' },
  { value: 'featured',   label: 'Featured' },
  { value: 'price_asc',  label: 'Price ↑' },
  { value: 'price_desc', label: 'Price ↓' },
]

const PER_PAGE = 24

export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ sort?: string; page?: string }>
}) {
  const { slug } = await params
  const sp = await searchParams
  const sort = sp.sort ?? 'newest'
  const page = Math.max(1, parseInt(sp.page ?? '1', 10))

  let category: any = null
  let products: any[] = []
  let total = 0

  try {
    category = await prisma.category.findUnique({ where: { slug } })
    if (!category) notFound()

    const orderBy: any =
      sort === 'price_asc'  ? { price: 'asc' }
      : sort === 'price_desc' ? { price: 'desc' }
      : sort === 'featured'   ? [{ isFeatured: 'desc' }, { createdAt: 'desc' }]
      : { createdAt: 'desc' }

    const where = { status: 'ACTIVE' as const, categoryId: category.id }
    ;[products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        orderBy,
        skip: (page - 1) * PER_PAGE,
        take: PER_PAGE,
        include: {
          images: { orderBy: [{ isPrimary: 'desc' }, { sortOrder: 'asc' }] },
          category: { select: { name: true, slug: true } },
        },
      }),
      prisma.product.count({ where }),
    ])
  } catch {
    if (!category) notFound()
  }

  const totalPages = Math.ceil(total / PER_PAGE)
  const displayName = category.name

  return (
    <>
      {/* Header */}
      {category.imageUrl && (
        <div
          className="relative flex items-end"
          style={{
            height: 280,
            background: `linear-gradient(to bottom, transparent 30%, rgba(0,0,0,0.7)), url(${category.imageUrl}) center/cover no-repeat`,
          }}
        >
          <div className="mx-auto w-full max-w-[1440px] px-4 sm:px-8 lg:px-[60px]" style={{ paddingBottom: 32 }}>
            <h1
              style={{
                fontFamily: 'var(--font-oswald), Oswald, sans-serif',
                fontWeight: 700,
                fontSize: 48,
                letterSpacing: '-0.02em',
                textTransform: 'uppercase',
                color: '#fff',
                margin: 0,
                lineHeight: 1,
              }}
            >
              {displayName}
            </h1>
          </div>
        </div>
      )}

      <section style={{ borderBottom: '1px solid #E0DFDB' }}>
        <div className="mx-auto max-w-[1440px] px-4 sm:px-8 lg:px-[60px]" style={{ paddingTop: category.imageUrl ? 20 : 48 }}>
          {/* Breadcrumb */}
          <nav className="mb-4 flex items-center gap-1.5 text-xs text-[#999]">
            <Link href="/" className="hover:text-[#E85D1A] transition-colors">Home</Link>
            <span>/</span>
            <Link href="/shop" className="hover:text-[#E85D1A] transition-colors">Shop</Link>
            <span>/</span>
            <span className="text-[#111]">{displayName}</span>
          </nav>

          {!category.imageUrl && (
            <h1
              style={{
                fontFamily: 'var(--font-oswald), Oswald, sans-serif',
                fontWeight: 700,
                fontSize: 40,
                letterSpacing: '-0.02em',
                textTransform: 'uppercase',
                color: '#111111',
                lineHeight: 1,
                marginBottom: 8,
              }}
            >
              {displayName}
            </h1>
          )}
          {category.description && (
            <p className="mb-4 max-w-xl text-sm text-[#666]">{category.description}</p>
          )}

          {/* Sort / count bar */}
          <div className="flex items-center justify-between py-3">
            <p className="text-xs text-[#999]">{total} {total === 1 ? 'Product' : 'Products'}</p>
            <form method="GET" className="flex items-center gap-2">
              {page > 1 && <input type="hidden" name="page" value="1" />}
              <select
                name="sort"
                defaultValue={sort}
                className="rounded border border-[#E0DFDB] bg-white px-2.5 py-1.5 text-xs text-[#444] outline-none focus:border-[#E85D1A] cursor-pointer"
              >
                {SORT_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
              <button
                type="submit"
                className="rounded border border-[#E0DFDB] bg-white px-3 py-1.5 text-xs font-semibold text-[#444] hover:border-[#E85D1A] hover:text-[#E85D1A]"
              >
                Sorteren
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Grid */}
      <section className="mx-auto max-w-[1440px] px-4 sm:px-8 lg:px-[60px]" style={{ paddingTop: 48, paddingBottom: 80 }}>
        {products.length === 0 ? (
          <div className="py-24 text-center">
            <p className="font-display text-xl font-bold uppercase text-[#111]">No Products Found</p>
            <p className="mt-2 text-sm text-[#999]">There are no products in this category yet.</p>
            <Link
              href="/shop"
              className="mt-6 inline-block border border-[#111] px-6 py-2.5 font-display text-xs font-bold uppercase tracking-widest text-[#111] hover:bg-[#111] hover:text-white transition-colors"
            >
              View All Products
            </Link>
          </div>
        ) : (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
              gap: 32,
            }}
          >
            {products.map((p: any) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-16 flex items-center justify-center gap-2">
            {page > 1 && (
              <Link href={`/categories/${slug}?sort=${sort}&page=${page - 1}`}
                className="border border-[#E0DFDB] px-4 py-2 text-xs font-semibold uppercase tracking-wider text-[#444] hover:border-[#111] transition-colors"
              >
                ← Previous
              </Link>
            )}
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <Link key={p}
                href={`/categories/${slug}?sort=${sort}&page=${p}`}
                className={`inline-block border px-4 py-2 text-xs font-semibold uppercase tracking-wider transition-colors ${
                  p === page ? 'border-[#111] bg-[#111] text-white' : 'border-[#E0DFDB] text-[#444] hover:border-[#111]'
                }`}
              >
                {p}
              </Link>
            ))}
            {page < totalPages && (
              <Link href={`/categories/${slug}?sort=${sort}&page=${page + 1}`}
                className="border border-[#E0DFDB] px-4 py-2 text-xs font-semibold uppercase tracking-wider text-[#444] hover:border-[#111] transition-colors"
              >
                Next →
              </Link>
            )}
          </div>
        )}
      </section>
    </>
  )
}
