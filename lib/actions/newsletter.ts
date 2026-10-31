'use server'

import { prisma } from '@/lib/db/prisma'

export async function subscribeNewsletter(
  email: string
): Promise<{ ok: boolean; error?: string }> {
  const trimmed = email.trim().toLowerCase()
  if (!trimmed || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
    return { ok: false, error: 'Vul een geldig e-mailadres in.' }
  }

  try {
    await prisma.newsletterSubscriber.upsert({
      where: { email: trimmed },
      create: { email: trimmed },
      update: {},
    })
    return { ok: true }
  } catch {
    return { ok: false, error: 'Er is iets misgegaan. Probeer het opnieuw.' }
  }
}
