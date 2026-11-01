'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { subscribeNewsletter } from '@/lib/actions/newsletter'
import { formatPrice } from '@/lib/utils/format'
import { GoogleReviews } from '@/components/home/GoogleReviews'
import type { GoogleReviewsData } from '@/lib/google-reviews'
import {
  ShieldCheck,
  Truck,
  Award,
  Headphones,
  RefreshCw,
  Package,
  ChevronRight,
  ArrowRight,
} from 'lucide-react'

// ── Types ─────────────────────────────────────────────────────────────────────

export interface CategoryDisplay {
  id: string
  name: string
  slug: string
  imageUrl: string | null
  productCount: number
}

export interface ProductDisplay {
  id: string
  name: string
  brand: string
  slug: string
  price: number | null
  salePrice: number | null
  imageUrl: string | null
  imageAlt: string
}

export interface HeroProduct {
  name: string
  slug: string
  price: number | null
  imageUrl: string | null
}

interface Props {
  heroImageUrl: string
  heroProduct: HeroProduct | null
  willowImageUrl: string | null
  categories: CategoryDisplay[]
  tabProducts: {
    new: ProductDisplay[]
    bestseller: ProductDisplay[]
    willow: ProductDisplay[]
    sale: ProductDisplay[]
  }
  returnWindowDays: string
  reviews: GoogleReviewsData | null
}

// ── Static data ───────────────────────────────────────────────────────────────

const TABS = [
  { key: 'new', label: 'New Arrivals' },
  { key: 'bestseller', label: 'Bestsellers' },
  { key: 'willow', label: 'English Willow' },
  { key: 'sale', label: 'On Sale' },
]

const CATEGORIES = [
  { name: 'Cricket Bats', slug: 'cricket-bats', emoji: '🏏', href: '/categories/cricket-bats' },
  { name: 'Balls', slug: 'balls', emoji: '🔴', href: '/categories/balls' },
  { name: 'Protective Gear', slug: 'protective-gear', emoji: '🛡️', href: '/categories/protective-gear' },
  { name: 'Accessories', slug: 'accessories', emoji: '🎒', href: '/categories/accessories' },
  { name: 'Teamwear', slug: 'teamwear', emoji: '🎽', href: '/categories/teamwear' },
  { name: 'Custom Apparel', slug: 'custom-apparel', emoji: '👕', href: '/categories/custom-apparel' },
]

const WHY_ITEMS = [
  { icon: Award, title: 'Premium Quality', text: 'English willow bats and match-grade gear, built to perform from club nets to tournament cricket.' },
  { icon: Package, title: 'Wholesale & B2B', text: 'Volume pricing for clubs, schools, academies and dealers, with custom team kit on request.' },
  { icon: Truck, title: 'Free Delivery in India', text: 'Every order ships free to your door, anywhere in India. Any import duty is on us.' },
  { icon: Headphones, title: 'Expert Advice', text: 'Not sure which bat weight or pad size suits you? Our team will help you choose the right gear.' },
]

// ── Unified card type ─────────────────────────────────────────────────────────

type CardProduct = {
  id: string
  name: string
  brand: string
  price: number | null
  comparePrice: number | null
  badge: string
  badgeColor: string
  href: string
  imageUrl: string | null
}

function dbToCard(p: ProductDisplay, tab: string): CardProduct {
  const hasSale = p.salePrice !== null && p.salePrice !== undefined
  const badge = hasSale ? 'SALE' : tab === 'new' ? 'NEW' : tab === 'bestseller' ? 'BESTSELLER' : tab === 'willow' ? 'ENGLISH WILLOW' : ''
  const badgeColor = hasSale || tab === 'sale' ? '#e85d1a' : tab === 'new' ? '#059669' : tab === 'willow' ? '#92400e' : '#111111'
  return {
    id: p.id,
    name: p.name,
    brand: p.brand || 'Mantra Sports',
    price: hasSale ? p.salePrice : p.price,
    comparePrice: hasSale ? p.price : null,
    badge,
    badgeColor,
    href: `/shop/${p.slug}`,
    imageUrl: p.imageUrl,
  }
}

