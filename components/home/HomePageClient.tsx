'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { subscribeNewsletter } from '@/lib/actions/newsletter'
import {
  Star,
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
    neue: ProductDisplay[]
    bestseller: ProductDisplay[]
    willow: ProductDisplay[]
    sale: ProductDisplay[]
  }
}

// ── Static data ───────────────────────────────────────────────────────────────

const TABS = [
  { key: 'neue', label: 'Nieuwe Arrivals' },
  { key: 'bestseller', label: 'Bestsellers' },
  { key: 'willow', label: 'Engels Wilgenhout' },
  { key: 'sale', label: 'In de Aanbieding' },
]

const CATEGORIES = [
  { name: 'Cricketbats', slug: 'cricket-bats', emoji: '🏏', href: '/categories/cricket-bats' },
  { name: 'Ballen', slug: 'balls', emoji: '🔴', href: '/categories/balls' },
  { name: 'Beschermende Uitrusting', slug: 'protective-gear', emoji: '🛡️', href: '/categories/protective-gear' },
  { name: 'Accessoires', slug: 'accessories', emoji: '🎒', href: '/categories/accessories' },
  { name: 'Teamkleding', slug: 'teamwear', emoji: '🎽', href: '/categories/teamwear' },
  { name: 'Aangepaste Kleding', slug: 'custom-apparel', emoji: '👕', href: '/categories/custom-apparel' },
]

const TRUST_ITEMS = [
  { icon: Truck, text: 'Gratis verzending vanaf €100' },
  { icon: ShieldCheck, text: 'Veilig betalen & privacy' },
  { icon: RefreshCw, text: '30 dagen retourrecht' },
  { icon: Award, text: 'Authentieke premiumkwaliteit' },
  { icon: Headphones, text: 'Persoonlijke klantenservice' },
]

const WHY_ITEMS = [
  { icon: Award, title: 'Premium Kwaliteit', text: 'Elke bat handgemaakt van het beste Engels wilgenhout. Vakmanschap dat je op het veld voelt.' },
  { icon: Package, title: 'Groothandel & B2B', text: 'Flexibele groothandelsprijzen voor clubs, scholen en dealers. Partnerschap dat schaalt.' },
  { icon: Truck, title: 'EU-wijde Verzending', text: 'Snelle levering naar alle EU-landen. Gratis verzending vanaf €100 bestelling.' },
  { icon: Headphones, title: 'Deskundig Advies', text: 'Ons expertteam helpt je de perfecte uitrusting te vinden voor jouw speelniveau.' },
]

// ── Helpers ───────────────────────────────────────────────────────────────────

function formatPrice(n: number) {
  return new Intl.NumberFormat('nl-NL', { style: 'currency', currency: 'EUR', minimumFractionDigits: 0 }).format(n)
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex" aria-label={`${rating} van 5 sterren`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} className="h-3.5 w-3.5" fill={i < rating ? '#e85d1a' : 'none'} stroke={i < rating ? '#e85d1a' : '#D0CFC8'} />
      ))}
    </div>
  )
}

// ── Unified card type for both DB and placeholder products ────────────────────

type CardProduct = {
  id: string
  name: string
  brand: string
  price: number | null
  comparePrice: number | null
  badge: string
  badgeColor: string
  stars: number
  reviews: number
  href: string
  emoji: string
  imageUrl: string | null
}

function dbToCard(p: ProductDisplay, tab: string): CardProduct {
  const hasSale = p.salePrice !== null && p.salePrice !== undefined
  const badge = hasSale ? 'SALE' : tab === 'neue' ? 'NEU' : tab === 'bestseller' ? 'BESTSELLER' : tab === 'willow' ? 'ENGLISH WILLOW' : ''
  const badgeColor = hasSale || tab === 'sale' ? '#e85d1a' : tab === 'neue' ? '#059669' : tab === 'willow' ? '#92400e' : '#111111'
  return {
    id: p.id,
    name: p.name,
    brand: p.brand || 'Mantra Sports',
    price: p.price,
    comparePrice: hasSale ? p.price : null,
    badge,
    badgeColor,
    stars: 5,
    reviews: 0,
    href: `/shop/${p.slug}`,
    emoji: '🏏',
    imageUrl: p.imageUrl,
  }
}

