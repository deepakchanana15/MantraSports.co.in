import type { Metadata } from 'next'
import Link from 'next/link'
import { prisma } from '@/lib/db/prisma'

export const metadata: Metadata = {
  title: 'Collections',
  description: 'Discover curated cricket collections from Mantra Sports India.',
}

export default async function CollectionsPage() {
  let collections: any[] = []
  let dbError = false

  try {
    collections = await prisma.collection.findMany({
      orderBy: [{ isFeatured: 'desc' }, { sortOrder: 'asc' }],
      include: { _count: { select: { collectionProducts: true } } },
    })
  } catch {
    dbError = true
  }

  return (
    <>
      {/* Header */}
      <section style={{ borderBottom: '1px solid #E0DFDB' }}>
        <div className="mx-auto max-w-[1440px] px-4 sm:px-8 lg:px-[60px]" style={{ paddingTop: 48, paddingBottom: 32 }}>
          <nav className="mb-4 flex items-center gap-1.5 text-xs text-[#999]">
            <Link href="/" className="hover:text-[#E85D1A] transition-colors">Home</Link>
            <span>/</span>
            <span className="text-[#111]">Collections</span>
          </nav>
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
            Collections
          </h1>
          <p className="text-sm text-[#666]">
            Curated selections for every playing level and style.
          </p>
        </div>
      </section>

      {/* Grid */}
      <section className="mx-auto max-w-[1440px] px-4 sm:px-8 lg:px-[60px]" style={{ paddingTop: 48, paddingBottom: 80 }}>
        {dbError && (
          <div className="mb-8 rounded border border-amber-200 bg-amber-50 p-4 text-sm text-amber-700">
            Collections could not be loaded right now. Please try again later.
          </div>
        )}

        {collections.length === 0 && !dbError ? (
          <div className="py-24 text-center">
            <p className="font-display text-xl font-bold uppercase text-[#111]">No Collections Yet</p>
            <p className="mt-2 text-sm text-[#999]">Binnenkort beschikbaar — kom snel terug.</p>
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
              gridTemplateColumns: 'repeat(auto-fill, minmax(min(340px, 100%), 1fr))',
              gap: 32,
            }}
          >
            {collections.map((col: any) => (
              <CollectionCard key={col.id} collection={col} />
            ))}
          </div>
        )}
      </section>
    </>
  )
}

function CollectionCard({ collection }: { collection: any }) {
  const count: number = collection._count?.collectionProducts ?? 0

  return (
    <Link href={`/collections/${collection.slug}`} className="group block">
      {/* Banner / image */}
      <div className="relative aspect-[16/9] overflow-hidden bg-[#111111]">
        {collection.bannerUrl ? (
          <img
            src={collection.bannerUrl}
            alt={collection.name}
            className="h-full w-full object-cover opacity-80 transition-all duration-500 group-hover:opacity-100 group-hover:scale-105"
          />
        ) : (
          <div
            className="flex h-full w-full items-center justify-center"
            style={{
              background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)',
            }}
          >
            <span
              style={{
                fontFamily: 'var(--font-oswald), Oswald, sans-serif',
                fontWeight: 700,
                fontSize: 32,
                textTransform: 'uppercase',
                letterSpacing: '-0.02em',
                color: 'rgba(255,255,255,0.12)',
              }}
            >
              {collection.name}
            </span>
          </div>
        )}

        {/* Featured badge */}
        {collection.isFeatured && (
          <span className="absolute left-4 top-4 bg-[#E85D1A] px-2.5 py-1 font-display text-[11px] font-bold uppercase tracking-wider text-white">
            Empfohlen
          </span>
        )}

        {/* Hover CTA */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <span className="border border-white px-6 py-2.5 font-display text-xs font-bold uppercase tracking-widest text-white backdrop-blur-sm" style={{ background: 'rgba(0,0,0,0.3)' }}>
            View Collection
          </span>
        </div>
      </div>

      {/* Info */}
      <div className="mt-4">
        <h2
          style={{
            fontFamily: 'var(--font-oswald), Oswald, sans-serif',
            fontWeight: 700,
            fontSize: 20,
            textTransform: 'uppercase',
            letterSpacing: '-0.01em',
            color: '#111',
            marginBottom: 4,
            transition: 'color 0.2s',
          }}
          className="group-hover:text-[#E85D1A]"
        >
          {collection.name}
        </h2>
        {collection.description && (
          <p className="text-sm leading-relaxed text-[#666] line-clamp-2">{collection.description}</p>
        )}
        <p className="mt-2 text-xs text-[#999]">{count} {count === 1 ? 'product' : 'products'}</p>
      </div>
    </Link>
  )
}