// ── Product Card ──────────────────────────────────────────────────────────────

function ProductCard({ product }: { product: CardProduct }) {
  return (
    <Link href={product.href} className="group flex h-full flex-col" style={{ background: '#ffffff' }}>
      <div className="relative flex h-[200px] items-center justify-center overflow-hidden sm:h-[260px]" style={{ background: '#F8F7F4' }}>
        {product.imageUrl ? (
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 50vw, 25vw"
            className="object-contain p-4"
          />
        ) : (
          <span className="select-none text-7xl" aria-hidden="true">🏏</span>
        )}

        {product.badge && (
          <span
            className="absolute left-3 top-3 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white"
            style={{ background: product.badgeColor }}
          >
            {product.badge}
          </span>
        )}

        <div
          className="absolute inset-0 hidden items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100 md:flex"
          style={{ background: 'rgba(17,17,17,0.6)' }}
        >
          <span className="border px-5 py-2 font-display text-[13px] font-semibold uppercase tracking-widest text-white" style={{ borderColor: 'white' }}>
            View Product
          </span>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-4" style={{ borderTop: '1px solid #E0DFDB' }}>
        <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.15em]" style={{ color: '#6B6B6B' }}>
          {product.brand}
        </p>
        <h3 className="mb-2 flex-1 font-display text-[15px] font-semibold uppercase leading-tight tracking-[0.02em] sm:text-[16px]" style={{ color: '#111111' }}>
          {product.name}
        </h3>

        <div className="flex flex-wrap items-baseline gap-2">
          {product.price !== null ? (
            <>
              <span className="font-display text-[18px] font-semibold sm:text-[20px]" style={{ color: '#e85d1a' }}>
                {formatPrice(product.price)}
              </span>
              {product.comparePrice && product.comparePrice !== product.price && (
                <span className="text-[13px] line-through" style={{ color: '#A0A0A0' }}>
                  {formatPrice(product.comparePrice)}
                </span>
              )}
            </>
          ) : (
            <span className="font-display text-[14px] font-semibold uppercase tracking-wider" style={{ color: '#6B6B6B' }}>
              Price on Request
            </span>
          )}
        </div>
      </div>
    </Link>
  )
}

// ── Main component ────────────────────────────────────────────────────────────

