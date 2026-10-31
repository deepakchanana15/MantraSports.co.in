import Link from 'next/link'
import { formatPrice, calculateDiscount } from '@/lib/utils/format'

type CardProduct = {
  slug: string
  name: string
  price: { toString(): string } | null
  salePrice: { toString(): string } | null
  isNewArrival: boolean
  isBestSeller: boolean
  stockStatus: string
  images: { url: string; altText: string | null; isPrimary: boolean }[]
  category: { name: string; slug: string } | null
}

const STOCK_BADGE: Record<string, { label: string; cls: string }> = {
  IN_STOCK:     { label: 'Op voorraad',    cls: 'bg-green-100 text-green-700' },
  OUT_OF_STOCK: { label: 'Niet leverbaar', cls: 'bg-red-100 text-red-600' },
  ON_REQUEST:   { label: 'Op aanvraag',    cls: 'bg-orange-100 text-orange-700' },
}

export function ProductCard({ product }: { product: CardProduct }) {
  const primaryImage = product.images.find((i) => i.isPrimary) ?? product.images[0]
  const price = product.price ? Number(product.price.toString()) : null
  const salePrice = product.salePrice ? Number(product.salePrice.toString()) : null
  const discount = price && salePrice ? calculateDiscount(price, salePrice) : 0
  const stock = STOCK_BADGE[product.stockStatus]

  return (
    <Link href={`/shop/${product.slug}`} className="group block">
      {/* Image */}
      <div className="relative aspect-[4/5] overflow-hidden bg-[#F8F7F4]">
        {primaryImage ? (
          <img
            src={primaryImage.url}
            alt={primaryImage.altText ?? product.name}
            className="h-full w-full object-contain transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-[#F2F1EE]">
            <svg width="64" height="64" viewBox="0 0 64 64" fill="none" className="opacity-20">
              <rect x="8" y="24" width="48" height="16" rx="4" fill="#111" />
              <rect x="28" y="8" width="8" height="48" rx="4" fill="#111" />
            </svg>
          </div>
        )}

        {/* Badge */}
        {discount > 0 ? (
          <span className="absolute left-3 top-3 bg-[#E85D1A] px-2 py-0.5 font-display text-[11px] font-bold uppercase text-white tracking-wider">
            -{discount}%
          </span>
        ) : product.isNewArrival ? (
          <span className="absolute left-3 top-3 bg-[#111111] px-2 py-0.5 font-display text-[11px] font-bold uppercase text-white tracking-wider">
            Nieuw
          </span>
        ) : product.isBestSeller ? (
          <span className="absolute left-3 top-3 bg-[#E85D1A] px-2 py-0.5 font-display text-[11px] font-bold uppercase text-white tracking-wider">
            Bestseller
          </span>
        ) : null}

        {/* Hover overlay CTA */}
        <div className="absolute inset-x-0 bottom-0 flex translate-y-full items-center justify-center bg-[#111111] py-3 transition-transform duration-300 group-hover:translate-y-0">
          <span className="font-display text-[11px] font-bold uppercase tracking-[0.18em] text-white">
            Nu aanvragen
          </span>
        </div>
      </div>

      {/* Info */}
      <div className="mt-3 space-y-1">
        {product.category && (
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#E85D1A]">
            {product.category.name}
          </p>
        )}
        <h3 className="font-display text-sm font-semibold uppercase tracking-tight text-[#111111] transition-colors group-hover:text-[#E85D1A] line-clamp-2 leading-snug">
          {product.name}
        </h3>
        <div className="flex items-baseline gap-2">
          {salePrice != null ? (
            <>
              <span className="font-display text-sm font-bold text-[#111111]">
                {formatPrice(salePrice)}
              </span>
              <span className="text-xs text-[#999] line-through">{formatPrice(price)}</span>
            </>
          ) : price != null ? (
            <span className="font-display text-sm font-bold text-[#111111]">
              {formatPrice(price)}
            </span>
          ) : (
            <span className="font-display text-xs font-medium text-[#999]">Prijs op aanvraag</span>
          )}
        </div>
        {stock && (
          <span className={`inline-block rounded px-1.5 py-0.5 text-[10px] font-semibold ${stock.cls}`}>
            {stock.label}
          </span>
        )}
      </div>
    </Link>
  )
}
