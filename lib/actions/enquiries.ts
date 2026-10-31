'use server'

import { auth } from '@/auth'
import { prisma } from '@/lib/db/prisma'
import { revalidatePath } from 'next/cache'
import type { EnquiryStatus, EnquiryType } from '@prisma/client'
import { headers } from 'next/headers'
import { rateLimit } from '@/lib/utils/rate-limit'

const MANTRA_OS_CUSTOMER_TYPE: Record<EnquiryType, string> = {
  GENERAL: 'General Contact',
  WHOLESALE: 'Wholesale / B2B / Dealer',
  QUOTE: 'Quote Request',
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

/**
 * Sends this enquiry to MantraOS as a lead Opportunity, so head office sees
 * every site enquiry in one pipeline alongside Meta/website/WhatsApp leads.
 * Never throws — a MantraOS outage must not block a real visitor's enquiry
 * from being saved. Awaited (with a timeout) so serverless hosting doesn't
 * cut the request off after the response is sent.
 */
async function sendToMantraOS(params: {
  name: string
  email: string
  phone: string | null
  company: string | null
  country: string | null
  quantity: number | null
  productName: string | null
  message: string | null
  type: EnquiryType
}) {
  const key = process.env.MANTRA_LEAD_INTAKE_KEY
  if (!key) return

  const extra = [
    params.productName && `Product: ${params.productName}`,
    params.company && `Organization/Club: ${params.company}`,
    params.country && `Country/City: ${params.country}`,
    params.quantity && `Estimated quantity: ${params.quantity}`,
  ].filter(Boolean)
  const message = [params.message, ...extra].filter(Boolean).join('\n')

  try {
    await fetch('https://mantra-os-api.vercel.app/v1/leads/intake', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-intake-key': key },
      signal: AbortSignal.timeout(5000),
      body: JSON.stringify({
        name: params.name,
        email: params.email,
        phone: params.phone || undefined,
        message: message || undefined,
        customerType: MANTRA_OS_CUSTOMER_TYPE[params.type],
      }),
    })
  } catch (err) {
    console.error('MantraOS lead intake failed:', err)
  }
}

export async function submitEnquiry(formData: FormData): Promise<{ ok: boolean; error?: string }> {
  try {
    const name = (formData.get('name') as string ?? '').trim()
    const email = (formData.get('email') as string ?? '').trim()
    const type = (formData.get('type') as EnquiryType) ?? 'GENERAL'
    const phone = (formData.get('phone') as string) || null
    const company = (formData.get('company') as string) || null
    const country = (formData.get('country') as string) || null
    const quantity = formData.get('quantity') ? parseInt(formData.get('quantity') as string, 10) || null : null
    const productName = (formData.get('productName') as string) || null
    const message = (formData.get('message') as string) || null

    if (!name || !email) return { ok: false, error: 'Name and email are required.' }
    if (!EMAIL_RE.test(email)) return { ok: false, error: 'Please enter a valid email address.' }

    const hdrs = await headers()
    const ip = hdrs.get('x-forwarded-for')?.split(',')[0]?.trim() ?? hdrs.get('x-real-ip') ?? null

    if (!rateLimit(`enquiry:${ip ?? 'unknown'}`, { maxRequests: 5, windowMs: 10 * 60 * 1000 }).success) {
      return { ok: false, error: 'Too many enquiries. Please wait a few minutes and try again.' }
    }

    await prisma.enquiry.create({
      data: {
        type,
        name,
        email,
        phone,
        company,
        country,
        quantity,
        productName,
        message,
        ipAddress: ip,
      },
    })

    await sendToMantraOS({ name, email, phone, company, country, quantity, productName, message, type })

    revalidatePath('/admin/enquiries')
    return { ok: true }
  } catch {
    return { ok: false, error: 'Something went wrong. Please try again.' }
  }
}

export async function updateEnquiryStatus(id: string, status: EnquiryStatus): Promise<void> {
  const session = await auth()
  if (!session) throw new Error('Unauthorized')

  await prisma.enquiry.update({ where: { id }, data: { status } })
  revalidatePath('/admin/enquiries')
  revalidatePath(`/admin/enquiries/${id}`)
}

export async function deleteEnquiry(id: string): Promise<void> {
  const session = await auth()
  if (!session) throw new Error('Unauthorized')

  await prisma.enquiry.delete({ where: { id } })
  revalidatePath('/admin/enquiries')
}
