'use server'

import { revalidatePath } from 'next/cache'
import { createServerClient } from '../supabase/server'
import {
  assertCanAddMonitors,
  assertFrequencyAllowed,
  assertZoneCount,
} from '../entitlements'
import { z } from 'zod'
import { action } from './action'
import { normalizeUrl, deriveMonitorName, UrlValidationError } from '../url'
import type { CheckFrequency, MonitoredUrlMode, Zone } from '../types/database.types'

/**
 * Monitor CRUD.
 *
 * Every mutation here runs through `requireEntitlements()` first. Supabase RLS
 * already guarantees a caller can only touch their own workspace's rows — these
 * checks are about plan limits, which RLS knows nothing about.
 */

export interface UrlInput {
  url: string
  name?: string
  check_frequency?: CheckFrequency
  /** 0–23 UTC. null falls back to elapsed-time scheduling. */
  check_hour?: number | null
  threshold_pct?: number
  /** What the user wants to be alerted about — passed to Claude as context. */
  watch_description?: string | null
  /** Full-page capture vs. visible area only. */
  full_page?: boolean
  mode?: MonitoredUrlMode
  /** Tracked regions. null or empty means whole-page diffing. */
  zones?: Zone[] | null
}

/** Fields a caller may change after creation. */
type MonitorUpdate = Partial<
  Pick<
    UrlInput,
    | 'name'
    | 'check_frequency'
    | 'check_hour'
    | 'threshold_pct'
    | 'watch_description'
    | 'full_page'
    | 'mode'
    | 'zones'
  >
>

// ─── Create ──────────────────────────────────────────────────────────────────

/**
 * Adds one or more monitors.
 *
 * All-or-nothing: if the batch would exceed the plan's monitor ceiling, nothing
 * is inserted. Partial success here would leave the user over quota with no
 * clear way back.
 */
export const addMonitoredUrls = action
  .input(
    z.object({
      urls: z
        .array(
          z.object({
            url: z.string().min(1),
            name: z.string().max(200).optional(),
            check_frequency: z.enum(['hourly', 'daily', 'weekly']).optional(),
            check_hour: z.number().int().min(0).max(23).nullable().optional(),
            threshold_pct: z.number().min(0).max(100).optional(),
            watch_description: z.string().max(2000).nullable().optional(),
            full_page: z.boolean().optional(),
            mode: z.enum(['watch', 'archive']).optional(),
            zones: z.array(z.any()).nullable().optional(),
          })
        )
        .min(1),
    })
  )
  .handler(async ({ input, ctx }) => {
    const { entitlements, workspaceId, supabase } = ctx

    // Normalize first so invalid entries are rejected before they count toward
    // the quota check.
    const candidates = (input.urls as UrlInput[])
      .map((raw) => ({ raw, url: safeNormalize(raw.url) }))
      .filter((c): c is { raw: UrlInput; url: string } => Boolean(c.url))

    if (!candidates.length) {
      throw new Error('None of those look like URLs we can monitor.')
    }

    assertCanAddMonitors(entitlements, candidates.length)

    const rows = candidates.map(({ raw, url }) => {
      const frequency = raw.check_frequency ?? 'daily'
      const zones = raw.zones ?? []

      assertFrequencyAllowed(entitlements, frequency)
      assertZoneCount(entitlements, zones.length)

      return {
        workspace_id: workspaceId,
        url,
        name: raw.name?.trim() || deriveMonitorName(url),
        check_frequency: frequency,
        check_hour: raw.check_hour ?? null,
        threshold_pct: raw.threshold_pct ?? 5,
        is_active: true,
        watch_description: raw.watch_description ?? null,
        full_page: raw.full_page ?? true,
        mode: raw.mode ?? 'watch',
        zones: zones.length ? zones : null,
      }
    })

    const { data, error } = await supabase.from('monitored_urls').insert(rows).select('id')
    if (error) throw new Error(error.message)

    revalidatePath('/dashboard/urls')
    revalidatePath('/dashboard')
    return (data ?? []) as { id: string }[]
  })

// ─── Read ────────────────────────────────────────────────────────────────────

/** Active and paused monitors. Soft-deleted rows are excluded. */
export async function getMonitoredUrls(workspaceId: string) {
  const supabase = await createServerClient()

  const { data, error } = await supabase
    .from('monitored_urls')
    .select(
      `
      *,
      screenshot_snapshots (
        id,
        storage_path,
        taken_at
      )
    `
    )
    .eq('workspace_id', workspaceId)
    .is('deleted_at', null)
    .order('created_at', { ascending: false })

  if (error) throw new Error(error.message)
  return data ?? []
}

