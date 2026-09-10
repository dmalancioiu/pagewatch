"use server"

import { z } from 'zod'
import { tasks } from '@trigger.dev/sdk/v3'
import { action } from './action'
import { assertCheckQuota, EntitlementError } from '../entitlements'
import type { runSingleUrlTask } from '@/trigger/tasks/run-single-url'

/**
 * Manual "run now".
 *
 * Each press costs a browser launch, a capture, storage, and usually a model
 * call - so it is metered against the same monthly quota as scheduled checks
 * and additionally rate-limited per hour. Without the hourly ceiling, holding
 * the button down is a free way to burn a plan's entire allowance in a minute.
 */
export const triggerManualRun = action
  .input(z.object({ id: z.string().uuid() }))
  .handler(async ({ input, ctx }) => {
    const { supabase, entitlements, workspaceId } = ctx

    // RLS restricts this read to the caller's workspace, so a row coming back
    // at all proves ownership.
    const { data: monitor, error } = await supabase
      .from('monitored_urls')
      .select('id, is_active, deleted_at')
      .eq('id', input.id)
      .eq('workspace_id', workspaceId)
      .is('deleted_at', null)
      .maybeSingle()

    if (error) throw new Error(error.message)
    if (!monitor) throw new Error('Monitor not found')
    if (!monitor.is_active) {
      throw new Error('This monitor is paused. Resume it before running a check.')
    }

    assertCheckQuota(entitlements)

    const limitPerHour = entitlements.effective.limits.manualRunsPerHour
    const since = new Date(Date.now() - 60 * 60 * 1000).toISOString()

    // Counted from snapshots the capture task already stamps as manual rather
    // than a dedicated table: a run that never produced a capture did not cost
    // us one either.
    const { count } = await supabase
      .from('screenshot_snapshots')
      .select('id', { count: 'exact', head: true })
      .eq('workspace_id', workspaceId)
      .gte('taken_at', since)
      .eq('metadata->>manual_run', 'true')

    if ((count ?? 0) >= limitPerHour) {
      throw new EntitlementError(
        'limit_reached',
        `You have run ${limitPerHour} manual checks in the last hour. Scheduled checks are unaffected - try again shortly.`,
        null
      )
    }

    const handle = await tasks.trigger<typeof runSingleUrlTask>('run-single-url', {
      urlId: input.id,
      trigger: 'manual',
    })

    return { runId: handle.id }
  })
