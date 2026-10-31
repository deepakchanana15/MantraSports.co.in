import type { Metadata } from 'next'
import Link from 'next/link'
import { ContentPage } from '@/components/layout/ContentPage'
import { SITE_CONFIG } from '@/lib/config/site'

export const metadata: Metadata = {
  title: 'Retour- en garantiebeleid',
  description:
    'Retourneren, herroepingsrecht, ruilen en garantie bij Mantra Sports Nederland. 30 dagen bedenktijd op ongebruikte artikelen en garantie op bats en beschermers.',
}

export default function ReturnsPolicyPage() {
  const { company, contact } = SITE_CONFIG
  const email = contact.email

  return (
    <ContentPage
      eyebrow="Klantenservice"
      title="Retour- en garantiebeleid"
      intro="Onze belofte aan jou: duidelijke afspraken over retourneren, ruilen en garantie — bovenop je wettelijke rechten."
      breadcrumb={[{ label: 'Retourbeleid' }]}
      meta="Laatst bijgewerkt: 31 oktober 2026"
    >
      <h2>Onze belofte</h2>
      <p>
        Als consument heb je altijd recht op de wettelijke garantie: een product moet doen wat je er redelijkerwijs van mag
        verwachten. Is dat niet zo, dan heb je recht op herstel of vervanging en in bepaalde gevallen op prijsvermindering of
        terugbetaling. Dit beleid beperkt die wettelijke rechten op geen enkele manier; het geeft je daarnaast extra zekerheid.
      </p>

      <h2>Herroepingsrecht (14 dagen bedenktijd)</h2>
      <p>
        Koop je als consument op afstand bij ons, dan heb je het recht om de overeenkomst binnen <strong>14 dagen</strong> zonder
        opgave van redenen te ontbinden. Deze termijn gaat in op de dag nadat jij (of een door jou aangewezen persoon) het product
        hebt ontvangen. Tijdens de bedenktijd mag je het product uitpakken en bekijken zoals je dat in een winkel zou doen. Gebruik
        je het product meer dan nodig is om de aard, kenmerken en werking vast te stellen (bijvoorbeeld een bat inkloppen of ermee
        spelen), dan mogen we de waardevermindering in rekening brengen.
      </p>

      <h2>30 dagen retourneren van ongebruikte artikelen</h2>
      <p>
        Uit service verlengen we de bedenktijd voor ongebruikte artikelen tot <strong>30 dagen</strong> na ontvangst, mits het
        artikel:
      </p>
      <ul>
        <li>ongebruikt is en in dezelfde staat als waarin je het hebt ontvangen;</li>
        <li>in de originele, onbeschadigde verpakking zit;</li>
        <li>vergezeld gaat van een aankoopbewijs (orderbevestiging of factuur).</li>
      </ul>

      <h2>Zo retourneer je</h2>
      <ol>
        <li>
          Meld je retour binnen de termijn per e-mail aan <a href={`mailto:${email}`}>{email}</a>, met je naam, ordernummer en
          het artikel dat je wilt retourneren. Je kunt hiervoor ook het <a href="#modelformulier">modelformulier</a> hieronder
          gebruiken.
        </li>
        <li>We sturen je de retourinstructies en het retouradres.</li>
        <li>Stuur het artikel binnen 14 dagen na je melding goed verpakt terug.</li>
      </ol>
      <p>
        De kosten voor het terugsturen zijn voor jouw rekening, tenzij het artikel defect is of je een verkeerd artikel hebt
        ontvangen. Let op: omdat wij vanuit Australië werken, kan het retouradres in Australië liggen. Gebruik bij voorkeur een
        verzendmethode met track &amp; trace.
      </p>

      <h2>Terugbetaling</h2>
      <p>
        Bij een herroeping betalen we het aankoopbedrag, inclusief de oorspronkelijke standaardverzendkosten, uiterlijk binnen
        14 dagen nadat je ons hebt laten weten dat je de overeenkomst ontbindt. We mogen wachten met terugbetalen tot we het
        product hebben ontvangen of tot je hebt aangetoond dat je het hebt teruggestuurd. We betalen terug via dezelfde
        betaalmethode die je hebt gebruikt, tenzij we samen iets anders afspreken. Je ontvangt een e-mail zodra de terugbetaling
        is verwerkt.
      </p>

      <h2>Uitzonderingen</h2>
      <ul>
        <li>
          <strong>Maatwerk:</strong> producten die volgens jouw specificaties zijn gemaakt of gepersonaliseerd (zoals teamkleding
          op maat, bedrukte of geborduurde artikelen) zijn uitgesloten van het herroepingsrecht, tenzij er sprake is van een
          productiefout. Controleer je maatwerkgegevens dus goed voordat je de bestelling bevestigt.
        </li>
        <li><strong>Cadeaubonnen</strong> kunnen niet worden ingewisseld voor contant geld.</li>
      </ul>

      <h2>Ruilen</h2>
      <ul>
        <li>Ruilen kan binnen 30 dagen na ontvangst, zolang het product in verkoopbare staat en in de originele verpakking is.</li>
        <li>Een ruilverzoek stuur je naar <a href={`mailto:${email}`}>{email}</a>, samen met je aankoopbewijs.</li>
        <li>Ruilen is mogelijk voor de oorspronkelijke koper.</li>
        <li>Het vervangende artikel spreken we samen met je af.</li>
        <li>
          Is het nieuwe artikel duurder, dan betaal je het verschil bij. Is het goedkoper, dan ontvang je het verschil als
          tegoed of, als je dat liever hebt, als terugbetaling.
        </li>
      </ul>

      <h2>Garantie</h2>
      <p>
        Naast de wettelijke garantie geeft {company.legalName} de volgende garantie per productcategorie. Deze garantie geldt
        voor fabrieks- en materiaalfouten en vervangt je wettelijke rechten niet.
      </p>

      <h3>Cricketbats — 12 maanden garantie</h3>
      <ul>
        <li>
          Bats met een fabrieksfout die niet door de gebruiker is veroorzaakt en die niet te repareren is, worden naar jouw keuze
          vervangen, terugbetaald of omgezet in tegoed.
        </li>
        <li>
          Een gebroken handvat of scheurtjes in de rand, de teen of het oppervlak horen bij de aard van een wilgenhouten bat en
          hebben geen invloed op de prestaties. In die gevallen repareren we de bat kosteloos onder garantie.
        </li>
        <li>
          De prijs van een bat zegt niets over de levensduur. De duurste bats van Grade 1-wilgenhout zijn van nature zachter
          (dat maakt ze juist beter) en kunnen daardoor eerder scheurtjes vertonen dan bats van een lagere, compactere houtsoort.
        </li>
        <li>
          Geen garantie op schade door het gebruik van ballen uit een werpmachine (bowling machine). We raden af om met je bat
          tegen zulke ballen te spelen.
        </li>
        <li>
          Geen garantie op schade door vocht en zwelling van de teen. Water en wilgenhout gaan niet samen; een toe guard of
          &lsquo;shoe goo&rsquo; helpt dit te voorkomen.
        </li>
        <li>
          We raden extra bescherming aan, zoals een anti-scuff sheet of fiberglass sleeve en een toe guard, en adviseren om elke
          nieuwe bat goed in te kloppen. Een bat die niet is ingeklopt, kan eerder scheuren.
        </li>
      </ul>

      <h3>Beschermende uitrusting — 6 maanden garantie</h3>
      <p>Handschoenen, beenbeschermers, dijbeschermers, armbeschermers en borstbeschermers.</p>
      <ul>
        <li>De garantie dekt loslatende naden en stiksels.</li>
        <li>Normale slijtage en intensief gebruik vallen niet onder de garantie.</li>
        <li>Kan het product worden gerepareerd zonder dat de werking of vorm verandert, dan doen we dat kosteloos.</li>
        <li>
          Is de schade aan naad of stiksel zo groot dat herstel niet goed mogelijk is, dan bieden we vervanging, terugbetaling of
          tegoed aan.
        </li>
      </ul>

      <h3>Helmen — 6 maanden garantie</h3>
      <ul>
        <li>De garantie dekt een defecte maatverstelling (draaiknop).</li>
        <li>Schade door de impact van een bal valt niet onder deze garantie. Vervang een helm altijd na een zware treffer.</li>
        <li>Bij twijfelgevallen kan het product voor beoordeling naar de fabrikant worden gestuurd.</li>
      </ul>

      <h3>Kitbags — 12 maanden garantie</h3>
      <ul>
        <li>De garantie dekt loslatende naden en stiksels, defecte ritsen en defecte wieltjes.</li>
        <li>Schade door overmatige slijtage valt niet onder de garantie, tenzij er sprake is van een fabrieksfout.</li>
      </ul>

      <h3>Cricketballen</h3>
      <p>
        Op cricketballen geeft de fabrikant geen aanvullende garantie. Je wettelijke rechten bij een defect blijven uiteraard
        gelden.
      </p>

      <h2>Een garantieclaim indienen</h2>
      <ul>
        <li>
          Mail je claim naar <a href={`mailto:${email}`}>{email}</a> met je aankoopbewijs, een omschrijving van het probleem en
          duidelijke foto&apos;s van het defect.
        </li>
        <li>We bevestigen de ontvangst van je claim per e-mail en handelen deze zo snel mogelijk af.</li>
        <li>Elke claim wordt individueel beoordeeld; soms vragen we je het product op te sturen voor inspectie.</li>
        <li>
          Wordt je claim goedgekeurd, dan herstellen of vervangen we het product, of ontvang je een terugbetaling of tegoed. Een
          terugbetaling gebeurt via je oorspronkelijke betaalmethode.
        </li>
      </ul>

      <h2 id="modelformulier">Modelformulier voor herroeping</h2>
      <p>Vul dit formulier alleen in als je de overeenkomst wilt herroepen, en stuur het naar <a href={`mailto:${email}`}>{email}</a>.</p>
      <blockquote>
        Aan: {company.legalName}, {company.street}, {company.city} {company.postalCode}, {company.region}, {company.country} —
        {' '}{email}
        <br /><br />
        Ik/Wij* deel/delen* u hierbij mede dat ik/wij* onze overeenkomst betreffende de verkoop van de volgende producten
        herroep/herroepen*:
        <br />
        Besteld op* / ontvangen op*:
        <br />
        Naam/namen consument(en):
        <br />
        Adres consument(en):
        <br />
        Handtekening van consument(en) (alleen wanneer dit formulier op papier wordt ingediend):
        <br />
        Datum:
        <br /><br />
        * Doorhalen wat niet van toepassing is.
      </blockquote>

      <h2>Vragen?</h2>
      <p>
        Neem contact op via <a href={`mailto:${email}`}>{email}</a> of het <Link href="/contact">contactformulier</Link>. Zie ook
        ons <Link href="/shipping-policy">verzendbeleid</Link> en de <Link href="/terms-and-conditions">algemene voorwaarden</Link>.
      </p>
    </ContentPage>
  )
}
