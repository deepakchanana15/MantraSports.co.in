import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { isCloudinaryConfigured, isValidFolder, listFolders, listImages } from '@/lib/cloudinary'

// GET /api/admin/cloudinary            → { folders }
// GET /api/admin/cloudinary?folder=x   → { images }
export async function GET(req: NextRequest) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  if (!isCloudinaryConfigured()) {
    return NextResponse.json({ error: 'Cloudinary is not configured.' }, { status: 501 })
  }

  const folder = req.nextUrl.searchParams.get('folder')
  if (folder !== null && !isValidFolder(folder)) {
    return NextResponse.json({ error: 'Invalid folder' }, { status: 400 })
  }
  try {
    if (folder) return NextResponse.json({ images: await listImages(folder) })
    return NextResponse.json({ folders: await listFolders() })
  } catch (err) {
    console.error('Cloudinary browse error:', err)
    return NextResponse.json({ error: 'Could not load pictures from Cloudinary.' }, { status: 502 })
  }
}
