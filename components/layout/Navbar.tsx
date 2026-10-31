'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X, Search, ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils/cn'
import { MAIN_NAV, SITE_CONFIG } from '@/lib/config/site'
import type { NavItem } from '@/types'
import { CartButton } from '@/components/layout/CartButton'

// ── Logo mark — inline SVG fallback while PNG loads ──────────────────────────
function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" fill="none" aria-hidden="true" className={className}>
      {/* Stylised "M" / phoenix mark matching the Mantra orange phoenix */}
      <path
        d="M50 5 L10 50 L25 50 L50 20 L75 50 L90 50 Z"
        fill="#e85d1a"
      />
      <path
        d="M30 55 L50 30 L70 55 L62 55 L50 38 L38 55 Z"
        fill="#e85d1a"
        opacity="0.7"
      />
      <path
        d="M42 58 L50 45 L58 58 L50 95 Z"
        fill="#e85d1a"
      />
    </svg>
  )
}

export function Navbar({ announcementText = '' }: { announcementText?: string }) {
  const pathname = usePathname()
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)
  const [logoError, setLogoError] = useState(false)
  const navRef = useRef<HTMLElement>(null)

  useEffect(() => {
    setIsMobileOpen(false)
    setOpenDropdown(null)
  }, [pathname])

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setOpenDropdown(null)
      }
    }
    document.addEventListener('click', handleClickOutside)
    return () => document.removeEventListener('click', handleClickOutside)
  }, [])

  useEffect(() => {
    document.body.style.overflow = isMobileOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [isMobileOpen])

  return (
    <>
      {/* ── Announcement Bar (text editable in /admin/settings) ───────── */}
      {announcementText && (
        <div
          style={{ background: '#111111' }}
          className="py-[9px] px-4 text-center text-[12px] font-medium tracking-[0.08em] text-white"
        >
          🏏 {announcementText}
          <Link
            href="/shop"
            className="ml-2 text-[#e85d1a] hover:underline"
          >
            Shop now →
          </Link>
        </div>
      )}

      {/* ── Sticky Nav ───────────────────────────────────────────────── */}
      <header
        className="sticky top-0 z-50 border-b bg-white"
        style={{ borderColor: '#E0DFDB' }}
      >
        <nav
          ref={navRef}
          aria-label="Main navigation"
          className="mx-auto flex h-[72px] max-w-none items-center justify-between px-4 sm:px-8 xl:px-[60px]"
        >
          {/* ── Logo ───────────────────────────────────────────────── */}
          <Link
            href="/"
            aria-label={`${SITE_CONFIG.name} — Home`}
            className="flex shrink-0 items-center gap-3.5 text-decoration-none"
          >
            {logoError ? (
              <LogoMark className="h-[46px] w-[46px]" />
            ) : (
              <img
                src="/images/brand/logo.png"
                alt="Mantra Sports Logo"
                width={46}
                height={46}
                className="h-[46px] w-[46px] object-contain"
                onError={() => setLogoError(true)}
              />
            )}
            <div className="leading-none">
              <span
                className="block font-display text-[19px] font-semibold tracking-[0.04em] sm:text-[22px]"
                style={{ color: '#111111' }}
              >
                MANTRA SPORTS
              </span>
              <span
                className="mt-[1px] block text-[10px] font-medium uppercase tracking-[0.2em]"
                style={{ color: '#e85d1a' }}
              >
                India
              </span>
            </div>
          </Link>

          {/* ── Desktop Nav Links ───────────────────────────────────── */}
          <ul className="hidden items-center lg:flex" role="list">
            {MAIN_NAV.map((item) => (
              <NavItemDesktop
                key={item.label}
                item={item}
                isActive={pathname === item.href || pathname.startsWith(item.href + '/')}
                openDropdown={openDropdown}
                setOpenDropdown={setOpenDropdown}
              />
            ))}
          </ul>

          {/* ── Right Actions ───────────────────────────────────────── */}
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Search */}
            <form method="GET" action="/shop" className="relative hidden md:block">
              <Search
                className="pointer-events-none absolute top-1/2 -translate-y-1/2"
                style={{ left: 11, width: 14, height: 14, color: '#6B6B6B' }}
                aria-hidden="true"
              />
              <input
                name="q"
                type="search"
                placeholder="Search products…"
                className="w-[170px] xl:w-[200px] rounded-[4px] border text-[13px] outline-none transition-colors"
                style={{
                  background: '#F2F1EE',
                  borderColor: '#E0DFDB',
                  color: '#111111',
                  fontFamily: 'var(--font-inter)',
                  paddingTop: 8,
                  paddingBottom: 8,
                  paddingLeft: 34,
                  paddingRight: 12,
                }}
                onFocus={(e) => {
                  e.currentTarget.style.background = '#fff'
                  e.currentTarget.style.borderColor = '#e85d1a'
                }}
                onBlur={(e) => {
                  e.currentTarget.style.background = '#F2F1EE'
                  e.currentTarget.style.borderColor = '#E0DFDB'
                }}
                aria-label="Search products"
              />
            </form>

            <CartButton />

            {/* CTA */}
            <Link
              href="/b2b"
              className="hidden rounded-[2px] px-[22px] py-[10px] font-display text-[14px] font-medium uppercase tracking-[0.08em] text-white transition-colors lg:block"
              style={{ background: '#e85d1a' }}
              onMouseEnter={(e) => { e.currentTarget.style.background = '#c44b0f' }}
              onMouseLeave={(e) => { e.currentTarget.style.background = '#e85d1a' }}
            >
              Request a Quote
            </Link>

            {/* Hamburger */}
            <button
              type="button"
              aria-label={isMobileOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={isMobileOpen}
              aria-controls="mobile-menu"
              onClick={() => setIsMobileOpen((prev) => !prev)}
              className="flex items-center justify-center rounded p-2 lg:hidden"
              style={{ color: '#333333' }}
            >
              {isMobileOpen
                ? <X className="h-6 w-6" aria-hidden="true" />
                : <Menu className="h-6 w-6" aria-hidden="true" />
              }
            </button>
          </div>
        </nav>
      </header>

      {/* ── Mobile Menu ──────────────────────────────────────────────── */}
      <div
        id="mobile-menu"
        role="dialog"
        aria-label="Mobile Navigation"
        aria-modal="true"
        className={cn(
          'fixed inset-x-0 bottom-0 top-[72px] z-40 flex flex-col overflow-y-auto bg-white transition-transform duration-300 lg:hidden',
          isMobileOpen ? 'translate-x-0' : 'translate-x-full'
        )}
      >
        <div className="flex-1 px-5 py-6">
          <form method="GET" action="/shop" className="mb-4 md:hidden">
            <input
              name="q"
              type="search"
              placeholder="Search products…"
              aria-label="Search products"
              className="h-11 w-full rounded-[4px] border border-[#E0DFDB] bg-[#F2F1EE] px-4 text-sm text-[#111] outline-none focus:border-[#e85d1a] focus:bg-white"
            />
          </form>
          <ul className="space-y-1" role="list">
            {MAIN_NAV.map((item) => (
              <li key={item.label}>
                <Link
                  href={item.href}
                  className="block px-4 py-3 font-display text-sm font-semibold uppercase tracking-widest transition-colors"
                  style={{
                    color: pathname === item.href ? '#e85d1a' : '#333333',
                  }}
                  aria-current={pathname === item.href ? 'page' : undefined}
                >
                  {item.label}
                </Link>
                {item.children && (
                  <ul
                    className="ml-4 mt-1 space-y-1 border-l pl-4"
                    style={{ borderColor: '#F2F1EE' }}
                  >
                    {item.children.map((child) => (
                      <li key={child.label}>
                        <Link
                          href={child.href}
                          className="block py-1.5 text-sm transition-colors"
                          style={{ color: '#6B6B6B' }}
                          onMouseEnter={(e) => { e.currentTarget.style.color = '#e85d1a' }}
                          onMouseLeave={(e) => { e.currentTarget.style.color = '#6B6B6B' }}
                        >
                          {child.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        </div>

        <div className="border-t p-4" style={{ borderColor: '#F2F1EE' }}>
          <Link
            href="/b2b"
            className="block rounded-[2px] px-4 py-3 text-center font-display text-sm font-bold uppercase tracking-widest text-white"
            style={{ background: '#e85d1a' }}
          >
            Request a B2B Quote
          </Link>
        </div>
      </div>
    </>
  )
}

// ── Desktop Nav Item with Dropdown ────────────────────────────────────────────

function NavItemDesktop({
  item,
  isActive,
  openDropdown,
  setOpenDropdown,
}: {
  item: NavItem
  isActive: boolean
  openDropdown: string | null
  setOpenDropdown: (key: string | null) => void
}) {
  const isOpen = openDropdown === item.label
  const hasChildren = item.children && item.children.length > 0

  if (!hasChildren) {
    return (
      <li>
        <Link
          href={item.href}
          aria-current={isActive ? 'page' : undefined}
          className="flex items-center gap-1 font-medium transition-colors hover:text-[#e85d1a]"
          style={{
            color: isActive ? '#e85d1a' : '#111111',
            borderBottom: isActive ? '2px solid #e85d1a' : '2px solid transparent',
            height: '72px',
            padding: '0 18px',
            fontSize: '13px',
            letterSpacing: '0.04em',
            textDecoration: 'none',
          }}
        >
          {item.label}
        </Link>
      </li>
    )
  }

  return (
    <li className="relative">
      <button
        type="button"
        aria-expanded={isOpen}
        aria-haspopup="true"
        onClick={() => setOpenDropdown(isOpen ? null : item.label)}
        className="flex items-center gap-[4px] font-medium transition-colors hover:text-[#e85d1a]"
        style={{
          color: isActive ? '#e85d1a' : '#111111',
          borderTop: 'none',
          borderLeft: 'none',
          borderRight: 'none',
          borderBottom: isActive ? '2px solid #e85d1a' : '2px solid transparent',
          height: '72px',
          padding: '0 18px',
          fontSize: '13px',
          letterSpacing: '0.04em',
          background: 'none',
          cursor: 'pointer',
          fontFamily: 'var(--font-inter)',
        }}
      >
        {item.label}
        <ChevronDown
          className={cn('h-3.5 w-3.5 transition-transform duration-200', isOpen && 'rotate-180')}
          aria-hidden="true"
        />
      </button>

      {isOpen && (
        <ul
          role="menu"
          className="absolute left-0 top-full z-50 min-w-[200px] border bg-white py-2 shadow-lg"
          style={{ borderColor: '#E0DFDB' }}
        >
          {item.children!.map((child) => (
            <li key={child.label} role="none">
              <Link
                href={child.href}
                role="menuitem"
                className="block px-4 py-2 text-sm transition-colors hover:bg-[#F2F1EE] hover:text-[#e85d1a]"
                style={{ color: '#333333', fontSize: '13px' }}
              >
                {child.label}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </li>
  )
}
