'use server'

import { auth } from '@/auth'
import { prisma } from '@/lib/db/prisma'
import { revalidatePath } from 'next/cache'

export async function saveSettings(formData: FormData): Promise<void> {
  const session = await auth()
  if (!session) throw new Error('Unauthorized')

  const entries: Array<{ key: string; value: string }> = []
  formData.forEach((value, key) => {
    if (key.startsWith('setting_')) {
      entries.push({ key: key.replace('setting_', ''), value: value as string })
    }
  })

  await prisma.$transaction(
    entries.map(({ key, value }) =>
      prisma.siteSetting.upsert({
        where: { key },
        update: { value },
        create: { key, value, type: 'STRING' },
      })
    )
  )

  revalidatePath('/admin/settings')
  revalidatePath('/')
}

export async function getSettings(): Promise<Record<string, string>> {
  const session = await auth()
  if (!session) throw new Error('Unauthorized')

  const rows = await prisma.siteSetting.findMany()
  return Object.fromEntries(rows.map((r) => [r.key, r.value ?? '']))
}
