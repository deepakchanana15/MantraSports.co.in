import 'server-only'
import { v2 as cloudinary } from 'cloudinary'

// The Cloudinary account is shared with the NL and CA sites. India uploads
// always go into their own folders so the sites' pictures never mix.
export const INDIA_FOLDERS = {
  products: 'mantrasports-in/products',
  hero: 'mantrasports-in/hero',
} as const

export type UploadTarget = keyof typeof INDIA_FOLDERS

// Folders hidden from the picker (Cloudinary's demo images)
const HIDDEN_FOLDERS = ['samples']

export function isCloudinaryConfigured(): boolean {
  return (
    !!process.env.CLOUDINARY_CLOUD_NAME &&
    !!process.env.CLOUDINARY_API_KEY &&
    !!process.env.CLOUDINARY_API_SECRET
  )
}

function client() {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
  })
  return cloudinary
}

/** Signature for a direct browser → Cloudinary upload into an India folder. */
export function signUpload(target: UploadTarget) {
  const c = client()
  const timestamp = Math.round(Date.now() / 1000)
  const assetFolder = INDIA_FOLDERS[target]
  const signature = c.utils.api_sign_request(
    { asset_folder: assetFolder, timestamp },
    process.env.CLOUDINARY_API_SECRET!,
  )
  return {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME!,
    apiKey: process.env.CLOUDINARY_API_KEY!,
    timestamp,
    signature,
    assetFolder,
  }
}

/** All folders that can hold pictures, India's first. */
export async function listFolders(): Promise<string[]> {
  const c = client()
  const { folders: roots } = await c.api.root_folders()
  const paths: string[] = []
  for (const root of roots as { path: string }[]) {
    if (HIDDEN_FOLDERS.includes(root.path)) continue
    const { folders: subs } = await c.api.sub_folders(root.path)
    // Parent folders (e.g. "mantrasports") only group their subfolders
    if (subs.length === 0) paths.push(root.path)
    for (const sub of subs as { path: string }[]) paths.push(sub.path)
  }
  const india = Object.values(INDIA_FOLDERS) as string[]
  return [...india, ...paths.filter((p) => !india.includes(p) && !india.some((i) => i.startsWith(p + '/')))]
}

export type CloudinaryImage = {
  url: string
  thumbUrl: string
  name: string
  width: number
  height: number
}

const FOLDER_RE = /^[\w\- ./]+$/

export function isValidFolder(folder: string): boolean {
  return FOLDER_RE.test(folder)
}

/** Images directly inside one folder, newest first. */
export async function listImages(folder: string): Promise<CloudinaryImage[]> {
  if (!isValidFolder(folder)) throw new Error('Invalid folder')
  const c = client()
  const res = await c.search
    .expression(`asset_folder="${folder}" AND resource_type:image`)
    .sort_by('created_at', 'desc')
    .max_results(500)
    .execute()

  type Resource = { public_id: string; secure_url: string; display_name?: string; width: number; height: number; version: number }
  return (res.resources as Resource[]).map((r) => ({
    url: r.secure_url,
    thumbUrl: c.url(r.public_id, {
      version: r.version,
      transformation: [{ width: 240, height: 240, crop: 'fit' }, { fetch_format: 'auto', quality: 'auto' }],
    }),
    name: r.display_name || r.public_id.split('/').pop() || r.public_id,
    width: r.width,
    height: r.height,
  }))
}
