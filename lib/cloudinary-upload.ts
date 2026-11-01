// Browser helper: uploads straight to Cloudinary (bypasses Vercel's 4.5 MB
// request limit) using a signature from the server, into an India folder.
export async function uploadToCloudinary(file: File, target: 'products' | 'hero'): Promise<string> {
  const signRes = await fetch('/api/admin/cloudinary/sign', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ target }),
  })
  const sign = await signRes.json()
  if (!signRes.ok) throw new Error(sign.error ?? 'Cloudinary is not configured.')

  const fd = new FormData()
  fd.append('file', file)
  fd.append('api_key', sign.apiKey)
  fd.append('timestamp', String(sign.timestamp))
  fd.append('signature', sign.signature)
  fd.append('asset_folder', sign.assetFolder)

  const res = await fetch(`https://api.cloudinary.com/v1_1/${sign.cloudName}/image/upload`, {
    method: 'POST',
    body: fd,
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.error?.message ?? 'Upload failed')
  return data.secure_url as string
}