export function HomePageClient({ heroImageUrl, heroProduct, willowImageUrl, categories, tabProducts, returnWindowDays, reviews }: Props) {
  const [activeTab, setActiveTab] = useState('new')
  const [email, setEmail] = useState('')
  const [newsletterSent, setNewsletterSent] = useState(false)
  const [newsletterError, setNewsletterError] = useState('')
  const [newsletterLoading, setNewsletterLoading] = useState(false)

  const trustItems = [
    { icon: Truck, text: 'Free delivery across India' },
    { icon: ShieldCheck, text: 'Secure payments — UPI, cards & netbanking' },
    { icon: RefreshCw, text: `${returnWindowDays}-day returns` },
    { icon: Award, text: 'Authentic Mantra Sports gear' },
    { icon: Headphones, text: 'Personal customer support' },
  ]

  // Category image lookup: slug → imageUrl from DB
  const catImageBySlug: Record<string, string | null> = {}
  const catCountBySlug: Record<string, number> = {}
  for (const cat of categories) {
    catImageBySlug[cat.slug] = cat.imageUrl
    catCountBySlug[cat.slug] = cat.productCount
  }

  function getTabCards(tab: string): CardProduct[] {
    const dbList = tabProducts[tab as keyof typeof tabProducts]
    return dbList ? dbList.map((p) => dbToCard(p, tab)) : []
  }

  // Hide tabs without products (e.g. no items on sale); show all if none have any
  const tabsWithProducts = TABS.filter((t) => getTabCards(t.key).length > 0)
  const visibleTabs = tabsWithProducts.length > 0 ? tabsWithProducts : TABS
  const currentTab = visibleTabs.some((t) => t.key === activeTab) ? activeTab : visibleTabs[0].key

  const filteredProducts = getTabCards(currentTab)

  // Hero visual
  const heroVisualUrl = heroImageUrl || heroProduct?.imageUrl || null
  const heroName = heroProduct?.name || 'English Willow Cricket Bats'

  return (
    <div className="overflow-x-hidden bg-white">

      {/* ══════════════════════════════════════════════════════════════
          HERO
      ══════════════════════════════════════════════════════════════ */}
      <section aria-labelledby="hero-heading" className="grid grid-cols-1 lg:min-h-[88vh] lg:grid-cols-2" style={{ borderBottom: '1px solid #E0DFDB' }}>
        <div className="flex flex-col justify-center px-5 py-14 sm:px-10 lg:border-r lg:py-20 lg:pl-20 lg:pr-[60px]" style={{ borderColor: '#E0DFDB' }}>
          <span className="mb-7 inline-flex items-center gap-2 self-start rounded-[2px] px-[14px] py-[6px] font-display text-[11px] font-semibold uppercase tracking-[0.18em] text-white" style={{ background: '#e85d1a' }}>
            🏏 Now in India
          </span>

          <h1 id="hero-heading" className="mb-6 font-display font-bold uppercase leading-[0.93] tracking-[-0.01em]" style={{ fontSize: 'clamp(44px, 7vw, 88px)', color: '#111111' }}>
            PERFORMANCE.<br />GOT.<br /><span style={{ color: '#e85d1a' }}>SIMPLIFIED.</span>
          </h1>

          <p className="mb-10 max-w-[440px] text-[16px] font-light leading-[1.7]" style={{ color: '#6B6B6B' }}>
            Premium English willow bats, protective gear and teamwear from Mantra Sports — delivered free to your door anywhere in India.
          </p>

          <div className="mb-14 flex flex-wrap gap-3">
            <Link href="/shop" className="inline-flex items-center gap-2 rounded-[2px] font-display text-[15px] font-medium uppercase tracking-[0.1em] text-white transition-colors" style={{ background: '#e85d1a', padding: '16px 36px', border: '2px solid #e85d1a' }}
              onMouseEnter={(e) => { e.currentTarget.style.background = '#c44b0f'; e.currentTarget.style.borderColor = '#c44b0f' }}
              onMouseLeave={(e) => { e.currentTarget.style.background = '#e85d1a'; e.currentTarget.style.borderColor = '#e85d1a' }}>
              Shop Now <ArrowRight className="h-4 w-4" />
            </Link>
            <Link href="/b2b" className="inline-flex items-center gap-2 rounded-[2px] font-display text-[15px] font-medium uppercase tracking-[0.1em] transition-colors" style={{ color: '#111111', padding: '15px 36px', border: '2px solid #111111', background: 'transparent' }}
              onMouseEnter={(e) => { e.currentTarget.style.background = '#111111'; e.currentTarget.style.color = '#ffffff' }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#111111' }}>
              Team &amp; Club Orders
            </Link>
          </div>

          <div className="flex" style={{ borderTop: '1px solid #E0DFDB' }}>
            {[{ num: 'Free', label: 'Delivery in India' }, { num: 'UPI', label: 'Cards & netbanking' }, { num: 'B2B', label: 'Club & dealer pricing' }].map((stat, i) => (
              <div key={stat.num} className="flex-1 pt-6" style={{ borderRight: i < 2 ? '1px solid #E0DFDB' : 'none', paddingRight: i < 2 ? '16px' : '0', paddingLeft: i > 0 ? '16px' : '0' }}>
                <div className="font-display text-[26px] font-semibold leading-none sm:text-[32px]" style={{ color: '#e85d1a' }}>{stat.num}</div>
                <div className="mt-1 text-[10px] font-medium uppercase tracking-[0.12em] sm:text-[11px]" style={{ color: '#6B6B6B' }}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="relative flex min-h-[420px] items-center justify-center overflow-hidden" style={{ background: '#F8F7F4' }}>
          <div aria-hidden="true" className="absolute rounded-full" style={{ width: '520px', height: '520px', border: '1px solid #E0DFDB', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }} />
          <div aria-hidden="true" className="absolute rounded-full" style={{ width: '380px', height: '380px', border: '1px solid #E0DFDB', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }} />

          {heroVisualUrl ? (
            <div className="absolute z-10" style={{ top: '72px', left: '32px', right: '32px', bottom: '168px' }}>
              <div className="relative h-full w-full">
                <Image
                  src={heroVisualUrl}
                  alt={heroName}
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  priority
                  className="object-contain"
                  style={{ filter: 'drop-shadow(0 24px 48px rgba(0,0,0,0.13))' }}
                />
              </div>
            </div>
          ) : (
            <div className="relative z-10 flex flex-col items-center text-center">
              <span className="mb-4 select-none" style={{ fontSize: '120px', lineHeight: 1 }} aria-hidden="true">🏏</span>
              <span className="font-display text-[11px] font-semibold uppercase tracking-[0.2em]" style={{ color: '#6B6B6B' }}>
                {heroName}
              </span>
            </div>
          )}

          <div className="absolute bottom-6 right-6 sm:bottom-8 sm:right-8" style={{ background: '#ffffff', border: '1px solid #E0DFDB', padding: '16px 20px', maxWidth: '220px' }}>
            <p className="mb-1 font-display text-[11px] font-semibold uppercase tracking-[0.12em]" style={{ color: '#6B6B6B' }}>Featured</p>
            <p className="font-display text-[15px] font-bold uppercase leading-tight tracking-[0.04em]" style={{ color: '#111111' }}>
              {heroName}
            </p>
            {heroProduct?.price != null && (
              <p className="mt-1 text-[12px]" style={{ color: '#6B6B6B' }}>{formatPrice(heroProduct.price)}</p>
            )}
            <Link href={heroProduct ? `/shop/${heroProduct.slug}` : '/categories/cricket-bats'} className="mt-3 flex items-center gap-1 text-[12px] font-semibold uppercase tracking-wider" style={{ color: '#e85d1a' }}>
              Discover <ChevronRight className="h-3 w-3" />
            </Link>
          </div>

          <div className="absolute left-6 top-6 px-3 py-1.5 font-display text-[11px] font-semibold uppercase tracking-[0.14em] text-white sm:left-8 sm:top-8" style={{ background: '#111111' }}>
            Premium Cricket
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          TRUST BAR
      ══════════════════════════════════════════════════════════════ */}
      <section aria-label="Why shop with us" style={{ borderBottom: '1px solid #E0DFDB' }}>
        <div className="flex flex-wrap items-center justify-center px-4 lg:px-[60px]">
          {trustItems.map((item, i) => (
            <div key={item.text} className={`flex items-center gap-3 px-4 py-3 lg:px-8 lg:py-[18px] ${i < trustItems.length - 1 ? 'lg:border-r' : ''}`} style={{ borderColor: '#E0DFDB' }}>
              <item.icon className="h-4 w-4 shrink-0" style={{ color: '#e85d1a' }} aria-hidden="true" />
              <span className="text-[13px] font-medium lg:whitespace-nowrap" style={{ color: '#333333' }}>{item.text}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          CATEGORIES GRID
      ══════════════════════════════════════════════════════════════ */}
      <section aria-labelledby="categories-heading" className="px-4 py-14 sm:px-8 lg:px-[60px] lg:py-20" style={{ borderBottom: '1px solid #E0DFDB' }}>
        <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="mb-2 font-display text-[11px] font-semibold uppercase tracking-[0.22em]" style={{ color: '#e85d1a' }}>Categories</p>
            <h2 id="categories-heading" className="font-display font-bold uppercase leading-tight tracking-[0.01em]" style={{ fontSize: 'clamp(30px, 4vw, 52px)', color: '#111111' }}>
              Shop by Category
            </h2>
          </div>
          <Link href="/shop" className="flex items-center gap-2 font-display text-[13px] font-semibold uppercase tracking-widest transition-colors" style={{ color: '#e85d1a' }}
            onMouseEnter={(e) => { e.currentTarget.style.color = '#c44b0f' }}
            onMouseLeave={(e) => { e.currentTarget.style.color = '#e85d1a' }}>
            View All <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-px sm:grid-cols-3 lg:grid-cols-6" style={{ border: '1px solid #E0DFDB', background: '#E0DFDB' }}>
          {CATEGORIES.map((cat) => {
            const dbImage = catImageBySlug[cat.slug] ?? null
            const count = catCountBySlug[cat.slug] ?? null
            return (
              <Link key={cat.name} href={cat.href} className="group flex flex-col items-center justify-center text-center transition-colors" style={{ padding: '36px 16px', background: '#ffffff' }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#e85d1a'
                  e.currentTarget.querySelectorAll<HTMLElement>('span').forEach((s) => { s.style.color = '#ffffff' })
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = '#ffffff'
                  e.currentTarget.querySelectorAll<HTMLElement>('span').forEach((s, si) => { s.style.color = si === 0 ? '#111111' : '#6B6B6B' })
                }}
              >
                {dbImage ? (
                  <div className="relative mb-4 overflow-hidden rounded" style={{ width: '96px', height: '96px' }}>
                    <Image src={dbImage} alt={cat.name} fill sizes="96px" className="object-cover" />
                  </div>
                ) : (
                  <span className="mb-4 block select-none transition-colors" style={{ fontSize: '64px', lineHeight: 1 }} aria-hidden="true">
                    {cat.emoji}
                  </span>
                )}
                <span className="block font-display text-[13px] font-semibold uppercase leading-tight tracking-[0.06em] transition-colors" style={{ color: '#111111' }}>
                  {cat.name}
                </span>
                <span className="mt-1 block text-[11px] transition-colors" style={{ color: '#6B6B6B' }}>
                  {count ? `${count} ${count === 1 ? 'product' : 'products'}` : cat.slug === 'custom-apparel' ? 'Made to order' : ''}
                </span>
              </Link>
            )
          })}
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          FEATURED PRODUCTS
      ══════════════════════════════════════════════════════════════ */}
      <section aria-labelledby="products-heading" className="px-4 py-14 sm:px-8 lg:px-[60px] lg:py-20" style={{ background: '#F8F7F4', borderBottom: '1px solid #E0DFDB' }}>
        <div className="mb-8 flex items-end justify-between">
          <div>
            <p className="mb-2 font-display text-[11px] font-semibold uppercase tracking-[0.22em]" style={{ color: '#e85d1a' }}>Our Products</p>
            <h2 id="products-heading" className="font-display font-bold uppercase leading-tight tracking-[0.01em]" style={{ fontSize: 'clamp(30px, 4vw, 52px)', color: '#111111' }}>
              Featured Gear
            </h2>
          </div>
          <Link href="/shop" className="hidden items-center gap-2 font-display text-[13px] font-semibold uppercase tracking-widest transition-colors md:flex" style={{ color: '#e85d1a' }}>
            All Products <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="mb-8 flex gap-0 overflow-x-auto" role="tablist" aria-label="Product groups" style={{ borderBottom: '1px solid #E0DFDB' }}>
          {visibleTabs.map((tab) => (
            <button key={tab.key} type="button" role="tab" aria-selected={currentTab === tab.key} onClick={() => setActiveTab(tab.key)}
              className="shrink-0 font-display text-[13px] font-medium uppercase tracking-[0.06em] transition-colors"
              style={{ padding: '14px 20px', color: currentTab === tab.key ? '#e85d1a' : '#6B6B6B', borderTop: 'none', borderLeft: 'none', borderRight: 'none', borderBottom: currentTab === tab.key ? '2px solid #e85d1a' : '2px solid transparent', background: 'none', cursor: 'pointer' }}>
              {tab.label}
            </button>
          ))}
        </div>

        {filteredProducts.length > 0 ? (
          // Per-card borders (not gap-px) so a short row doesn't leave grey empty cells
          <div className="grid grid-cols-2 lg:grid-cols-4" style={{ borderTop: '1px solid #E0DFDB', borderLeft: '1px solid #E0DFDB' }}>
            {filteredProducts.map((product) => (
              <div key={product.id} style={{ borderRight: '1px solid #E0DFDB', borderBottom: '1px solid #E0DFDB' }}>
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        ) : (
          <div className="flex items-center justify-center py-20 font-display text-[13px] uppercase tracking-widest" style={{ color: '#6B6B6B', border: '1px solid #E0DFDB', background: '#ffffff' }}>
            Coming Soon
          </div>
        )}

        <div className="mt-8 text-center">
          <Link href="/shop" className="inline-flex items-center gap-2 rounded-[2px] font-display text-[14px] font-medium uppercase tracking-[0.1em] text-white transition-colors" style={{ background: '#111111', padding: '14px 36px' }}
            onMouseEnter={(e) => { e.currentTarget.style.background = '#e85d1a' }}
            onMouseLeave={(e) => { e.currentTarget.style.background = '#111111' }}>
            View All Products <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          ENGLISH WILLOW — Dark section
      ══════════════════════════════════════════════════════════════ */}
      <section aria-labelledby="willow-heading" style={{ background: '#111111', borderBottom: '1px solid #1c1c1c' }}>
        <div className="grid grid-cols-1 items-center lg:min-h-[520px] lg:grid-cols-2">
          <div className="relative flex h-[360px] items-center justify-center overflow-hidden lg:h-[520px] lg:border-r" style={{ background: '#1c1c1c', borderColor: '#2a2a2a' }}>
            <div aria-hidden="true" className="absolute rounded-full" style={{ width: '400px', height: '400px', border: '1px solid #2a2a2a', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }} />
            {willowImageUrl ? (
              <div className="absolute z-10" style={{ top: '32px', left: '32px', right: '32px', bottom: '56px' }}>
                <Image
                  src={willowImageUrl}
                  alt="English willow cricket bat by Mantra Sports"
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-contain"
                  style={{ filter: 'drop-shadow(0 16px 40px rgba(0,0,0,0.5))' }}
                />
              </div>
            ) : (
              <span style={{ fontSize: '100px', zIndex: 10, position: 'relative' }} aria-hidden="true">🏏</span>
            )}
            <div className="absolute bottom-0 left-0 right-0 flex items-center justify-between px-6 py-4" style={{ background: 'rgba(232,93,26,0.15)', borderTop: '1px solid rgba(232,93,26,0.3)', zIndex: 20 }}>
              <span className="font-display text-[11px] font-semibold uppercase tracking-[0.2em]" style={{ color: '#e85d1a' }}>Mantra Sports</span>
              <span className="font-display text-[11px] font-semibold uppercase tracking-[0.2em]" style={{ color: '#e85d1a' }}>English Willow</span>
            </div>
          </div>

          <div className="px-5 py-14 sm:px-10 lg:px-20 lg:py-[60px]">
            <span className="mb-6 inline-block font-display text-[11px] font-semibold uppercase tracking-[0.22em]" style={{ color: '#e85d1a' }}>Premium Collection</span>
            <h2 id="willow-heading" className="mb-6 font-display font-bold uppercase leading-tight tracking-[0.01em]" style={{ fontSize: 'clamp(30px, 3.5vw, 46px)', color: '#ffffff' }}>
              English Willow<br /><span style={{ color: '#e85d1a' }}>Cricket Bats</span>
            </h2>
            <p className="mb-8 text-[15px] leading-[1.8]" style={{ color: '#A0A0A0', maxWidth: '420px' }}>
              The Magnitude, Raptor and Cobra ranges — English willow bats made for players who want big sweet spots, clean pick-up and power through the line.
            </p>
            <ul className="mb-8 space-y-3">
              {['Premium English willow', 'Choice of weights and profiles', '12-month bat warranty', 'Free delivery across India'].map((feat) => (
                <li key={feat} className="flex items-start gap-3 text-[14px]" style={{ color: '#A0A0A0' }}>
                  <ChevronRight className="mt-0.5 h-4 w-4 shrink-0" style={{ color: '#e85d1a' }} />{feat}
                </li>
              ))}
            </ul>
            <Link href="/categories/cricket-bats" className="inline-flex items-center gap-2 rounded-[2px] font-display text-[14px] font-medium uppercase tracking-[0.1em] text-white transition-colors" style={{ background: '#e85d1a', padding: '14px 32px', border: '2px solid #e85d1a' }}
              onMouseEnter={(e) => { e.currentTarget.style.background = 'transparent' }}
              onMouseLeave={(e) => { e.currentTarget.style.background = '#e85d1a' }}>
              Shop Cricket Bats <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          WHY MANTRA
      ══════════════════════════════════════════════════════════════ */}
      <section aria-labelledby="why-heading" className="px-4 py-14 sm:px-8 lg:px-[60px] lg:py-20" style={{ background: '#ffffff', borderBottom: '1px solid #E0DFDB' }}>
        <div className="mb-12 text-center">
          <p className="mb-2 font-display text-[11px] font-semibold uppercase tracking-[0.22em]" style={{ color: '#e85d1a' }}>Why Mantra Sports</p>
          <h2 id="why-heading" className="font-display font-bold uppercase leading-tight tracking-[0.01em]" style={{ fontSize: 'clamp(30px, 4vw, 52px)', color: '#111111' }}>The Mantra Difference</h2>
        </div>
        <div className="grid grid-cols-1 gap-px sm:grid-cols-2 lg:grid-cols-4" style={{ border: '1px solid #E0DFDB', background: '#E0DFDB' }}>
          {WHY_ITEMS.map((item) => (
            <div key={item.title} className="group flex flex-col transition-colors" style={{ padding: '40px 32px', background: '#ffffff' }}
              onMouseEnter={(e) => { e.currentTarget.style.background = '#F8F7F4' }}
              onMouseLeave={(e) => { e.currentTarget.style.background = '#ffffff' }}>
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-[2px]" style={{ background: '#FFF5ED' }}>
                <item.icon className="h-5 w-5" style={{ color: '#e85d1a' }} aria-hidden="true" />
              </div>
              <h3 className="mb-3 font-display text-[18px] font-semibold uppercase tracking-[0.04em]" style={{ color: '#111111' }}>{item.title}</h3>
              <p className="text-[14px] leading-relaxed" style={{ color: '#6B6B6B' }}>{item.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          GOOGLE REVIEWS — only rendered when real reviews are available
      ══════════════════════════════════════════════════════════════ */}
      {reviews && reviews.reviews.length > 0 && <GoogleReviews data={reviews} />}

      {/* ══════════════════════════════════════════════════════════════
          WHOLESALE BANNER
      ══════════════════════════════════════════════════════════════ */}
      <section aria-labelledby="wholesale-heading" style={{ background: '#F8F7F4', borderBottom: '1px solid #E0DFDB' }}>
        <div className="flex flex-col items-start justify-between gap-6 px-4 py-10 sm:px-8 md:flex-row md:items-center lg:px-[60px]">
          <div>
            <p className="mb-1 font-display text-[11px] font-semibold uppercase tracking-[0.22em]" style={{ color: '#e85d1a' }}>For Clubs, Schools &amp; Dealers</p>
            <h2 id="wholesale-heading" className="font-display text-[24px] font-bold uppercase tracking-[0.02em] sm:text-[28px]" style={{ color: '#111111' }}>Wholesale &amp; B2B Enquiries</h2>
            <p className="mt-2 text-[14px]" style={{ color: '#6B6B6B' }}>Volume pricing and custom team kit for clubs, academies, schools and retailers.</p>
          </div>
          <Link href="/b2b" className="inline-flex shrink-0 items-center gap-2 rounded-[2px] font-display text-[14px] font-medium uppercase tracking-[0.1em] text-white transition-colors" style={{ background: '#111111', padding: '14px 32px' }}
            onMouseEnter={(e) => { e.currentTarget.style.background = '#e85d1a' }}
            onMouseLeave={(e) => { e.currentTarget.style.background = '#111111' }}>
            Request a B2B Quote <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          NEWSLETTER
      ══════════════════════════════════════════════════════════════ */}
      <section aria-labelledby="newsletter-heading" style={{ background: '#e85d1a' }}>
        <div className="flex flex-col items-center px-4 py-16 text-center sm:px-8 lg:px-[60px]">
          <p className="mb-2 font-display text-[11px] font-semibold uppercase tracking-[0.22em]" style={{ color: 'rgba(255,255,255,0.7)' }}>Newsletter</p>
          <h2 id="newsletter-heading" className="mb-3 font-display text-[30px] font-bold uppercase leading-tight tracking-[0.01em] text-white sm:text-[36px]">Stay in the Loop</h2>
          <p className="mb-8 max-w-[460px] text-[15px] text-white" style={{ opacity: 0.85 }}>
            Get exclusive offers, new product launches and cricket news straight to your inbox.
          </p>

          {newsletterSent ? (
            <div className="flex items-center gap-3 rounded-[2px] px-8 py-4 font-display text-[14px] font-semibold uppercase tracking-wider text-white" style={{ background: 'rgba(255,255,255,0.2)', border: '1px solid rgba(255,255,255,0.4)' }}>
              ✓ Thank you! You&apos;re subscribed.
            </div>
          ) : (
            <>
            <form
              className="flex items-stretch gap-0"
              style={{ maxWidth: '480px', width: '100%' }}
              onSubmit={async (e) => {
                e.preventDefault()
                if (!email) return
                setNewsletterLoading(true)
                setNewsletterError('')
                const result = await subscribeNewsletter(email)
                if (result.ok) {
                  setNewsletterSent(true)
                } else {
                  setNewsletterError(result.error ?? 'Error')
                }
                setNewsletterLoading(false)
              }}
            >
              <label htmlFor="newsletter-email" className="sr-only">Email address</label>
              <input
                id="newsletter-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email address"
                style={{ flex: 1, minWidth: 0, height: '52px', padding: '0 16px', fontSize: '14px', outline: 'none', background: '#ffffff', color: '#111111', border: 'none', fontFamily: 'var(--font-inter)' }}
              />
              <button
                type="submit"
                disabled={newsletterLoading}
                style={{ height: '52px', padding: '0 24px', background: '#111111', border: 'none', cursor: newsletterLoading ? 'wait' : 'pointer', color: '#ffffff', fontFamily: 'var(--font-oswald), Oswald, sans-serif', fontSize: '13px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', whiteSpace: 'nowrap', flexShrink: 0, opacity: newsletterLoading ? 0.7 : 1 }}
                onMouseEnter={(e) => { e.currentTarget.style.background = '#1c1c1c' }}
                onMouseLeave={(e) => { e.currentTarget.style.background = '#111111' }}
              >
                {newsletterLoading ? '…' : 'Subscribe'}
              </button>
            </form>
            {newsletterError && (
              <p className="mt-2 text-[12px]" style={{ color: 'rgba(255,255,255,0.9)' }}>{newsletterError}</p>
            )}
            </>
          )}

          <p className="mt-4 text-[12px]" style={{ color: 'rgba(255,255,255,0.6)' }}>No spam. Unsubscribe at any time.</p>
        </div>
      </section>

    </div>
  )
}
