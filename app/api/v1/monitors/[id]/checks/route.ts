import { NextRequest } from 'next/server'
import { z } from 'zod'
import { tasks } from '@trigger.dev/sdk/v3'
import { ApiError, apiErrorResponse, apiSuccess, authenticateApiRequest } from '@/lib/api-auth'
import { assertCheckQuota, EntitlementError } from '@/lib/entitlements'
import type { runSingleUrlTask } from '@/trigger/tasks/run-single-url'

export const dynamic = 'force-dynamic'

const idSchema = z.string().uuid()

/**
 * `POST /v1/monitors/:id/checks` — trigger a manual run.
 *
 * Mirrors `lib/actions/run-now.ts#triggerManualRun` exactly: same monthly
 * quota check, same per-hour manual-run ceiling (counted the same way, off
 * `screenshot_snapshots.metadata->>manual_run`), same underlying
 * `run-single-url` task. The dashboard action can't be called directly here
 * (it resolves its workspace from a Supabase session, which a v1 request
 * doesn't have), so the same rules are re-run against the admin client
 * instead of forked.
 */
export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const ctx = await authenticateApiRequest(request, { requireWrite: true })

    const parsedId = idSchema.safeParse(params.id)
    if (!parsedId.success) throw new ApiError(404, 'not_found', 'Monitor not found.')
    const id = parsedId.data

    const { data: monitor, error } = await ctx.admin
      .from('monitored_urls')
      .select('id, is_active, deleted_at')
      .eq('id', id)
      .eq('workspace_id', ctx.workspaceId)
      .is('deleted_at', null)
      .maybeSingle()

    if (error) {
      console.error('[api/v1/monitors/:id/checks] load failed', error.message)
      throw new ApiError(500, 'internal_error', 'Could not load the monitor.')
    }
    if (!monitor) throw new ApiError(404, 'not_found', 'Monitor not found.')
    if (!monitor.is_active) {
      throw new ApiError(409, 'monitor_paused', 'This monitor is paused. Resume it before running a check.')
    }

    assertCheckQuota(ctx.entitlements)

    const limitPerHour = ctx.entitlements.effective.limits.manualRunsPerHour
    const since = new Date(Date.now() - 60 * 60 * 1000).toISOString()

    const { count } = await ctx.admin
      .from('screenshot_snapshots')
      .select('id', { count: 'exact', head: true })
      .eq('workspace_id', ctx.workspaceId)
      .gte('taken_at', since)
      .eq('metadata->>manual_run', 'true')

    if ((count ?? 0) >= limitPerHour) {
      throw new EntitlementError(
        'limit_reached',
        `You have run ${limitPerHour} manual checks in the last hour. Scheduled checks are unaffected — try again shortly.`,
        null
      )
    }

    const handle = await tasks.trigger<typeof runSingleUrlTask>('run-single-url', {
      urlId: id,
      trigger: 'manual',
    })

    return apiSuccess({ run_id: handle.id }, { status: 202, rateLimit: ctx.rateLimit })
  } catch (err) {
    return apiErrorResponse(err)
  }
}
