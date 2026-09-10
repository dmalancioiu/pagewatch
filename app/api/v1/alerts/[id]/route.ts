import { NextRequest } from 'next/server'
import { z } from 'zod'
import { ApiError, apiErrorResponse, apiSuccess, authenticateApiRequest } from '@/lib/api-auth'

export const dynamic = 'force-dynamic'

// One string literal, not `+`-built — see app/api/v1/monitors/route.ts for why.
const ALERT_SELECT =
  'id, workspace_id, monitored_url_id, alert_type, severity, status, title, summary, ai_summary, diff_pct, current_snapshot_id, previous_snapshot_id, triggered_at, created_at, monitored_urls(id, url, name)'

const idSchema = z.string().uuid()

const patchSchema = z.object({
  status: z.enum(['acknowledged', 'dismissed'], {
    errorMap: () => ({ message: 'status must be "acknowledged" or "dismissed"' }),
  }),
})

function parseId(raw: string): string {
  const parsed = idSchema.safeParse(raw)
  if (!parsed.success) throw new ApiError(404, 'not_found', 'Alert not found.')
  return parsed.data
}

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const ctx = await authenticateApiRequest(request)
    const id = parseId(params.id)

    const { data, error } = await ctx.admin
      .from('alerts')
      .select(ALERT_SELECT)
      .eq('id', id)
      .eq('workspace_id', ctx.workspaceId)
      .maybeSingle()

    if (error) {
      console.error('[api/v1/alerts/:id] get failed', error.message)
      throw new ApiError(500, 'internal_error', 'Could not load the alert.')
    }
    if (!data) throw new ApiError(404, 'not_found', 'Alert not found.')

    return apiSuccess(data, { rateLimit: ctx.rateLimit })
  } catch (err) {
    return apiErrorResponse(err)
  }
}

/**
 * `PATCH /v1/alerts/:id` — set `status` to `acknowledged` or `dismissed`.
 * Mirrors `lib/actions/alerts.ts#acknowledgeAlert` / `dismissAlert` exactly;
 * `open` is not a settable target — nothing in the product reopens an alert.
 */
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

    const parsed = patchSchema.safeParse(body)
    if (!parsed.success) {
      throw new ApiError(422, 'validation_error', 'Check the request body and try again.', {
        fields: parsed.error.flatten().fieldErrors as Record<string, string[]>,
      })
    }

    const { data, error } = await ctx.admin
      .from('alerts')
      .update({ status: parsed.data.status })
      .eq('id', id)
      .eq('workspace_id', ctx.workspaceId)
      .select(ALERT_SELECT)
      .maybeSingle()

    if (error) {
      console.error('[api/v1/alerts/:id] update failed', error.message)
      throw new ApiError(500, 'internal_error', 'Could not update the alert.')
    }
    if (!data) throw new ApiError(404, 'not_found', 'Alert not found.')

    return apiSuccess(data, { rateLimit: ctx.rateLimit })
  } catch (err) {
    return apiErrorResponse(err)
  }
}
