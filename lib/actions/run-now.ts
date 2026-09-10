'use server'

import { tasks } from '@trigger.dev/sdk/v3'
import { createServerClient } from '../supabase/server'
import {
  requireEntitlements,
  assertCheckQuota,
  EntitlementError,
} from '../entitlements'
import type { runSingleUrlTask } from '@/trigger/tasks/run-single-url'

/**
 * Manual "run now".
 *
 * Each press costs a browser launch, a screenshot, storage, and usually a model
 * call — so it is metered against the same monthly quota as scheduled checks and
 * additionally rate-limited per hour. Without the hourly ceiling, holding the
 * button down is a free way to burn the plan's entire allowance in a minute.
 */
export async function triggerManualRun(urlId: string): Promise<{ runId: string }> {
  const entitlements = await requireEntitlements()
  const supabase = await createServerClient()

  // RLS restricts this read to the caller's workspace, so a row coming back at
  // all proves ownership.
  const { data: monitor, error } = await supabase
    .from('monitored_urls')
    .select('id, is_active, deleted_at')
    .eq('id', urlId)
    .eq('workspace_id', entitlements.workspaceId)
    .is('deleted_at', null)
    .maybeSingle()

  if (error) throw new Error(error.message)
  if (!monitor) throw new Error('Monitor not found')
  if (!monitor.is_active) {
    throw new Error('This monitor is paused. Resume it before running a check.')
  }

  assertCheckQuota(entitlements)
  await assertManualRunRateLimit(supabase, entitlements.workspaceId, entitlements.effective.limits.manualRunsPerHour)

  const handle = await tasks.trigger<typeof runSingleUrlTask>('run-single-url', {
    urlId,
    trigger: 'manual',
  })

  return { runId: handle.id }
}

/**
 * Counts manual captures in the trailing hour.
 *
 * Reads from `screenshot_snapshots.metadata.manual_run` rather than a dedicated
 * table — the capture task already stamps it, and a run that never produced a
 * snapshot did not cost us a screenshot either.
 */
async function assertManualRunRateLimit(
  supabase: Awaited<ReturnType<typeof createServerClient>>,
  workspaceId: string,
  limitPerHour: number
): Promise<void> {
  const since = new Date(Date.now() - 60 * 60 * 1000).toISOString()

  const { count } = await supabase
    .from('screenshot_snapshots')
    .select('id', { count: 'exact', head: true })
    .eq('workspace_id', workspaceId)
    .gte('taken_at', since)
    .eq('metadata->>manual_run', 'true')

  if ((count ?? 0) < limitPerHour) return

  throw new EntitlementError(
    'limit_reached',
    `You have run ${limitPerHour} manual checks in the last hour. Scheduled checks are unaffected — try again shortly.`,
    null
  )
}
