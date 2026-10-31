import Link from 'next/link'
import { ChevronRight } from 'lucide-react'

interface Crumb {
  label: string
  href?: string
}

interface ContentPageProps {
  eyebrow: string
  title: string
  intro?: string
  breadcrumb: Crumb[]
  /** Shown under the hero, e.g. "Last updated: …" */
  meta?: string
  /** Wrap children in .prose with a readable max width (default true) */
  prose?: boolean
  children: React.ReactNode
}

// Shared layout for informational pages — same breadcrumb bar + dark hero as /contact and /wholesale
export function ContentPage({ eyebrow, title, intro, breadcrumb, meta, prose = true, children }: ContentPageProps) {
  return (
    <div className="bg-white">

      {/* ── Breadcrumb ── */}
      <div className="px-4 py-3 sm:px-8 lg:px-[60px]" style={{ borderBottom: '1px solid #E0DFDB', background: '#F8F7F4' }}>
        <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-2 text-[12px]" style={{ color: '#6B6B6B' }}>
          <Link href="/" className="transition-colors hover:text-[#e85d1a]">Home</Link>
          {breadcrumb.map((crumb, i) => (
            <span key={crumb.label} className="flex items-center gap-2">
              <ChevronRight className="h-3 w-3" />
              {crumb.href && i < breadcrumb.length - 1 ? (
                <Link href={crumb.href} className="transition-colors hover:text-[#e85d1a]">{crumb.label}</Link>
              ) : (
                <span style={{ color: '#111111' }}>{crumb.label}</span>
              )}
            </span>
          ))}
        </nav>
      </div>

      {/* ── Hero ── */}
      <div style={{ background: '#111111', borderBottom: '1px solid #1c1c1c' }}>
        <div className="px-4 py-12 sm:px-8 lg:px-[60px] lg:py-16">
          <p className="mb-3 font-display text-[11px] font-semibold uppercase tracking-[0.22em]" style={{ color: '#e85d1a' }}>
            {eyebrow}
          </p>
          <h1 className="mb-4 font-display font-bold uppercase leading-tight tracking-[0.01em]" style={{ fontSize: 'clamp(32px, 5vw, 60px)', color: '#ffffff' }}>
            {title}
          </h1>
          {intro && (
            <p className="max-w-[620px] text-[16px] font-light leading-[1.8]" style={{ color: '#A0A0A0' }}>
              {intro}
            </p>
          )}
          {meta && (
            <p className="mt-4 text-[12px] uppercase tracking-[0.12em]" style={{ color: '#6B6B6B' }}>{meta}</p>
          )}
        </div>
      </div>

      {/* ── Body ── */}
      <div className="px-4 py-12 sm:px-8 lg:px-[60px] lg:py-16">
        {prose ? <div className="prose" style={{ maxWidth: 820 }}>{children}</div> : children}
      </div>

    </div>
  )
}
