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
    const nlName = NL_NAMES[slug] ?? cat.name
    // DB meta fields for categories are English seed data — build Dutch metadata here
    return {
      title: `${nlName} kopen`,
      description: `Koop ${nlName.toLowerCase()} bij Mantra Sports NL. Premium cricketuitrusting met persoonlijk advies — ook groothandel voor clubs en scholen.`,
    }
  } catch {
    return {}
  }
}

const NL_NAMES: Record<string, string> = {
  'cricket-bats':    'Cricketbats',
  'balls':           'Ballen',
  'protective-gear': 'Beschermende Uitrusting',
  'accessories':     'Accessoires',
  'teamwear':        'Teamkleding',
  'custom-apparel':  'Aangepaste Kleding',
}

const SORT_OPTIONS = [
  { value: 'newest',     label: 'Nieuwste' },
  { value: 'featured',   label: 'Aanbevolen' },
  { value: 'price_asc',  label: 'Prijs ↑' },
  { value: 'price_desc', label: 'Prijs ↓' },
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
  const displayName = NL_NAMES[slug] ?? category.name

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
          <div style={{ padding: '0 60px 32px', maxWidth: 1440, width: '100%', margin: '0 auto' }}>
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
        <div style={{ padding: category.imageUrl ? '20px 60px 0' : '48px 60px 0', maxWidth: 1440, margin: '0 auto' }}>
          {/* Breadcrumb */}
          <nav className="mb-4 flex items-center gap-1.5 text-xs text-[#999]">
            <Link href="/" className="hover:text-[#E85D1A] transition-colors">Startpagina</Link>
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
            <p className="text-xs text-[#999]">{total} {total === 1 ? 'Product' : 'Producten'}</p>
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
      <section style={{ padding: '48px 60px 80px', maxWidth: 1440, margin: '0 auto' }}>
        {products.length === 0 ? (
          <div className="py-24 text-center">
            <p className="font-display text-xl font-bold uppercase text-[#111]">Geen producten gevonden</p>
            <p className="mt-2 text-sm text-[#999]">In deze categorie zijn nog geen producten beschikbaar.</p>
            <Link
              href="/shop"
              className="mt-6 inline-block border border-[#111] px-6 py-2.5 font-display text-xs font-bold uppercase tracking-widest text-[#111] hover:bg-[#111] hover:text-white transition-colors"
            >
              Alle producten bekijken
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
                ← Vorige
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
                Volgende →
              </Link>
            )}
          </div>
        )}
      </section>
    </>
  )
}
