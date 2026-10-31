import type { Metadata } from 'next'
import Link from 'next/link'
import { ContentPage } from '@/components/layout/ContentPage'
import { FAQSchema } from '@/components/seo/JsonLd'
import { getSiteSettings } from '@/lib/utils/settings'

export const metadata: Metadata = {
  title: 'Frequently Asked Questions (FAQ)',
  description:
    'Answers to common questions about ordering, delivery, returns, payment, warranty and wholesale at Mantra Sports India.',
}

type FaqItem = { question: string; answer: string; link?: { href: string; label: string } }

export default async function FaqPage() {
  const { shipping_processing_time, shipping_delivery_time, return_window_days, response_time_hours } = await getSiteSettings([
    'shipping_processing_time',
    'shipping_delivery_time',
    'return_window_days',
    'response_time_hours',
  ])

  const FAQ_GROUPS: { title: string; items: FaqItem[] }[] = [
    {
      title: 'Ordering',
      items: [
        {
          question: 'How do I order from Mantra Sports India?',
          answer:
            'Add products to your cart, go to checkout, enter your delivery address and pay securely online with UPI, card, netbanking or a wallet. You receive an order confirmation by email straight away.',
          link: { href: '/shop', label: 'Start shopping' },
        },
        {
          question: 'What size cricket bat do I need?',
          answer:
            'The right bat size depends mainly on your height. Our size guide has a chart from junior sizes up to Short Handle and Long Handle for adults. Not sure? Message us and we will help.',
          link: { href: '/blog/cricket-bat-size-guide', label: 'See the cricket bat size guide' },
        },
        {
          question: 'Do you supply clubs, schools and academies?',
          answer:
            'Yes. For clubs, schools, academies and dealers we offer volume pricing and custom kit such as teamwear and kit bags in club colours. Request a no-obligation B2B quote.',
          link: { href: '/b2b', label: 'Request a B2B quote' },
        },
        {
          question: 'Can I get a GST invoice?',
          answer:
            'Yes. Every order comes with a GST invoice that you can view and print from your order page. If you are buying for a business, tick the GST option at checkout and enter your GSTIN and business name.',
        },
      ],
    },
    {
      title: 'Delivery',
      items: [
        {
          question: 'How much does delivery cost?',
          answer: 'Nothing — delivery is free on every order to an address in India. The price at checkout is the total you pay.',
        },
        {
          question: 'How long will my order take?',
          answer: `We usually dispatch within ${shipping_processing_time} of payment. Estimated delivery after dispatch: ${shipping_delivery_time}.`,
          link: { href: '/shipping-policy', label: 'Read our shipping policy' },
        },
        {
          question: 'Will I have to pay customs duty?',
          answer:
            'No. Some products ship from our Australian warehouse; any import duty and IGST on those are paid by us. The courier may ask for KYC details (such as PAN or Aadhaar) to clear the parcel through customs.',
        },
        {
          question: 'Can I track my order?',
          answer:
            'Yes. When your order ships, we email you the courier name and tracking number. You can also check your order status online with your order number and email address.',
          link: { href: '/order-status', label: 'Track your order' },
        },
      ],
    },
    {
      title: 'Returns & Refunds',
      items: [
        {
          question: 'What is your returns policy?',
          answer: `Unused items in their original packaging can be returned within ${return_window_days} days of delivery. Damaged, defective or wrong items are always replaced or refunded — just contact us within 48 hours of delivery with photos.`,
          link: { href: '/returns-policy', label: 'Read our returns & warranty policy' },
        },
        {
          question: 'How quickly will I get my refund?',
          answer:
            'Approved refunds are issued to your original payment method within 7 working days of approval. Your bank may take a further 5–7 working days to show the amount.',
        },
        {
          question: 'Can I return a custom-made product?',
          answer:
            'Custom or personalised products, such as custom teamwear, cannot be returned for change of mind unless they are defective or not made to the agreed specification. Please check your custom order details carefully.',
        },
        {
          question: 'What warranty do I get on my bat?',
          answer:
            'Cricket bats have a 12-month warranty, protective gear and helmets 6 months, and kit bags 12 months, in addition to your statutory rights. Our returns & warranty policy explains exactly what is covered.',
        },
      ],
    },
    {
      title: 'Payment',
      items: [
        {
          question: 'Which payment methods do you accept?',
          answer:
            'Payments are processed by Razorpay. You can pay with UPI (Google Pay, PhonePe, Paytm and others), debit and credit cards including RuPay, netbanking and popular wallets.',
        },
        {
          question: 'Is my payment secure?',
          answer:
            'Yes. Payments are handled by Razorpay over an encrypted connection. We never see or store your card details, UPI PIN or banking password.',
        },
        {
          question: 'Do you offer cash on delivery?',
          answer: 'At the moment all online orders are prepaid. If you need another option, message us on WhatsApp.',
        },
      ],
    },
  ]

  const allItems = FAQ_GROUPS.flatMap((g) => g.items)

  return (
    <ContentPage
      eyebrow="Help & Support"
      title="Frequently Asked Questions"
      intro="Answers to the most common questions about ordering, delivery, returns and payment. Can't find your question? Get in touch."
      breadcrumb={[{ label: 'FAQ' }]}
    >
      <FAQSchema items={allItems.map(({ question, answer }) => ({ question, answer }))} />

      {FAQ_GROUPS.map((group) => (
        <section key={group.title}>
          <h2>{group.title}</h2>
          {group.items.map((item) => (
            <div key={item.question}>
              <h3>{item.question}</h3>
              <p>
                {item.answer}
                {item.link && (
                  <>
                    {' '}
                    <Link href={item.link.href}>{item.link.label}</Link>.
                  </>
                )}
              </p>
            </div>
          ))}
        </section>
      ))}

      <h2>Still Have a Question?</h2>
      <p>
        Our team is happy to help. Use the <Link href="/contact">contact form</Link> or WhatsApp us — we usually reply within{' '}
        {response_time_hours} hours on working days.
      </p>
    </ContentPage>
  )
}
