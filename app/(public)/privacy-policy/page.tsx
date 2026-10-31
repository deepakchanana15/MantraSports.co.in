import type { Metadata } from 'next'
import Link from 'next/link'
import { ContentPage } from '@/components/layout/ContentPage'
import { SITE_CONFIG } from '@/lib/config/site'

export const metadata: Metadata = {
  title: 'Privacybeleid',
  description:
    'Hoe Mantra Sports Nederland (Mantra Corporation Pty Ltd) omgaat met je persoonsgegevens, conform de Algemene Verordening Gegevensbescherming (AVG).',
}

export default function PrivacyPolicyPage() {
  const { company, contact } = SITE_CONFIG
  const email = contact.email

  return (
    <ContentPage
      eyebrow="Juridisch"
      title="Privacybeleid"
      intro="In dit privacybeleid lees je welke persoonsgegevens we verzamelen wanneer je mantrasports.nl bezoekt of bij ons bestelt, waarom we dat doen en welke rechten je hebt."
      breadcrumb={[{ label: 'Privacybeleid' }]}
      meta="Laatst bijgewerkt: 31 oktober 2026"
    >
      <h2>Wie is verantwoordelijk?</h2>
      <p>
        De verwerkingsverantwoordelijke voor de persoonsgegevens die via mantrasports.nl (&lsquo;de website&rsquo;) worden
        verzameld, is:
      </p>
      <p>
        <strong>{company.legalName}</strong> (handelend als Mantra Sports Nederland)<br />
        ABN {company.abn}<br />
        {company.street}, {company.city} {company.postalCode}, {company.region}, {company.country}<br />
        E-mail: <a href={`mailto:${email}`}>{email}</a><br />
        Telefoon: {contact.phone}
      </p>
      <p>
        Omdat we producten aanbieden aan klanten in de Europese Unie, verwerken we je gegevens in overeenstemming met de
        Algemene Verordening Gegevensbescherming (AVG / GDPR).
      </p>

      <h2>Welke gegevens verzamelen we?</h2>
      <h3>Gegevens die je zelf aan ons geeft</h3>
      <ul>
        <li>
          <strong>Contact-, offerte- en groothandelsaanvragen:</strong> naam, e-mailadres, telefoonnummer, organisatie of club,
          land, gewenste aantallen, producten waarin je geïnteresseerd bent en de inhoud van je bericht.
        </li>
        <li><strong>Nieuwsbrief:</strong> je e-mailadres, als je je aanmeldt.</li>
        <li>
          <strong>Bestellingen (&lsquo;ordergegevens&rsquo;):</strong> naam, factuur- en bezorgadres, e-mailadres, telefoonnummer
          en betaalgegevens die nodig zijn om je bestelling af te handelen.
        </li>
      </ul>
      <h3>Gegevens die automatisch worden verzameld (&lsquo;apparaatgegevens&rsquo;)</h3>
      <ul>
        <li>
          <strong>Logbestanden:</strong> bij elk bezoek registreert onze hostingprovider technische gegevens zoals je IP-adres,
          browsertype, bezochte pagina&apos;s, verwijzende pagina en datum/tijd. Deze gegevens zijn nodig om de website veilig en
          goed te laten werken.
        </li>
        <li>
          <strong>IP-adres bij formulieren:</strong> wanneer je een formulier verstuurt, slaan we je IP-adres op om misbruik en
          spam te voorkomen.
        </li>
      </ul>

      <h2>Cookies en lokale opslag</h2>
      <p>
        De website gebruikt op dit moment <strong>geen</strong> analytische, advertentie- of trackingcookies. We slaan alleen je
        cookievoorkeur op in de lokale opslag van je browser, zodat we je niet bij elk bezoek opnieuw dezelfde melding tonen.
        Voor beheerders van de website worden functionele inlogcookies gebruikt. Mochten we in de toekomst analytische of
        marketingcookies inzetten, dan vragen we daarvoor vooraf je toestemming en passen we dit beleid aan. Meer informatie over
        cookies en hoe je ze uitschakelt, vind je op <a href="https://www.allaboutcookies.org" target="_blank" rel="noopener noreferrer">allaboutcookies.org</a>.
      </p>

      <h2>Waarvoor gebruiken we je gegevens?</h2>
      <div className="table-wrap">
        <table>
          <thead>
            <tr><th>Doel</th><th>Rechtsgrond (AVG)</th></tr>
          </thead>
          <tbody>
            <tr>
              <td>Je vraag of offerteaanvraag beantwoorden en opvolgen</td>
              <td>Uitvoering van (de voorbereiding van) een overeenkomst, of ons gerechtvaardigd belang om op vragen te reageren</td>
            </tr>
            <tr>
              <td>Je bestelling verwerken: betaling, verzending, facturen en orderbevestigingen</td>
              <td>Uitvoering van de overeenkomst</td>
            </tr>
            <tr>
              <td>Met je communiceren over je bestelling, retour of garantieclaim</td>
              <td>Uitvoering van de overeenkomst</td>
            </tr>
            <tr>
              <td>Nieuwsbrieven en informatie over producten en acties sturen</td>
              <td>Je toestemming (die je altijd kunt intrekken via de afmeldlink of per e-mail)</td>
            </tr>
            <tr>
              <td>Fraude, spam en misbruik voorkomen en de website beveiligen en verbeteren</td>
              <td>Ons gerechtvaardigd belang</td>
            </tr>
            <tr>
              <td>Voldoen aan wettelijke verplichtingen, zoals de administratie- en belastingplicht</td>
              <td>Wettelijke verplichting</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2>Met wie delen we je gegevens?</h2>
      <p>We verkopen je gegevens nooit. We delen ze alleen met partijen die ons helpen de website en onze dienstverlening te leveren:</p>
      <ul>
        <li><strong>Hosting en infrastructuur</strong> — Vercel (hosting van de website) en Neon (database).</li>
        <li><strong>Afbeeldingen</strong> — Cloudinary (opslag en weergave van productafbeeldingen).</li>
        <li><strong>E-mail</strong> — onze e-maildienstverlener, om je aanvraag en onze antwoorden te versturen.</li>
        <li>
          <strong>Mantra Sports-groep</strong> — aanvragen worden ook vastgelegd in het interne klantsysteem van Mantra Sports,
          zodat ons hoofdkantoor je aanvraag kan opvolgen.
        </li>
        <li><strong>Vervoerders en betaaldienstverleners</strong> — voor het bezorgen en afrekenen van bestellingen.</li>
      </ul>
      <p>
        Daarnaast kunnen we gegevens verstrekken als dat wettelijk verplicht is, bijvoorbeeld op verzoek van een bevoegde
        instantie, of om onze rechten te beschermen.
      </p>

      <h2>Doorgifte buiten de Europese Economische Ruimte</h2>
      <p>
        Omdat {company.legalName} in Australië is gevestigd en sommige dienstverleners in de Verenigde Staten zitten, worden je
        gegevens doorgegeven aan landen buiten de Europese Economische Ruimte (EER). We zorgen in dat geval voor passende
        waarborgen, zoals de standaardcontractbepalingen van de Europese Commissie of, voor Amerikaanse partijen, het EU-US
        Data Privacy Framework waar van toepassing. Je kunt via <a href={`mailto:${email}`}>{email}</a> meer informatie over deze
        waarborgen opvragen.
      </p>

      <h2>Hoe lang bewaren we je gegevens?</h2>
      <ul>
        <li>
          Aanvragen die niet tot een bestelling leiden, bewaren we zolang dat nodig is voor de opvolging en uiterlijk 2 jaar na
          het laatste contact.
        </li>
        <li>Ordergegevens en facturen bewaren we zolang de wettelijke bewaarplicht voor onze administratie dat vereist.</li>
        <li>Je nieuwsbriefaanmelding bewaren we tot je je afmeldt.</li>
        <li>Logbestanden worden na korte tijd automatisch verwijderd door onze hostingprovider.</li>
      </ul>

      <h2>Je rechten</h2>
      <p>Op grond van de AVG heb je het recht om:</p>
      <ul>
        <li>inzage te vragen in de persoonsgegevens die we van je hebben;</li>
        <li>onjuiste gegevens te laten corrigeren of aanvullen;</li>
        <li>je gegevens te laten verwijderen;</li>
        <li>de verwerking te laten beperken;</li>
        <li>bezwaar te maken tegen verwerking op basis van ons gerechtvaardigd belang, waaronder direct marketing;</li>
        <li>je gegevens in een gangbaar formaat te ontvangen (dataportabiliteit);</li>
        <li>je toestemming op elk moment in te trekken.</li>
      </ul>
      <p>
        Stuur je verzoek naar <a href={`mailto:${email}`}>{email}</a>. We reageren binnen een maand. Ben je niet tevreden over
        hoe we met je gegevens omgaan, dan kun je een klacht indienen bij de{' '}
        <a href="https://autoriteitpersoonsgegevens.nl" target="_blank" rel="noopener noreferrer">Autoriteit Persoonsgegevens</a>{' '}
        of bij de privacytoezichthouder in je eigen land.
      </p>

      <h2>Beveiliging</h2>
      <p>
        We nemen passende technische en organisatorische maatregelen om je gegevens te beschermen. De website gebruikt een
        versleutelde verbinding (HTTPS) en de toegang tot klantgegevens is beperkt tot medewerkers die deze nodig hebben.
      </p>

      <h2>Do Not Track</h2>
      <p>
        We passen onze gegevensverzameling niet aan op basis van een &lsquo;Do Not Track&rsquo;-signaal van je browser. Omdat
        we geen trackingcookies gebruiken, heeft dit in de praktijk weinig gevolgen.
      </p>

      <h2>Wijzigingen</h2>
      <p>
        We kunnen dit privacybeleid van tijd tot tijd aanpassen, bijvoorbeeld door veranderingen in onze werkwijze of om
        operationele, juridische of wettelijke redenen. De meest recente versie staat altijd op deze pagina.
      </p>

      <h2>Contact</h2>
      <p>
        Heb je vragen over onze privacypraktijken of wil je een klacht indienen? Mail ons via{' '}
        <a href={`mailto:${email}`}>{email}</a> of schrijf naar {company.legalName}, {company.street}, {company.city}{' '}
        {company.postalCode}, {company.region}, {company.country}. Zie ook onze <Link href="/terms-and-conditions">algemene voorwaarden</Link>.
      </p>
    </ContentPage>
  )
}
