import type { Metadata } from 'next'
import Link from 'next/link'
import { SlidersHorizontal } from 'lucide-react'
import { prisma } from '@/lib/db/prisma'
import { ProductCard } from '@/components/shop/ProductCard'
import { DEFAULT_CATEGORIES } from '@/lib/config/site'

export const metadata: Metadata = {
  title: 'Shop — All Products',
  description: 'Shop the full Mantra Sports range in India — English willow cricket bats, pads, gloves, helmets, leather balls and accessories. Free delivery across India.',
}

const PER_PAGE = 24

const SORT_OPTIONS = [
  { value: 'newest',     label: 'Newest' },
  { value: 'featured',   label: 'Featured' },
  { value: 'price_asc',  label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
]

type SearchParams = { category?: string; sort?: string; q?: string; page?: string }

export default async function ShopPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const params = await searchParams
  const activeCategory = params.category ?? ''
  const sort = params.sort ?? 'newest'
  const q = params.q ?? ''
  const page = Math.max(1, parseInt(params.page ?? '1', 10))

  let products: any[] = []
  let total = 0
  let categories: { id: string; name: string; slug: string }[] = []
  let dbError = false

  try {
    // Fetch categories for filter bar
    categories = await prisma.category.findMany({ orderBy: { sortOrder: 'asc' } })

    const where: any = {
      status: 'ACTIVE',
      ...(activeCategory && { category: { slug: activeCategory } }),
      ...(q && {
        OR: [
          { name: { contains: q, mode: 'insensitive' } },
          { description: { contains: q, mode: 'insensitive' } },
          { tags: { has: q } },
        ],
      }),
    }

    const orderBy: any =
      sort === 'price_asc'  ? { price: 'asc' }
      : sort === 'price_desc' ? { price: 'desc' }
      : sort === 'featured'   ? [{ isFeatured: 'desc' }, { createdAt: 'desc' }]
      : { createdAt: 'desc' }

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
    dbError = true
    // Fallback to empty state — no categories from config to avoid type mismatch
  }

  const totalPages = Math.ceil(total / PER_PAGE)
  const activeName =
    categories.find((c) => c.slug === activeCategory)?.name ??
    DEFAULT_CATEGORIES.find((c) => c.slug === activeCategory)?.name
  const activeLabel = activeName ?? undefined

  return (
    <>
      {/* Page Header */}
      <section style={{ borderBottom: '1px solid #E0DFDB' }}>
        <div className="mx-auto max-w-[1440px] px-4 sm:px-8 lg:px-[60px]" style={{ paddingTop: 48, paddingBottom: 32 }}>
          {/* Breadcrumb */}
          <nav className="mb-4 flex items-center gap-1.5 text-xs text-[#999]">
            <Link href="/" className="hover:text-[#E85D1A] transition-colors">Home</Link>
            <span>/</span>
            <span className="text-[#111]">Shop</span>
            {activeLabel && (
              <>
                <span>/</span>
                <span className="text-[#111]">{activeLabel}</span>
              </>
            )}
          </nav>

          <div className="flex items-end justify-between">
            <div>
              <h1
                style={{
                  fontFamily: 'var(--font-oswald), Oswald, sans-serif',
                  fontWeight: 700,
                  fontSize: 40,
                  letterSpacing: '-0.02em',
                  textTransform: 'uppercase',
                  color: '#111111',
                  lineHeight: 1,
                  margin: 0,
                }}
              >
                {activeLabel ?? 'All Products'}
              </h1>
              {!dbError && (
                <p className="mt-2 text-sm text-[#999]">{total} {total === 1 ? 'product' : 'products'}</p>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Filter Bar */}
      <section style={{ borderBottom: '1px solid #E0DFDB', background: '#FAFAFA' }}>
        <div className="mx-auto max-w-[1440px] px-4 sm:px-8 lg:px-[60px]">
          <form method="GET" className="flex items-center gap-0 overflow-x-auto">
            {/* Hidden fields to preserve other params */}
            {sort !== 'newest' && <input type="hidden" name="sort" value={sort} />}
            {q && <input type="hidden" name="q" value={q} />}

            {/* Category pills */}
            <div className="flex shrink-0 items-center gap-0">
              <Link
                href={buildUrl({ sort, q })}
                className={`whitespace-nowrap border-b-2 px-4 py-4 text-xs font-bold uppercase tracking-wider transition-colors ${
                  !activeCategory
                    ? 'border-[#E85D1A] text-[#E85D1A]'
                    : 'border-transparent text-[#666] hover:text-[#111]'
                }`}
              >
                All
              </Link>
              {(categories.length > 0 ? categories : Array.from(DEFAULT_CATEGORIES)).map((cat) => (
                <Link
                  key={cat.slug}
                  href={buildUrl({ category: cat.slug, sort, q })}
                  className={`whitespace-nowrap border-b-2 px-4 py-4 text-xs font-bold uppercase tracking-wider transition-colors ${
                    activeCategory === cat.slug
                      ? 'border-[#E85D1A] text-[#E85D1A]'
                      : 'border-transparent text-[#666] hover:text-[#111]'
                  }`}
                >
                  {cat.name}
                </Link>
              ))}
            </div>

            {/* Spacer */}
            <div className="ml-auto flex shrink-0 items-center gap-3 py-3 pl-4">
              {/* Search */}
              <div className="flex items-center gap-2">
                <input
                  name="q"
                  type="search"
                  defaultValue={q}
                  placeholder="Search…"
                  className="w-40 rounded border border-[#E0DFDB] bg-white px-3 py-1.5 text-xs outline-none focus:border-[#E85D1A]"
                />
                {activeCategory && <input type="hidden" name="category" value={activeCategory} />}
              </div>

              {/* Sort */}
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
                className="flex items-center gap-1.5 rounded border border-[#E0DFDB] bg-white px-3 py-1.5 text-xs font-semibold text-[#444] hover:border-[#E85D1A] hover:text-[#E85D1A]"
              >
                <SlidersHorizontal className="h-3 w-3" /> Filter
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* Product Grid */}
      <section className="mx-auto max-w-[1440px] px-4 sm:px-8 lg:px-[60px]" style={{ paddingTop: 48, paddingBottom: 80 }}>
        {dbError && (
          <div className="mb-8 rounded border border-amber-200 bg-amber-50 p-4 text-sm text-amber-700">
            Products could not be loaded right now. Please try again later.
          </div>
        )}

        {products.length === 0 && !dbError ? (
          <div className="py-24 text-center">
            <p
              style={{
                fontFamily: 'var(--font-oswald), Oswald, sans-serif',
                fontWeight: 600,
                fontSize: 24,
                textTransform: 'uppercase',
                letterSpacing: '-0.01em',
                color: '#111',
                marginBottom: 8,
              }}
            >
              No Products Found
            </p>
            <p className="text-sm text-[#999]">
              {q ? `No results for “${q}”. Try a different search term.` : 'There are no products in this category yet.'}
            </p>
            {(q || activeCategory) && (
              <Link
                href="/shop"
                className="mt-6 inline-block border border-[#111] px-6 py-2.5 font-display text-xs font-bold uppercase tracking-widest text-[#111] hover:bg-[#111] hover:text-white transition-colors"
              >
                View All Products
              </Link>
            )}
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
              <Link
                href={buildUrl({ category: activeCategory, sort, q, page: page - 1 })}
                className="border border-[#E0DFDB] px-4 py-2 text-xs font-semibold uppercase tracking-wider text-[#444] hover:border-[#111] hover:text-[#111] transition-colors"
              >
                ← Previous
              </Link>
            )}
            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter((p) => Math.abs(p - page) <= 2 || p === 1 || p === totalPages)
              .map((p, idx, arr) => (
                <span key={p}>
                  {idx > 0 && arr[idx - 1] !== p - 1 && (
                    <span className="px-1 text-[#999]">…</span>
                  )}
                  <Link
                    href={buildUrl({ category: activeCategory, sort, q, page: p })}
                    className={`inline-block border px-4 py-2 text-xs font-semibold uppercase tracking-wider transition-colors ${
                      p === page
                        ? 'border-[#111] bg-[#111] text-white'
                        : 'border-[#E0DFDB] text-[#444] hover:border-[#111] hover:text-[#111]'
                    }`}
                  >
                    {p}
                  </Link>
                </span>
              ))}
            {page < totalPages && (
              <Link
                href={buildUrl({ category: activeCategory, sort, q, page: page + 1 })}
                className="border border-[#E0DFDB] px-4 py-2 text-xs font-semibold uppercase tracking-wider text-[#444] hover:border-[#111] hover:text-[#111] transition-colors"
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

function buildUrl(params: { category?: string; sort?: string; q?: string; page?: number }): string {
  const sp = new URLSearchParams()
  if (params.category) sp.set('category', params.category)
  if (params.sort && params.sort !== 'newest') sp.set('sort', params.sort)
  if (params.q) sp.set('q', params.q)
  if (params.page && params.page > 1) sp.set('page', String(params.page))
  const qs = sp.toString()
  return qs ? `/shop?${qs}` : '/shop'
}
