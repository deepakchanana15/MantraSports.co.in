import type { Metadata } from 'next'
import Link from 'next/link'
import { ContentPage } from '@/components/layout/ContentPage'
import { SITE_CONFIG } from '@/lib/config/site'

export const metadata: Metadata = {
  title: 'Verzendbeleid',
  description:
    'Verzending, levertijden, verzendkosten en invoerrechten voor bestellingen bij Mantra Sports Nederland. Bestellingen worden verzonden vanuit Australië.',
}

export default function ShippingPolicyPage() {
  const email = SITE_CONFIG.contact.email

  return (
    <ContentPage
      eyebrow="Klantenservice"
      title="Verzendbeleid"
      intro="Alles over het verwerken, verzenden en bezorgen van je bestelling bij Mantra Sports Nederland."
      breadcrumb={[{ label: 'Verzendbeleid' }]}
      meta="Laatst bijgewerkt: 31 oktober 2026"
    >
      <h2>Waar verzenden we vandaan?</h2>
      <p>
        Bestellingen bij Mantra Sports Nederland worden verzorgd door {SITE_CONFIG.company.legalName} en verzonden
        vanuit Australië. Daardoor gelden er andere levertijden dan bij een Nederlandse webwinkel, en kunnen er bij invoer
        in de EU kosten bijkomen (zie <a href="#invoerrechten">Invoerrechten en btw</a>).
      </p>

      <h2>Bestellen en orderbevestiging</h2>
      <p>
        Je bestelt bij ons via een offerteaanvraag: via het <Link href="/contact">contactformulier</Link>, de knop
        &lsquo;Offerte aanvragen&rsquo; op een productpagina, WhatsApp of per e-mail. In onze offerte vermelden we de prijs,
        de verzendkosten en de verwachte levertijd. Zodra je de offerte hebt geaccepteerd en de betaling is ontvangen,
        ontvang je een orderbevestiging per e-mail.
      </p>

      <h2>Verwerking en verzending</h2>
      <p>
        Mantra Sports verzendt bestellingen doorgaans binnen <strong>1 tot 4 werkdagen</strong> na ontvangst van de bestelling
        en betaling*. Bestellingen worden tijdens normale werktijden verwerkt.
      </p>
      <p>
        Bats die we op jouw verzoek inkloppen (&lsquo;knocking-in&rsquo;) hebben hiervoor ongeveer 7 dagen nodig en worden
        daarna verzonden.
      </p>

      <h2>Levertijden</h2>
      <div className="table-wrap">
        <table>
          <thead>
            <tr><th>Bestemming</th><th>Levertijd na verzending</th></tr>
          </thead>
          <tbody>
            <tr><td>Nederland, België en de rest van Europa</td><td>5 – 14 werkdagen</td></tr>
            <tr><td>Verenigd Koninkrijk</td><td>5 – 14 werkdagen</td></tr>
          </tbody>
        </table>
      </div>
      <p>
        * Sommige artikelen moeten eerst vanuit een andere locatie naar ons worden overgebracht voordat ze kunnen worden verzonden,
        wat de levertijd kan beïnvloeden. De genoemde levertijden zijn schattingen. We verzenden zo snel mogelijk; bij langere
        vertraging nemen we contact met je op om je bestelling te bespreken. Douaneafhandeling kan de levertijd verlengen.
      </p>

      <h2>Track &amp; trace</h2>
      <p>
        Zodra je bestelling is verzonden, ontvang je per e-mail een trackingnummer waarmee je de status van je zending online
        kunt volgen.
      </p>

      <h2>Verzendkosten</h2>
      <p>
        Verzendkosten worden berekend op basis van gewicht, afmetingen en bestemming en staan altijd vooraf in je offerte.
        Voor extra volumineuze artikelen kunnen hogere kosten van de vervoerder gelden; we laten je dat altijd van tevoren weten.
        Voor bestellingen vanaf €100 is de verzending gratis, tenzij in je offerte uitdrukkelijk anders is vermeld.
      </p>

      <h2 id="invoerrechten">Invoerrechten en btw</h2>
      <p>
        Omdat we vanuit Australië (buiten de EU) verzenden, kan je zending bij invoer worden belast met invoerbtw, eventuele
        invoerrechten en inklaringskosten van de vervoerder of douane. Tenzij in je offerte anders is vermeld, zijn deze kosten
        voor rekening van de ontvanger. Ook kunnen douanebeperkingen van toepassing zijn.
      </p>

      <h2>Bezorging</h2>
      <p>
        Je bezorggegevens moeten een volledig straatadres en een telefoonnummer bevatten waarop je overdag bereikbaar bent.
        Zonder deze gegevens kunnen we je bestelling niet verzenden.
      </p>
      <p>
        Ben je niet thuis? De vervoerder doet doorgaans een nieuwe bezorgpoging of laat het pakket achter bij een afhaalpunt.
        Je kunt ook zelf contact opnemen met de vervoerder om een ander bezorgmoment af te spreken.
      </p>
      <p>
        Het risico van verlies of beschadiging van de producten gaat pas op jou over op het moment dat jij (of een door jou
        aangewezen persoon) het pakket in ontvangst neemt.
      </p>

      <h2>Beschikbaarheid van producten</h2>
      <p>
        Het kan voorkomen dat een product op het moment van bestellen is uitverkocht. In dat geval laten we je dat per e-mail
        weten en bespreken we de mogelijkheden. Sommige uitverkochte artikelen zijn nog via onze leveranciers verkrijgbaar; we
        doen dan ons best om het artikel alsnog voor je te bestellen.
      </p>

      <h2>Vragen?</h2>
      <p>
        Wil je een nauwkeurigere inschatting van de levertijd? Mail ons via <a href={`mailto:${email}`}>{email}</a>.
        Zie ook ons <Link href="/returns-policy">retour- en garantiebeleid</Link> en de <Link href="/faq">veelgestelde vragen</Link>.
      </p>
    </ContentPage>
  )
}
