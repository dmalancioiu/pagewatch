import { NextRequest } from 'next/server'
import { ApiError, apiErrorResponse, apiList, authenticateApiRequest, encodeCursor, parsePagination } from '@/lib/api-auth'

export const dynamic = 'force-dynamic'

// One string literal, not `+`-built — see app/api/v1/monitors/route.ts for why.
const ALERT_SELECT =
  'id, workspace_id, monitored_url_id, alert_type, severity, status, title, summary, ai_summary, diff_pct, current_snapshot_id, previous_snapshot_id, triggered_at, created_at, monitored_urls(id, url, name)'

const VALID_STATUS = new Set(['open', 'acknowledged', 'dismissed'])
const VALID_SEVERITY = new Set(['low', 'medium', 'high', 'critical'])
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

/**
 * `GET /v1/alerts?status=&severity=&monitored_url_id=&limit=&cursor=`
 *
 * Filters mirror `lib/actions/alerts.ts#getAlerts` plus `severity` and
 * `monitored_url_id`, which the dashboard doesn't need (it always scopes to
 * one monitor's own page or the whole workspace) but a webhook-less
 * integration polling this endpoint does.
 */
export async function GET(request: NextRequest) {
  try {
    const ctx = await authenticateApiRequest(request)
    const { limit, cursor } = parsePagination(request.nextUrl.searchParams)
    const params = request.nextUrl.searchParams

    const status = params.get('status')
    const severity = params.get('severity')
    const monitoredUrlId = params.get('monitored_url_id')

    if (status !== null && !VALID_STATUS.has(status)) {
      throw new ApiError(400, 'invalid_filter', 'status must be one of open, acknowledged, dismissed.', {
        fields: { status: ['must be one of open, acknowledged, dismissed'] },
      })
    }
    if (severity !== null && !VALID_SEVERITY.has(severity)) {
      throw new ApiError(400, 'invalid_filter', 'severity must be one of low, medium, high, critical.', {
        fields: { severity: ['must be one of low, medium, high, critical'] },
      })
    }
    if (monitoredUrlId !== null && !UUID_RE.test(monitoredUrlId)) {
      throw new ApiError(400, 'invalid_filter', 'monitored_url_id must be a uuid.', {
        fields: { monitored_url_id: ['must be a uuid'] },
      })
    }

    let query = ctx.admin
      .from('alerts')
      .select(ALERT_SELECT)
      // Scoped to the key's workspace only — never a value from the request.
      .eq('workspace_id', ctx.workspaceId)
      .order('created_at', { ascending: false })
      .order('id', { ascending: false })
      .limit(limit + 1)

    if (status) query = query.eq('status', status)
    if (severity) query = query.eq('severity', severity)
    if (monitoredUrlId) query = query.eq('monitored_url_id', monitoredUrlId)
    if (cursor) {
      query = query.or(
        `created_at.lt.${cursor.createdAt},and(created_at.eq.${cursor.createdAt},id.lt.${cursor.id})`
      )
    }

    const { data, error } = await query
    if (error) {
      console.error('[api/v1/alerts] list failed', error.message)
      throw new ApiError(500, 'internal_error', 'Could not list alerts.')
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
