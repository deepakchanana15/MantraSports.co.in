import type { Metadata } from 'next'
import Link from 'next/link'
import { ContentPage } from '@/components/layout/ContentPage'
import { SITE_CONFIG } from '@/lib/config/site'
import { getSiteSettings } from '@/lib/utils/settings'

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description:
    'How Mantra Sports International (Mantra Sports India) collects, uses and protects your personal data, in line with the Digital Personal Data Protection Act, 2023.',
}

export default async function PrivacyPolicyPage() {
  const { company, grievanceOfficer } = SITE_CONFIG
  const { contact_email, contact_phone } = await getSiteSettings(['contact_email', 'contact_phone'])
  const email = contact_email

  return (
    <ContentPage
      eyebrow="Legal"
      title="Privacy Policy"
      intro="This policy explains what personal data we collect when you visit mantrasports.co.in, buy from us or contact us, why we collect it, and the rights you have."
      breadcrumb={[{ label: 'Privacy Policy' }]}
      meta="Last updated: 31 October 2026"
    >
      <h2>Who We Are</h2>
      <p>
        The Data Fiduciary responsible for personal data collected through mantrasports.co.in (&lsquo;the website&rsquo;) is:
      </p>
      <p>
        <strong>{company.legalName}</strong> ({company.entityType}), trading as Mantra Sports India<br />
        {SITE_CONFIG.contact.address}<br />
        GSTIN {company.gstin}<br />
        Email: <a href={`mailto:${email}`}>{email}</a> · Phone: {contact_phone}
      </p>
      <p>
        We process personal data in accordance with the Digital Personal Data Protection Act, 2023 (&lsquo;DPDP Act&rsquo;), the
        Information Technology Act, 2000 and the rules made under them.
      </p>

      <h2>What Data We Collect</h2>
      <h3>Data you give us</h3>
      <ul>
        <li>
          <strong>Orders:</strong> name, email address, mobile number, delivery address, and — if you choose — business name and
          GSTIN. Order contents and order history.
        </li>
        <li>
          <strong>Payments:</strong> payments are processed by Razorpay. We do not see or store your full card number, UPI PIN or
          netbanking password. We receive a payment reference and payment status from Razorpay.
        </li>
        <li>
          <strong>Enquiries</strong> (contact, B2B, wholesale and dealer forms): name, email, phone, organisation, city/state,
          quantities, products of interest and your message.
        </li>
        <li><strong>Newsletter:</strong> your email address, if you subscribe.</li>
        <li><strong>WhatsApp and email:</strong> the messages and contact details you send us.</li>
      </ul>
      <h3>Data collected automatically</h3>
      <ul>
        <li>
          <strong>IP address:</strong> stored with enquiries and orders to prevent spam, abuse and payment fraud.
        </li>
        <li>
          <strong>Server logs:</strong> our hosting provider records technical data such as IP address, browser type, pages
          visited and date/time to keep the website secure and working.
        </li>
        <li>
          <strong>Browser storage:</strong> your cart, your cookie choice and display preference are saved in your own browser
          (local storage). See <a href="#cookies">Cookies</a> below.
        </li>
      </ul>

      <h2>Why We Use Your Data</h2>
      <ul>
        <li>To process, deliver and support your order, issue GST invoices and handle returns, refunds and warranty claims.</li>
        <li>To respond to your enquiries and prepare quotes.</li>
        <li>To send order updates (confirmation, dispatch, tracking) by email, SMS or WhatsApp.</li>
        <li>To send our newsletter and offers — only if you have subscribed. You can unsubscribe at any time.</li>
        <li>To prevent fraud, spam and misuse, and keep the website secure.</li>
        <li>To comply with legal obligations, including tax (GST) and accounting record-keeping.</li>
      </ul>
      <p>
        We process your data on the basis of your consent (for example, when you submit a form, place an order or subscribe),
        or for legitimate uses permitted under the DPDP Act, such as fulfilling a purchase you have requested or complying with
        the law.
      </p>

      <h2>Who We Share Data With</h2>
      <p>We never sell your personal data. We share it only with service providers who help us run the business:</p>
      <ul>
        <li><strong>Razorpay</strong> (India) — payment processing.</li>
        <li><strong>Courier and logistics partners</strong> — to deliver your order (name, address, phone).</li>
        <li>
          <strong>Mantra Corporation Pty Ltd</strong> (Australia), the Mantra Sports head office — enquiries are recorded in the
          group&apos;s customer management system (MantraOS) so our team can follow up.
        </li>
        <li><strong>Vercel</strong> (website hosting) and <strong>Neon</strong> (database hosting).</li>
        <li><strong>Cloudinary</strong> — product image hosting.</li>
        <li><strong>Our email provider</strong> — to send order and enquiry emails.</li>
        <li>
          <strong>Google</strong> — if Google reviews are shown on our homepage, reviewer profile photos load from Google&apos;s
          servers, which receive your IP address.
        </li>
        <li>Government authorities, where required by law (for example tax or customs authorities).</li>
      </ul>

      <h2>Transfers Outside India</h2>
      <p>
        Some of our service providers store or process data outside India — including in Australia (Mantra Sports head office)
        and the United States (hosting and image services). We transfer data only as permitted under the DPDP Act and take
        reasonable steps to ensure it is protected.
      </p>

      <h2>How Long We Keep Data</h2>
      <ul>
        <li>Order and invoice records: as long as required by GST and tax law (generally at least 8 years).</li>
        <li>Enquiries: up to 3 years after our last contact, unless you become a customer.</li>
        <li>Newsletter: until you unsubscribe.</li>
        <li>Server logs: for a limited period for security purposes.</li>
      </ul>

      <h2>Your Rights</h2>
      <p>Under the DPDP Act, you have the right to:</p>
      <ul>
        <li><strong>Access</strong> a summary of the personal data we hold about you and how we process it;</li>
        <li><strong>Correct</strong> inaccurate or incomplete data, and <strong>update</strong> it;</li>
        <li><strong>Erase</strong> your data where it is no longer needed (subject to legal retention requirements);</li>
        <li><strong>Withdraw consent</strong> at any time — this does not affect processing done before withdrawal;</li>
        <li><strong>Nominate</strong> another person to exercise your rights in the event of death or incapacity;</li>
        <li><strong>Grievance redressal</strong> — raise a complaint with us about how your data is handled.</li>
      </ul>
      <p>
        To exercise any of these rights, email <a href={`mailto:${email}`}>{email}</a> or contact our Grievance Officer below.
        We may need to verify your identity before acting on a request.
      </p>

      <h2>Grievance Officer</h2>
      <p>
        {grievanceOfficer.name}, {grievanceOfficer.designation}<br />
        {company.legalName}, {SITE_CONFIG.contact.address}<br />
        Email: <a href={`mailto:${grievanceOfficer.email}`}>{grievanceOfficer.email}</a> · Phone: {grievanceOfficer.phone}
      </p>
      <p>
        We acknowledge complaints within 48 hours and aim to resolve them within one month. If you are not satisfied with our
        response, you may complain to the <strong>Data Protection Board of India</strong>.
      </p>

      <h2 id="cookies">Cookies &amp; Browser Storage</h2>
      <p>
        We do not use advertising or analytics cookies. We use only what the website needs to work: your shopping cart, your
        cookie-banner choice and your display preference are stored in your browser&apos;s local storage, and a secure session
        cookie is used for staff logging in to the admin area. If we add analytics in future, we will ask for your consent first
        and update this policy.
      </p>
      <p>
        When you pay, Razorpay&apos;s checkout window may set its own cookies needed for payment security; see Razorpay&apos;s
        privacy policy.
      </p>

      <h2>Security</h2>
      <p>
        The website uses HTTPS encryption. Access to customer data is limited to staff who need it, and admin accounts are
        password-protected. No method of transmission or storage is completely secure, but we take reasonable measures to
        protect your data.
      </p>

      <h2>Children</h2>
      <p>
        Our products are often bought for junior cricketers, but purchases must be made by an adult. We do not knowingly collect
        personal data from children under 18 without verifiable consent from a parent or guardian.
      </p>

      <h2>Changes to This Policy</h2>
      <p>
        We may update this policy from time to time. The latest version is always on this page, with the date it was last
        updated.
      </p>

      <h2>Questions?</h2>
      <p>
        Email <a href={`mailto:${email}`}>{email}</a> or use our <Link href="/contact">contact form</Link>. See also our{' '}
        <Link href="/terms-and-conditions">terms &amp; conditions</Link>.
      </p>
    </ContentPage>
  )
}
