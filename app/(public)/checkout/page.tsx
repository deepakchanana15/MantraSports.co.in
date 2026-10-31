import type { Metadata } from 'next'
import { CheckoutClient } from './CheckoutClient'
import { getSiteSettings } from '@/lib/utils/settings'

export const metadata: Metadata = {
  title: 'Checkout',
  robots: { index: false, follow: false },
}

export const dynamic = 'force-dynamic'

export default async function CheckoutPage() {
  const { shipping_delivery_time } = await getSiteSettings(['shipping_delivery_time'])
  const paymentsEnabled = Boolean(process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET)
  return <CheckoutClient deliveryTime={shipping_delivery_time} paymentsEnabled={paymentsEnabled} />
}
