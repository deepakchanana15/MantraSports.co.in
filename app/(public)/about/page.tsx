import type { Metadata } from 'next'
import Link from 'next/link'
import { ContentPage } from '@/components/layout/ContentPage'

export const metadata: Metadata = {
  title: 'About Us',
  description:
    'Mantra Sports specialises in premium cricket equipment — English willow bats, protective gear and custom teamwear. Meet Mantra Sports India.',
}

export default function AboutPage() {
  return (
    <ContentPage
      eyebrow="About Mantra Sports"
      title="About Us"
      intro="Premium cricket equipment for every player — from club cricketers to serious competitors. Mantra Sports India is operated by Mantra Sports International, Ghaziabad."
      breadcrumb={[{ label: 'About Us' }]}
    >
      <p>
        Welcome to Mantra Sports, specialists in premium cricket equipment. We are passionate about helping cricketers reach
        their full potential and achieve their goals on the field. Whether you are an experienced player or just starting out,
        we have the products and the expertise to support you at every step. From English willow bats and protective gear to
        custom teamwear, we are committed to giving you the best possible products and service.
      </p>
      <p>
        We understand the dedication and hard work that goes into the game. Whether you are at the crease or behind the stumps,
        we want to help you perform at your best and enjoy every moment on the field. Thank you for choosing Mantra Sports as
        your trusted partner in cricket.
      </p>

      <h2>What We Offer</h2>
      <p>
        Mantra Sports offers a wide range of high-quality cricket equipment, designed for players at every level:
      </p>
      <ul>
        <li><strong>Cricket bats</strong> — English willow bats built for performance and durability.</li>
        <li><strong>Gloves &amp; batting pads</strong> — premium gloves and leg guards for comfort and protection.</li>
        <li><strong>Helmets &amp; protective gear</strong> — safety first, so you can play with confidence.</li>
        <li><strong>Wicket-keeping equipment</strong> — specialist gear for keepers.</li>
        <li><strong>Grips &amp; accessories</strong> — the essentials that keep your kit match-ready.</li>
        <li><strong>Cricket apparel</strong> — comfortable, durable teamwear for every level.</li>
      </ul>
      <p>
        We also take custom orders: kit bags, clothing and equipment in your club colours. Looking for something specific? Let us
        know. You deal directly with our team, so you get personal service and expert advice when choosing the right gear.
      </p>

      <h2>Why Mantra Sports?</h2>
      <ul>
        <li><strong>Quality at a fair price</strong> — premium cricket equipment at competitive prices.</li>
        <li><strong>A trusted cricket specialist</strong> — a focused range for every cricket enthusiast.</li>
        <li><strong>Everything in one place</strong> — bats, gloves, helmets, pads and keeping gear.</li>
        <li><strong>Personal advice</strong> — help choosing the right size, weight and equipment.</li>
        <li><strong>Free delivery across India</strong> — on every online order.</li>
      </ul>

      <h2>Mantra Sports Worldwide</h2>
      <p>
        Mantra Sports operates in Australia, the United States, Germany, the Netherlands, Canada and India. In India, the
        website and all sales are handled by Mantra Sports International, Ghaziabad, Uttar Pradesh. See our{' '}
        <Link href="/company-information">company information</Link> for full details.
      </p>

      <h2>Get Started</h2>
      <p>
        Browse our <Link href="/shop">full range</Link>, request a <Link href="/b2b">team or club quote</Link>, or get in touch
        about <Link href="/wholesale">wholesale and dealer orders</Link>. Not sure which bat size is right? Read our{' '}
        <Link href="/blog">guides and tips</Link>.
      </p>
    </ContentPage>
  )
}
