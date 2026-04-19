'use server'
import { createServerClient } from '../supabase/server'
import { revalidatePath } from 'next/cache'
import type { CheckFrequency, MonitoredUrlMode, Zone } from '../types/database.types'

export interface UrlInput {
  url:               string
  name?:             string
  check_frequency?:  CheckFrequency
  check_hour?:       number | null   // 0–23 UTC; null = elapsed-time logic
  threshold_pct?:    number
  watch_description?: string | null   // what to alert on (Claude context)
  full_page?:        boolean          // full-page vs visible-area screenshot
  mode?:             MonitoredUrlMode // 'watch' | 'archive'
  zones?:            Zone[] | null    // tracked regions; null = whole page
}

function normalizeUrl(raw: string): string {
  const trimmed = raw.trim()
  if (!trimmed) return ''
  // Ensure it has a protocol so new URL() works
  if (!/^https?:\/\//i.test(trimmed)) return `https://${trimmed}`
  return trimmed
}

function deriveName(url: string): string {
  try {
    const { hostname, pathname } = new URL(url)
    const path = pathname.replace(/\/$/, '')
    return path ? `${hostname}${path}` : hostname
  } catch {
    return url
  }
}

export async function addMonitoredUrls(
  workspaceId: string,
  urls: UrlInput[]
): Promise<{ id: string }[]> {
  const supabase = await createServerClient()

  const rows = urls
    .map((u) => {
      const normalized = normalizeUrl(u.url)
      if (!normalized) return null
      return {
        workspace_id:      workspaceId,
        url:               normalized,
        name:              u.name?.trim() || deriveName(normalized),
        check_frequency:   u.check_frequency ?? 'daily',
        check_hour:        u.check_hour ?? null,
        threshold_pct:     u.threshold_pct ?? 5,
        is_active:         true,
        watch_description: u.watch_description ?? null,
        full_page:         u.full_page ?? true,
        mode:              u.mode ?? 'watch',
      }
    })
    .filter(Boolean)

  if (!rows.length) return []

  const { data, error } = await supabase
    .from('monitored_urls')
    .insert(rows)
    .select('id')
  if (error) throw new Error(error.message)
  revalidatePath('/dashboard/urls')
  return data ?? []
}

export async function getMonitoredUrls(workspaceId: string) {
  const supabase = await createServerClient()
  const { data, error } = await supabase
    .from('monitored_urls')
    .select(`
      *,
      screenshot_snapshots (
        id,
        storage_path,
        taken_at
      )
    `)
    .eq('workspace_id', workspaceId)
    .is('deleted_at', null)           // hide deleted; paused urls (is_active=false) still show
    .order('created_at', { ascending: false })
  if (error) throw new Error(error.message)
  return data ?? []
}

export async function getMonitoredUrlById(urlId: string) {
  const supabase = await createServerClient()
  const { data, error } = await supabase
    .from('monitored_urls')
    .select(`
      *,
      screenshot_snapshots (
        id,
        storage_path,
        taken_at,
        file_size_bytes
      ),
      alerts (
        id,
        diff_pct,
        severity,
        status,
        created_at,
        diff_storage_path,
        current_snapshot_id,
        previous_snapshot_id
      )
    `)
    .eq('id', urlId)
    .single()
  if (error) throw new Error(error.message)
  return data
}

export async function getLatestSnapshot(monitoredUrlId: string) {
  const supabase = await createServerClient()
  const { data } = await supabase
    .from('screenshot_snapshots')
    .select('*')
    .eq('monitored_url_id', monitoredUrlId)
    .order('taken_at', { ascending: false })
    .limit(1)
    .single()
  return data ?? null
}

export async function pauseMonitoredUrl(urlId: string, paused: boolean) {
  const supabase = await createServerClient()
  const { error } = await supabase
    .from('monitored_urls')
    .update({ is_active: !paused })
    .eq('id', urlId)
  if (error) throw new Error(error.message)
  revalidatePath('/dashboard/urls')
  revalidatePath(`/dashboard/urls/${urlId}`)
}

export async function deleteMonitoredUrl(urlId: string) {
  const supabase = await createServerClient()
  const { error } = await supabase
    .from('monitored_urls')
    .delete()
    .eq('id', urlId)
  if (error) throw new Error(error.message)
  revalidatePath('/dashboard/urls')
}

export async function updateMonitoredUrl(
  urlId: string,
  updates: Partial<Pick<UrlInput, 'name' | 'check_frequency' | 'check_hour' | 'threshold_pct' | 'watch_description' | 'full_page' | 'mode' | 'zones'>>
) {
  const supabase = await createServerClient()
  const { error } = await supabase
    .from('monitored_urls')
    .update(updates)
    .eq('id', urlId)
  if (error) throw new Error(error.message)
  revalidatePath('/dashboard/urls')
  revalidatePath(`/dashboard/urls/${urlId}`)
}
