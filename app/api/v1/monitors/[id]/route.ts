import { NextRequest } from 'next/server'
import { z } from 'zod'
import { ApiError, apiErrorResponse, apiSuccess, authenticateApiRequest } from '@/lib/api-auth'
import { assertFrequencyAllowed, assertZoneCount } from '@/lib/entitlements'

export const dynamic = 'force-dynamic'

// Kept as one string literal (not `+`-built) — see app/api/v1/monitors/route.ts
// for why: postgrest-js needs the literal type to produce a real result shape.
const MONITOR_SELECT =
  'id, workspace_id, url, name, check_frequency, check_hour, threshold_pct, is_active, last_checked_at, watch_description, full_page, mode, zones, consecutive_failures, last_error, last_error_at, last_success_at, created_at, updated_at'

const idSchema = z.string().uuid('id must be a uuid')

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

/** Same updatable-field set as `lib/actions/websites.ts#updateMonitoredUrl` — `url` is intentionally not included there either. */
const updateMonitorSchema = z
  .object({
    name: z.string().min(1).max(200).optional(),
    check_frequency: z.enum(['hourly', 'daily', 'weekly']).optional(),
    check_hour: z.number().int().min(0).max(23).nullable().optional(),
    threshold_pct: z.number().min(0).max(100).optional(),
    watch_description: z.string().max(2000).nullable().optional(),
    full_page: z.boolean().optional(),
    mode: z.enum(['watch', 'archive']).optional(),
    zones: z.array(zoneSchema).nullable().optional(),
    is_active: z.boolean().optional(),
  })
  .refine((body) => Object.keys(body).length > 0, { message: 'Provide at least one field to update.' })

function parseId(raw: string): string {
  const parsed = idSchema.safeParse(raw)
  if (!parsed.success) {
    throw new ApiError(404, 'not_found', 'Monitor not found.')
  }
  return parsed.data
}

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const ctx = await authenticateApiRequest(request)
    const id = parseId(params.id)

    // `.eq('workspace_id', ctx.workspaceId)` is what makes this safe against
    // a caller naming another workspace's monitor id — the admin client has
    // no RLS to fall back on, so a missing filter here would be a
    // cross-tenant read, not a 404.
    const { data, error } = await ctx.admin
      .from('monitored_urls')
      .select(MONITOR_SELECT)
      .eq('id', id)
      .eq('workspace_id', ctx.workspaceId)
      .is('deleted_at', null)
      .maybeSingle()

    if (error) {
      console.error('[api/v1/monitors/:id] get failed', error.message)
      throw new ApiError(500, 'internal_error', 'Could not load the monitor.')
    }
    if (!data) throw new ApiError(404, 'not_found', 'Monitor not found.')

    return apiSuccess(data, { rateLimit: ctx.rateLimit })
  } catch (err) {
    return apiErrorResponse(err)
  }
}

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const ctx = await authenticateApiRequest(request, { requireWrite: true })
    const id = parseId(params.id)

    let body: unknown
    try {
      body = await request.json()
    } catch {
      throw new ApiError(400, 'invalid_json', 'Request body must be valid JSON.')
    }

    const parsed = updateMonitorSchema.safeParse(body)
    if (!parsed.success) {
      throw new ApiError(422, 'validation_error', 'Check the request body and try again.', {
        fields: parsed.error.flatten().fieldErrors as Record<string, string[]>,
      })
    }
    const updates = parsed.data

    if (updates.check_frequency) assertFrequencyAllowed(ctx.entitlements, updates.check_frequency)
    if (updates.zones !== undefined) assertZoneCount(ctx.entitlements, updates.zones?.length ?? 0)

    const { data, error } = await ctx.admin
      .from('monitored_urls')
      .update(updates)
      .eq('id', id)
      .eq('workspace_id', ctx.workspaceId)
      .is('deleted_at', null)
      .select(MONITOR_SELECT)
      .maybeSingle()

    if (error) {
      console.error('[api/v1/monitors/:id] update failed', error.message)
      throw new ApiError(500, 'internal_error', 'Could not update the monitor.')
    }
    if (!data) throw new ApiError(404, 'not_found', 'Monitor not found.')

    return apiSuccess(data, { rateLimit: ctx.rateLimit })
  } catch (err) {
    return apiErrorResponse(err)
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const ctx = await authenticateApiRequest(request, { requireWrite: true })
    const id = parseId(params.id)

    // Soft delete, matching `lib/actions/websites.ts#deleteMonitoredUrl` —
    // history is retained, quota is freed immediately.
    const { data, error } = await ctx.admin
      .from('monitored_urls')
      .update({ deleted_at: new Date().toISOString(), is_active: false })
      .eq('id', id)
      .eq('workspace_id', ctx.workspaceId)
      .is('deleted_at', null)
      .select('id')
      .maybeSingle()

    if (error) {
      console.error('[api/v1/monitors/:id] delete failed', error.message)
      throw new ApiError(500, 'internal_error', 'Could not delete the monitor.')
    }
    if (!data) throw new ApiError(404, 'not_found', 'Monitor not found.')

    return apiSuccess({ id: data.id, deleted: true }, { rateLimit: ctx.rateLimit })
  } catch (err) {
    return apiErrorResponse(err)
  }
}
