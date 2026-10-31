import type { Metadata } from 'next'
import Link from 'next/link'
import { ContentPage } from '@/components/layout/ContentPage'
import { SITE_CONFIG } from '@/lib/config/site'
import { getSiteSettings } from '@/lib/utils/settings'

export const metadata: Metadata = {
  title: 'Returns, Refunds & Warranty',
  description:
    'Returns, refunds, exchanges and warranty at Mantra Sports India. Easy returns on unused items and warranty on cricket bats, protective gear, helmets and kit bags.',
}

export default async function ReturnsPolicyPage() {
  const { contact_email, contact_phone, return_window_days } = await getSiteSettings([
    'contact_email',
    'contact_phone',
    'return_window_days',
  ])
  const { company } = SITE_CONFIG
  const email = contact_email

  return (
    <ContentPage
      eyebrow="Customer Service"
      title="Returns, Refunds & Warranty"
      intro="Clear terms for returns, exchanges, refunds and warranty — so you can buy with confidence."
      breadcrumb={[{ label: 'Returns & Refunds' }]}
      meta="Last updated: 31 October 2026"
    >
      <h2>Our Promise</h2>
      <p>
        If you receive a product that is defective, damaged in transit, not as described, or not what you ordered, we will
        replace it or refund you in full — including any return shipping. This policy is in addition to your rights under the
        Consumer Protection Act, 2019 and does not limit them.
      </p>

      <h2>{return_window_days}-Day Returns on Unused Items</h2>
      <p>
        Changed your mind? You can return an item within <strong>{return_window_days} days of delivery</strong>, provided it is:
      </p>
      <ul>
        <li>unused, unwashed and in the same condition you received it (a bat must not have been knocked in, oiled or played with);</li>
        <li>in its original, undamaged packaging with all tags and protective covers;</li>
        <li>accompanied by your order number or invoice.</li>
      </ul>
      <p>
        For change-of-mind returns, return shipping is at your cost unless we agree otherwise. Please use a trackable courier
        service — we cannot accept responsibility for returns lost in transit.
      </p>

      <h2>Damaged, Defective or Wrong Items</h2>
      <p>
        Please check your parcel on delivery. If an item arrives damaged, defective or different from what you ordered, contact
        us within <strong>48 hours of delivery</strong> with your order number and photos of the item and packaging. We will
        arrange a replacement or refund, and cover the cost of returning the item.
      </p>

      <h2>How to Return an Item</h2>
      <ol>
        <li>
          Email <a href={`mailto:${email}`}>{email}</a> or WhatsApp {contact_phone} with your name, order number, the item you
          want to return and the reason.
        </li>
        <li>We confirm your return and send you the return address and instructions.</li>
        <li>Send the item back, securely packed, within 7 days of our confirmation.</li>
      </ol>

      <h2>Refunds</h2>
      <p>
        Once we receive and inspect your return, we email you to confirm. Approved refunds are issued to your
        <strong> original payment method</strong> (UPI, card, netbanking or wallet) within <strong>7 working days</strong> of
        approval. Depending on your bank, it can take a further 5–7 working days for the amount to appear in your account.
      </p>
      <p>
        If your order is cancelled before dispatch, or an item is out of stock after you order, we refund the full amount to your
        original payment method.
      </p>

      <h2>Cancellations</h2>
      <p>
        You can cancel an order free of charge before it has been dispatched — contact us as soon as possible. Once an order has
        shipped, please follow the returns process above.
      </p>

      <h2>Exceptions</h2>
      <ul>
        <li>
          <strong>Custom and personalised products</strong> (such as custom teamwear, printed or embroidered items) cannot be
          returned for change of mind, unless they are defective or not made to the agreed specification. Please check your
          custom order details carefully before confirming.
        </li>
        <li><strong>Cricket balls</strong> that have been used cannot be returned for change of mind.</li>
      </ul>

      <h2>Exchanges</h2>
      <ul>
        <li>Exchanges for a different size or model are possible within {return_window_days} days of delivery, if the item is unused and in its original packaging.</li>
        <li>Email your exchange request to <a href={`mailto:${email}`}>{email}</a> with your order number.</li>
        <li>
          If the new item costs more, you pay the difference; if it costs less, we refund the difference to your original
          payment method.
        </li>
      </ul>

      <h2>Warranty</h2>
      <p>
        In addition to your statutory rights, {company.legalName} offers the following warranty against manufacturing and
        material defects. Warranty starts from the date of delivery.
      </p>

      <h3>Cricket Bats — 12-Month Warranty</h3>
      <ul>
        <li>
          Bats with a manufacturing defect not caused by the user, which cannot be repaired, will be replaced, refunded or
          credited, at your choice.
        </li>
        <li>
          A broken handle or cracks on the edge, toe or face are part of the nature of a willow bat and do not affect
          performance. In these cases we repair the bat free of charge under warranty.
        </li>
        <li>
          Price does not indicate lifespan. Higher grades of English willow are naturally softer — which makes them play better
          — and can show surface cracks sooner than denser, lower-grade willow.
        </li>
        <li>No warranty for damage caused by bowling-machine balls. We recommend not using your bat against them.</li>
        <li>
          No warranty for moisture damage or toe swelling. Water and willow do not mix; a toe guard or toe protection helps
          prevent this.
        </li>
        <li>
          We recommend extra protection such as an anti-scuff sheet or fibreglass facing and a toe guard, and properly knocking
          in every new bat. A bat that has not been knocked in may crack sooner.
        </li>
      </ul>

      <h3>Protective Gear — 6-Month Warranty</h3>
      <p>Batting gloves, batting pads, thigh guards, arm guards and chest guards.</p>
      <ul>
        <li>Covers seams and stitching coming apart.</li>
        <li>Normal wear and tear and heavy use are not covered.</li>
        <li>If the product can be repaired without changing its function or shape, we repair it free of charge.</li>
        <li>If seam or stitching damage cannot be properly repaired, we offer a replacement, refund or credit.</li>
      </ul>

      <h3>Helmets — 6-Month Warranty</h3>
      <ul>
        <li>Covers a faulty size-adjustment dial.</li>
        <li>Damage from ball impact is not covered. Always replace a helmet after a heavy blow.</li>
        <li>In borderline cases the product may be sent to the manufacturer for assessment.</li>
      </ul>

      <h3>Kit Bags — 12-Month Warranty</h3>
      <ul>
        <li>Covers seams and stitching coming apart, faulty zips and faulty wheels.</li>
        <li>Damage from excessive wear is not covered unless caused by a manufacturing fault.</li>
      </ul>

      <h3>Cricket Balls</h3>
      <p>
        Cricket balls carry no additional manufacturer warranty. Your statutory rights for defective goods still apply.
      </p>

      <h2>Making a Warranty Claim</h2>
      <ul>
        <li>
          Email <a href={`mailto:${email}`}>{email}</a> with your order number, a description of the problem and clear photos of
          the defect.
        </li>
        <li>We acknowledge your claim by email and handle it as quickly as possible.</li>
        <li>Each claim is assessed individually; we may ask you to send the product for inspection.</li>
        <li>
          If your claim is approved, we repair or replace the product, or issue a refund or credit. Refunds go to your original
          payment method.
        </li>
      </ul>

      <h2>Not Happy With How We Handled Your Return?</h2>
      <p>
        Contact our <Link href="/company-information#grievance-officer">Grievance Officer</Link>, who will acknowledge your
        complaint within 48 hours and aim to resolve it within one month.
      </p>

      <h2>Questions?</h2>
      <p>
        Contact us at <a href={`mailto:${email}`}>{email}</a> or via the <Link href="/contact">contact form</Link>. See also our{' '}
        <Link href="/shipping-policy">shipping policy</Link> and <Link href="/terms-and-conditions">terms &amp; conditions</Link>.
      </p>
    </ContentPage>
  )
}
