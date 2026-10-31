import type { Metadata } from 'next'
import { prisma } from '@/lib/db/prisma'
import { SettingsForm } from './SettingsForm'
import { PasswordForm } from './PasswordForm'
import { DEFAULT_SITE_SETTINGS } from '@/lib/config/site'

export const metadata: Metadata = { title: 'Settings' }

export default async function SettingsPage() {
  let savedSettings: Record<string, string> = {}
  let dbError = false

  try {
    const rows = await prisma.siteSetting.findMany()
    savedSettings = Object.fromEntries(rows.map((r) => [r.key, r.value ?? '']))
  } catch {
    dbError = true
  }

  // Merge defaults with DB values
  const settings = { ...DEFAULT_SITE_SETTINGS, ...savedSettings } as Record<string, string>

  return (
    <div className="max-w-2xl">
      <h1 className="mb-2 font-display text-2xl font-bold uppercase tracking-tight text-neutral-900">
        Site Settings
      </h1>
      <p className="mb-6 text-sm text-neutral-500">
        These settings control the public-facing site name, contact details, and more.
      </p>

      {dbError && (
        <div className="mb-6 rounded border border-amber-200 bg-amber-50 p-4 text-sm text-amber-700">
          <strong>Database not connected.</strong> Settings are shown from defaults and cannot be saved until the database is set up.
        </div>
      )}

      <SettingsForm settings={settings} disabled={dbError} />

      {/* Password change */}
      <div className="mt-10 border-t border-neutral-200 pt-8">
        <h2 className="mb-1 font-display text-lg font-bold uppercase tracking-tight text-neutral-900">
          Change Password
        </h2>
        <p className="mb-5 text-sm text-neutral-500">
          Update your admin account password.
        </p>
        <PasswordForm />
      </div>
    </div>
  )
}
