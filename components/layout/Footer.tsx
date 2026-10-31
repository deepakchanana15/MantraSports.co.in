'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Instagram, Facebook, Youtube, Linkedin, Mail, Phone, ChevronRight } from 'lucide-react'
import { FOOTER_NAV, SITE_CONFIG } from '@/lib/config/site'

interface FooterProps {
  contactEmail?: string
  contactPhone?: string
  social?: { instagram?: string; facebook?: string; linkedin?: string; youtube?: string }
}

const isRealLink = (href?: string) => !!href && /^https?:\/\//.test(href)

export function Footer({ contactEmail, contactPhone, social = {} }: FooterProps) {
  const [logoError, setLogoError] = useState(false)
  const currentYear = new Date().getFullYear()
  const email = contactEmail || SITE_CONFIG.contact.email
  const phone = contactPhone || SITE_CONFIG.contact.phone
  const { company } = SITE_CONFIG

  // Only show social icons that have a real URL set in /admin/settings
  const socialLinks = [
    { icon: Instagram, href: social.instagram, label: 'Instagram' },
    { icon: Facebook,  href: social.facebook,  label: 'Facebook'  },
    { icon: Linkedin,  href: social.linkedin,  label: 'LinkedIn'  },
    { icon: Youtube,   href: social.youtube,   label: 'YouTube'   },
  ].filter((s) => isRealLink(s.href))

  return (
    <footer style={{ background: '#111111', color: '#E0DFDB' }} aria-label="Footer">
      {/* ── Main Footer Grid ─────────────────────────────────────── */}
      <div className="grid grid-cols-1 gap-10 px-5 py-14 sm:grid-cols-2 sm:px-8 lg:grid-cols-[2fr_1fr_1fr_1fr] lg:px-[60px] lg:py-16">
        {/* Brand Column */}
        <div>
          <Link href="/" className="mb-6 flex items-center gap-3.5 no-underline">
            {logoError ? (
              <span
                className="flex h-[44px] w-[44px] shrink-0 items-center justify-center rounded text-xl"
                style={{ background: '#e85d1a' }}
              >
                🏏
              </span>
            ) : (
              <img
                src="/images/brand/logo.png"
                alt="Mantra Sports"
                width={44}
                height={44}
                className="h-[44px] w-[44px] shrink-0 object-contain"
                onError={() => setLogoError(true)}
              />
            )}
            <div className="leading-none">
              <span
                className="block font-display text-[20px] font-semibold tracking-[0.04em]"
                style={{ color: '#ffffff' }}
              >
                MANTRA SPORTS
              </span>
              <span
                className="mt-[2px] block text-[10px] font-medium uppercase tracking-[0.2em]"
                style={{ color: '#e85d1a' }}
              >
                India
              </span>
            </div>
          </Link>

          <p
            className="mb-6 max-w-[300px] text-[14px] leading-relaxed"
            style={{ color: '#A0A0A0' }}
          >
            Premium cricket bats, protective gear, teamwear and accessories.
            Built for players at every level.
          </p>

          {socialLinks.length > 0 && (
            <div className="mb-6 flex flex-wrap gap-3" aria-label="Social media">
              {socialLinks.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-9 w-9 items-center justify-center rounded transition-colors"
                  style={{ background: '#1c1c1c', color: '#A0A0A0' }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = '#e85d1a'
                    e.currentTarget.style.color = '#ffffff'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = '#1c1c1c'
                    e.currentTarget.style.color = '#A0A0A0'
                  }}
                >
                  <Icon className="h-4 w-4" aria-hidden="true" />
                </a>
              ))}
            </div>
          )}

          <div className="space-y-2">
            <a
              href={`mailto:${email}`}
              className="flex items-center gap-2 text-[13px] transition-colors"
              style={{ color: '#A0A0A0' }}
              onMouseEnter={(e) => { e.currentTarget.style.color = '#e85d1a' }}
              onMouseLeave={(e) => { e.currentTarget.style.color = '#A0A0A0' }}
            >
              <Mail className="h-4 w-4" aria-hidden="true" />
              {email}
            </a>
            <a
              href={`tel:${phone.replace(/\s/g, '')}`}
              className="flex items-center gap-2 text-[13px] transition-colors"
              style={{ color: '#A0A0A0' }}
              onMouseEnter={(e) => { e.currentTarget.style.color = '#e85d1a' }}
              onMouseLeave={(e) => { e.currentTarget.style.color = '#A0A0A0' }}
            >
              <Phone className="h-4 w-4" aria-hidden="true" />
              {phone}
            </a>
          </div>
        </div>

        {/* Nav Columns */}
        {[FOOTER_NAV.products, FOOTER_NAV.company, FOOTER_NAV.support].map((col) => (
          <div key={col.title}>
            <h3
              className="mb-5 font-display text-[12px] font-semibold uppercase tracking-[0.18em]"
              style={{ color: '#ffffff' }}
            >
              {col.title}
            </h3>
            <ul className="space-y-3" role="list">
              {col.links.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="group flex items-center gap-1.5 text-[13px] transition-colors"
                    style={{ color: '#A0A0A0' }}
                    onMouseEnter={(e) => { e.currentTarget.style.color = '#e85d1a' }}
                    onMouseLeave={(e) => { e.currentTarget.style.color = '#A0A0A0' }}
                  >
                    <ChevronRight className="h-3 w-3 opacity-0 transition-opacity group-hover:opacity-100" aria-hidden="true" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* ── Seller details (Consumer Protection (E-Commerce) Rules, 2020) ── */}
      <div className="border-t" style={{ borderColor: '#1c1c1c' }}>
        <p className="px-5 py-4 text-[12px] leading-relaxed sm:px-8 lg:px-[60px]" style={{ color: '#6B6B6B' }}>
          Sold by <strong style={{ color: '#A0A0A0' }}>{company.legalName}</strong> ({company.entityType}),{' '}
          {SITE_CONFIG.contact.address} · GSTIN {company.gstin} ·{' '}
          <Link href="/company-information" className="underline hover:text-[#e85d1a]">Seller &amp; grievance officer details</Link>
        </p>
      </div>

      {/* ── Global Websites ───────────────────────────────────────── */}
      <div className="border-t" style={{ borderColor: '#1c1c1c' }}>
        <div className="flex flex-wrap items-center px-5 sm:px-8 lg:px-[60px]">
          <span
            className="mr-6 shrink-0 font-display text-[11px] font-semibold uppercase tracking-[0.18em]"
            style={{ color: '#6B6B6B', padding: '18px 0' }}
          >
            Mantra Sports Worldwide:
          </span>
          {[
            { label: 'Australia', flag: '🇦🇺', href: 'https://www.mantrasports.com.au' },
            { label: 'United States', flag: '🇺🇸', href: 'https://www.mantrasportsusa.com' },
            { label: 'Germany', flag: '🇩🇪', href: 'https://www.mantrasports.de' },
            { label: 'Netherlands', flag: '🇳🇱', href: 'https://www.mantrasports.nl' },
            { label: 'Canada', flag: '🇨🇦', href: 'https://www.mantrasports.ca' },
          ].map((site) => (
            <a
              key={site.label}
              href={site.href}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-[12px] transition-colors"
              style={{
                color: '#6B6B6B',
                padding: '14px 16px',
                borderLeft: '1px solid #1c1c1c',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.color = '#e85d1a' }}
              onMouseLeave={(e) => { e.currentTarget.style.color = '#6B6B6B' }}
            >
              <span aria-hidden="true">{site.flag}</span>
              {site.label}
            </a>
          ))}
        </div>
      </div>

      {/* ── Bottom Bar ────────────────────────────────────────────── */}
      <div className="border-t" style={{ borderColor: '#1c1c1c' }}>
        <div className="flex flex-col items-center justify-between gap-4 px-5 py-5 text-center sm:px-8 lg:flex-row lg:px-[60px] lg:text-left">
          <p className="text-[12px]" style={{ color: '#6B6B6B' }}>
            © {currentYear} {company.legalName}. All rights reserved.
          </p>

          {/* Payment methods (via Razorpay) */}
          <div className="flex flex-wrap items-center justify-center gap-2">
            {['UPI', 'RUPAY', 'VISA', 'MASTERCARD', 'NETBANKING'].map((method) => (
              <span
                key={method}
                className="rounded-[2px] px-2.5 py-1 text-[10px] font-bold"
                style={{
                  background: '#1c1c1c',
                  color: '#6B6B6B',
                  border: '1px solid #2a2a2a',
                  letterSpacing: '0.08em',
                }}
              >
                {method}
              </span>
            ))}
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4">
            {[
              { label: 'Privacy Policy', href: '/privacy-policy' },
              { label: 'Terms & Conditions', href: '/terms-and-conditions' },
              { label: 'Company Information', href: '/company-information' },
            ].map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="text-[12px] transition-colors"
                style={{ color: '#6B6B6B' }}
                onMouseEnter={(e) => { e.currentTarget.style.color = '#e85d1a' }}
                onMouseLeave={(e) => { e.currentTarget.style.color = '#6B6B6B' }}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
