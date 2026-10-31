import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { MessageCircle, Mail, Tag, Check, Clock, PackageX } from 'lucide-react'
import { prisma } from '@/lib/db/prisma'
import { formatPrice, calculateDiscount } from '@/lib/utils/format'
import { ImageGallery } from '@/components/shop/ImageGallery'
import { ProductCard } from '@/components/shop/ProductCard'
import { getProductWhatsAppUrl, categoryNameNl } from '@/lib/config/site'

type Props = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  try {
    const p = await prisma.product.findUnique({
      where: { slug, status: 'ACTIVE' },
      select: { name: true, metaTitle: true, metaDescription: true, description: true },
    })
    if (!p) return {}
    return {
      title: p.metaTitle?.includes('Mantra Sports') ? { absolute: p.metaTitle } : (p.metaTitle ?? p.name),
      description: p.metaDescription ?? p.description?.slice(0, 160) ?? undefined,
    }
  } catch {
    return {}
  }
}

const STOCK_INFO: Record<string, { label: string; icon: typeof Check; cls: string }> = {
  IN_STOCK:     { label: 'Op voorraad',     icon: Check,    cls: 'text-green-600' },
  OUT_OF_STOCK: { label: 'Niet leverbaar',  icon: PackageX, cls: 'text-red-500' },
  ON_REQUEST:   { label: 'Op aanvraag',     icon: Clock,    cls: 'text-orange-500' },
}

