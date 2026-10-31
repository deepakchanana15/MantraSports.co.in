import type { Metadata } from 'next'
import Link from 'next/link'
import { ContentPage } from '@/components/layout/ContentPage'
import { SITE_CONFIG } from '@/lib/config/site'
import { getSiteSettings } from '@/lib/utils/settings'

export const metadata: Metadata = {
  title: 'Company Information & Grievance Officer',
  description:
    'Seller details for Mantra Sports India: Mantra Sports International, Ghaziabad, Uttar Pradesh. GSTIN 09IVBPS2213F1ZM. Customer care and Grievance Officer contact details.',
}

export default async function CompanyInformationPage() {
  const { company, grievanceOfficer } = SITE_CONFIG
  const { contact_email, contact_phone, response_time_hours } = await getSiteSettings([
    'contact_email',
    'contact_phone',
    'response_time_hours',
  ])

  return (
    <ContentPage
      eyebrow="Who We Are"
      title="Company Information"
      intro="Mantra Sports India (mantrasports.co.in) is operated by Mantra Sports International, the seller of all products on this website."
      breadcrumb={[{ label: 'Company Information' }]}
    >
      <h2>Seller &amp; Operator of This Website</h2>
      <div className="table-wrap">
        <table>
          <tbody>
            <tr><th scope="row">Legal name</th><td>{company.legalName}</td></tr>
            <tr><th scope="row">Type of business</th><td>{company.entityType}</td></tr>
            <tr><th scope="row">GSTIN</th><td>{company.gstin}</td></tr>
            <tr>
              <th scope="row">Registered address</th>
              <td>
                {company.street}<br />
                {company.city}, {company.region} {company.postalCode}<br />
                {company.country}
              </td>
            </tr>
            <tr><th scope="row">Customer care phone</th><td><a href={`tel:${contact_phone.replace(/\s/g, '')}`}>{contact_phone}</a></td></tr>
            <tr><th scope="row">Customer care email</th><td><a href={`mailto:${contact_email}`}>{contact_email}</a></td></tr>
            <tr><th scope="row">Website</th><td><a href={SITE_CONFIG.url}>{SITE_CONFIG.url.replace('https://', '')}</a></td></tr>
          </tbody>
        </table>
      </div>
      <p>
        Mantra Sports International is part of the international Mantra Sports group, whose brand also operates in Australia,
        the United States, Germany, the Netherlands and Canada.
      </p>

      <h2 id="grievance-officer">Grievance Officer</h2>
      <p>
        In accordance with the Consumer Protection (E-Commerce) Rules, 2020 and the Information Technology Act, 2000 and rules
        made under it, the details of our Grievance Officer are:
      </p>
      <div className="table-wrap">
        <table>
          <tbody>
            <tr><th scope="row">Name</th><td>{grievanceOfficer.name}</td></tr>
            <tr><th scope="row">Designation</th><td>{grievanceOfficer.designation}</td></tr>
            <tr><th scope="row">Phone</th><td><a href={`tel:${grievanceOfficer.phone.replace(/\s/g, '')}`}>{grievanceOfficer.phone}</a></td></tr>
            <tr><th scope="row">Email</th><td><a href={`mailto:${grievanceOfficer.email}`}>{grievanceOfficer.email}</a></td></tr>
            <tr><th scope="row">Address</th><td>{SITE_CONFIG.contact.address}</td></tr>
          </tbody>
        </table>
      </div>
      <p>
        Please include your order number (if any), a description of the issue and any supporting photos. The Grievance Officer
        will <strong>acknowledge your complaint within 48 hours</strong> and aim to <strong>resolve it within one month</strong> of
        receipt. You can also raise a complaint about personal data with the Grievance Officer — see our{' '}
        <Link href="/privacy-policy">Privacy Policy</Link>.
      </p>
      <p>
        If you are not satisfied with the resolution, you may approach the National Consumer Helpline (dial 1915 or visit{' '}
        <a href="https://consumerhelpline.gov.in" target="_blank" rel="noopener noreferrer">consumerhelpline.gov.in</a>) or the
        appropriate Consumer Disputes Redressal Commission.
      </p>

      <h2>Customer Support</h2>
      <p>
        For questions about products, orders, deliveries or wholesale, email{' '}
        <a href={`mailto:${contact_email}`}>{contact_email}</a>, call or WhatsApp {contact_phone}, or use our{' '}
        <Link href="/contact">contact form</Link>. We usually reply within {response_time_hours} hours on working days.
      </p>

      <h2>Product Information</h2>
      <p>
        The country of origin is shown on each product page where applicable. All prices on this website are in Indian Rupees
        (₹) and include GST. Delivery within India is free; there are no additional charges at checkout.
      </p>

      <h2>Legal</h2>
      <ul>
        <li><Link href="/terms-and-conditions">Terms &amp; Conditions</Link></li>
        <li><Link href="/privacy-policy">Privacy Policy</Link></li>
        <li><Link href="/returns-policy">Returns, Refunds &amp; Warranty</Link></li>
        <li><Link href="/shipping-policy">Shipping Policy</Link></li>
      </ul>
    </ContentPage>
  )
}
