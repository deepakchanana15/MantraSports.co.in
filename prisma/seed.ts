/**
 * Mantra Sports India — Database Seed
 * Run: npm run db:seed
 *
 * Creates:
 *  1. Super Admin user        — from DEV_ADMIN_EMAIL / DEV_ADMIN_PASSWORD
 *  2. Default site settings
 *  3. Product categories
 */

import { config } from 'dotenv'
config({ path: '.env.local' })
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import { DEFAULT_SITE_SETTINGS, DEFAULT_CATEGORIES } from '../lib/config/site'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding Mantra Sports India database…\n')

  // ── 1. Super Admin User ─────────────────────────────────────
  const adminEmail = process.env.DEV_ADMIN_EMAIL || 'admin@mantrasports.co.in'
  const adminPassword = process.env.DEV_ADMIN_PASSWORD
  if (!adminPassword) throw new Error('DEV_ADMIN_PASSWORD is not set in .env.local')

  const existingAdmin = await prisma.adminUser.findUnique({
    where: { email: adminEmail },
  })

  if (!existingAdmin) {
    const hash = await bcrypt.hash(adminPassword, 12)
    await prisma.adminUser.create({
      data: {
        name: 'Mantra Admin',
        email: adminEmail,
        passwordHash: hash,
        role: 'SUPER_ADMIN',
      },
    })
    console.log('✅ Super admin created:', adminEmail)
    console.log('   Password: value of DEV_ADMIN_PASSWORD in .env.local\n')
  } else {
    console.log('ℹ  Admin user already exists — skipping\n')
  }

  // ── 2. Site Settings ────────────────────────────────────────
  console.log('📋 Seeding site settings…')
  for (const [key, value] of Object.entries(DEFAULT_SITE_SETTINGS)) {
    await prisma.siteSetting.upsert({
      where: { key },
      create: { key, value: String(value), type: 'STRING' },
      update: { value: String(value) },
    })
  }
  console.log(`✅ ${Object.keys(DEFAULT_SITE_SETTINGS).length} site settings configured\n`)

  // ── 3. Product Categories ────────────────────────────────────
  console.log('📁 Seeding product categories…')
  for (const category of DEFAULT_CATEGORIES) {
    await prisma.category.upsert({
      where: { slug: category.slug },
      create: {
        name: category.name,
        slug: category.slug,
        sortOrder: category.sortOrder,
        metaTitle: `${category.name} | Mantra Sports India`,
        metaDescription: `Shop premium ${category.name.toLowerCase()} from Mantra Sports India. Professional quality, competitive prices.`,
      },
      update: {
        name: category.name,
        sortOrder: category.sortOrder,
      },
    })
  }
  console.log(`✅ ${DEFAULT_CATEGORIES.length} categories created\n`)

  // ── 4. Sample Blog Category ──────────────────────────────────
  await prisma.blogCategory.upsert({
    where: { slug: 'cricket-tips' },
    create: { name: 'Cricket Tips', slug: 'cricket-tips' },
    update: {},
  })

  await prisma.blogCategory.upsert({
    where: { slug: 'product-news' },
    create: { name: 'Product News', slug: 'product-news' },
    update: {},
  })

  console.log('✅ Blog categories seeded\n')
  console.log('🎉 Seed complete! You can now start the development server.')
  console.log('   Admin login: http://localhost:3000/admin/login')
  console.log('   Email:      ', adminEmail)
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