export async function getMonitoredUrlById(urlId: string) {
  const supabase = await createServerClient()

  const { data, error } = await supabase
    .from('monitored_urls')
    .select(
      `
      *,
      screenshot_snapshots (
        id,
        storage_path,
        taken_at,
        file_size_bytes,
        extract
      ),
      alerts (
        id,
        diff_pct,
        severity,
        status,
        created_at,
        ai_summary,
        metadata,
        diff_storage_path,
        current_snapshot_id,
        previous_snapshot_id
      )
    `
    )
    .eq('id', urlId)
    .is('deleted_at', null)
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
    .maybeSingle()

  return data ?? null
}

// ─── Update ──────────────────────────────────────────────────────────────────

export const updateMonitoredUrl = action
  .input(
    z.object({
      id: z.string().uuid(),
      name: z.string().min(1).max(200).optional(),
      check_frequency: z.enum(['hourly', 'daily', 'weekly']).optional(),
      check_hour: z.number().int().min(0).max(23).nullable().optional(),
      threshold_pct: z.number().min(0).max(100).optional(),
      watch_description: z.string().max(2000).nullable().optional(),
      full_page: z.boolean().optional(),
      mode: z.enum(['watch', 'archive']).optional(),
      zones: z.array(z.any()).nullable().optional(),
      is_active: z.boolean().optional(),
    })
  )
  .handler(async ({ input, ctx }) => {
    const { id, ...updates } = input

    // Only re-check the limits the caller is actually changing. Someone on a
    // downgraded plan should still be able to rename a monitor whose cadence is
    // now above their tier.
    if (updates.check_frequency) {
      assertFrequencyAllowed(ctx.entitlements, updates.check_frequency)
    }
    if (updates.zones !== undefined) {
      assertZoneCount(ctx.entitlements, updates.zones?.length ?? 0)
    }

    const { error } = await ctx.supabase
      .from('monitored_urls')
      .update(updates)
      .eq('id', id)
      .is('deleted_at', null)

    if (error) throw new Error(error.message)

    revalidatePath('/dashboard/urls')
    revalidatePath(`/dashboard/urls/${id}`)
  })

/** Pauses or resumes capture without affecting history. */
export const pauseMonitoredUrl = action
  .input(z.object({ id: z.string().uuid(), paused: z.boolean() }))
  .handler(async ({ input, ctx }) => {
    const { error } = await ctx.supabase
      .from('monitored_urls')
      .update({ is_active: !input.paused })
      .eq('id', input.id)
      .is('deleted_at', null)

    if (error) throw new Error(error.message)

    revalidatePath('/dashboard/urls')
    revalidatePath(`/dashboard/urls/${input.id}`)
  })

// ─── Delete ──────────────────────────────────────────────────────────────────

/**
 * Soft-deletes a monitor.
 *
 * Hard deletion would cascade through `screenshot_snapshots`, `screenshot_diffs`
 * and `alerts` while leaving the image objects orphaned in storage forever. The
 * retention job reclaims both, on the plan's schedule.
 *
 * Freed quota is immediate: `getMonitoredUrls` and the usage count both filter
 * on `deleted_at`.
 */
export const deleteMonitoredUrl = action
  .input(z.object({ id: z.string().uuid() }))
  .handler(async ({ input, ctx }) => {
    const { error } = await ctx.supabase
      .from('monitored_urls')
      .update({ deleted_at: new Date().toISOString(), is_active: false })
      .eq('id', input.id)
      .is('deleted_at', null)

    if (error) throw new Error(error.message)

    revalidatePath('/dashboard/urls')
    revalidatePath('/dashboard')
  })

/**
 * Restores a soft-deleted monitor, provided the plan still has room. Only
 * possible until the retention job purges the underlying history.
 */
export const restoreMonitoredUrl = action
  .input(z.object({ id: z.string().uuid() }))
  .handler(async ({ input, ctx }) => {
    assertCanAddMonitors(ctx.entitlements, 1)

    const { error } = await ctx.supabase
      .from('monitored_urls')
      .update({ deleted_at: null, is_active: true })
      .eq('id', input.id)

    if (error) throw new Error(error.message)
    revalidatePath('/dashboard/urls')
  })

// ─── Internals ───────────────────────────────────────────────────────────────

/** Returns null for anything that fails validation, so a bad row is skipped. */
function safeNormalize(raw: string): string | null {
  try {
    return normalizeUrl(raw)
  } catch (error) {
    if (error instanceof UrlValidationError) return null
    throw error
  }
}
