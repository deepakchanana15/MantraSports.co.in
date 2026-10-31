import type { Metadata } from 'next'
import { ContentPage } from '@/components/layout/ContentPage'
import { OrderLookupForm } from './OrderLookupForm'

export const metadata: Metadata = {
  title: 'Track Your Order',
  description: 'Check the status of your Mantra Sports India order with your order number and email address.',
}

export default function OrderStatusPage() {
  return (
    <ContentPage
      eyebrow="Help & Support"
      title="Track Your Order"
      intro="Enter the order number from your confirmation email and the email address you ordered with."
      breadcrumb={[{ label: 'Track Your Order' }]}
      prose={false}
    >
      <OrderLookupForm />
    </ContentPage>
  )
}
