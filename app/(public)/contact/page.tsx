import type { Metadata } from 'next'
import Link from 'next/link'
import { Mail, Phone, MapPin, Clock, ChevronRight, MessageCircle } from 'lucide-react'
import { ContactForm } from './ContactForm'
import { prisma } from '@/lib/db/prisma'
import { SITE_CONFIG } from '@/lib/config/site'
import { getSiteSettings } from '@/lib/utils/settings'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Contact',
  description:
    'Contact Mantra Sports India — product questions, orders, sizing advice, wholesale and B2B enquiries. Call, WhatsApp or email our team.',
}

export default async function ContactPage({ searchParams }: { searchParams: Promise<{ product?: string }> }) {
  const { product: productSlug } = await searchParams

  // Load live contact details from settings if set
  let email: string = SITE_CONFIG.contact.email
  let phone: string = SITE_CONFIG.contact.phone
  let address: string = SITE_CONFIG.contact.address
  let whatsapp: string = SITE_CONFIG.contact.whatsapp

  try {
    const settings = await prisma.siteSetting.findMany({
      where: { key: { in: ['contact_email', 'contact_phone', 'contact_address', 'whatsapp_number'] } },
    })
    const map = Object.fromEntries(settings.map((s) => [s.key, s.value ?? '']))
    if (map.contact_email) email = map.contact_email
    if (map.contact_phone) phone = map.contact_phone
    if (map.contact_address) address = map.contact_address
    if (map.whatsapp_number) whatsapp = map.whatsapp_number
  } catch {
    // fall through to defaults
  }

  // Quote request from a product page — prefill the message with the product name
  let defaultMessage: string | undefined
  if (productSlug) {
    try {
      const product = await prisma.product.findUnique({ where: { slug: productSlug, status: 'ACTIVE' }, select: { name: true } })
      if (product) defaultMessage = `I'd like more information about: ${product.name}`
    } catch {
      // ignore — form works without prefill
    }
  }

  const { response_time_hours } = await getSiteSettings(['response_time_hours'])

  const hasPhone = phone && phone !== 'TO_BE_PROVIDED'
  const hasAddress = address && address !== 'TO_BE_PROVIDED'
  const hasWhatsApp = whatsapp && whatsapp !== 'TO_BE_PROVIDED'

  return (
    <div className="bg-white">

      {/* Breadcrumb */}
      <div className="px-4 py-3 sm:px-8 lg:px-[60px]" style={{ borderBottom: '1px solid #E0DFDB', background: '#F8F7F4' }}>
        <nav className="flex items-center gap-2 text-[12px]" style={{ color: '#6B6B6B' }}>
          <Link href="/" className="transition-colors hover:text-[#e85d1a]">Home</Link>
          <ChevronRight className="h-3 w-3" />
          <span style={{ color: '#111111' }}>Contact</span>
        </nav>
      </div>

      {/* Hero */}
      <div style={{ background: '#111111', borderBottom: '1px solid #1c1c1c' }}>
        <div className="px-4 py-12 sm:px-8 lg:px-[60px] lg:py-16">
          <p
            className="mb-3 font-display text-[11px] font-semibold uppercase tracking-[0.22em]"
            style={{ color: '#e85d1a' }}
          >
            We&apos;re Here to Help
          </p>
          <h1
            className="mb-4 font-display font-bold uppercase leading-tight tracking-[0.01em]"
            style={{ fontSize: 'clamp(36px, 5vw, 60px)', color: '#ffffff' }}
          >
            Contact Us
          </h1>
          <p className="max-w-[500px] text-[16px] font-light leading-[1.8]" style={{ color: '#A0A0A0' }}>
            Questions about a product, your order, sizing or team pricing? Our team is happy to help.
          </p>
        </div>
      </div>

      {/* Main */}
      <div className="px-4 py-12 sm:px-8 lg:px-[60px] lg:py-16">
        <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-[1fr_1.3fr] lg:gap-16">

          {/* Left — contact info */}
          <div className="space-y-6">
            <div>
              <p
                className="mb-2 font-display text-[11px] font-semibold uppercase tracking-[0.22em]"
                style={{ color: '#e85d1a' }}
              >
                Contact Details
              </p>
              <h2
                className="mb-6 font-display text-[28px] font-bold uppercase leading-tight tracking-[0.02em]"
                style={{ color: '#111111' }}
              >
                How to Reach Us
              </h2>
            </div>

            <div style={{ border: '1px solid #E0DFDB' }}>
              {/* Email — always shown */}
              <div className="flex gap-4" style={{ padding: '24px', borderBottom: '1px solid #E0DFDB' }}>
                <div
                  className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-[2px]"
                  style={{ background: '#FFF5ED' }}
                >
                  <Mail className="h-4 w-4" style={{ color: '#e85d1a' }} />
                </div>
                <div>
                  <p
                    className="mb-1 font-display text-[11px] font-semibold uppercase tracking-[0.12em]"
                    style={{ color: '#6B6B6B' }}
                  >
                    Email
                  </p>
                  <a
                    href={`mailto:${email}`}
                    className="font-display text-[15px] font-semibold transition-colors hover:text-[#e85d1a]"
                    style={{ color: '#111111' }}
                  >
                    {email}
                  </a>
                </div>
              </div>

              {/* WhatsApp */}
              {hasWhatsApp && (
                <div className="flex gap-4" style={{ padding: '24px', borderBottom: '1px solid #E0DFDB' }}>
                  <div
                    className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-[2px]"
                    style={{ background: '#FFF5ED' }}
                  >
                    <MessageCircle className="h-4 w-4" style={{ color: '#e85d1a' }} />
                  </div>
                  <div>
                    <p
                      className="mb-1 font-display text-[11px] font-semibold uppercase tracking-[0.12em]"
                      style={{ color: '#6B6B6B' }}
                    >
                      WhatsApp
                    </p>
                    <a
                      href={`https://wa.me/${whatsapp.replace(/\D/g, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-display text-[15px] font-semibold transition-colors hover:text-[#e85d1a]"
                      style={{ color: '#111111' }}
                    >
                      {whatsapp}
                    </a>
                  </div>
                </div>
              )}

              {/* Phone */}
              {hasPhone && (
                <div className="flex gap-4" style={{ padding: '24px', borderBottom: hasAddress ? '1px solid #E0DFDB' : 'none' }}>
                  <div
                    className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-[2px]"
                    style={{ background: '#FFF5ED' }}
                  >
                    <Phone className="h-4 w-4" style={{ color: '#e85d1a' }} />
                  </div>
                  <div>
                    <p
                      className="mb-1 font-display text-[11px] font-semibold uppercase tracking-[0.12em]"
                      style={{ color: '#6B6B6B' }}
                    >
                      Phone
                    </p>
                    <a
                      href={`tel:${phone}`}
                      className="font-display text-[15px] font-semibold transition-colors hover:text-[#e85d1a]"
                      style={{ color: '#111111' }}
                    >
                      {phone}
                    </a>
                  </div>
                </div>
              )}

              {/* Address */}
              {hasAddress && (
                <div className="flex gap-4" style={{ padding: '24px' }}>
                  <div
                    className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-[2px]"
                    style={{ background: '#FFF5ED' }}
                  >
                    <MapPin className="h-4 w-4" style={{ color: '#e85d1a' }} />
                  </div>
                  <div>
                    <p
                      className="mb-1 font-display text-[11px] font-semibold uppercase tracking-[0.12em]"
                      style={{ color: '#6B6B6B' }}
                    >
                      Address
                    </p>
                    <p className="text-[15px] leading-relaxed" style={{ color: '#111111' }}>{address}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Response time */}
            <div
              className="flex gap-4"
              style={{ border: '1px solid #E0DFDB', padding: '20px 24px', background: '#F8F7F4' }}
            >
              <Clock className="mt-0.5 h-5 w-5 shrink-0" style={{ color: '#e85d1a' }} />
              <div>
                <p
                  className="mb-0.5 font-display text-[12px] font-semibold uppercase tracking-[0.1em]"
                  style={{ color: '#111111' }}
                >
                  Response Time
                </p>
                <p className="text-[13px]" style={{ color: '#6B6B6B' }}>
                  We usually reply within <strong>{response_time_hours} hours</strong> on working days.
                </p>
              </div>
            </div>

            {/* Wholesale CTA */}
            <div style={{ border: '1px solid #e85d1a', padding: '20px 24px', background: '#FFF5ED' }}>
              <p
                className="mb-1 font-display text-[12px] font-semibold uppercase tracking-[0.1em]"
                style={{ color: '#e85d1a' }}
              >
                Wholesale &amp; B2B
              </p>
              <p className="mb-3 text-[13px]" style={{ color: '#333333' }}>
                Buying for a club, school, academy or shop? Use our B2B quote form for volume pricing.
              </p>
              <Link
                href="/b2b"
                className="inline-flex items-center gap-1.5 font-display text-[12px] font-bold uppercase tracking-wider"
                style={{ color: '#e85d1a' }}
              >
                Request a B2B quote <ChevronRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>

          {/* Right — form */}
          <div>
            <ContactForm defaultMessage={defaultMessage} />
          </div>
        </div>
      </div>

    </div>
  )
}
