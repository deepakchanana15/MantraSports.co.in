'use server'

import { auth } from '@/auth'
import { prisma } from '@/lib/db/prisma'
import { revalidatePath } from 'next/cache'
import type { EnquiryStatus, EnquiryType } from '@prisma/client'
import { headers } from 'next/headers'

const MANTRA_OS_CUSTOMER_TYPE: Record<EnquiryType, string> = {
  GENERAL: 'General Contact',
  WHOLESALE: 'Wholesale / B2B / Dealer',
  QUOTE: 'Quote Request',
}

/**
 * Mirrors this enquiry into MantraOS as a lead Opportunity, so head office
 * sees every site enquiry in one pipeline alongside Meta/website/WhatsApp
 * leads. Never throws — a MantraOS outage must not block a real visitor's
 * enquiry from being saved and emailed as it always has been.
 */
async function sendToMantraOS(params: {
  name: string
  email: string
  phone: string | null
  company: string | null
  country: string | null
  quantity: number | null
  message: string | null
  type: EnquiryType
}) {
  const key = process.env.MANTRA_LEAD_INTAKE_KEY
  if (!key) return

  const extra = [
    params.company && `Organization/Club: ${params.company}`,
    params.country && `Country: ${params.country}`,
    params.quantity && `Estimated quantity: ${params.quantity}`,
  ].filter(Boolean)
  const message = [params.message, ...extra].filter(Boolean).join('\n')

  try {
    await fetch('https://mantra-os-api.vercel.app/v1/leads/intake', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-intake-key': key },
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
    const quantity = formData.get('quantity') ? parseInt(formData.get('quantity') as string, 10) : null
    const message = (formData.get('message') as string) || null

    if (!name || !email) return { ok: false, error: 'Naam en e-mailadres zijn verplicht.' }

    const hdrs = await headers()
    const ip = hdrs.get('x-forwarded-for')?.split(',')[0] ?? hdrs.get('x-real-ip') ?? null

    await prisma.enquiry.create({
      data: {
        type,
        name,
        email,
        phone,
        company,
        country,
        quantity,
        message,
        ipAddress: ip,
      },
    })

    void sendToMantraOS({ name, email, phone, company, country, quantity, message, type })

    revalidatePath('/admin/enquiries')
    return { ok: true }
  } catch {
    return { ok: false, error: 'Er is iets misgegaan. Probeer het opnieuw.' }
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
