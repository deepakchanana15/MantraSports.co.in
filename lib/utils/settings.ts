import { prisma } from '@/lib/db/prisma'
import { DEFAULT_SITE_SETTINGS } from '@/lib/config/site'

type SettingKey = keyof typeof DEFAULT_SITE_SETTINGS

// Fetch site settings from the database, falling back to defaults for any
// key that's missing or if the database isn't reachable.
export async function getSiteSettings<K extends SettingKey>(
  keys: K[]
): Promise<Record<K, string>> {
  const result = {} as Record<K, string>
  for (const key of keys) result[key] = DEFAULT_SITE_SETTINGS[key]

  try {
    const rows = await prisma.siteSetting.findMany({ where: { key: { in: keys } } })
    for (const row of rows) {
      if (row.value) result[row.key as K] = row.value
    }
  } catch {
    // Database not connected — defaults above already populated
  }

  return result
}
