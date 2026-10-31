import type { Metadata } from 'next'
import Link from 'next/link'
import { Award, Package, Truck, Headphones, ChevronRight } from 'lucide-react'
import { WholesaleForm } from './WholesaleForm'

export const metadata: Metadata = {
  title: 'Groothandel & B2B',
  description:
    'Groothandelsaanvragen voor clubs, scholen en retailers. Premium cricketuitrusting tegen voordelige B2B-prijzen — EU-wijd geleverd.',
}

const BENEFITS = [
  {
    icon: Award,
    title: 'Premium Kwaliteit',
    text: 'Dezelfde professionele producten die internationale spelers gebruiken — nu voor jouw team of winkel.',
  },
  {
    icon: Package,
    title: 'Flexibele Hoeveelheden',
    text: 'Of het nu 10 of 500 stuks zijn — we bieden schaalbare groothandelsprijzen voor elke bestelling.',
  },
  {
    icon: Truck,
    title: 'EU-wijde Verzending',
    text: 'Snelle en betrouwbare levering naar alle EU-landen, direct naar jouw adres of magazijn.',
  },
  {
    icon: Headphones,
    title: 'Persoonlijke Service',
    text: 'Ons B2B-team staat klaar voor individuele aanvragen, maatwerk en volumekortingen.',
  },
]

const WHO_FOR = [
  'Cricketclubs & Sportverenigingen',
  'Scholen & Universiteiten',
  'Sportwinkels & Retailers',
  'Wederverkopers & Distributeurs',
  'Cricket-academies',
  'Nationale & Regionale Bonden',
]

export default function WholesalePage() {
  return (
    <div className="bg-white">

      {/* ── Breadcrumb ── */}
      <div style={{ borderBottom: '1px solid #E0DFDB', padding: '12px 60px', background: '#F8F7F4' }}>
        <nav className="flex items-center gap-2 text-[12px]" style={{ color: '#6B6B6B' }}>
          <Link href="/" className="transition-colors hover:text-[#e85d1a]">Startpagina</Link>
          <ChevronRight className="h-3 w-3" />
          <span style={{ color: '#111111' }}>Groothandel</span>
        </nav>
      </div>

      {/* ── Hero ── */}
      <div style={{ background: '#111111', borderBottom: '1px solid #1c1c1c' }}>
        <div style={{ padding: '72px 60px' }}>
          <p className="mb-3 font-display text-[11px] font-semibold uppercase tracking-[0.22em]" style={{ color: '#e85d1a' }}>
            Voor Clubs & Dealers
          </p>
          <h1 className="mb-4 font-display font-bold uppercase leading-tight tracking-[0.01em]" style={{ fontSize: 'clamp(36px, 5vw, 64px)', color: '#ffffff' }}>
            Groothandel & B2B-aanvragen
          </h1>
          <p className="max-w-[560px] text-[16px] font-light leading-[1.8]" style={{ color: '#A0A0A0' }}>
            Mantra Sports NL levert premium cricketuitrusting aan clubs, scholen, dealers en academies door heel Europa — tegen eerlijke groothandelsprijzen en met persoonlijke service.
          </p>
        </div>
      </div>

      {/* ── Main content ── */}
      <div style={{ padding: '64px 60px' }}>
        <div className="grid gap-16" style={{ gridTemplateColumns: '1fr 1.2fr', alignItems: 'start' }}>

          {/* Left — info */}
          <div>
            <p className="mb-2 font-display text-[11px] font-semibold uppercase tracking-[0.22em]" style={{ color: '#e85d1a' }}>Waarom Mantra Sports</p>
            <h2 className="mb-8 font-display text-[32px] font-bold uppercase leading-tight tracking-[0.02em]" style={{ color: '#111111' }}>
              Jouw betrouwbare cricketpartner
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
              <p className="mb-4 font-display text-[12px] font-semibold uppercase tracking-[0.14em]" style={{ color: '#6B6B6B' }}>Geschikt voor</p>
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
            <WholesaleForm />
          </div>
        </div>
      </div>

    </div>
  )
}
