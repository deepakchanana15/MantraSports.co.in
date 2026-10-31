'use server'

import { prisma } from '@/lib/db/prisma'
import { auth } from '@/auth'
import bcrypt from 'bcryptjs'
import { z } from 'zod'

const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z.string().min(8, 'New password must be at least 8 characters'),
  confirmPassword: z.string(),
}).refine((d) => d.newPassword === d.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
})

export async function changeAdminPassword(formData: FormData) {
  const session = await auth()
  if (!session?.user?.email) return { error: 'Not authenticated' }

  const parsed = changePasswordSchema.safeParse({
    currentPassword: formData.get('currentPassword'),
    newPassword: formData.get('newPassword'),
    confirmPassword: formData.get('confirmPassword'),
  })

  if (!parsed.success) {
    return { error: parsed.error.errors[0].message }
  }

  try {
    const admin = await prisma.adminUser.findUnique({
      where: { email: session.user.email },
      select: { id: true, passwordHash: true },
    })

    if (!admin) return { error: 'Admin user not found' }

    const isValid = await bcrypt.compare(parsed.data.currentPassword, admin.passwordHash)
    if (!isValid) return { error: 'Current password is incorrect' }

    const newHash = await bcrypt.hash(parsed.data.newPassword, 12)
    await prisma.adminUser.update({
      where: { id: admin.id },
      data: { passwordHash: newHash },
    })

    return { success: true }
  } catch {
    return { error: 'Failed to update password. Please try again.' }
  }
}
