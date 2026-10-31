import type { Metadata } from 'next'
import Link from 'next/link'
import { Shirt, Users, Package, Headphones } from 'lucide-react'
import { ContentPage } from '@/components/layout/ContentPage'
import { WholesaleForm } from '../wholesale/WholesaleForm'

export const metadata: Metadata = {
  title: 'B2B-Partnerschappen',
  description:
    'B2B-partnerschappen met Mantra Sports: cricketuitrusting, teamkleding en kitbags in clubkleuren voor clubs, scholen, academies en bonden in Nederland en Europa.',
}

const OFFERS = [
  {
    icon: Shirt,
    title: 'Maatwerk in clubkleuren',
    text: 'Teamkleding, kitbags en uitrusting in de kleuren en met het logo van jouw club of school.',
  },
  {
    icon: Package,
    title: 'Volumeprijzen',
    text: 'Scherpe prijzen voor grotere aantallen — van een teamset tot de uitrusting voor een hele vereniging.',
  },
  {
    icon: Users,
    title: 'Voor elk niveau',
    text: 'Van juniorbats en beschermers voor de jeugd tot premium Engels wilgenhout voor het eerste team.',
  },
  {
    icon: Headphones,
    title: 'Direct contact',
    text: 'Je spreekt direct met ons team voor persoonlijk advies over maten, materialen en levering.',
  },
]

const STEPS = [
  { title: 'Aanvraag', text: 'Vertel ons via het formulier wat je nodig hebt: producten, aantallen en eventuele wensen voor maatwerk.' },
  { title: 'Offerte', text: 'Je ontvangt een offerte op maat met prijzen, verzendkosten en de verwachte levertijd.' },
  { title: 'Levering', text: 'Na akkoord gaan we aan de slag en leveren we je bestelling op het afgesproken adres.' },
]

export default function B2BPage() {
  return (
    <ContentPage
      eyebrow="Voor clubs, scholen & organisaties"
      title="B2B-Partnerschappen"
      intro="Mantra Sports is dé partner voor clubs, scholen, academies en bonden die hun spelers willen uitrusten met premium cricketuitrusting en teamkleding."
      breadcrumb={[{ label: 'Groothandel', href: '/wholesale' }, { label: 'B2B-Partnerschappen' }]}
      prose={false}
    >
      <div className="grid gap-16" style={{ gridTemplateColumns: '1fr 1.2fr', alignItems: 'start' }}>
        <div>
          <p className="mb-2 font-display text-[11px] font-semibold uppercase tracking-[0.22em]" style={{ color: '#e85d1a' }}>Wat we bieden</p>
          <h2 className="mb-8 font-display text-[32px] font-bold uppercase leading-tight tracking-[0.02em]" style={{ color: '#111111' }}>
            Samen jouw team uitrusten
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
            <p className="mb-4 font-display text-[12px] font-semibold uppercase tracking-[0.14em]" style={{ color: '#6B6B6B' }}>Zo werkt het</p>
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
            Ben je een sportwinkel of wederverkoper? Bekijk dan ons <Link href="/become-a-dealer" className="underline hover:text-[#e85d1a]">dealerprogramma</Link>.
          </p>
        </div>

        <div>
          <WholesaleForm />
        </div>
      </div>
    </ContentPage>
  )
}
