'use client'

import { useState, useTransition } from 'react'
import { updateOrder } from '@/lib/actions/orders'

const STATUSES = [
  { value: 'PENDING_PAYMENT', label: 'Pending payment' },
  { value: 'PAYMENT_FAILED', label: 'Payment failed' },
  { value: 'PAID', label: 'Paid — to pack' },
  { value: 'PROCESSING', label: 'Processing' },
  { value: 'SHIPPED', label: 'Shipped' },
  { value: 'DELIVERED', label: 'Delivered' },
  { value: 'CANCELLED', label: 'Cancelled' },
  { value: 'REFUNDED', label: 'Refunded' },
]

interface Props {
  orderId: string
  status: string
  courier: string
  trackingNumber: string
  trackingUrl: string
  adminNotes: string
}

export function OrderActions(props: Props) {
  const [status, setStatus] = useState(props.status)
  const [message, setMessage] = useState<{ ok: boolean; text: string } | null>(null)
  const [pending, startTransition] = useTransition()

  const input = 'w-full rounded border border-neutral-300 px-3 py-2 text-sm'

  return (
    <form
      className="h-fit space-y-4 rounded border border-neutral-200 bg-white p-4"
      action={(fd) =>
        startTransition(async () => {
          setMessage(null)
          const res = await updateOrder(props.orderId, fd)
          setMessage(res.ok
            ? { ok: true, text: res.emailed ? 'Saved — shipping email sent to customer.' : 'Saved.' }
            : { ok: false, text: res.error ?? 'Could not save.' })
        })
      }
    >
      <h2 className="text-sm font-semibold text-neutral-700">Fulfilment</h2>

      <div>
        <label htmlFor="status" className="mb-1 block text-xs font-medium text-neutral-600">Status</label>
        <select id="status" name="status" value={status} onChange={(e) => setStatus(e.target.value)} className={input}>
          {STATUSES.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
        </select>
      </div>

      <div>
        <label htmlFor="courier" className="mb-1 block text-xs font-medium text-neutral-600">Courier</label>
        <input id="courier" name="courier" defaultValue={props.courier} placeholder="e.g. Delhivery, Blue Dart, India Post" className={input} />
      </div>
      <div>
        <label htmlFor="trackingNumber" className="mb-1 block text-xs font-medium text-neutral-600">Tracking / AWB number</label>
        <input id="trackingNumber" name="trackingNumber" defaultValue={props.trackingNumber} className={input} />
      </div>
      <div>
        <label htmlFor="trackingUrl" className="mb-1 block text-xs font-medium text-neutral-600">Tracking link</label>
        <input id="trackingUrl" name="trackingUrl" type="url" defaultValue={props.trackingUrl} placeholder="https://" className={input} />
      </div>

      {status === 'SHIPPED' && (
        <label className="flex items-center gap-2 text-sm text-neutral-700">
          <input type="checkbox" name="notifyCustomer" defaultChecked={props.status !== 'SHIPPED'} className="h-4 w-4" />
          Email the customer that their order has shipped
        </label>
      )}

      <div>
        <label htmlFor="adminNotes" className="mb-1 block text-xs font-medium text-neutral-600">Internal notes</label>
        <textarea id="adminNotes" name="adminNotes" rows={3} defaultValue={props.adminNotes} className={input} />
      </div>

      {(status === 'CANCELLED' || status === 'REFUNDED') && props.status !== status && (
        <p className="rounded bg-amber-50 p-2 text-xs text-amber-700">
          Changing the status here does not refund the customer. Issue refunds from the Razorpay Dashboard → Payments.
        </p>
      )}

      <button type="submit" disabled={pending} className="w-full rounded bg-neutral-900 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-600 disabled:opacity-60">
        {pending ? 'Saving…' : 'Save'}
      </button>
      {message && <p className={`text-sm ${message.ok ? 'text-green-700' : 'text-red-600'}`}>{message.text}</p>}
    </form>
  )
}
