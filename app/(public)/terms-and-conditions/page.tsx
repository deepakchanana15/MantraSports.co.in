import type { Metadata } from 'next'
import Link from 'next/link'
import { ContentPage } from '@/components/layout/ContentPage'
import { SITE_CONFIG } from '@/lib/config/site'
import { getSiteSettings } from '@/lib/utils/settings'

export const metadata: Metadata = {
  title: 'Terms & Conditions',
  description:
    'Terms and conditions for using mantrasports.co.in and buying from Mantra Sports International (Mantra Sports India).',
}

export default async function TermsPage() {
  const { company } = SITE_CONFIG
  const { contact_email, contact_phone, return_window_days } = await getSiteSettings([
    'contact_email',
    'contact_phone',
    'return_window_days',
  ])
  const email = contact_email

  return (
    <ContentPage
      eyebrow="Legal"
      title="Terms & Conditions"
      intro="These terms apply to your use of mantrasports.co.in and to every purchase you make from us. Please read them before placing an order."
      breadcrumb={[{ label: 'Terms & Conditions' }]}
      meta="Last updated: 31 October 2026"
    >
      <h2>Overview</h2>
      <p>
        This website is operated by <strong>{company.legalName}</strong> ({company.entityType}), {SITE_CONFIG.contact.address},
        GSTIN {company.gstin} (&lsquo;Mantra Sports India&rsquo;, &lsquo;we&rsquo;, &lsquo;us&rsquo;). We are the seller of all
        products on this website. By using the website or placing an order, you agree to these terms, together with our{' '}
        <Link href="/privacy-policy">Privacy Policy</Link>, <Link href="/shipping-policy">Shipping Policy</Link> and{' '}
        <Link href="/returns-policy">Returns Policy</Link>.
      </p>
      <p>
        Nothing in these terms limits your rights as a consumer under the Consumer Protection Act, 2019 and the Consumer
        Protection (E-Commerce) Rules, 2020.
      </p>

      <h2>1. Using the Website</h2>
      <ul>
        <li>You must be at least 18 years old to place an order, or have the involvement of a parent or guardian.</li>
        <li>You agree to provide accurate, current and complete information when ordering or contacting us.</li>
        <li>
          You must not use the website for any unlawful purpose, attempt to interfere with its security or operation, or
          introduce malicious code.
        </li>
        <li>We may refuse service, cancel orders or restrict access where we reasonably suspect fraud or misuse.</li>
      </ul>

      <h2>2. Product Information</h2>
      <p>
        We take care to describe and photograph products accurately, including key specifications and country of origin where
        applicable. Natural materials such as English willow vary, so grain, colour and weight can differ slightly from the
        photos. Colours may also look different depending on your screen. If a product you receive is not as described, you can
        return it under our <Link href="/returns-policy">Returns Policy</Link>.
      </p>

      <h2>3. Prices</h2>
      <ul>
        <li>All prices are in Indian Rupees (₹) and <strong>include GST</strong>.</li>
        <li>Delivery within India is free. The total shown at checkout is the full amount you pay — there are no hidden charges.</li>
        <li>
          We may change prices at any time, but changes do not affect orders already confirmed. If a product is listed at an
          obviously incorrect price due to an error, we will contact you before dispatch and you may cancel for a full refund.
        </li>
      </ul>

      <h2>4. Placing an Order</h2>
      <p>
        When you place an order and complete payment, you make an offer to buy the products in your cart. We send an order
        confirmation by email once payment is received; a contract is formed when we dispatch the products. We may decline or
        cancel an order (for example if an item is out of stock, or we suspect fraud), in which case we refund you in full to
        your original payment method.
      </p>

      <h2>5. Payment</h2>
      <p>
        Payments are processed securely by Razorpay. We accept the methods shown at checkout, which may include UPI,
        debit and credit cards (including RuPay), netbanking and wallets. Orders are prepaid; cash on delivery is not offered
        unless stated at checkout. We do not store your card or banking credentials.
      </p>

      <h2>6. Delivery</h2>
      <p>
        We deliver within India only. Delivery times and terms are set out in our <Link href="/shipping-policy">Shipping
        Policy</Link>. Risk in the products passes to you on delivery. For items shipped from Australia, any import duty and IGST
        are paid by us.
      </p>

      <h2>7. Cancellations, Returns &amp; Exchanges</h2>
      <p>
        You may cancel before dispatch for a full refund. Unused items can be returned within {return_window_days} days of
        delivery, and damaged, defective or wrong items will always be replaced or refunded. Full details are in our{' '}
        <Link href="/returns-policy">Returns, Refunds &amp; Warranty Policy</Link>.
      </p>

      <h2>8. Warranty</h2>
      <p>
        Products carry the manufacturer&apos;s warranty described in our <Link href="/returns-policy#warranty">Returns, Refunds
        &amp; Warranty Policy</Link>, in addition to your statutory rights for defective goods.
      </p>

      <h2>9. Liability</h2>
      <p>
        To the extent permitted by law, our total liability for any claim relating to an order is limited to the amount you paid
        for that order. We are not liable for indirect or consequential losses. Nothing in these terms excludes liability that
        cannot be excluded by law, including for product defects, deficiency in service or negligence causing injury.
      </p>
      <p>
        Cricket is a contact sport. Protective equipment reduces but does not eliminate the risk of injury. Always choose the
        correct size, check equipment for damage before use, and replace a helmet after a heavy impact.
      </p>

      <h2>10. Intellectual Property</h2>
      <p>
        All content on this website — including the Mantra Sports name and logo, text, images and design — belongs to Mantra
        Sports or its licensors and may not be copied or used without written permission.
      </p>

      <h2>11. Reviews &amp; Submissions</h2>
      <p>
        Any reviews shown on this website come from genuine customers (for example, via our Google Business Profile). We do not
        publish fake reviews or edit reviews to change their meaning. If you send us feedback or ideas, you allow us to use them
        without obligation to you.
      </p>

      <h2>12. Third-Party Links</h2>
      <p>
        The website may link to third-party websites (such as Razorpay, courier tracking pages or social media). We are not
        responsible for their content or practices.
      </p>

      <h2>13. Personal Data</h2>
      <p>
        We handle your personal data as described in our <Link href="/privacy-policy">Privacy Policy</Link>.
      </p>

      <h2>14. Business &amp; Wholesale Customers</h2>
      <p>
        Wholesale, B2B, club and dealer orders placed through a quote are governed by the terms in that quote. Where a quote is
        silent, these terms apply. Business buyers who provide a GSTIN at checkout receive a GST invoice showing their GSTIN.
      </p>

      <h2>15. Complaints &amp; Grievances</h2>
      <p>
        If you have a complaint, please contact us first at <a href={`mailto:${email}`}>{email}</a> or {contact_phone}. You can
        also contact our <Link href="/company-information#grievance-officer">Grievance Officer</Link>, who acknowledges
        complaints within 48 hours and aims to resolve them within one month. You may also approach the National Consumer
        Helpline (1915) or the appropriate Consumer Disputes Redressal Commission.
      </p>

      <h2>16. Governing Law</h2>
      <p>
        These terms are governed by the laws of India. Subject to your rights as a consumer to file a complaint where you reside
        or work, the courts at Ghaziabad, Uttar Pradesh have jurisdiction over disputes.
      </p>

      <h2>17. General</h2>
      <ul>
        <li>If any part of these terms is found invalid, the rest remains in force.</li>
        <li>Our failure to enforce a term does not waive our right to enforce it later.</li>
        <li>
          We may update these terms from time to time. The version on this page at the time of your order applies to that
          order.
        </li>
      </ul>

      <h2>18. Contact</h2>
      <p>
        {company.legalName}<br />
        {SITE_CONFIG.contact.address}<br />
        Email: <a href={`mailto:${email}`}>{email}</a> · Phone / WhatsApp: {contact_phone}
      </p>
    </ContentPage>
  )
}
