import type { Metadata } from 'next'
import Link from 'next/link'
import { ContentPage } from '@/components/layout/ContentPage'
import { FAQSchema } from '@/components/seo/JsonLd'

export const metadata: Metadata = {
  title: 'Veelgestelde Vragen (FAQ)',
  description:
    'Antwoorden op veelgestelde vragen over bestellen, verzending, levertijden, retourneren, betalen en groothandel bij Mantra Sports Nederland.',
}

type FaqItem = { question: string; answer: string; link?: { href: string; label: string } }

const FAQ_GROUPS: { title: string; items: FaqItem[] }[] = [
  {
    title: 'Bestellen',
    items: [
      {
        question: 'Hoe bestel ik bij Mantra Sports Nederland?',
        answer:
          'Je bestelt via een offerteaanvraag. Klik op een productpagina op ‘Offerte aanvragen’, gebruik het contactformulier of stuur ons een bericht via WhatsApp of e-mail. Je ontvangt een offerte met de prijs, de verzendkosten en de verwachte levertijd. Na akkoord en betaling verzenden we je bestelling.',
        link: { href: '/contact', label: 'Naar het contactformulier' },
      },
      {
        question: 'Welke maat cricketbat heb ik nodig?',
        answer:
          'De juiste batmaat hangt vooral af van je lengte. In onze maatgids vind je een maattabel van maat 0 voor de jongste spelers tot Short Handle en Long Handle voor volwassenen. Twijfel je? Ons team helpt je graag.',
        link: { href: '/blog/cricketbat-maattabel-welke-maat', label: 'Bekijk de maattabel voor cricketbats' },
      },
      {
        question: 'Bestellen clubs en scholen ook bij jullie?',
        answer:
          'Ja. Voor clubs, scholen, academies en dealers bieden we groothandelsprijzen en maatwerk, zoals teamkleding en kitbags in clubkleuren. Vraag vrijblijvend een groothandelsofferte aan.',
        link: { href: '/wholesale', label: 'Groothandel & B2B' },
      },
    ],
  },
  {
    title: 'Levering & verzending',
    items: [
      {
        question: 'Hoe lang duurt het voordat ik mijn bestelling ontvang?',
        answer:
          'We verzenden bestellingen vanuit Australië, doorgaans binnen 1 tot 4 werkdagen na ontvangst van de betaling. Daarna duurt de bezorging naar Nederland en de rest van Europa gemiddeld 5 tot 14 werkdagen. De levertijd kan variëren per product en door douaneafhandeling.',
        link: { href: '/shipping-policy', label: 'Lees ons verzendbeleid' },
      },
      {
        question: 'Wat zijn de verzendkosten?',
        answer:
          'De verzendkosten hangen af van het gewicht, de afmetingen en de bestemming van je bestelling. Je ziet de exacte verzendkosten altijd vooraf in je offerte.',
      },
      {
        question: 'Moet ik invoerrechten of btw betalen?',
        answer:
          'Omdat we vanuit Australië verzenden, kunnen bij invoer in de EU invoerbtw, invoerrechten en inklaringskosten worden berekend. Tenzij in je offerte anders is vermeld, zijn deze kosten voor rekening van de ontvanger.',
      },
      {
        question: 'Kan ik mijn zending volgen?',
        answer:
          'Ja. Zodra je bestelling is verzonden, ontvang je per e-mail een trackingnummer waarmee je je zending online kunt volgen.',
      },
      {
        question: 'Wat als ik niet thuis ben bij de bezorging?',
        answer:
          'De vervoerder doet doorgaans een nieuwe bezorgpoging of laat het pakket achter bij een afhaalpunt. Je kunt ook zelf contact opnemen met de vervoerder om een ander bezorgmoment af te spreken.',
      },
    ],
  },
  {
    title: 'Retourneren & terugbetaling',
    items: [
      {
        question: 'Wat is jullie retourbeleid?',
        answer:
          'Als consument heb je 14 dagen wettelijke bedenktijd. Voor ongebruikte artikelen in de originele verpakking verlengen we dat tot 30 dagen na ontvangst. Neem contact met ons op om een retour aan te melden; we sturen je dan de retourinstructies.',
        link: { href: '/returns-policy', label: 'Lees ons retour- en garantiebeleid' },
      },
      {
        question: 'Hoe snel krijg ik mijn geld terug?',
        answer:
          'We betalen je uiterlijk binnen 14 dagen nadat je de herroeping hebt gemeld terug. We mogen wachten tot we het product hebben ontvangen of tot je hebt aangetoond dat je het hebt teruggestuurd. Je ontvangt een e-mail zodra de terugbetaling is verwerkt.',
      },
      {
        question: 'Kan ik een product op maat retourneren?',
        answer:
          'Producten die op maat zijn gemaakt of gepersonaliseerd, zoals teamkleding op maat, kunnen niet worden geretourneerd, tenzij er sprake is van een productiefout. Controleer je maatwerkgegevens daarom goed voordat je je bestelling bevestigt.',
      },
      {
        question: 'Welke garantie krijg ik op mijn bat?',
        answer:
          'Op cricketbats geven we 12 maanden garantie, op beschermende uitrusting en helmen 6 maanden en op kitbags 12 maanden, naast je wettelijke garantie. In ons retour- en garantiebeleid lees je precies wat wel en niet onder de garantie valt.',
      },
    ],
  },
  {
    title: 'Betalen',
    items: [
      {
        question: 'Welke betaalmethoden accepteren jullie?',
        answer:
          'We accepteren onder meer creditcard en PayPal. De beschikbare betaalmethoden en betaalinstructies staan in je offerte.',
      },
      {
        question: 'Is mijn betaling veilig?',
        answer:
          'Ja. Betalingen worden versleuteld en via beveiligde betaalomgevingen verwerkt. Je veiligheid en privacy staan bij elke transactie voorop.',
      },
    ],
  },
]

export default function FaqPage() {
  const allItems = FAQ_GROUPS.flatMap((g) => g.items)

  return (
    <ContentPage
      eyebrow="Hulp & ondersteuning"
      title="Veelgestelde Vragen"
      intro="Antwoorden op de meest gestelde vragen over bestellen, verzending, retourneren en betalen. Staat je vraag er niet tussen? Neem gerust contact met ons op."
      breadcrumb={[{ label: 'FAQ' }]}
    >
      <FAQSchema items={allItems.map(({ question, answer }) => ({ question, answer }))} />

      {FAQ_GROUPS.map((group) => (
        <section key={group.title}>
          <h2>{group.title}</h2>
          {group.items.map((item) => (
            <div key={item.question}>
              <h3>{item.question}</h3>
              <p>
                {item.answer}
                {item.link && (
                  <>
                    {' '}
                    <Link href={item.link.href}>{item.link.label}</Link>.
                  </>
                )}
              </p>
            </div>
          ))}
        </section>
      ))}

      <h2>Nog een vraag?</h2>
      <p>
        Ons team helpt je graag verder. Gebruik het <Link href="/contact">contactformulier</Link> — we reageren doorgaans binnen
        24 uur op werkdagen.
      </p>
    </ContentPage>
  )
}
