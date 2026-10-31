import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { prisma } from '@/lib/db/prisma'
import { ProductCard } from '@/components/shop/ProductCard'

type Props = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  try {
    const col = await prisma.collection.findUnique({
      where: { slug },
      select: { name: true, metaTitle: true, metaDescription: true, description: true },
    })
    if (!col) return {}
    return {
      title: col.metaTitle?.includes('Mantra Sports') ? { absolute: col.metaTitle } : (col.metaTitle ?? `${col.name} — Collection`),
      description: col.metaDescription ?? col.description?.slice(0, 160) ?? undefined,
    }
  } catch {
    return {}
  }
}

export default async function CollectionDetailPage({ params }: Props) {
  const { slug } = await params

  let collection: any = null
  let products: any[] = []

  try {
    collection = await prisma.collection.findUnique({
      where: { slug },
      include: {
        collectionProducts: {
          orderBy: { sortOrder: 'asc' },
          include: {
            product: {
              include: {
                images: { orderBy: [{ isPrimary: 'desc' }, { sortOrder: 'asc' }] },
                category: { select: { name: true, slug: true } },
              },
            },
          },
        },
      },
    })

    if (!collection) notFound()

    products = collection.collectionProducts
      .map((cp: any) => cp.product)
      .filter((p: any) => p.status === 'ACTIVE')
  } catch {
    if (!collection) notFound()
  }

  return (
    <>
      {/* Banner */}
      {collection.bannerUrl ? (
        <div
          className="relative flex items-end"
          style={{
            height: 360,
            background: `linear-gradient(to bottom, transparent 30%, rgba(0,0,0,0.75)), url(${collection.bannerUrl}) center/cover no-repeat`,
          }}
        >
          <div className="mx-auto w-full max-w-[1440px] px-4 sm:px-8 lg:px-[60px]" style={{ paddingBottom: 40 }}>
            <nav className="mb-3 flex items-center gap-1.5 text-xs text-white/60">
              <Link href="/" className="hover:text-white transition-colors">Home</Link>
              <span>/</span>
              <Link href="/collections" className="hover:text-white transition-colors">Collections</Link>
              <span>/</span>
              <span className="text-white">{collection.name}</span>
            </nav>
            <h1
              style={{
                fontFamily: 'var(--font-oswald), Oswald, sans-serif',
                fontWeight: 700,
                fontSize: 52,
                letterSpacing: '-0.02em',
                textTransform: 'uppercase',
                color: '#fff',
                margin: 0,
                lineHeight: 1,
              }}
            >
              {collection.name}
            </h1>
            {collection.description && (
              <p className="mt-3 max-w-lg text-sm text-white/75 leading-relaxed">
                {collection.description}
              </p>
            )}
          </div>
        </div>
      ) : (
        <section style={{ borderBottom: '1px solid #E0DFDB', background: '#111' }}>
          <div className="mx-auto max-w-[1440px] px-4 sm:px-8 lg:px-[60px]" style={{ paddingTop: 48, paddingBottom: 40 }}>
            <nav className="mb-4 flex items-center gap-1.5 text-xs text-white/40">
              <Link href="/" className="hover:text-[#E85D1A] transition-colors">Home</Link>
              <span>/</span>
              <Link href="/collections" className="hover:text-[#E85D1A] transition-colors">Collections</Link>
              <span>/</span>
              <span className="text-white/80">{collection.name}</span>
            </nav>
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
              {collection.name}
            </h1>
            {collection.description && (
              <p className="mt-3 max-w-xl text-sm text-white/60 leading-relaxed">
                {collection.description}
              </p>
            )}
          </div>
        </section>
      )}

      {/* Products */}
      <section className="mx-auto max-w-[1440px] px-4 sm:px-8 lg:px-[60px]" style={{ paddingTop: 48, paddingBottom: 80 }}>
        <div className="mb-8 flex items-center justify-between">
          <p className="text-sm text-[#999]">{products.length} {products.length === 1 ? 'product' : 'products'}</p>
          <Link
            href="/collections"
            className="text-xs font-semibold uppercase tracking-wider text-[#999] hover:text-[#E85D1A] transition-colors"
          >
            ← All Collections
          </Link>
        </div>

        {products.length === 0 ? (
          <div className="py-24 text-center">
            <p className="font-display text-xl font-bold uppercase text-[#111]">No Products Yet</p>
            <p className="mt-2 text-sm text-[#999]">Products will be added to this collection soon.</p>
            <Link
              href="/shop"
              className="mt-6 inline-block border border-[#111] px-6 py-2.5 font-display text-xs font-bold uppercase tracking-widest text-[#111] hover:bg-[#111] hover:text-white transition-colors"
            >
              Go to Shop
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
      </section>
    </>
  )
}
