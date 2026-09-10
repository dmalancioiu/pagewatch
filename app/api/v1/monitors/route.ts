import { NextRequest } from 'next/server'
import { z } from 'zod'
import {
  ApiError,
  apiErrorResponse,
  apiList,
  apiSuccess,
  authenticateApiRequest,
  encodeCursor,
  parsePagination,
} from '@/lib/api-auth'
import { assertCanAddMonitors, assertFrequencyAllowed, assertZoneCount } from '@/lib/entitlements'
import { deriveMonitorName, normalizeUrl, UrlValidationError } from '@/lib/url'

export const dynamic = 'force-dynamic'

/**
 * `GET /v1/monitors` — list, `POST /v1/monitors` — create.
 *
 * Creation deliberately reuses the exact same building blocks
 * `lib/actions/websites.ts#addMonitoredUrls` uses — `normalizeUrl` (the SSRF
 * guard included) and the `assertCanAddMonitors` / `assertFrequencyAllowed` /
 * `assertZoneCount` entitlement gates from `lib/entitlements.ts` — rather than
 * re-deriving any of those rules here. A URL the dashboard's SSRF guard
 * rejects is rejected here too, because it is the same function.
 */

// Never select `*` here: this is the one place a v1 caller's shape is fixed,
// and it must never accidentally grow to include a future internal-only
// column just because the table did.
// A single string literal (not built with `+`) so TypeScript keeps its exact
// literal type — postgrest-js parses the select list from that literal type
// to produce a real result shape; a widened `string` degrades to an opaque
// `GenericStringError` type instead (see the vendored parser's `ParseQuery`).
const MONITOR_SELECT =
  'id, workspace_id, url, name, check_frequency, check_hour, threshold_pct, is_active, last_checked_at, watch_description, full_page, mode, zones, consecutive_failures, last_error, last_error_at, last_success_at, created_at, updated_at'

const zoneSchema = z.object({
  id: z.string(),
  x: z.number().min(0).max(1),
  y: z.number().min(0).max(1),
  width: z.number().min(0).max(1),
  height: z.number().min(0).max(1),
  label: z.string().optional(),
  instruction: z.string().optional(),
  sensitivity: z.enum(['low', 'normal', 'high']).optional(),
})

const createMonitorSchema = z.object({
  url: z.string().min(1, 'url is required'),
  name: z.string().max(200).optional(),
  check_frequency: z.enum(['hourly', 'daily', 'weekly']).optional(),
  check_hour: z.number().int().min(0).max(23).nullable().optional(),
  threshold_pct: z.number().min(0).max(100).optional(),
  watch_description: z.string().max(2000).nullable().optional(),
  full_page: z.boolean().optional(),
  mode: z.enum(['watch', 'archive']).optional(),
  zones: z.array(zoneSchema).nullable().optional(),
})

export async function GET(request: NextRequest) {
  try {
    const ctx = await authenticateApiRequest(request)
    const { limit, cursor } = parsePagination(request.nextUrl.searchParams)

    const isActiveParam = request.nextUrl.searchParams.get('is_active')
    const modeParam = request.nextUrl.searchParams.get('mode')

    let query = ctx.admin
      .from('monitored_urls')
      .select(MONITOR_SELECT)
      // `workspaceId` came only from the authenticated key, never from the
      // request — see lib/api-auth.ts. This filter is what actually scopes
      // the query; the admin client itself enforces nothing.
      .eq('workspace_id', ctx.workspaceId)
      .is('deleted_at', null)
      .order('created_at', { ascending: false })
      .order('id', { ascending: false })
      .limit(limit + 1)

    if (isActiveParam === 'true') query = query.eq('is_active', true)
    if (isActiveParam === 'false') query = query.eq('is_active', false)
    if (modeParam === 'watch' || modeParam === 'archive') query = query.eq('mode', modeParam)

    if (cursor) {
      query = query.or(
        `created_at.lt.${cursor.createdAt},and(created_at.eq.${cursor.createdAt},id.lt.${cursor.id})`
      )
    }

    const { data, error } = await query
    if (error) {
      console.error('[api/v1/monitors] list failed', error.message)
      throw new ApiError(500, 'internal_error', 'Could not list monitors.')
    }

    const rows = data ?? []
    const page = rows.slice(0, limit)
    const nextCursor =
      rows.length > limit ? encodeCursor(page[page.length - 1] as { created_at: string; id: string }) : null

    return apiList(page, nextCursor, { rateLimit: ctx.rateLimit })
  } catch (err) {
    return apiErrorResponse(err)
  }
}

export async function POST(request: NextRequest) {
  try {
    const ctx = await authenticateApiRequest(request, { requireWrite: true })

    let body: unknown
    try {
      body = await request.json()
    } catch {
      throw new ApiError(400, 'invalid_json', 'Request body must be valid JSON.')
    }

    const parsed = createMonitorSchema.safeParse(body)
    if (!parsed.success) {
      throw new ApiError(422, 'validation_error', 'Check the request body and try again.', {
        fields: parsed.error.flatten().fieldErrors as Record<string, string[]>,
      })
    }
    const input = parsed.data

    let url: string
    try {
      url = normalizeUrl(input.url)
    } catch (err) {
      if (err instanceof UrlValidationError) {
        throw new ApiError(422, `url_${err.reason}`, err.message, { fields: { url: [err.message] } })
      }
      throw err
    }

    const frequency = input.check_frequency ?? 'daily'
    const zones = input.zones ?? []

    // Same assertions `lib/actions/websites.ts#addMonitoredUrls` runs before
    // inserting — see this route's file header.
    assertCanAddMonitors(ctx.entitlements, 1)
    assertFrequencyAllowed(ctx.entitlements, frequency)
    assertZoneCount(ctx.entitlements, zones.length)

    const { data, error } = await ctx.admin
      .from('monitored_urls')
      .insert({
        workspace_id: ctx.workspaceId,
        url,
        name: input.name?.trim() || deriveMonitorName(url),
        check_frequency: frequency,
        check_hour: input.check_hour ?? null,
        threshold_pct: input.threshold_pct ?? 5,
        is_active: true,
        watch_description: input.watch_description ?? null,
        full_page: input.full_page ?? true,
        mode: input.mode ?? 'watch',
        zones: zones.length ? zones : null,
      })
      .select(MONITOR_SELECT)
      .single()

    if (error) {
      console.error('[api/v1/monitors] insert failed', error.message)
      throw new ApiError(500, 'internal_error', 'Could not create the monitor.')
    }

    return apiSuccess(data, { status: 201, rateLimit: ctx.rateLimit })
  } catch (err) {
    return apiErrorResponse(err)
  }
}
