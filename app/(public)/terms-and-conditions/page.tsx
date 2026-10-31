import type { Metadata } from 'next'
import Link from 'next/link'
import { ContentPage } from '@/components/layout/ContentPage'
import { SITE_CONFIG } from '@/lib/config/site'

export const metadata: Metadata = {
  title: 'Algemene Voorwaarden',
  description:
    'De algemene voorwaarden van Mantra Sports Nederland (Mantra Corporation Pty Ltd) voor het gebruik van mantrasports.nl en voor bestellingen.',
}

export default function TermsPage() {
  const { company, contact } = SITE_CONFIG
  const email = contact.email

  return (
    <ContentPage
      eyebrow="Juridisch"
      title="Algemene Voorwaarden"
      intro="Lees deze voorwaarden goed door voordat je de website gebruikt of een bestelling plaatst."
      breadcrumb={[{ label: 'Algemene Voorwaarden' }]}
      meta="Laatst bijgewerkt: 31 oktober 2026"
    >
      <h2>Overzicht</h2>
      <p>
        Deze website wordt geëxploiteerd door {company.legalName} (ABN {company.abn}), {company.street}, {company.city}{' '}
        {company.postalCode}, {company.region}, {company.country}, handelend als Mantra Sports Nederland. Op de hele website
        verwijzen &lsquo;wij&rsquo;, &lsquo;ons&rsquo; en &lsquo;onze&rsquo; naar Mantra Sports Nederland.
      </p>
      <p>
        Door onze website te bezoeken en/of iets bij ons te kopen, maak je gebruik van onze &lsquo;Dienst&rsquo; en ga je akkoord
        met deze algemene voorwaarden (&lsquo;Voorwaarden&rsquo;), inclusief de aanvullende voorwaarden en het beleid waarnaar
        hierin wordt verwezen. Deze Voorwaarden gelden voor alle gebruikers van de website.
      </p>
      <p>
        Waar in deze Voorwaarden sprake is van een &lsquo;consument&rsquo;, bedoelen we een natuurlijke persoon die niet handelt
        in de uitoefening van een beroep of bedrijf. Niets in deze Voorwaarden beperkt de rechten die consumenten op grond van
        dwingend recht hebben.
      </p>

      <h2>1. Gebruik van de website</h2>
      <ul>
        <li>
          Door akkoord te gaan met deze Voorwaarden verklaar je meerderjarig te zijn, of minderjarig te zijn met toestemming van
          je ouder of voogd.
        </li>
        <li>Je mag onze producten en de website niet gebruiken voor illegale of ongeoorloofde doeleinden.</li>
        <li>Je mag geen virussen of andere schadelijke code verspreiden.</li>
        <li>
          Je mag (delen van) de Dienst niet kopiëren, dupliceren, verkopen of anderszins exploiteren zonder onze uitdrukkelijke
          schriftelijke toestemming.
        </li>
        <li>
          Het is verboden de website te gebruiken om anderen lastig te vallen of te misleiden, om onjuiste informatie te
          verstrekken, om persoonsgegevens van anderen te verzamelen, om spam te versturen of geautomatiseerd gegevens te
          verzamelen, of om de beveiliging van de website te omzeilen.
        </li>
        <li>Bij overtreding van deze regels kunnen we je de toegang tot de Dienst ontzeggen.</li>
      </ul>

      <h2>2. Informatie op de website</h2>
      <p>
        We doen ons best om de informatie op de website juist, volledig en actueel te houden. Toch kan informatie onvolledig of
        verouderd zijn of (type)fouten bevatten, bijvoorbeeld in productbeschrijvingen, prijzen, verzendkosten, levertijden of
        beschikbaarheid. We behouden ons het recht voor om zulke fouten te corrigeren. Kennelijke vergissingen en fouten binden
        ons niet.
      </p>
      <p>
        We doen ons best om kleuren en afbeeldingen van producten zo nauwkeurig mogelijk weer te geven, maar kunnen niet
        garanderen dat jouw beeldscherm de kleuren precies weergeeft.
      </p>

      <h2>3. Prijzen</h2>
      <ul>
        <li>Prijzen op de website zijn in euro&apos;s.</li>
        <li>
          Prijzen kunnen zonder voorafgaande kennisgeving wijzigen. Een prijswijziging heeft geen invloed op een offerte die al
          door jou is geaccepteerd of een bestelling die al door ons is bevestigd.
        </li>
        <li>
          Verzendkosten en eventuele invoerkosten staan vermeld in je offerte en in ons{' '}
          <Link href="/shipping-policy">verzendbeleid</Link>.
        </li>
      </ul>

      <h2>4. Offerte en totstandkoming van de overeenkomst</h2>
      <ul>
        <li>
          Je bestelt bij ons via een offerteaanvraag. Een offerte is vrijblijvend en geldig gedurende de termijn die in de offerte
          staat.
        </li>
        <li>
          De overeenkomst komt tot stand wanneer je onze offerte accepteert en wij je bestelling per e-mail bevestigen.
        </li>
        <li>
          We kunnen een bestelling weigeren of de hoeveelheid per persoon, huishouden of bestelling beperken, bijvoorbeeld bij
          vermoeden van misbruik of fraude. Als we een bevestigde bestelling wijzigen of annuleren, laten we je dat zo snel
          mogelijk weten en betalen we een eventueel al betaald bedrag volledig terug.
        </li>
        <li>
          Je bent verantwoordelijk voor het verstrekken van juiste en volledige gegevens, zoals je naam, e-mailadres en
          bezorgadres.
        </li>
      </ul>

      <h2>5. Betaling</h2>
      <p>
        De betaalwijze en betaalinstructies staan in je offerte of factuur. Betalingen worden verwerkt via beveiligde
        betaalomgevingen. Creditcardgegevens worden altijd versleuteld verzonden.
      </p>

      <h2>6. Levering</h2>
      <p>
        Bestellingen worden verzonden vanuit Australië. Levertijden, verzendkosten en informatie over invoerbtw en invoerrechten
        vind je in ons <Link href="/shipping-policy">verzendbeleid</Link>. Het risico van verlies of beschadiging gaat voor
        consumenten pas over op het moment van bezorging.
      </p>

      <h2>7. Herroepingsrecht, retourneren en ruilen</h2>
      <p>
        Consumenten hebben een herroepingsrecht van 14 dagen na ontvangst, dat wij voor ongebruikte artikelen verlengen tot 30
        dagen. Maatwerk en gepersonaliseerde producten zijn uitgesloten van het herroepingsrecht. Alle details, inclusief het
        modelformulier voor herroeping, vind je in ons <Link href="/returns-policy">retour- en garantiebeleid</Link>.
      </p>

      <h2>8. Garantie en conformiteit</h2>
      <p>
        De producten die we leveren, voldoen aan de overeenkomst en aan wat je redelijkerwijs mag verwachten. Je hebt als
        consument altijd recht op de wettelijke garantie. Daarnaast geven wij een eigen garantie per productcategorie, zoals
        beschreven in ons <Link href="/returns-policy">retour- en garantiebeleid</Link>.
      </p>

      <h2>9. Aansprakelijkheid</h2>
      <p>
        We kunnen niet garanderen dat de website altijd ononderbroken, tijdig, veilig of foutloos beschikbaar is. Voor zover
        wettelijk toegestaan, zijn wij, onze bestuurders, medewerkers, gelieerde ondernemingen en leveranciers niet aansprakelijk
        voor indirecte schade of gevolgschade, zoals gederfde winst of omzet, die voortvloeit uit het gebruik van de website of
        van via de website verkregen producten. Deze beperking geldt niet bij opzet of bewuste roekeloosheid en doet niets af aan
        je wettelijke rechten als consument.
      </p>

      <h2>10. Intellectueel eigendom</h2>
      <p>
        Alle teksten, afbeeldingen, logo&apos;s en andere materialen op deze website zijn eigendom van Mantra Sports of haar
        licentiegevers en mogen niet zonder onze schriftelijke toestemming worden gebruikt.
      </p>

      <h2>11. Opmerkingen, feedback en andere inzendingen</h2>
      <p>
        Als je ons ideeën, suggesties of andere materialen stuurt (&lsquo;opmerkingen&rsquo;), mogen we deze zonder beperking
        bewerken, kopiëren, publiceren en anderszins gebruiken. We zijn niet verplicht opmerkingen vertrouwelijk te houden, er
        een vergoeding voor te betalen of erop te reageren. Je bent zelf verantwoordelijk voor je opmerkingen; deze mogen geen
        inbreuk maken op rechten van derden en geen onrechtmatige, beledigende of schadelijke inhoud bevatten.
      </p>

      <h2>12. Links naar derden</h2>
      <p>
        Links op de website kunnen naar websites van derden leiden die niet aan ons zijn verbonden. We zijn niet verantwoordelijk
        voor de inhoud of juistheid van die websites en niet aansprakelijk voor schade in verband met producten of diensten van
        derden. Lees het beleid van zulke derden zorgvuldig.
      </p>

      <h2>13. Persoonsgegevens</h2>
      <p>
        Op de verwerking van je persoonsgegevens is ons <Link href="/privacy-policy">privacybeleid</Link> van toepassing.
      </p>

      <h2>14. Zakelijke afnemers en groothandel</h2>
      <p>
        Voor clubs, scholen, dealers en andere zakelijke afnemers kunnen in de offerte of een aparte overeenkomst afwijkende
        afspraken worden gemaakt, bijvoorbeeld over prijzen, aantallen, betaling en levering. Het herroepingsrecht en andere
        regels die specifiek voor consumenten gelden, zijn niet van toepassing op zakelijke afnemers.
      </p>

      <h2>15. Klachten</h2>
      <p>
        Heb je een klacht? Neem contact met ons op via <a href={`mailto:${email}`}>{email}</a>. We bevestigen je klacht en streven
        ernaar deze binnen 14 dagen inhoudelijk te beantwoorden.
      </p>

      <h2>16. Toepasselijk recht</h2>
      <p>
        Op deze Voorwaarden en op overeenkomsten met ons is het recht van Tasmanië, Australië, van toepassing. Ben je een
        consument met woonplaats in de Europese Unie, dan behoud je daarnaast de bescherming die de dwingende bepalingen van het
        recht van je woonland je bieden, en kun je een geschil ook voorleggen aan de bevoegde rechter in je woonland.
      </p>

      <h2>17. Overige bepalingen</h2>
      <ul>
        <li>
          Is een bepaling van deze Voorwaarden onwettig, nietig of niet afdwingbaar, dan blijven de overige bepalingen
          onverminderd van kracht. De betreffende bepaling wordt dan zoveel mogelijk uitgevoerd binnen wat wettelijk is
          toegestaan.
        </li>
        <li>Als wij een recht of bepaling niet uitoefenen of handhaven, betekent dat niet dat we daarvan afstand doen.</li>
        <li>
          We kunnen deze Voorwaarden van tijd tot tijd wijzigen. De meest recente versie staat altijd op deze pagina. Op een
          bestelling zijn de Voorwaarden van toepassing die golden op het moment dat je de bestelling plaatste.
        </li>
      </ul>

      <h2>18. Contact</h2>
      <p>
        Vragen over deze Voorwaarden kun je sturen naar <a href={`mailto:${email}`}>{email}</a>. Onze volledige gegevens vind je
        op de pagina <Link href="/company-information">bedrijfsgegevens</Link>.
      </p>
    </ContentPage>
  )
}
