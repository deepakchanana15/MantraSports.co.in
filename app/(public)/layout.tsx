import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { WhatsAppButton } from '@/components/layout/WhatsAppButton'
import { CookieBanner } from '@/components/layout/CookieBanner'
import { CartProvider } from '@/lib/cart/CartContext'
import { getSiteSettings } from '@/lib/utils/settings'

export default async function PublicLayout({ children }: { children: React.ReactNode }) {
  const settings = await getSiteSettings([
    'contact_email',
    'contact_phone',
    'announcement_text',
    'social_instagram',
    'social_facebook',
    'social_linkedin',
    'social_youtube',
  ])

  return (
    <CartProvider>
      {/* Skip to main content */}
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>

      <Navbar announcementText={settings.announcement_text} />

      <main id="main-content" tabIndex={-1}>
        {children}
      </main>

      <Footer
        contactEmail={settings.contact_email}
        contactPhone={settings.contact_phone}
        social={{
          instagram: settings.social_instagram,
          facebook: settings.social_facebook,
          linkedin: settings.social_linkedin,
          youtube: settings.social_youtube,
        }}
      />

      {/* Floating WhatsApp CTA — visible across all public pages */}
      <WhatsAppButton />

      {/* Cookie consent banner */}
      <CookieBanner />
    </CartProvider>
  )
}
