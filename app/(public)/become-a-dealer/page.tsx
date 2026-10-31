import type { Metadata } from 'next'
import Link from 'next/link'
import { Store, Tag, Image as ImageIcon, Handshake } from 'lucide-react'
import { ContentPage } from '@/components/layout/ContentPage'
import { WholesaleForm } from '../wholesale/WholesaleForm'

export const metadata: Metadata = {
  title: 'Become a Dealer',
  description:
    'Become a Mantra Sports dealer in India. Stock premium English willow cricket bats, protective gear, balls and accessories at trade prices.',
}

const BENEFITS = [
  {
    icon: Tag,
    title: 'Trade Pricing',
    text: 'Attractive buying prices across our range, so you can sell with a healthy margin.',
  },
  {
    icon: Store,
    title: 'Complete Range',
    text: 'Cricket bats, protective gear, balls, accessories and teamwear — all from one supplier.',
  },
  {
    icon: ImageIcon,
    title: 'Product Content',
    text: 'Product descriptions and images to present Mantra Sports products in your store or online shop.',
  },
  {
    icon: Handshake,
    title: 'Personal Support',
    text: 'A dedicated contact in our team for orders, advice and questions.',
  },
]

const WHO = [
  'Sports shops and cricket specialists',
  'Online sports retailers',
  'Resellers and distributors',
  'Clubs and academies with their own pro shop',
]

export default function BecomeADealerPage() {
  return (
    <ContentPage
      eyebrow="Dealer Programme"
      title="Become a Dealer"
      intro="Bring premium Mantra Sports cricket equipment to your customers. We are looking for dealers in cities and towns across India."
      breadcrumb={[{ label: 'Wholesale', href: '/wholesale' }, { label: 'Become a Dealer' }]}
      prose={false}
    >
      <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-[1fr_1.2fr] lg:gap-16">
        <div>
          <p className="mb-2 font-display text-[11px] font-semibold uppercase tracking-[0.22em]" style={{ color: '#e85d1a' }}>Why become a dealer</p>
          <h2 className="mb-8 font-display text-[28px] font-bold uppercase leading-tight tracking-[0.02em] sm:text-[32px]" style={{ color: '#111111' }}>
            Grow With Mantra Sports
          </h2>

          <div className="mb-10" style={{ border: '1px solid #E0DFDB' }}>
            {BENEFITS.map((item, i) => (
              <div key={item.title} className="flex gap-4" style={{ padding: '24px', borderBottom: i < BENEFITS.length - 1 ? '1px solid #E0DFDB' : 'none' }}>
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
            <p className="mb-4 font-display text-[12px] font-semibold uppercase tracking-[0.14em]" style={{ color: '#6B6B6B' }}>Who we&apos;re looking for</p>
            <ul className="space-y-2">
              {WHO.map((item) => (
                <li key={item} className="flex items-center gap-2 text-[14px]" style={{ color: '#333333' }}>
                  <span className="h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: '#e85d1a' }} />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <p className="mt-6 text-[14px] leading-relaxed" style={{ color: '#6B6B6B' }}>
            Apply using the form. Include your business name, city and the product groups you are interested in, and
            we&apos;ll contact you to discuss the opportunity. For clubs and schools, see{' '}
            <Link href="/b2b" className="underline hover:text-[#e85d1a]">B2B partnerships</Link>.
          </p>
        </div>

        <div>
          <WholesaleForm heading="Apply to Become a Dealer" />
        </div>
      </div>
    </ContentPage>
  )
}
