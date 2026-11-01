import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { INDIA_FOLDERS, isCloudinaryConfigured, signUpload, type UploadTarget } from '@/lib/cloudinary'

// POST { target: 'products' | 'hero' } → signature for a direct browser upload
export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  if (!isCloudinaryConfigured()) {
    return NextResponse.json({ error: 'Cloudinary is not configured.' }, { status: 501 })
  }

  const body = await req.json().catch(() => ({}))
  const target = body?.target as UploadTarget
  if (typeof target !== 'string' || !Object.hasOwn(INDIA_FOLDERS, target)) {
    return NextResponse.json({ error: 'Invalid upload target' }, { status: 400 })
  }
  return NextResponse.json(signUpload(target))
}
