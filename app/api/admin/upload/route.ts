import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { v2 as cloudinary } from 'cloudinary'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import { existsSync } from 'fs'

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
const MAX_SIZE = 10 * 1024 * 1024 // 10 MB

const hasCloudinary =
  !!process.env.CLOUDINARY_CLOUD_NAME &&
  !!process.env.CLOUDINARY_API_KEY &&
  !!process.env.CLOUDINARY_API_SECRET

if (hasCloudinary) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  })
}

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  if (!hasCloudinary && !!process.env.VERCEL) {
    return NextResponse.json(
      { error: 'Image uploads are not configured. Please add Cloudinary credentials in Vercel environment variables.' },
      { status: 501 }
    )
  }

  let formData: FormData
  try {
    formData = await req.formData()
  } catch {
    return NextResponse.json({ error: 'Invalid form data' }, { status: 400 })
  }

  const file = formData.get('file') as File | null
  if (!file || file.size === 0) {
    return NextResponse.json({ error: 'No file provided' }, { status: 400 })
  }

  if (!ALLOWED_TYPES.includes(file.type)) {
    return NextResponse.json(
      { error: 'Invalid file type. Only JPG, PNG, WebP, and GIF are allowed.' },
      { status: 400 }
    )
  }

  if (file.size > MAX_SIZE) {
    return NextResponse.json(
      { error: 'File too large. Maximum size is 10 MB.' },
      { status: 400 }
    )
  }

  const bytes = await file.arrayBuffer()
  const buffer = Buffer.from(bytes)

  // ── Cloudinary upload ────────────────────────────────────────────────────────
  if (hasCloudinary) {
    try {
      const result = await new Promise<{ secure_url: string; public_id: string }>(
        (resolve, reject) => {
          cloudinary.uploader
            .upload_stream(
              { folder: 'mantrasports/products', resource_type: 'image' },
              (error, result) => {
                if (error || !result) reject(error ?? new Error('Upload failed'))
                else resolve(result as { secure_url: string; public_id: string })
              }
            )
            .end(buffer)
        }
      )
      return NextResponse.json({ url: result.secure_url, filename: result.public_id })
    } catch (err) {
      console.error('Cloudinary upload error:', err)
      return NextResponse.json({ error: 'Image upload failed. Please try again.' }, { status: 500 })
    }
  }

  // ── Local disk fallback (development only) ───────────────────────────────────
  const ext = file.name.split('.').pop()?.toLowerCase() ?? 'jpg'
  const filename = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`
  const uploadDir = join(process.cwd(), 'public', 'uploads', 'products')

  if (!existsSync(uploadDir)) {
    await mkdir(uploadDir, { recursive: true })
  }

  await writeFile(join(uploadDir, filename), buffer)
  return NextResponse.json({ url: `/uploads/products/${filename}`, filename })
}
