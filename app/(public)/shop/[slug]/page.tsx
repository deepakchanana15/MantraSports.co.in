import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { MessageCircle, Users, Tag, Check, Clock, PackageX, Truck, ShieldCheck, RefreshCw } from 'lucide-react'
import { prisma } from '@/lib/db/prisma'
import { formatPrice, calculateDiscount } from '@/lib/utils/format'
import { ImageGallery } from '@/components/shop/ImageGallery'
import { ProductCard } from '@/components/shop/ProductCard'
import { AddToCart } from '@/components/shop/AddToCart'
import { ProductSchema } from '@/components/seo/JsonLd'
import { getProductWhatsAppUrl } from '@/lib/config/site'
import { getSiteSettings } from '@/lib/utils/settings'

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
  IN_STOCK:     { label: 'In Stock',     icon: Check,    cls: 'text-green-600' },
  OUT_OF_STOCK: { label: 'Out of Stock', icon: PackageX, cls: 'text-red-500' },
  ON_REQUEST:   { label: 'Available on Request', icon: Clock, cls: 'text-orange-500' },
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

  const { return_window_days, shipping_delivery_time, response_time_hours } = await getSiteSettings([
    'return_window_days',
    'shipping_delivery_time',
    'response_time_hours',
  ])

  const price = product.price ? Number(product.price.toString()) : null
  const salePrice = product.salePrice ? Number(product.salePrice.toString()) : null
  const unitPrice = salePrice ?? price
  const discount = price && salePrice ? calculateDiscount(price, salePrice) : 0
  const stock = STOCK_INFO[product.stockStatus]
  const StockIcon = stock?.icon ?? Check
  const canBuy = unitPrice != null && product.stockStatus === 'IN_STOCK'

  const features: string[] = product.features
    ? product.features.split('\n').map((f: string) => f.trim()).filter(Boolean)
    : []

  const whatsappUrl = getProductWhatsAppUrl(product.name)
  const b2bUrl = `/b2b?product=${encodeURIComponent(product.slug)}`

  return (
    <>
      <ProductSchema
        name={product.name}
        description={product.metaDescription ?? product.description?.slice(0, 300) ?? undefined}
        image={product.images[0]?.url}
        price={unitPrice ?? undefined}
        sku={product.sku ?? undefined}
        availability={product.stockStatus === 'OUT_OF_STOCK' ? 'OutOfStock' : product.stockStatus === 'ON_REQUEST' ? 'PreOrder' : 'InStock'}
        url={`/shop/${product.slug}`}
      />

      <div className="mx-auto max-w-[1440px] px-4 pb-20 pt-8 sm:px-8 lg:px-[60px] lg:pt-10">
        {/* Breadcrumb */}
        <nav className="mb-8 flex flex-wrap items-center gap-1.5 text-xs text-[#999]" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-[#E85D1A] transition-colors">Home</Link>
          <span>/</span>
          <Link href="/shop" className="hover:text-[#E85D1A] transition-colors">Shop</Link>
          {product.category && (
            <>
              <span>/</span>
              <Link
                href={`/categories/${product.category.slug}`}
                className="hover:text-[#E85D1A] transition-colors"
              >
                {product.category.name}
              </Link>
            </>
          )}
          <span>/</span>
          <span className="text-[#111]">{product.name}</span>
        </nav>

        {/* Product layout */}
        <div className="grid grid-cols-1 items-start gap-10 md:grid-cols-2 lg:gap-16">
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
                {product.category.name}
              </p>
            )}

            <h1
              className="text-[28px] sm:text-[36px]"
              style={{
                fontFamily: 'var(--font-oswald), Oswald, sans-serif',
                fontWeight: 700,
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
              <p className="mb-4 text-xs text-[#999]">SKU: {product.sku}</p>
            )}

            {/* Price */}
            <div className="mb-1 flex flex-wrap items-baseline gap-3">
              {salePrice != null ? (
                <>
                  <span style={{ fontFamily: 'var(--font-oswald)', fontSize: 28, fontWeight: 700, color: '#111' }}>
                    {formatPrice(salePrice)}
                  </span>
                  <span className="text-base text-[#999] line-through">{formatPrice(price)}</span>
                  {discount > 0 && (
                    <span className="rounded bg-[#E85D1A] px-2 py-0.5 font-display text-xs font-bold text-white">
                      -{discount}%
                    </span>
                  )}
                </>
              ) : price != null ? (
                <span style={{ fontFamily: 'var(--font-oswald)', fontSize: 28, fontWeight: 700, color: '#111' }}>
                  {formatPrice(price)}
                </span>
              ) : (
                <span style={{ fontFamily: 'var(--font-oswald)', fontSize: 18, fontWeight: 600, color: '#999' }}>
                  Price on Request
                </span>
              )}
            </div>
            {unitPrice != null && (
              <p className="mb-4 text-xs text-[#6B6B6B]">Inclusive of all taxes · Free delivery across India</p>
            )}

            {/* Stock */}
            {stock && (
              <div className={`mb-5 flex items-center gap-1.5 text-sm font-semibold ${stock.cls}`}>
                <StockIcon className="h-4 w-4" />
                {stock.label}
              </div>
            )}

            {/* Buy */}
            {canBuy ? (
              <AddToCart
                product={{
                  id: product.id,
                  slug: product.slug,
                  name: product.name,
                  imageUrl: product.images[0]?.url ?? null,
                  unitPrice: unitPrice!,
                  optionName: product.optionName,
                  optionValues: product.optionValues ?? [],
                  maxQty: product.stockQty,
                }}
              />
            ) : (
              <p className="rounded-[2px] border border-[#E0DFDB] bg-[#F8F7F4] p-4 text-sm text-[#444]">
                {product.stockStatus === 'OUT_OF_STOCK'
                  ? 'This product is currently out of stock. Message us on WhatsApp and we will let you know when it is back.'
                  : 'This product is available on request. Message us on WhatsApp for price and availability.'}
              </p>
            )}

            {/* Enquiry options */}
            <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 rounded-[2px] px-4 py-3 font-display text-[13px] font-bold uppercase tracking-[0.1em] text-white transition-all hover:brightness-90"
                style={{ background: '#25D366' }}
              >
                <MessageCircle size={16} />
                Ask on WhatsApp
              </a>
              <Link
                href={b2bUrl}
                className="flex items-center justify-center gap-2 rounded-[2px] border-2 border-[#111] px-4 py-3 font-display text-[13px] font-bold uppercase tracking-[0.1em] text-[#111] transition-colors hover:bg-[#111] hover:text-white"
              >
                <Users size={16} />
                Bulk / Team Quote
              </Link>
            </div>
            <p className="mt-2 text-center text-xs text-[#999]">
              Buying for a club, school or shop? Request a B2B quote — we usually reply within {response_time_hours} hours.
            </p>

            {/* Delivery & returns */}
            <ul className="mt-6 space-y-2 border-y border-[#E0DFDB] py-4 text-sm text-[#444]">
              <li className="flex items-start gap-2"><Truck className="mt-0.5 h-4 w-4 shrink-0 text-[#E85D1A]" /> Free delivery — {shipping_delivery_time}</li>
              <li className="flex items-start gap-2"><RefreshCw className="mt-0.5 h-4 w-4 shrink-0 text-[#E85D1A]" /> {return_window_days}-day returns — <Link href="/returns-policy" className="underline">see policy</Link></li>
              <li className="flex items-start gap-2"><ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-[#E85D1A]" /> Secure payment via Razorpay — UPI, cards, netbanking</li>
            </ul>

            {/* Description */}
            {product.description && (
              <div className="my-6">
                <p className="whitespace-pre-line text-sm leading-relaxed text-[#444]">{product.description}</p>
              </div>
            )}

            {/* Features */}
            {features.length > 0 && (
              <div className="mb-6">
                <h2 className="mb-3 font-display text-xs font-bold uppercase tracking-[0.15em] text-[#111]">
                  Features
                </h2>
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

            {/* Mandatory product details (E-Commerce Rules / Legal Metrology) */}
            <dl className="mb-6 grid grid-cols-[auto_1fr] gap-x-6 gap-y-1.5 text-sm">
              {product.countryOfOrigin && (
                <>
                  <dt className="text-[#999]">Country of origin</dt>
                  <dd className="text-[#333]">{product.countryOfOrigin}</dd>
                </>
              )}
              <dt className="text-[#999]">Sold by</dt>
              <dd className="text-[#333]"><Link href="/company-information" className="underline">Mantra Sports International</Link></dd>
            </dl>

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
                You May Also Like
              </h2>
            </div>
            <div className="grid grid-cols-2 gap-4 sm:gap-7 lg:grid-cols-4">
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
