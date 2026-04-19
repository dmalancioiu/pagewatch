'use server'
import { createServerClient } from '../supabase/server'

/**
 * Returns the storage path of the most recent snapshot for a URL,
 * or null if none exists yet. Used to poll for the first screenshot
 * after a URL is created.
 */
export async function pollFirstSnapshot(
  urlId: string
): Promise<{ storagePath: string } | null> {
  const supabase = await createServerClient()
  const { data } = await supabase
    .from('screenshot_snapshots')
    .select('storage_path')
    .eq('monitored_url_id', urlId)
    .order('taken_at', { ascending: false })
    .limit(1)
    .single()

  return data ? { storagePath: data.storage_path } : null
}

/**
 * Returns a short-lived signed URL for a screenshot storage path.
 * Used to display the first screenshot in the baseline confirmation modal.
 */
export async function getSignedScreenshotUrl(
  storagePath: string
): Promise<string | null> {
  const supabase = await createServerClient()
  const { data, error } = await supabase.storage
    .from('screenshots')
    .createSignedUrl(storagePath, 300) // 5-minute TTL

  if (error || !data?.signedUrl) return null
  return data.signedUrl
}
