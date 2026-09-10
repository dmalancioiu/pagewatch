import { createServerClient } from './supabase/server'
import {
  effectivePlan,
  hasFeature,
  allowsFrequency,
  cheapestPlanWith,
  cheapestPlanWithMonitors,
  FEATURE_LABELS,
  FREQUENCY_LABELS,
  type FeatureKey,
  type Plan,
  type PlanStatus,
} from './plans'
import type { CheckFrequency } from './types/database.types'

/**
 * Entitlements — "what is this workspace allowed to do right now?"
 *
 * The plan catalog in `lib/plans.ts` says what a tier includes. This module
 * joins that against the workspace's live subscription state and current usage,
 * and exposes assertions that server actions call before doing work.
 *
 * Enforcement rule: every limit is checked HERE, on the server, inside the
 * mutation. The UI also reads entitlements to hide and disable things, but that
 * is presentation only — a hidden button is not a limit.
 */

// ─── Shape ───────────────────────────────────────────────────────────────────

export interface UsageSnapshot {
  /** Monitors that are not soft-deleted, active or paused. */
  monitors: number
  /** Monitors currently capturing. */
  activeMonitors: number
  /** Captures consumed in the current billing period. */
  checksThisPeriod: number
  /** Members in the workspace, including the owner. */
  seats: number
}

export interface Entitlements {
  workspaceId: string
  /** The tier the workspace pays for — what the billing page should show. */
  plan: Plan
  /**
   * The tier whose limits actually apply. Differs from `plan` when a
   * subscription is past due, canceled, or a trial has lapsed.
   */
  effective: Plan
  status: PlanStatus
  trialEndsAt: string | null
  usage: UsageSnapshot
  /** Convenience view of the limits that apply, with usage folded in. */
  remaining: {
    monitors: number
    checksThisPeriod: number
    seats: number
  }
}

// ─── Errors ──────────────────────────────────────────────────────────────────

/**
 * Thrown when an action is refused on plan grounds — never on a bug.
 *
 * Carries enough structure for the UI to render a real upgrade prompt instead
 * of a generic toast: what was blocked, and which plan unblocks it.
 */
export class EntitlementError extends Error {
  readonly code: 'limit_reached' | 'feature_locked' | 'frequency_locked'
  readonly upgradeTo: string | null

  constructor(
    code: EntitlementError['code'],
    message: string,
    upgradeTo: Plan | null = null
  ) {
    super(message)
    this.name = 'EntitlementError'
    this.code = code
    this.upgradeTo = upgradeTo?.id ?? null
  }
}

// ─── Resolution ──────────────────────────────────────────────────────────────

/**
 * Loads entitlements for the caller's workspace.
 *
 * Returns null when there is no authenticated user or no workspace yet — the
 * onboarding path. Callers that require a workspace should use
 * `requireEntitlements()` instead of null-checking this every time.
 */
export async function getEntitlements(): Promise<Entitlements | null> {
  const supabase = await createServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return null

  // RLS scopes this to workspaces the caller belongs to, so no extra check.
  const { data: membership } = await supabase
    .from('workspace_members')
    .select('workspace_id, workspaces(id, plan, plan_status, trial_ends_at)')
    .eq('user_id', user.id)
    .limit(1)
    .maybeSingle()

  const workspace = membership?.workspaces as
    | { id: string; plan: string; plan_status: string; trial_ends_at: string | null }
    | undefined

  if (!workspace) return null

  const status = (workspace.plan_status ?? 'active') as PlanStatus
  const plan = effectivePlan(workspace.plan, 'active', null)
  const effective = effectivePlan(workspace.plan, status, workspace.trial_ends_at)

  const usage = await loadUsage(supabase, workspace.id)

  return {
    workspaceId: workspace.id,
    plan,
    effective,
    status,
    trialEndsAt: workspace.trial_ends_at,
    usage,
    remaining: {
      monitors: Math.max(0, effective.limits.maxMonitors - usage.monitors),
      checksThisPeriod: Math.max(
        0,
        effective.limits.maxChecksPerMonth - usage.checksThisPeriod
      ),
      seats: Math.max(0, effective.limits.maxSeats - usage.seats),
    },
  }
}

/** Same as `getEntitlements`, but throws rather than returning null. */
export async function requireEntitlements(): Promise<Entitlements> {
  const entitlements = await getEntitlements()
  if (!entitlements) throw new Error('No workspace found for the current user')
  return entitlements
}

/**
 * Current-period usage for a workspace.
 *
 * Monitor and seat counts are read live (cheap, always exact). Check volume
 * comes from the `workspace_usage` counter the capture task increments —
 * counting snapshot rows instead would silently refund quota every time the
 * retention job deletes history.
 */
