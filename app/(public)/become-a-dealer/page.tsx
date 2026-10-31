import type { Metadata } from 'next'
import Link from 'next/link'
import { Store, Tag, Image as ImageIcon, Handshake } from 'lucide-react'
import { ContentPage } from '@/components/layout/ContentPage'
import { WholesaleForm } from '../wholesale/WholesaleForm'

export const metadata: Metadata = {
  title: 'Word Dealer',
  description:
    'Word dealer van Mantra Sports in Nederland of België. Verkoop premium cricketbats, beschermende uitrusting en accessoires tegen groothandelsprijzen.',
}

const BENEFITS = [
  {
    icon: Tag,
    title: 'Groothandelsprijzen',
    text: 'Aantrekkelijke inkoopprijzen op ons assortiment, zodat je met een gezonde marge kunt verkopen.',
  },
  {
    icon: Store,
    title: 'Volledig assortiment',
    text: 'Cricketbats, beschermende uitrusting, ballen, accessoires en teamkleding — alles van één leverancier.',
  },
  {
    icon: ImageIcon,
    title: 'Productinformatie & beelden',
    text: 'Productbeschrijvingen en afbeeldingen om Mantra Sports-producten in je winkel of webshop te presenteren.',
  },
  {
    icon: Handshake,
    title: 'Persoonlijke begeleiding',
    text: 'Een vast aanspreekpunt in ons team voor bestellingen, advies en vragen.',
  },
]

const WHO = [
  'Sportwinkels en cricketspeciaalzaken',
  'Webwinkels in sportartikelen',
  'Wederverkopers en distributeurs',
  'Clubs met een eigen clubwinkel',
]

export default function BecomeADealerPage() {
  return (
    <ContentPage
      eyebrow="Dealerprogramma"
      title="Word Dealer"
      intro="Breng premium cricketuitrusting van Mantra Sports naar jouw klanten. We zoeken dealers in Nederland, België en de rest van Europa."
      breadcrumb={[{ label: 'Groothandel', href: '/wholesale' }, { label: 'Word Dealer' }]}
      prose={false}
    >
      <div className="grid gap-16" style={{ gridTemplateColumns: '1fr 1.2fr', alignItems: 'start' }}>
        <div>
          <p className="mb-2 font-display text-[11px] font-semibold uppercase tracking-[0.22em]" style={{ color: '#e85d1a' }}>Waarom dealer worden</p>
          <h2 className="mb-8 font-display text-[32px] font-bold uppercase leading-tight tracking-[0.02em]" style={{ color: '#111111' }}>
            Groeien met Mantra Sports
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
            <p className="mb-4 font-display text-[12px] font-semibold uppercase tracking-[0.14em]" style={{ color: '#6B6B6B' }}>Wie we zoeken</p>
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
            Meld je aan via het formulier. Vermeld de naam van je bedrijf, je land en de productgroepen waarin je geïnteresseerd
            bent — we nemen contact met je op om de mogelijkheden te bespreken. Voor clubs en scholen: zie{' '}
            <Link href="/b2b" className="underline hover:text-[#e85d1a]">B2B-partnerschappen</Link>.
          </p>
        </div>

        <div>
          <WholesaleForm />
        </div>
      </div>
    </ContentPage>
  )
}