export default async function ProductDetailPage({ params }: Props) {
  const { slug } = await params

  let product: any = null
  let related: any[] = []

  try {
    product = await prisma.product.findUnique({
      where: { slug, status: 'ACTIVE' },
      include: {
        images: { orderBy: [{ isPrimary: 'desc' }, { sortOrder: 'asc' }] },
        category: { select: { id: true, name: true, slug: true } },
      },
    })

    if (product?.category?.id) {
      related = await prisma.product.findMany({
        where: {
          status: 'ACTIVE',
          categoryId: product.category.id,
          id: { not: product.id },
        },
        take: 4,
        include: {
          images: { orderBy: [{ isPrimary: 'desc' }], take: 1 },
          category: { select: { name: true, slug: true } },
        },
      })
    }
  } catch { /* DB not connected */ }

  if (!product) notFound()

  const price = product.price ? Number(product.price.toString()) : null
  const salePrice = product.salePrice ? Number(product.salePrice.toString()) : null
  const discount = price && salePrice ? calculateDiscount(price, salePrice) : 0
  const stock = STOCK_INFO[product.stockStatus]
  const StockIcon = stock?.icon ?? Check

  const features: string[] = product.features
    ? product.features.split('\n').map((f: string) => f.trim()).filter(Boolean)
    : []

  const whatsappUrl = getProductWhatsAppUrl(product.name)
  const contactUrl = `/contact?product=${encodeURIComponent(product.slug)}`

  return (
    <>
      <div style={{ maxWidth: 1440, margin: '0 auto', padding: '40px 60px 80px' }}>
        {/* Breadcrumb */}
        <nav className="mb-8 flex items-center gap-1.5 text-xs text-[#999]">
          <Link href="/" className="hover:text-[#E85D1A] transition-colors">Startpagina</Link>
          <span>/</span>
          <Link href="/shop" className="hover:text-[#E85D1A] transition-colors">Shop</Link>
          {product.category && (
            <>
              <span>/</span>
              <Link
                href={`/categories/${product.category.slug}`}
                className="hover:text-[#E85D1A] transition-colors"
              >
                {categoryNameNl(product.category.slug, product.category.name)}
              </Link>
            </>
          )}
          <span>/</span>
          <span className="text-[#111]">{product.name}</span>
        </nav>

        {/* Product layout */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 64,
            alignItems: 'start',
          }}
          className="max-sm:!grid-cols-1 max-lg:gap-10"
        >
          {/* Gallery */}
          <ImageGallery images={product.images} name={product.name} />

          {/* Info */}
          <div>
            {product.category && (
              <p
                style={{
                  fontFamily: 'var(--font-oswald), Oswald, sans-serif',
                  fontSize: 11,
                  fontWeight: 700,
                  letterSpacing: '0.2em',
                  textTransform: 'uppercase',
                  color: '#E85D1A',
                  marginBottom: 8,
                }}
              >
                {categoryNameNl(product.category.slug, product.category.name)}
              </p>
            )}

            <h1
              style={{
                fontFamily: 'var(--font-oswald), Oswald, sans-serif',
                fontWeight: 700,
                fontSize: 36,
                letterSpacing: '-0.02em',
                textTransform: 'uppercase',
                color: '#111111',
                lineHeight: 1.05,
                marginBottom: 12,
              }}
            >
              {product.name}
            </h1>

            {product.sku && (
              <p className="mb-4 text-xs text-[#999]">Artikelnr.: {product.sku}</p>
            )}

            {/* Price */}
            <div className="mb-4 flex items-baseline gap-3">
              {salePrice != null ? (
                <>
                  <span style={{ fontFamily: 'var(--font-oswald)', fontSize: 28, fontWeight: 700, color: '#111' }}>
                    {formatPrice(salePrice)}
                  </span>
                  <span className="text-base text-[#999] line-through">{formatPrice(price)}</span>
                  <span className="rounded bg-[#E85D1A] px-2 py-0.5 font-display text-xs font-bold text-white">
                    -{discount}%
                  </span>
                </>
              ) : price != null ? (
                <span style={{ fontFamily: 'var(--font-oswald)', fontSize: 28, fontWeight: 700, color: '#111' }}>
                  {formatPrice(price)}
                </span>
              ) : (
                <span style={{ fontFamily: 'var(--font-oswald)', fontSize: 18, fontWeight: 600, color: '#999' }}>
                  Prijs op aanvraag
                </span>
              )}
            </div>

            {/* Stock */}
            {stock && (
              <div className={`mb-5 flex items-center gap-1.5 text-sm font-semibold ${stock.cls}`}>
                <StockIcon className="h-4 w-4" />
                {stock.label}
              </div>
            )}

            <div style={{ borderTop: '1px solid #E0DFDB', margin: '20px 0' }} />

            {/* Description */}
            {product.description && (
              <div className="mb-6">
                <p className="text-sm leading-relaxed text-[#444]">{product.description}</p>
              </div>
            )}

            {/* Features */}
            {features.length > 0 && (
              <div className="mb-6">
                <h3 className="mb-3 font-display text-xs font-bold uppercase tracking-[0.15em] text-[#111]">
                  Kenmerken
                </h3>
                <ul className="space-y-1.5">
                  {features.map((f, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-[#444]">
                      <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#E85D1A]" />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div style={{ borderTop: '1px solid #E0DFDB', margin: '20px 0' }} />

            {/* CTAs */}
            <div className="flex flex-col gap-3">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:brightness-90 transition-all"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                  background: '#25D366',
                  color: '#fff',
                  padding: '14px 24px',
                  fontFamily: 'var(--font-oswald), Oswald, sans-serif',
                  fontWeight: 700,
                  fontSize: 13,
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  textDecoration: 'none',
                }}
              >
                <MessageCircle size={16} />
                Aanvragen via WhatsApp
              </a>

              <Link
                href={contactUrl}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                  background: '#E85D1A',
                  color: '#fff',
                  padding: '14px 24px',
                  fontFamily: 'var(--font-oswald), Oswald, sans-serif',
                  fontWeight: 700,
                  fontSize: 13,
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  textDecoration: 'none',
                }}
                className="hover:bg-[#cc4e14] transition-colors"
              >
                <Mail size={16} />
                Offerte aanvragen
              </Link>
            </div>

            <p className="mt-3 text-center text-xs text-[#999]">
              We reageren doorgaans binnen 24 uur.
            </p>

            {/* Tags */}
            {product.tags?.length > 0 && (
              <div className="mt-6 flex flex-wrap items-center gap-2">
                <Tag className="h-3.5 w-3.5 text-[#999]" />
                {product.tags.map((tag: string) => (
                  <span
                    key={tag}
                    className="rounded border border-[#E0DFDB] px-2 py-0.5 text-[11px] text-[#666]"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Related Products */}
        {related.length > 0 && (
          <section style={{ marginTop: 80 }}>
            <div style={{ borderTop: '2px solid #111', paddingTop: 40, marginBottom: 32 }}>
              <h2
                style={{
                  fontFamily: 'var(--font-oswald), Oswald, sans-serif',
                  fontWeight: 700,
                  fontSize: 22,
                  textTransform: 'uppercase',
                  letterSpacing: '-0.01em',
                  color: '#111',
                }}
              >
                Vergelijkbare producten
              </h2>
            </div>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
                gap: 28,
              }}
            >
              {related.map((p: any) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </section>
        )}
      </div>
    </>
  )
}
