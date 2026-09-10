import type { SupabaseClient } from '@supabase/supabase-js'
import { effectivePlan, type Plan, type PlanStatus } from '../../lib/plans'

/**
 * Worker-side entitlement resolution.
 *
 * The Next app resolves entitlements from the caller's session; the capture
 * worker has no session, so it reads the workspace row directly with the
 * service-role client. Both sides share the catalog in `lib/plans.ts`, so a
 * feature can never be on in the UI and off in the worker.
 */

/** Loads the plan whose limits apply to a workspace right now. */
export async function resolveWorkspacePlan(
  supabase: SupabaseClient,
  workspaceId: string
): Promise<Plan> {
  const { data } = await supabase
    .from('workspaces')
    .select('plan, plan_status, trial_ends_at')
    .eq('id', workspaceId)
    .maybeSingle()

  if (!data) return effectivePlan('free')

  return effectivePlan(
    data.plan,
    (data.plan_status ?? 'active') as PlanStatus,
    data.trial_ends_at
  )
}

/**
 * True when the workspace still has metered checks left this period.
 *
 * Checked before capture, not after: going over quota should skip the work,
 * not bill for it and then complain.
 */
export async function hasCheckQuota(
  supabase: SupabaseClient,
  workspaceId: string,
  plan: Plan
): Promise<boolean> {
  const periodStart = new Date()
  const period = new Date(
    Date.UTC(periodStart.getUTCFullYear(), periodStart.getUTCMonth(), 1)
  )
    .toISOString()
    .slice(0, 10)

  const { data } = await supabase
    .from('workspace_usage')
    .select('checks_used')
    .eq('workspace_id', workspaceId)
    .eq('period_start', period)
    .maybeSingle()

  return (data?.checks_used ?? 0) < plan.limits.maxChecksPerMonth
}

/**
 * Records what a capture consumed. Fire-and-forget: a usage write that fails
 * must never fail the capture that already succeeded.
 */
export async function recordUsage(
  supabase: SupabaseClient,
  workspaceId: string,
  usage: { checks?: number; aiCalls?: number; bytes?: number }
): Promise<void> {
  const { error } = await supabase.rpc('record_usage', {
    wsid: workspaceId,
    checks: usage.checks ?? 0,
    ai_calls: usage.aiCalls ?? 0,
    bytes: usage.bytes ?? 0,
  })

  if (error) {
    // Logged by the caller's logger; swallowed here so capture stays green.
    console.warn('[usage] record_usage failed', error.message)
  }
}
