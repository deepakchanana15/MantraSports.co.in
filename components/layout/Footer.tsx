'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Instagram, Facebook, Youtube, Linkedin, Mail, ChevronRight } from 'lucide-react'
import { FOOTER_NAV, SITE_CONFIG } from '@/lib/config/site'

function XIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.748l7.73-8.835L2.25 2.25h6.918l4.254 5.625L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z"/>
    </svg>
  )
}

function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.75a4.85 4.85 0 0 1-1.01-.06z"/>
    </svg>
  )
}

function PinterestIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 0C5.373 0 0 5.373 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 0 1 .083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.632-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0z"/>
    </svg>
  )
}

export function Footer({ contactEmail }: { contactEmail?: string }) {
  const [logoError, setLogoError] = useState(false)
  const currentYear = new Date().getFullYear()
  const email = contactEmail ?? SITE_CONFIG.contact.email

  return (
    <footer style={{ background: '#111111', color: '#E0DFDB' }} aria-label="Paginavoet">
      {/* ── Main Footer Grid ─────────────────────────────────────── */}
      <div
        className="grid gap-10"
        style={{
          padding: '64px 60px',
          gridTemplateColumns: '2fr 1fr 1fr 1fr',
          gap: '40px',
        }}
      >
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
                Nederland
              </span>
            </div>
          </Link>

          <p
            className="mb-6 max-w-[280px] text-[14px] leading-relaxed"
            style={{ color: '#A0A0A0' }}
          >
            Premium cricketbats, beschermende uitrusting, teamkleding en accessoires.
            Prestaties voor kampioenen op elk niveau.
          </p>

          {/* Social Icons */}
          <div className="mb-6 flex flex-wrap gap-3" aria-label="Social Media">
            {[
              { icon: Instagram,     href: SITE_CONFIG.social.instagram, label: 'Instagram' },
              { icon: Facebook,      href: SITE_CONFIG.social.facebook,  label: 'Facebook'  },
              { icon: Linkedin,      href: SITE_CONFIG.social.linkedin,  label: 'LinkedIn'  },
              { icon: Youtube,       href: SITE_CONFIG.social.youtube,   label: 'YouTube'   },
              { icon: XIcon,         href: '#',                          label: 'X'           },
              { icon: TikTokIcon,    href: '#',                          label: 'TikTok'    },
              { icon: PinterestIcon, href: '#',                          label: 'Pinterest' },
            ].map(({ icon: Icon, href, label }) => (
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

          {/* Contact Email */}
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

      {/* ── Global Websites ───────────────────────────────────────── */}
      <div className="border-t" style={{ borderColor: '#1c1c1c' }}>
        <div
          className="flex flex-wrap items-center gap-x-0 gap-y-0"
          style={{ padding: '0 60px' }}
        >
          <span
            className="mr-6 shrink-0 font-display text-[11px] font-semibold uppercase tracking-[0.18em]"
            style={{ color: '#6B6B6B', padding: '18px 0' }}
          >
            Mantra Sports Wereldwijd:
          </span>
          {[
            { label: 'Australië', flag: '🇦🇺', href: 'https://www.mantrasports.com.au' },
            { label: 'Verenigde Staten', flag: '🇺🇸', href: 'https://www.mantrasportsusa.com' },
            { label: 'Duitsland', flag: '🇩🇪', href: 'https://www.mantrasports.de' },
            { label: 'India', flag: '🇮🇳', href: 'https://www.mantrasports.co.in' },
            { label: 'Canada', flag: '🇨🇦', href: 'https://www.mantrasports.ca' },
          ].map((site, i, arr) => (
            <a
              key={site.label}
              href={site.href}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-[12px] transition-colors"
              style={{
                color: '#6B6B6B',
                padding: '18px 20px',
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
        <div
          className="flex flex-col items-center justify-between gap-4 sm:flex-row"
          style={{ padding: '20px 60px' }}
        >
          <p className="text-[12px]" style={{ color: '#6B6B6B' }}>
            © {currentYear} Mantra Sports. Alle rechten voorbehouden. Nederland.
          </p>

          {/* Payment badges */}
          <div className="flex items-center gap-2">
            {['VISA', 'MASTERCARD', 'PAYPAL', 'KLARNA'].map((method) => (
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

          {/* Legal mini-links */}
          <div className="flex items-center gap-4">
            {[
              { label: 'Privacybeleid', href: '/privacy-policy' },
              { label: 'Algemene Voorwaarden', href: '/terms-and-conditions' },
              { label: 'Bedrijfsgegevens', href: '/company-information' },
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