// ── Product Card ──────────────────────────────────────────────────────────────

function ProductCard({ product }: { product: CardProduct }) {
  return (
    <Link href={product.href} className="group flex flex-col" style={{ border: '1px solid #E0DFDB', background: '#ffffff' }}>
      {/* Image area */}
      <div className="relative flex items-center justify-center overflow-hidden" style={{ background: '#F8F7F4', height: '260px' }}>
        {product.imageUrl ? (
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 50vw, 25vw"
            className="object-contain p-4"
          />
        ) : (
          <span className="select-none text-7xl" aria-hidden="true">{product.emoji}</span>
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
          className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          style={{ background: 'rgba(17,17,17,0.6)' }}
        >
          <span className="border px-5 py-2 font-display text-[13px] font-semibold uppercase tracking-widest text-white" style={{ borderColor: 'white' }}>
            Aanvraag doen
          </span>
        </div>
      </div>

      {/* Info */}
      <div className="flex flex-1 flex-col p-4" style={{ borderTop: '1px solid #E0DFDB' }}>
        <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.15em]" style={{ color: '#6B6B6B' }}>
          {product.brand}
        </p>
        <h3 className="mb-2 flex-1 font-display text-[16px] font-semibold uppercase leading-tight tracking-[0.02em]" style={{ color: '#111111' }}>
          {product.name}
        </h3>

        {product.reviews > 0 && (
          <div className="mb-3 flex items-center gap-2">
            <StarRating rating={product.stars} />
            <span className="text-[11px]" style={{ color: '#6B6B6B' }}>({product.reviews})</span>
          </div>
        )}

        <div className="flex items-baseline gap-2">
          {product.price !== null ? (
            <>
              <span className="font-display text-[20px] font-semibold" style={{ color: '#e85d1a' }}>
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
              Op Aanvraag
            </span>
          )}
        </div>
      </div>
    </Link>
  )
}

// ── Main component ────────────────────────────────────────────────────────────

export function HomePageClient({ heroImageUrl, heroProduct, willowImageUrl, categories, tabProducts }: Props) {
  const [activeTab, setActiveTab] = useState('neue')
  const [email, setEmail] = useState('')
  const [newsletterSent, setNewsletterSent] = useState(false)
  const [newsletterError, setNewsletterError] = useState('')
  const [newsletterLoading, setNewsletterLoading] = useState(false)

  // Build category image lookup: slug → imageUrl from DB
  const catImageBySlug: Record<string, string | null> = {}
  const catCountBySlug: Record<string, number> = {}
  for (const cat of categories) {
    catImageBySlug[cat.slug] = cat.imageUrl
    catCountBySlug[cat.slug] = cat.productCount
  }

  // Resolve products for active tab — real DB products only
  function getTabCards(tab: string): CardProduct[] {
    const dbList = tabProducts[tab as keyof typeof tabProducts]
    return dbList ? dbList.map((p) => dbToCard(p, tab)) : []
  }

  // Hide tabs without products (e.g. no items on sale); show all if none have any
  const tabsWithProducts = TABS.filter((t) => getTabCards(t.key).length > 0)
  const visibleTabs = tabsWithProducts.length > 0 ? tabsWithProducts : TABS

  const filteredProducts = getTabCards(activeTab)

  // Hero visual
  const heroVisualUrl = heroImageUrl || heroProduct?.imageUrl || null
  const heroName = heroProduct?.name || 'Magnitude Legend'
  const heroPrice = heroProduct?.price !== null && heroProduct?.price !== undefined ? heroProduct.price : 1299

  return (
    <div className="overflow-x-hidden bg-white">

      {/* ══════════════════════════════════════════════════════════════
          HERO
      ══════════════════════════════════════════════════════════════ */}
      <section aria-labelledby="hero-heading" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', minHeight: '88vh', borderBottom: '1px solid #E0DFDB' }}>
        {/* Left — Text */}
        <div className="flex flex-col justify-center" style={{ padding: '80px 60px 80px 80px', borderRight: '1px solid #E0DFDB' }}>
          <span className="mb-7 inline-flex items-center gap-2 self-start rounded-[2px] px-[14px] py-[6px] font-display text-[11px] font-semibold uppercase tracking-[0.18em] text-white" style={{ background: '#e85d1a' }}>
            🏏 Nieuw in Nederland
          </span>

          <h1 id="hero-heading" className="mb-6 font-display font-bold uppercase leading-[0.93] tracking-[-0.01em]" style={{ fontSize: 'clamp(52px, 7vw, 88px)', color: '#111111' }}>
            SPEEL ZONDER <span style={{ color: '#e85d1a' }}>GRENZEN</span>
          </h1>

          <p className="mb-10 max-w-[420px] text-[16px] font-light leading-[1.7]" style={{ color: '#6B6B6B' }}>
            Premium cricketbats, beschermende uitrusting en teamkleding — direct naar Nederland geleverd. Vertrouwd door spelers door heel Europa.
          </p>

          <div className="mb-14 flex flex-wrap gap-3">
            <Link href="/shop" className="inline-flex items-center gap-2 rounded-[2px] font-display text-[15px] font-medium uppercase tracking-[0.1em] text-white transition-colors" style={{ background: '#e85d1a', padding: '16px 36px', border: '2px solid #e85d1a' }}
              onMouseEnter={(e) => { e.currentTarget.style.background = '#c44b0f'; e.currentTarget.style.borderColor = '#c44b0f' }}
              onMouseLeave={(e) => { e.currentTarget.style.background = '#e85d1a'; e.currentTarget.style.borderColor = '#e85d1a' }}>
              Nu winkelen <ArrowRight className="h-4 w-4" />
            </Link>
            <Link href="/contact" className="inline-flex items-center gap-2 rounded-[2px] font-display text-[15px] font-medium uppercase tracking-[0.1em] transition-colors" style={{ color: '#111111', padding: '15px 36px', border: '2px solid #111111', background: 'transparent' }}
              onMouseEnter={(e) => { e.currentTarget.style.background = '#111111'; e.currentTarget.style.color = '#ffffff' }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#111111' }}>
              Aanvraag doen
            </Link>
          </div>

          <div className="flex" style={{ borderTop: '1px solid #E0DFDB' }}>
            {[{ num: '500+', label: 'Klanten' }, { num: '50+', label: 'Producten' }, { num: 'EU-wijd', label: 'Levering' }].map((stat, i) => (
              <div key={stat.num} className="flex-1 pt-6" style={{ borderRight: i < 2 ? '1px solid #E0DFDB' : 'none', paddingRight: i < 2 ? '24px' : '0', paddingLeft: i > 0 ? '24px' : '0' }}>
                <div className="font-display text-[32px] font-semibold leading-none" style={{ color: '#e85d1a' }}>{stat.num}</div>
                <div className="mt-1 text-[11px] font-medium uppercase tracking-[0.12em]" style={{ color: '#6B6B6B' }}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Right — Visual */}
        <div className="relative flex items-center justify-center overflow-hidden" style={{ background: '#F8F7F4' }}>
          <div aria-hidden="true" className="absolute rounded-full" style={{ width: '520px', height: '520px', border: '1px solid #E0DFDB', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }} />
          <div aria-hidden="true" className="absolute rounded-full" style={{ width: '380px', height: '380px', border: '1px solid #E0DFDB', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }} />

          {/* Hero visual: full-panel product image or emoji fallback */}
          {heroVisualUrl ? (
            /* Image fills the usable area — cleared above by the badge and below by the info card */
            <div className="absolute z-10" style={{ top: '72px', left: '32px', right: '32px', bottom: '168px' }}>
              <div className="relative w-full h-full">
                <Image
                  src={heroVisualUrl}
                  alt={heroName}
                  fill
                  sizes="50vw"
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
                {heroProduct?.name || 'Magnitude Legend'}
              </span>
              <span className="font-display text-[13px] font-semibold uppercase tracking-[0.1em]" style={{ color: '#e85d1a' }}>
                Vanaf {formatPrice(heroPrice)}
              </span>
            </div>
          )}

          {/* Info card */}
          <div className="absolute bottom-8 right-8" style={{ background: '#ffffff', border: '1px solid #E0DFDB', padding: '16px 20px', maxWidth: '200px' }}>
            <p className="mb-1 font-display text-[11px] font-semibold uppercase tracking-[0.12em]" style={{ color: '#6B6B6B' }}>Nieuw Seizoen 2025</p>
            <p className="font-display text-[15px] font-bold uppercase leading-tight tracking-[0.04em]" style={{ color: '#111111' }}>
              {heroProduct?.name || 'Magnitude Legend Serie'}
            </p>
            <p className="mt-1 text-[12px]" style={{ color: '#6B6B6B' }}>Engels Wilgenhout Klasse I</p>
            <Link href="/shop" className="mt-3 flex items-center gap-1 text-[12px] font-semibold uppercase tracking-wider" style={{ color: '#e85d1a' }}>
              Ontdekken <ChevronRight className="h-3 w-3" />
            </Link>
          </div>

          <div className="absolute left-8 top-8 px-3 py-1.5 font-display text-[11px] font-semibold uppercase tracking-[0.14em] text-white" style={{ background: '#111111' }}>
            Premium Cricket
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          TRUST BAR
      ══════════════════════════════════════════════════════════════ */}
      <section aria-label="Vertrouwenskenmerken" style={{ borderBottom: '1px solid #E0DFDB' }}>
        <div className="flex flex-wrap items-center justify-center" style={{ padding: '0 60px' }}>
          {TRUST_ITEMS.map((item, i) => (
            <div key={item.text} className="flex items-center gap-3" style={{ padding: '18px 32px', borderRight: i < TRUST_ITEMS.length - 1 ? '1px solid #E0DFDB' : 'none' }}>
              <item.icon className="h-4 w-4 shrink-0" style={{ color: '#e85d1a' }} aria-hidden="true" />
              <span className="whitespace-nowrap text-[13px] font-medium" style={{ color: '#333333' }}>{item.text}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          CATEGORIES GRID
      ══════════════════════════════════════════════════════════════ */}
      <section aria-labelledby="categories-heading" style={{ padding: '80px 60px', borderBottom: '1px solid #E0DFDB' }}>
        <div className="mb-10 flex items-end justify-between">
          <div>
            <p className="mb-2 font-display text-[11px] font-semibold uppercase tracking-[0.22em]" style={{ color: '#e85d1a' }}>Collecties</p>
            <h2 id="categories-heading" className="font-display font-bold uppercase leading-tight tracking-[0.01em]" style={{ fontSize: 'clamp(34px, 4vw, 52px)', color: '#111111' }}>
              Alle Categorieën
            </h2>
          </div>
          <Link href="/shop" className="flex items-center gap-2 font-display text-[13px] font-semibold uppercase tracking-widest transition-colors" style={{ color: '#e85d1a' }}
            onMouseEnter={(e) => { e.currentTarget.style.color = '#c44b0f' }}
            onMouseLeave={(e) => { e.currentTarget.style.color = '#e85d1a' }}>
            Alles bekijken <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid" style={{ gridTemplateColumns: 'repeat(6, 1fr)', border: '1px solid #E0DFDB' }}>
          {CATEGORIES.map((cat, i) => {
            const dbImage = catImageBySlug[cat.slug] ?? null
            const count = catCountBySlug[cat.slug] ?? null
            return (
              <Link key={cat.name} href={cat.href} className="group flex flex-col items-center justify-center text-center transition-colors" style={{ padding: '36px 16px', borderRight: i < CATEGORIES.length - 1 ? '1px solid #E0DFDB' : 'none', background: '#ffffff' }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#e85d1a'
                  e.currentTarget.querySelectorAll<HTMLElement>('span').forEach((s) => { s.style.color = '#ffffff' })
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = '#ffffff'
                  e.currentTarget.querySelectorAll<HTMLElement>('span').forEach((s, si) => { s.style.color = si === 0 ? '#111111' : '#6B6B6B' })
                }}
              >
                {/* Category image or emoji */}
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
                  {count !== null ? `${count} producten` : cat.slug === 'custom-apparel' ? 'Aangepaste bestellingen' : ''}
                </span>
              </Link>
            )
          })}
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          FEATURED PRODUCTS
      ══════════════════════════════════════════════════════════════ */}
      <section aria-labelledby="products-heading" style={{ padding: '80px 60px', background: '#F8F7F4', borderBottom: '1px solid #E0DFDB' }}>
        <div className="mb-8 flex items-end justify-between">
          <div>
            <p className="mb-2 font-display text-[11px] font-semibold uppercase tracking-[0.22em]" style={{ color: '#e85d1a' }}>Onze Producten</p>
            <h2 id="products-heading" className="font-display font-bold uppercase leading-tight tracking-[0.01em]" style={{ fontSize: 'clamp(34px, 4vw, 52px)', color: '#111111' }}>
              Uitgelichte Uitrusting
            </h2>
          </div>
          <Link href="/shop" className="hidden items-center gap-2 font-display text-[13px] font-semibold uppercase tracking-widest transition-colors md:flex" style={{ color: '#e85d1a' }}>
            Alle Producten <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="mb-8 flex gap-0" role="tablist" aria-label="Productcategorieën" style={{ borderBottom: '1px solid #E0DFDB' }}>
          {visibleTabs.map((tab) => (
            <button key={tab.key} type="button" role="tab" aria-selected={activeTab === tab.key} onClick={() => setActiveTab(tab.key)}
              className="font-display text-[13px] font-medium uppercase tracking-[0.06em] transition-colors"
              style={{ padding: '14px 24px', color: activeTab === tab.key ? '#e85d1a' : '#6B6B6B', borderTop: 'none', borderLeft: 'none', borderRight: 'none', borderBottom: activeTab === tab.key ? '2px solid #e85d1a' : '2px solid transparent', background: 'none', cursor: 'pointer' }}>
              {tab.label}
            </button>
          ))}
        </div>

        {filteredProducts.length > 0 ? (
          <div className="grid gap-0" style={{ gridTemplateColumns: 'repeat(4, 1fr)', border: '1px solid #E0DFDB' }}>
            {filteredProducts.map((product, i) => (
              <div key={product.id} style={{ borderRight: i < filteredProducts.length - 1 ? '1px solid #E0DFDB' : 'none' }}>
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        ) : (
          <div className="flex items-center justify-center py-20 font-display text-[13px] uppercase tracking-widest" style={{ color: '#6B6B6B', border: '1px solid #E0DFDB', background: '#ffffff' }}>
            Binnenkort beschikbaar
          </div>
        )}

        <div className="mt-8 text-center">
          <Link href="/shop" className="inline-flex items-center gap-2 rounded-[2px] font-display text-[14px] font-medium uppercase tracking-[0.1em] text-white transition-colors" style={{ background: '#111111', padding: '14px 36px' }}
            onMouseEnter={(e) => { e.currentTarget.style.background = '#e85d1a' }}
            onMouseLeave={(e) => { e.currentTarget.style.background = '#111111' }}>
            Alle producten bekijken <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          ENGLISH WILLOW — Dark section
      ══════════════════════════════════════════════════════════════ */}
      <section aria-labelledby="willow-heading" style={{ background: '#111111', borderBottom: '1px solid #1c1c1c' }}>
        <div className="grid items-center" style={{ gridTemplateColumns: '1fr 1fr', minHeight: '520px' }}>
          <div className="relative flex items-center justify-center overflow-hidden" style={{ background: '#1c1c1c', height: '520px', borderRight: '1px solid #2a2a2a' }}>
            <div aria-hidden="true" className="absolute rounded-full" style={{ width: '400px', height: '400px', border: '1px solid #2a2a2a', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }} />
            {willowImageUrl ? (
              <div className="absolute z-10" style={{ top: '32px', left: '32px', right: '32px', bottom: '56px' }}>
                <Image
                  src={willowImageUrl}
                  alt="Magnitude Legend — English Willow Cricketbat"
                  fill
                  sizes="50vw"
                  className="object-contain"
                  style={{ filter: 'drop-shadow(0 16px 40px rgba(0,0,0,0.5))' }}
                />
              </div>
            ) : (
              <span style={{ fontSize: '100px', zIndex: 10, position: 'relative' }} aria-hidden="true">🏏</span>
            )}
            <div className="absolute bottom-0 left-0 right-0 flex items-center justify-between px-6 py-4" style={{ background: 'rgba(232,93,26,0.15)', borderTop: '1px solid rgba(232,93,26,0.3)', zIndex: 20 }}>
              <span className="font-display text-[11px] font-semibold uppercase tracking-[0.2em]" style={{ color: '#e85d1a' }}>Handgemaakt</span>
              <span className="font-display text-[11px] font-semibold uppercase tracking-[0.2em]" style={{ color: '#e85d1a' }}>English Willow Klasse I</span>
            </div>
          </div>

          <div style={{ padding: '60px 80px' }}>
            <span className="mb-6 inline-block font-display text-[11px] font-semibold uppercase tracking-[0.22em]" style={{ color: '#e85d1a' }}>Premium Collection</span>
            <h2 id="willow-heading" className="mb-6 font-display font-bold uppercase leading-tight tracking-[0.01em]" style={{ fontSize: 'clamp(30px, 3.5vw, 46px)', color: '#ffffff' }}>
              English Willow<br /><span style={{ color: '#e85d1a' }}>Cricketbats</span>
            </h2>
            <p className="mb-8 text-[15px] leading-[1.8]" style={{ color: '#A0A0A0', maxWidth: '400px' }}>
              Gemaakt van het fijnste Engels wilgenhout — elke bat een uniek stuk. Handgeselecteerde nerf, handgemaakte kling, professionele prestaties.
            </p>
            <ul className="mb-8 space-y-3">
              {['Engels Wilgenhout Klasse I–III', 'Handgemaakte klingverwerking', 'Professioneel ingeslagen & geoliëd', 'Individuele gewichts- en gripkeuze'].map((feat) => (
                <li key={feat} className="flex items-start gap-3 text-[14px]" style={{ color: '#A0A0A0' }}>
                  <ChevronRight className="mt-0.5 h-4 w-4 shrink-0" style={{ color: '#e85d1a' }} />{feat}
                </li>
              ))}
            </ul>
            <Link href="/categories/cricket-bats" className="inline-flex items-center gap-2 rounded-[2px] font-display text-[14px] font-medium uppercase tracking-[0.1em] text-white transition-colors" style={{ background: '#e85d1a', padding: '14px 32px', border: '2px solid #e85d1a' }}
              onMouseEnter={(e) => { e.currentTarget.style.background = 'transparent' }}
              onMouseLeave={(e) => { e.currentTarget.style.background = '#e85d1a' }}>
              Collectie ontdekken <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          WHY MANTRA
      ══════════════════════════════════════════════════════════════ */}
      <section aria-labelledby="why-heading" style={{ padding: '80px 60px', background: '#ffffff', borderBottom: '1px solid #E0DFDB' }}>
        <div className="mb-12 text-center">
          <p className="mb-2 font-display text-[11px] font-semibold uppercase tracking-[0.22em]" style={{ color: '#e85d1a' }}>Waarom Mantra Sports</p>
          <h2 id="why-heading" className="font-display font-bold uppercase leading-tight tracking-[0.01em]" style={{ fontSize: 'clamp(34px, 4vw, 52px)', color: '#111111' }}>Het Mantra-verschil</h2>
        </div>
        <div className="grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)', border: '1px solid #E0DFDB' }}>
          {WHY_ITEMS.map((item, i) => (
            <div key={item.title} className="group flex flex-col transition-colors" style={{ padding: '40px 32px', borderRight: i < WHY_ITEMS.length - 1 ? '1px solid #E0DFDB' : 'none', background: '#ffffff' }}
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
          WHOLESALE BANNER
      ══════════════════════════════════════════════════════════════ */}
      <section aria-labelledby="wholesale-heading" style={{ background: '#F8F7F4', borderBottom: '1px solid #E0DFDB' }}>
        <div className="flex items-center justify-between" style={{ padding: '40px 60px', borderBottom: '1px solid #E0DFDB' }}>
          <div>
            <p className="mb-1 font-display text-[11px] font-semibold uppercase tracking-[0.22em]" style={{ color: '#e85d1a' }}>Voor Clubs & Dealers</p>
            <h2 id="wholesale-heading" className="font-display text-[28px] font-bold uppercase tracking-[0.02em]" style={{ color: '#111111' }}>Groothandel & B2B-aanvragen</h2>
            <p className="mt-2 text-[14px]" style={{ color: '#6B6B6B' }}>Voordelige groothandelsprijzen voor clubs, scholen en retailers.</p>
          </div>
          <Link href="/wholesale" className="inline-flex shrink-0 items-center gap-2 rounded-[2px] font-display text-[14px] font-medium uppercase tracking-[0.1em] text-white transition-colors" style={{ background: '#111111', padding: '14px 32px' }}
            onMouseEnter={(e) => { e.currentTarget.style.background = '#e85d1a' }}
            onMouseLeave={(e) => { e.currentTarget.style.background = '#111111' }}>
            Groothandelsaanvraag doen <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          NEWSLETTER
      ══════════════════════════════════════════════════════════════ */}
      <section aria-labelledby="newsletter-heading" style={{ background: '#e85d1a' }}>
        <div className="flex flex-col items-center text-center" style={{ padding: '64px 60px' }}>
          <p className="mb-2 font-display text-[11px] font-semibold uppercase tracking-[0.22em]" style={{ color: 'rgba(255,255,255,0.7)' }}>Newsletter</p>
          <h2 id="newsletter-heading" className="mb-3 font-display text-[36px] font-bold uppercase leading-tight tracking-[0.01em] text-white">Altijd op de hoogte</h2>
          <p className="mb-8 max-w-[460px] text-[15px] text-white" style={{ opacity: 0.85 }}>
            Ontvang exclusieve aanbiedingen, nieuwe productlanceringen en cricket-nieuws direct in je inbox.
          </p>

          {newsletterSent ? (
            <div className="flex items-center gap-3 rounded-[2px] px-8 py-4 font-display text-[14px] font-semibold uppercase tracking-wider text-white" style={{ background: 'rgba(255,255,255,0.2)', border: '1px solid rgba(255,255,255,0.4)' }}>
              ✓ Bedankt! Je bent aangemeld.
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
                  setNewsletterError(result.error ?? 'Fout')
                }
                setNewsletterLoading(false)
              }}
            >
              <label htmlFor="newsletter-email" className="sr-only">E-mailadres</label>
              <input
                id="newsletter-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Jouw e-mailadres"
                style={{ flex: 1, height: '52px', padding: '0 16px', fontSize: '14px', outline: 'none', background: '#ffffff', color: '#111111', border: 'none', fontFamily: 'var(--font-inter)' }}
              />
              <button
                type="submit"
                disabled={newsletterLoading}
                style={{ height: '52px', padding: '0 28px', background: '#111111', border: 'none', cursor: newsletterLoading ? 'wait' : 'pointer', color: '#ffffff', fontFamily: 'var(--font-oswald), Oswald, sans-serif', fontSize: '13px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', whiteSpace: 'nowrap', flexShrink: 0, opacity: newsletterLoading ? 0.7 : 1 }}
                onMouseEnter={(e) => { e.currentTarget.style.background = '#1c1c1c' }}
                onMouseLeave={(e) => { e.currentTarget.style.background = '#111111' }}
              >
                {newsletterLoading ? '…' : 'Aanmelden'}
              </button>
            </form>
            {newsletterError && (
              <p className="mt-2 text-[12px]" style={{ color: 'rgba(255,255,255,0.9)' }}>{newsletterError}</p>
            )}
            </>
          )}

          <p className="mt-4 text-[12px]" style={{ color: 'rgba(255,255,255,0.6)' }}>Geen spam. Uitschrijven op elk moment mogelijk.</p>
        </div>
      </section>

    </div>
  )
}
