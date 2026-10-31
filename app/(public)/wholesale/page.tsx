import type { Metadata } from 'next'
import Link from 'next/link'
import { Award, Package, Truck, Headphones, ChevronRight } from 'lucide-react'
import { WholesaleForm } from './WholesaleForm'

export const metadata: Metadata = {
  title: 'Wholesale & B2B Cricket Equipment',
  description:
    'Wholesale cricket equipment for clubs, schools, academies and retailers across India. Request volume pricing on Mantra Sports bats, protective gear, balls and teamwear.',
}

const BENEFITS = [
  {
    icon: Award,
    title: 'Premium Quality',
    text: 'The same Mantra Sports range sold worldwide — English willow bats, protective gear and match balls for your team or store.',
  },
  {
    icon: Package,
    title: 'Flexible Quantities',
    text: 'From a single team kit to a full season order — volume pricing that scales with your requirement.',
  },
  {
    icon: Truck,
    title: 'Delivery Across India',
    text: 'Delivered to your club, school, academy or store anywhere in India.',
  },
  {
    icon: Headphones,
    title: 'Personal Service',
    text: 'A dedicated contact for quotes, custom branding, sizing and repeat orders.',
  },
]

const WHO_FOR = [
  'Cricket Clubs & Associations',
  'Schools, Colleges & Universities',
  'Cricket Academies & Coaching Centres',
  'Sports Shops & Retailers',
  'Resellers & Distributors',
  'Corporate & Tournament Organisers',
]

export default function WholesalePage() {
  return (
    <div className="bg-white">

      {/* ── Breadcrumb ── */}
      <div className="px-4 py-3 sm:px-8 lg:px-[60px]" style={{ borderBottom: '1px solid #E0DFDB', background: '#F8F7F4' }}>
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-[12px]" style={{ color: '#6B6B6B' }}>
          <Link href="/" className="transition-colors hover:text-[#e85d1a]">Home</Link>
          <ChevronRight className="h-3 w-3" />
          <span style={{ color: '#111111' }}>Wholesale</span>
        </nav>
      </div>

      {/* ── Hero ── */}
      <div style={{ background: '#111111', borderBottom: '1px solid #1c1c1c' }}>
        <div className="px-4 py-14 sm:px-8 lg:px-[60px] lg:py-[72px]">
          <p className="mb-3 font-display text-[11px] font-semibold uppercase tracking-[0.22em]" style={{ color: '#e85d1a' }}>
            For Clubs &amp; Dealers
          </p>
          <h1 className="mb-4 font-display font-bold uppercase leading-tight tracking-[0.01em]" style={{ fontSize: 'clamp(34px, 5vw, 64px)', color: '#ffffff' }}>
            Wholesale &amp; B2B Enquiries
          </h1>
          <p className="max-w-[560px] text-[16px] font-light leading-[1.8]" style={{ color: '#A0A0A0' }}>
            Mantra Sports India supplies premium cricket equipment to clubs, schools, academies and retailers across India — with fair volume pricing and personal service.
          </p>
        </div>
      </div>

      {/* ── Main content ── */}
      <div className="px-4 py-12 sm:px-8 lg:px-[60px] lg:py-16">
        <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-[1fr_1.2fr] lg:gap-16">

          {/* Left — info */}
          <div>
            <p className="mb-2 font-display text-[11px] font-semibold uppercase tracking-[0.22em]" style={{ color: '#e85d1a' }}>Why Mantra Sports</p>
            <h2 className="mb-8 font-display text-[28px] font-bold uppercase leading-tight tracking-[0.02em] sm:text-[32px]" style={{ color: '#111111' }}>
              Your Reliable Cricket Partner
            </h2>

            <div className="mb-10 space-y-0" style={{ border: '1px solid #E0DFDB' }}>
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
              <p className="mb-4 font-display text-[12px] font-semibold uppercase tracking-[0.14em]" style={{ color: '#6B6B6B' }}>Ideal for</p>
              <ul className="space-y-2">
                {WHO_FOR.map((item) => (
                  <li key={item} className="flex items-center gap-2 text-[14px]" style={{ color: '#333333' }}>
                    <span className="h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: '#e85d1a' }} />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Right — form */}
          <div>
            <WholesaleForm heading="Request Wholesale Pricing" />
          </div>
        </div>
      </div>

    </div>
  )
}
