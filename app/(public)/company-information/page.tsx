import type { Metadata } from 'next'
import Link from 'next/link'
import { ContentPage } from '@/components/layout/ContentPage'
import { SITE_CONFIG } from '@/lib/config/site'

export const metadata: Metadata = {
  title: 'Bedrijfsgegevens',
  description:
    'Bedrijfsgegevens van Mantra Sports Nederland: Mantra Corporation Pty Ltd, ABN 13 675 757 838, Newnham, Tasmanië, Australië.',
}

export default function CompanyInformationPage() {
  const { company, contact } = SITE_CONFIG

  return (
    <ContentPage
      eyebrow="Wie we zijn"
      title="Bedrijfsgegevens"
      intro="Mantra Sports Nederland (mantrasports.nl) is een handelsnaam van Mantra Corporation Pty Ltd, het Australische moederbedrijf van Mantra Sports."
      breadcrumb={[{ label: 'Bedrijfsgegevens' }]}
    >
      <h2>Exploitant van deze website</h2>
      <div className="table-wrap">
        <table>
          <tbody>
            <tr><th scope="row">Bedrijfsnaam</th><td>{company.legalName}</td></tr>
            <tr><th scope="row">Handelsnaam</th><td>Mantra Sports Nederland / Mantra Sports NL</td></tr>
            <tr><th scope="row">ABN (Australian Business Number)</th><td>{company.abn}</td></tr>
            <tr>
              <th scope="row">Adres</th>
              <td>
                {company.street}<br />
                {company.city} {company.postalCode}<br />
                {company.region}, {company.country}
              </td>
            </tr>
            <tr><th scope="row">Telefoon</th><td><a href={`tel:${contact.phone.replace(/\s/g, '')}`}>{contact.phone}</a></td></tr>
            <tr><th scope="row">E-mail</th><td><a href={`mailto:${contact.email}`}>{contact.email}</a></td></tr>
            <tr><th scope="row">Website</th><td><a href={SITE_CONFIG.url}>{SITE_CONFIG.url.replace('https://', '')}</a></td></tr>
          </tbody>
        </table>
      </div>

      <h2>Contact</h2>
      <p>
        Voor vragen over producten, offertes, bestellingen of groothandel kun je ons het beste mailen
        via <a href={`mailto:${contact.email}`}>{contact.email}</a> of het <Link href="/contact">contactformulier</Link> gebruiken.
        We reageren doorgaans binnen 24 uur op werkdagen. Houd er bij telefonisch contact rekening mee dat ons team in Australië
        werkt (tijdzone AEST/AEDT, 8 tot 10 uur later dan Nederland).
      </p>

      <h2>Juridische informatie</h2>
      <ul>
        <li><Link href="/terms-and-conditions">Algemene Voorwaarden</Link></li>
        <li><Link href="/privacy-policy">Privacybeleid</Link></li>
        <li><Link href="/returns-policy">Retour- en garantiebeleid</Link></li>
        <li><Link href="/shipping-policy">Verzendbeleid</Link></li>
      </ul>
    </ContentPage>
  )
}
