import { createServerClient } from './server'

const BUCKET = 'screenshots'
const SIGNED_URL_TTL = 3600 // 1 hour

/**
 * Batch-generates signed URLs for private Supabase Storage paths.
 * Returns a Map of storage_path → signed URL.
 * Deduplicates paths and silently ignores failures.
 */
export async function getSignedUrls(
  paths: (string | null | undefined)[]
): Promise<Map<string, string>> {
  const validPaths = [...new Set(paths.filter((p): p is string => Boolean(p)))]
  if (!validPaths.length) return new Map()

  const supabase = await createServerClient()
  const { data, error } = await supabase.storage
    .from(BUCKET)
    .createSignedUrls(validPaths, SIGNED_URL_TTL)

  if (error || !data) return new Map()

  const map = new Map<string, string>()
  for (const item of data) {
    if (item.signedUrl && item.path) map.set(item.path, item.signedUrl)
  }
  return map
}