async function loadUsage(
  supabase: Awaited<ReturnType<typeof createServerClient>>,
  workspaceId: string
): Promise<UsageSnapshot> {
  const periodStart = startOfBillingPeriod().toISOString().slice(0, 10)

  const [monitors, active, seats, usageRow] = await Promise.all([
    supabase
      .from('monitored_urls')
      .select('id', { count: 'exact', head: true })
      .eq('workspace_id', workspaceId)
      .is('deleted_at', null),
    supabase
      .from('monitored_urls')
      .select('id', { count: 'exact', head: true })
      .eq('workspace_id', workspaceId)
      .is('deleted_at', null)
      .eq('is_active', true),
    supabase
      .from('workspace_members')
      .select('id', { count: 'exact', head: true })
      .eq('workspace_id', workspaceId),
    supabase
      .from('workspace_usage')
      .select('checks_used')
      .eq('workspace_id', workspaceId)
      .eq('period_start', periodStart)
      .maybeSingle(),
  ])

  return {
    monitors: monitors.count ?? 0,
    activeMonitors: active.count ?? 0,
    seats: seats.count ?? 0,
    checksThisPeriod: usageRow.data?.checks_used ?? 0,
  }
}

/**
 * Start of the current usage period. Calendar month for now — when Stripe
 * anchors periods to a signup date, read `workspaces.current_period_end`
 * instead and keep this the single place that decides.
 */
export function startOfBillingPeriod(now: Date = new Date()): Date {
  return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1))
}

// ─── Assertions ──────────────────────────────────────────────────────────────
//
// Each throws EntitlementError with an upgrade target, or returns cleanly.
// Server actions call these before mutating.

/** Refuses when adding `count` more monitors would exceed the plan ceiling. */
export function assertCanAddMonitors(entitlements: Entitlements, count = 1): void {
  const { effective, usage } = entitlements
  const limit = effective.limits.maxMonitors
  const after = usage.monitors + count

  if (after <= limit) return

  const upgrade = cheapestPlanWithMonitors(after)
  const noun = limit === 1 ? 'monitor' : 'monitors'

  throw new EntitlementError(
    'limit_reached',
    `${effective.name} includes ${limit} ${noun} and you are using ${usage.monitors}.` +
      (upgrade ? ` ${upgrade.name} raises this to ${upgrade.limits.maxMonitors}.` : ''),
    upgrade
  )
}

/** Refuses a capture cadence the plan does not include. */
export function assertFrequencyAllowed(
  entitlements: Entitlements,
  frequency: CheckFrequency
): void {
  const { effective } = entitlements
  if (allowsFrequency(effective, frequency)) return

  const upgrade =
    ['pro', 'business', 'agency']
      .map((id) => effectivePlan(id))
      .find((plan) => allowsFrequency(plan, frequency)) ?? null

  throw new EntitlementError(
    'frequency_locked',
    `${FREQUENCY_LABELS[frequency]} checks are not included in ${effective.name}.` +
      (upgrade ? ` Available on ${upgrade.name}.` : ''),
    upgrade
  )
}

/** Refuses a gated feature. */
export function assertFeature(entitlements: Entitlements, feature: FeatureKey): void {
  const { effective } = entitlements
  if (hasFeature(effective, feature)) return

  const upgrade = cheapestPlanWith(feature)

  throw new EntitlementError(
    'feature_locked',
    `${FEATURE_LABELS[feature]} is not included in ${effective.name}.` +
      (upgrade ? ` Available on ${upgrade.name}.` : ''),
    upgrade
  )
}

/** Refuses more tracking zones than the plan allows on a single monitor. */
export function assertZoneCount(entitlements: Entitlements, zoneCount: number): void {
  if (zoneCount === 0) return

  assertFeature(entitlements, 'zones')

  const max = entitlements.effective.limits.maxZonesPerMonitor
  if (zoneCount <= max) return

  throw new EntitlementError(
    'limit_reached',
    `${entitlements.effective.name} allows ${max} tracking zones per monitor.`,
    null
  )
}

/** Refuses new captures once the period's metered ceiling is spent. */
export function assertCheckQuota(entitlements: Entitlements): void {
  if (entitlements.remaining.checksThisPeriod > 0) return

  throw new EntitlementError(
    'limit_reached',
    `You have used all ${entitlements.effective.limits.maxChecksPerMonth.toLocaleString()} ` +
      `checks included in ${entitlements.effective.name} this month.`,
    cheapestPlanWithMonitors(entitlements.usage.monitors + 1)
  )
}

/**
 * Client-safe projection of entitlements.
 *
 * Server components pass this to client components instead of the full object —
 * it carries no Supabase handles and nothing the browser shouldn't see.
 */
export interface ClientEntitlements {
  planId: string
  planName: string
  effectivePlanId: string
  status: PlanStatus
  features: Plan['features']
  limits: Plan['limits']
  usage: UsageSnapshot
  remaining: Entitlements['remaining']
}

export function toClientEntitlements(entitlements: Entitlements): ClientEntitlements {
  return {
    planId: entitlements.plan.id,
    planName: entitlements.plan.name,
    effectivePlanId: entitlements.effective.id,
    status: entitlements.status,
    features: entitlements.effective.features,
    limits: entitlements.effective.limits,
    usage: entitlements.usage,
    remaining: entitlements.remaining,
  }
}
