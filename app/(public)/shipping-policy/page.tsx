import type { Metadata } from 'next'
import Link from 'next/link'
import { ContentPage } from '@/components/layout/ContentPage'
import { SITE_CONFIG } from '@/lib/config/site'
import { getSiteSettings } from '@/lib/utils/settings'

export const metadata: Metadata = {
  title: 'Shipping Policy',
  description:
    'Free delivery across India on all Mantra Sports orders. Processing times, delivery times, tracking and import duty for items shipped from Australia.',
}

export default async function ShippingPolicyPage() {
  const { contact_email, shipping_processing_time, shipping_delivery_time } = await getSiteSettings([
    'contact_email',
    'shipping_processing_time',
    'shipping_delivery_time',
  ])

  return (
    <ContentPage
      eyebrow="Customer Service"
      title="Shipping Policy"
      intro="Everything about how we process, ship and deliver your Mantra Sports India order."
      breadcrumb={[{ label: 'Shipping Policy' }]}
      meta="Last updated: 31 October 2026"
    >
      <h2>Free Delivery Across India</h2>
      <p>
        Delivery is <strong>free on every online order</strong> shipped to an address in India. The price you see at checkout
        is the total you pay — there are no extra shipping charges, cash-handling fees or hidden costs. We currently deliver
        within India only.
      </p>

      <h2>Where Orders Ship From</h2>
      <p>
        Orders are sold and fulfilled by {SITE_CONFIG.company.legalName}, Ghaziabad, Uttar Pradesh. Most products are dispatched
        from our stock in India. Some products are shipped to you from the Mantra Sports warehouse in Australia; these may take
        longer to arrive (see delivery times below).
      </p>

      <h2>Order Confirmation</h2>
      <p>
        After you pay online, you receive an order confirmation by email with your order number and a link to your tax invoice.
        You can check the status of your order at any time on our <Link href="/order-status">order tracking page</Link>.
      </p>

      <h2>Processing Time</h2>
      <p>
        We usually dispatch orders within <strong>{shipping_processing_time}</strong> of payment. Orders are processed on working
        days (Monday to Saturday, excluding public holidays).
      </p>

      <h2>Delivery Time</h2>
      <p>
        Estimated delivery after dispatch: <strong>{shipping_delivery_time}</strong>. Delivery to remote areas, the North-East
        and island territories can take a few days longer. Delivery times are estimates — if your order is significantly delayed
        we will contact you.
      </p>

      <h2>Tracking</h2>
      <p>
        When your order ships, we email you the courier name and tracking number so you can follow your parcel online. The same
        details appear on your order page.
      </p>

      <h2 id="import-duty">Import Duty &amp; Customs</h2>
      <p>
        For products shipped from Australia, <strong>any customs duty and IGST on import are paid by us</strong> — you do not pay
        anything extra on delivery. The courier or customs authority may ask the recipient for KYC details (such as PAN or
        Aadhaar) to clear the parcel, as required under Indian customs rules. Please respond promptly if contacted, so your
        delivery is not delayed.
      </p>

      <h2>Delivery Address</h2>
      <p>
        Please provide a complete address with PIN code and a mobile number on which you are reachable during the day. We
        cannot change the delivery address once an order has shipped. If a delivery attempt fails, the courier will usually try
        again or contact you to arrange delivery.
      </p>
      <p>
        Please check your parcel when it arrives. If the package is visibly damaged or tampered with, note this with the courier
        and contact us within 48 hours with photos.
      </p>

      <h2>Out-of-Stock Items</h2>
      <p>
        Occasionally an item may sell out after you order. If that happens we will contact you straight away and offer an
        alternative or a full refund to your original payment method.
      </p>

      <h2>Bulk &amp; B2B Orders</h2>
      <p>
        Delivery terms for wholesale, club and dealer orders are agreed in your quote. <Link href="/b2b">Request a B2B quote</Link>.
      </p>

      <h2>Questions?</h2>
      <p>
        Email <a href={`mailto:${contact_email}`}>{contact_email}</a> or WhatsApp {SITE_CONFIG.contact.phone}. See also our{' '}
        <Link href="/returns-policy">returns policy</Link> and <Link href="/faq">FAQ</Link>.
      </p>
    </ContentPage>
  )
}
