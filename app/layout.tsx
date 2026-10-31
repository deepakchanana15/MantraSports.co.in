import type { Metadata, Viewport } from 'next'
import { Inter, Oswald } from 'next/font/google'
import { ThemeProvider } from '@/components/layout/ThemeProvider'
import { SITE_CONFIG } from '@/lib/config/site'
import '@/styles/globals.css'

// ── Fonts — downloaded at build time, served from same origin ──────────────
const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
})

const oswald = Oswald({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  display: 'swap',
  variable: '--font-oswald',
})

// ── Default Metadata ───────────────────────────────────────────────────────
export const metadata: Metadata = {
  metadataBase: new URL(SITE_CONFIG.url),
  alternates: { canonical: './' },
  title: {
    default: SITE_CONFIG.seo.defaultTitle,
    template: SITE_CONFIG.seo.titleTemplate,
  },
  description: SITE_CONFIG.seo.defaultDescription,
  keywords: [
    'English willow cricket bats India',
    'buy cricket bat online India',
    'Mantra Sports',
    'cricket protective gear',
    'cricket batting pads and gloves',
    'leather cricket balls',
    'custom cricket teamwear',
    'cricket equipment wholesale India',
  ],
  authors: [{ name: 'Mantra Sports India' }],
  creator: 'Mantra Sports India',
  publisher: 'Mantra Sports International',
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    siteName: SITE_CONFIG.name,
    title: SITE_CONFIG.seo.defaultTitle,
    description: SITE_CONFIG.seo.defaultDescription,
    images: [{ url: SITE_CONFIG.seo.defaultOgImage, width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    site: SITE_CONFIG.seo.twitterHandle,
    title: SITE_CONFIG.seo.defaultTitle,
    description: SITE_CONFIG.seo.defaultDescription,
    images: [SITE_CONFIG.seo.defaultOgImage],
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#111111' },
  ],
}

// ── Root Layout ────────────────────────────────────────────────────────────
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en-IN"
      suppressHydrationWarning
    >
      <head>
        {/*
          Only apply dark class if user explicitly chose dark.
          Default is always light — no flash of dark theme.
        */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('mantra-theme');if(t==='dark'){document.documentElement.classList.add('dark')}}catch(e){}})()`,
          }}
        />
      </head>
      <body className={`${inter.variable} ${oswald.variable} antialiased`}>
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
