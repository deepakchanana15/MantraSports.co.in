import type { Metadata } from 'next'
import Link from 'next/link'
import { ContentPage } from '@/components/layout/ContentPage'

export const metadata: Metadata = {
  title: 'Over Ons',
  description:
    'Mantra Sports is gespecialiseerd in premium cricketuitrusting: Engels wilgenhouten bats, beschermende uitrusting en teamkleding op maat. Leer ons kennen.',
}

export default function AboutPage() {
  return (
    <ContentPage
      eyebrow="Over Mantra Sports"
      title="Over Ons"
      intro="Premium cricketuitrusting voor elke speler — van beginner tot professional. Mantra Sports Nederland is onderdeel van Mantra Corporation Pty Ltd in Australië."
      breadcrumb={[{ label: 'Over Ons' }]}
    >
      <p>
        Welkom bij Mantra Sports, gespecialiseerd in premium cricketuitrusting. We zijn gepassioneerd over het helpen van
        cricketers om hun volledige potentieel te bereiken en hun doelen op het veld te halen. Of je nu een ervaren speler bent of
        net begint, wij hebben de producten en de expertise om je bij elke stap te ondersteunen. Van hoogwaardige Engels
        wilgenhouten bats en beschermende uitrusting tot teamkleding op maat: we zetten ons in om je de best mogelijke producten
        en service te bieden.
      </p>
      <p>
        We begrijpen de toewijding en het harde werk dat in het spel gaat zitten, en we helpen je graag om te slagen. Of je nu aan
        de crease staat of achter de stumps: wij helpen je om op je best te presteren en van elk moment op het veld te genieten.
        Bedankt dat je kiest voor Mantra Sports als jouw betrouwbare partner in cricket.
      </p>

      <h2>Wat we bieden</h2>
      <p>
        Mantra Sports biedt een uitgebreid assortiment hoogwaardige cricketuitrusting, ontworpen voor elke speler — van beginners tot
        professionals:
      </p>
      <ul>
        <li><strong>Cricketbats</strong> — topbats, gemaakt voor prestaties en duurzaamheid.</li>
        <li><strong>Handschoenen &amp; beenbeschermers</strong> — premium handschoenen en pads voor optimaal comfort en bescherming.</li>
        <li><strong>Helmen &amp; beschermende uitrusting</strong> — veiligheid voorop, zodat je met vertrouwen speelt.</li>
        <li><strong>Wicketkeeperuitrusting</strong> — gespecialiseerde uitrusting voor wicketkeepers.</li>
        <li><strong>Grips &amp; accessoires</strong> — essentiële accessoires om je spel naar een hoger niveau te tillen.</li>
        <li><strong>Cricketkleding</strong> — comfortabele, duurzame sportkleding voor elk niveau.</li>
      </ul>
      <p>
        Daarnaast verzorgen we maatwerkbestellingen: kitbags, kleding en uitrusting in de kleuren van jouw club. Zoek je iets
        specifieks? Laat het ons weten. Je spreekt direct met ons team, zodat je persoonlijke service en deskundig advies krijgt
        bij het maken van de juiste keuze.
      </p>

      <h2>Waarom Mantra Sports?</h2>
      <ul>
        <li><strong>Kwaliteit voor een eerlijke prijs</strong> — de beste cricketuitrusting tegen scherpe prijzen.</li>
        <li><strong>Een vertrouwde cricketspecialist</strong> — een breed assortiment voor iedere cricketliefhebber.</li>
        <li><strong>Alles op één plek</strong> — bats, handschoenen, helmen, pads en keepersuitrusting.</li>
        <li><strong>Persoonlijk advies</strong> — hulp bij het kiezen van de juiste maat, het juiste gewicht en de juiste uitrusting.</li>
      </ul>

      <h2>Mantra Sports wereldwijd</h2>
      <p>
        Mantra Sports Nederland wordt geëxploiteerd door Mantra Corporation Pty Ltd, gevestigd in Tasmanië, Australië. Bekijk
        onze <Link href="/company-information">bedrijfsgegevens</Link> voor meer informatie.
      </p>

      <h2>Aan de slag</h2>
      <p>
        Bekijk ons <Link href="/shop">volledige assortiment</Link>, vraag een <Link href="/contact">offerte</Link> aan of
        neem contact op over <Link href="/wholesale">groothandel en clubbestellingen</Link>. Twijfel je over de juiste batmaat?
        Lees onze <Link href="/blog">tips en gidsen</Link>.
      </p>
    </ContentPage>
  )
}
