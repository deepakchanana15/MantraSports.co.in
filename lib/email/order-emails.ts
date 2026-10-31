import 'server-only'
import { sendMail } from '@/lib/email/mailer'
import { formatPrice } from '@/lib/utils/format'
import { SITE_CONFIG } from '@/lib/config/site'
import { getSiteSettings } from '@/lib/utils/settings'
import type { Order, OrderItem } from '@prisma/client'

type OrderWithItems = Order & { items: OrderItem[] }

const esc = (s: string | null | undefined) =>
  (s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

function layout(title: string, body: string): string {
  return `<!doctype html><html><body style="margin:0;background:#F8F7F4;font-family:Arial,Helvetica,sans-serif;color:#333">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#F8F7F4;padding:24px 0"><tr><td align="center">
  <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#fff;border:1px solid #E0DFDB">
    <tr><td style="background:#111;padding:20px 28px">
      <span style="color:#fff;font-size:20px;font-weight:bold;letter-spacing:2px">MANTRA SPORTS</span>
      <span style="color:#E85D1A;font-size:11px;letter-spacing:3px;display:block">INDIA</span>
    </td></tr>
    <tr><td style="padding:28px">
      <h1 style="margin:0 0 16px;font-size:22px;color:#111;text-transform:uppercase">${esc(title)}</h1>
      ${body}
    </td></tr>
    <tr><td style="padding:16px 28px;border-top:1px solid #E0DFDB;font-size:11px;color:#999">
      ${esc(SITE_CONFIG.company.legalName)} · ${esc(SITE_CONFIG.contact.address)} · GSTIN ${esc(SITE_CONFIG.company.gstin)}
    </td></tr>
  </table></td></tr></table></body></html>`
}

function itemsTable(order: OrderWithItems): string {
  const rows = order.items.map((i) => `
    <tr>
      <td style="padding:8px 0;border-bottom:1px solid #eee">${esc(i.productName)}${i.option ? `<br><span style="color:#999;font-size:12px">${esc(i.option)}</span>` : ''}</td>
      <td style="padding:8px 0;border-bottom:1px solid #eee;text-align:center">${i.quantity}</td>
      <td style="padding:8px 0;border-bottom:1px solid #eee;text-align:right">${formatPrice(Number(i.lineTotal))}</td>
    </tr>`).join('')
  return `<table width="100%" cellpadding="0" cellspacing="0" style="font-size:14px;margin:16px 0">
    <tr><th align="left" style="font-size:11px;color:#999;text-transform:uppercase">Item</th><th style="font-size:11px;color:#999">Qty</th><th align="right" style="font-size:11px;color:#999;text-transform:uppercase">Amount</th></tr>
    ${rows}
    <tr><td colspan="2" style="padding:8px 0">Delivery</td><td style="padding:8px 0;text-align:right">${Number(order.shippingFee) === 0 ? 'FREE' : formatPrice(Number(order.shippingFee))}</td></tr>
    <tr><td colspan="2" style="padding:8px 0;font-weight:bold">Total (incl. GST)</td><td style="padding:8px 0;text-align:right;font-weight:bold">${formatPrice(Number(order.total))}</td></tr>
  </table>`
}

function addressBlock(order: Order): string {
  return `<p style="font-size:14px;line-height:1.6;margin:0">
    ${esc(order.customerName)}<br>${esc(order.addressLine1)}${order.addressLine2 ? `<br>${esc(order.addressLine2)}` : ''}<br>
    ${esc(order.city)}, ${esc(order.state)} ${esc(order.pincode)}<br>${esc(order.phone)}</p>`
}

export async function sendOrderConfirmation(order: OrderWithItems): Promise<boolean> {
  const { shipping_delivery_time } = await getSiteSettings(['shipping_delivery_time'])
  const link = `${SITE_CONFIG.url}/order-confirmation/${order.accessToken}`
  const body = `
    <p style="font-size:14px;line-height:1.6">Hi ${esc(order.customerName.split(' ')[0])}, thank you for your order. We've received your payment and will let you know as soon as it ships.</p>
    <p style="font-size:14px"><strong>Order number:</strong> ${esc(order.orderNumber)}</p>
    ${itemsTable(order)}
    <p style="font-size:12px;color:#999;margin:0 0 4px;text-transform:uppercase">Delivering to</p>
    ${addressBlock(order)}
    <p style="font-size:14px;line-height:1.6;margin-top:16px">Estimated delivery: ${esc(shipping_delivery_time)}.</p>
    <p style="margin:24px 0"><a href="${link}" style="background:#E85D1A;color:#fff;padding:12px 24px;text-decoration:none;font-weight:bold;text-transform:uppercase;font-size:13px">View order &amp; invoice</a></p>
    <p style="font-size:13px;color:#6B6B6B">Questions? Reply to this email or WhatsApp us on ${esc(SITE_CONFIG.contact.phone)}.</p>`
  return sendMail({
    to: order.email,
    subject: `Order confirmed — ${order.orderNumber} | Mantra Sports India`,
    html: layout('Order confirmed', body),
    replyTo: SITE_CONFIG.contact.email,
  })
}

export async function sendNewOrderNotification(order: OrderWithItems): Promise<boolean> {
  const to = process.env.ORDER_NOTIFY_EMAIL || (await getSiteSettings(['contact_email'])).contact_email
  if (!to) return false
  const body = `
    <p style="font-size:14px">New paid order <strong>${esc(order.orderNumber)}</strong> — ${formatPrice(Number(order.total))}</p>
    <p style="font-size:14px">${esc(order.customerName)} · ${esc(order.email)} · ${esc(order.phone)}</p>
    ${order.buyerGstin ? `<p style="font-size:14px">Buyer GSTIN: ${esc(order.buyerGstin)}${order.buyerCompany ? ` (${esc(order.buyerCompany)})` : ''}</p>` : ''}
    ${itemsTable(order)}
    ${addressBlock(order)}
    ${order.customerNote ? `<p style="font-size:14px"><strong>Customer note:</strong> ${esc(order.customerNote)}</p>` : ''}
    <p style="margin:24px 0"><a href="${SITE_CONFIG.url}/admin/orders/${order.id}" style="background:#111;color:#fff;padding:12px 24px;text-decoration:none;font-weight:bold;font-size:13px">Open in admin</a></p>`
  return sendMail({
    to,
    subject: `New order ${order.orderNumber} — ${formatPrice(Number(order.total))}`,
    html: layout('New order', body),
    replyTo: order.email,
  })
}

export async function sendShippedNotification(order: OrderWithItems): Promise<boolean> {
  const tracking = order.trackingNumber
    ? `<p style="font-size:14px"><strong>Courier:</strong> ${esc(order.courier ?? '—')}<br><strong>Tracking number:</strong> ${esc(order.trackingNumber)}</p>
       ${order.trackingUrl ? `<p style="margin:16px 0"><a href="${esc(order.trackingUrl)}" style="background:#E85D1A;color:#fff;padding:12px 24px;text-decoration:none;font-weight:bold;font-size:13px;text-transform:uppercase">Track your parcel</a></p>` : ''}`
    : ''
  const body = `
    <p style="font-size:14px;line-height:1.6">Good news, ${esc(order.customerName.split(' ')[0])} — your order <strong>${esc(order.orderNumber)}</strong> is on its way.</p>
    ${tracking}
    ${itemsTable(order)}
    <p style="font-size:13px;color:#6B6B6B">Questions? Reply to this email or WhatsApp us on ${esc(SITE_CONFIG.contact.phone)}.</p>`
  return sendMail({
    to: order.email,
    subject: `Your order ${order.orderNumber} has shipped | Mantra Sports India`,
    html: layout('Your order has shipped', body),
    replyTo: SITE_CONFIG.contact.email,
  })
}
