import type { Metadata } from 'next'
import Link from 'next/link'
import { Shirt, Users, Package, Headphones } from 'lucide-react'
import { ContentPage } from '@/components/layout/ContentPage'
import { WholesaleForm } from '../wholesale/WholesaleForm'
import { prisma } from '@/lib/db/prisma'

export const metadata: Metadata = {
  title: 'B2B Partnerships — Team Kit for Clubs, Schools & Academies',
  description:
    'B2B partnerships with Mantra Sports India: cricket equipment, custom teamwear and kit bags in club colours for clubs, schools, academies and associations across India.',
}

const OFFERS = [
  {
    icon: Shirt,
    title: 'Custom Club Kit',
    text: 'Teamwear, kit bags and equipment in your club or school colours, with your logo.',
  },
  {
    icon: Package,
    title: 'Volume Pricing',
    text: 'Sharp pricing for larger quantities — from a single team set to equipment for a whole academy.',
  },
  {
    icon: Users,
    title: 'For Every Squad',
    text: 'Gear for practice nets and match days alike, from training balls to premium English willow for your first XI.',
  },
  {
    icon: Headphones,
    title: 'Direct Contact',
    text: 'Speak directly with our team for advice on sizes, materials and delivery schedules.',
  },
]

const STEPS = [
  { title: 'Enquiry', text: 'Tell us what you need using the form: products, quantities and any custom branding.' },
  { title: 'Quote', text: 'You receive a tailored quote with pricing, GST and expected delivery time.' },
  { title: 'Delivery', text: 'Once approved, we prepare your order and deliver it to your chosen address in India.' },
]

export default async function B2BPage({ searchParams }: { searchParams: Promise<{ product?: string }> }) {
  const { product: productSlug } = await searchParams
  let productName: string | undefined
  if (productSlug) {
    try {
      const product = await prisma.product.findUnique({ where: { slug: productSlug, status: 'ACTIVE' }, select: { name: true } })
      productName = product?.name
    } catch {
      // form works without a product
    }
  }

  return (
    <ContentPage
      eyebrow="For clubs, schools & organisations"
      title="B2B Partnerships"
      intro="Mantra Sports is the partner for clubs, schools, academies and associations that want to equip their players with premium cricket gear and teamwear."
      breadcrumb={[{ label: 'Wholesale', href: '/wholesale' }, { label: 'B2B Partnerships' }]}
      prose={false}
    >
      <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-[1fr_1.2fr] lg:gap-16">
        <div className="order-2 lg:order-1">
          <p className="mb-2 font-display text-[11px] font-semibold uppercase tracking-[0.22em]" style={{ color: '#e85d1a' }}>What we offer</p>
          <h2 className="mb-8 font-display text-[28px] font-bold uppercase leading-tight tracking-[0.02em] sm:text-[32px]" style={{ color: '#111111' }}>
            Equip Your Team With Us
          </h2>

          <div className="mb-10" style={{ border: '1px solid #E0DFDB' }}>
            {OFFERS.map((item, i) => (
              <div key={item.title} className="flex gap-4" style={{ padding: '24px', borderBottom: i < OFFERS.length - 1 ? '1px solid #E0DFDB' : 'none' }}>
                <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-[2px]" style={{ background: '#FFF5ED' }}>
                  <item.icon className="h-4 w-4" style={{ color: '#e85d1a' }} />
                </div>
                <div>
                  <h3 className="mb-1 font-display text-[15px] font-bold uppercase tracking-[0.04em]" style={{ color: '#111111' }}>{item.title}</h3>
                  <p className="text-[14px] leading-relaxed" style={{ color: '#6B6B6B' }}>{item.text}</p>
                </div>
              </div>
            ))}
          </div>

          <div style={{ border: '1px solid #E0DFDB', padding: '24px', background: '#F8F7F4' }}>
            <p className="mb-4 font-display text-[12px] font-semibold uppercase tracking-[0.14em]" style={{ color: '#6B6B6B' }}>How it works</p>
            <ol className="space-y-4">
              {STEPS.map((step, i) => (
                <li key={step.title} className="flex gap-3 text-[14px]" style={{ color: '#333333' }}>
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full font-display text-[12px] font-bold text-white" style={{ background: '#e85d1a' }}>
                    {i + 1}
                  </span>
                  <span><strong style={{ color: '#111111' }}>{step.title}</strong> — {step.text}</span>
                </li>
              ))}
            </ol>
          </div>

          <p className="mt-6 text-[14px] leading-relaxed" style={{ color: '#6B6B6B' }}>
            Run a sports shop or resell cricket gear? See our <Link href="/become-a-dealer" className="underline hover:text-[#e85d1a]">dealer programme</Link>.
            Buying for yourself? <Link href="/shop" className="underline hover:text-[#e85d1a]">Shop online</Link> with free delivery.
          </p>
        </div>

        <div className="order-1 lg:order-2">
          <WholesaleForm productName={productName} />
        </div>
      </div>
    </ContentPage>
  )
}
