import { NextResponse } from 'next/server'
import type { SupabaseClient } from '@supabase/supabase-js'
import { createAdminClient } from './supabase/admin'
import {
  hashApiKey,
  isApiKeyScope,
  looksLikeApiKey,
  scopeAllowsWrite,
  timingSafeEqualHex,
  type ApiKeyScope,
} from './api-keys'
import { cheapestPlanWith, effectivePlan, hasFeature, type Plan, type PlanStatus } from './plans'
import { EntitlementError, type Entitlements, type UsageSnapshot } from './entitlements'

/**
 * Request authentication and rate limiting for `app/api/v1/**`.
 *
 * This is the first surface in the app authenticated by something other than
 * a Supabase session cookie, so the rule throughout is: resolve the workspace
 * from the key, from nothing else, and never trust RLS to catch a mistake —
 * every v1 route uses `createAdminClient()` (service role), which bypasses
 * RLS entirely. `authenticateApiRequest` is the ONLY place a v1 route may
 * derive a `workspace_id` from; every query a route handler makes after that
 * must filter by the `workspaceId` this function returns, explicitly, even
 * though the admin client would happily return rows from any workspace if a
 * route forgot to.
 */

// ─── Errors & envelopes ──────────────────────────────────────────────────────

export interface ApiErrorBody {
  error: {
    code: string
    message: string
    fields?: Record<string, string[]>
  }
}

/** A refusal with a real HTTP status, safe to serialize straight to the client. */
export class ApiError extends Error {
  readonly status: number
  readonly code: string
  readonly extraHeaders?: Record<string, string>
  readonly fields?: Record<string, string[]>

  constructor(
    status: number,
    code: string,
    message: string,
    opts?: { extraHeaders?: Record<string, string>; fields?: Record<string, string[]> }
  ) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.code = code
    this.extraHeaders = opts?.extraHeaders
    this.fields = opts?.fields
  }
}

/**
 * Turns anything a route handler's try/catch caught into a `{ error }`
 * response. Never forwards a raw Postgres/driver message — those are logged
 * server-side (never including a key) and replaced with a generic one.
 */
export function apiErrorResponse(err: unknown): NextResponse<ApiErrorBody> {
  if (err instanceof ApiError) {
    return NextResponse.json(
      { error: { code: err.code, message: err.message, ...(err.fields ? { fields: err.fields } : {}) } },
      { status: err.status, headers: err.extraHeaders }
    )
  }

  if (err instanceof EntitlementError) {
    const status = err.code === 'limit_reached' || err.code === 'frequency_locked' ? 403 : 403
    return NextResponse.json({ error: { code: err.code, message: err.message } }, { status })
  }

  // Deliberately generic. `err` may be a Postgres error carrying column/table
  // names or constraint text — never handed to the caller. It is safe to log
  // because nothing on this path ever puts a key's plaintext into an Error.
  console.error('[api/v1] unhandled error', err instanceof Error ? err.message : err)
  return NextResponse.json(
    { error: { code: 'internal_error', message: 'Something went wrong. Please try again.' } },
    { status: 500 }
  )
}

export interface RateLimitInfo {
  limit: number
  remaining: number
  /** Seconds until the current window resets. */
  resetSeconds: number
}

function rateLimitHeaders(info: RateLimitInfo): Record<string, string> {
  return {
    'RateLimit-Limit': String(info.limit),
    'RateLimit-Remaining': String(info.remaining),
    'RateLimit-Reset': String(info.resetSeconds),
  }
}

/** Success envelope for a single resource. */
export function apiSuccess<T>(
  data: T,
  opts: { status?: number; rateLimit?: RateLimitInfo; extraHeaders?: Record<string, string> } = {}
): NextResponse<{ data: T }> {
  return NextResponse.json(
    { data },
    {
      status: opts.status ?? 200,
      headers: { ...(opts.rateLimit ? rateLimitHeaders(opts.rateLimit) : {}), ...opts.extraHeaders },
    }
  )
}

/** Success envelope for a cursor-paginated list. */
export function apiList<T>(
  data: T[],
  nextCursor: string | null,
  opts: { status?: number; rateLimit?: RateLimitInfo } = {}
): NextResponse<{ data: T[]; next_cursor: string | null }> {
  return NextResponse.json(
    { data, next_cursor: nextCursor },
    { status: opts.status ?? 200, headers: opts.rateLimit ? rateLimitHeaders(opts.rateLimit) : {} }
  )
}

// ─── Cursor pagination ───────────────────────────────────────────────────────
//
// Keyset pagination on (created_at, id) — never `OFFSET` over a table that
// only grows (snapshots, alerts). The cursor is opaque to the caller: base64
// of `${created_at}|${id}`, the row the next page starts strictly after.

export interface Cursor {
  createdAt: string
  id: string
}

export function encodeCursor(row: { created_at: string; id: string }): string {
  return Buffer.from(`${row.created_at}|${row.id}`, 'utf8').toString('base64url')
}

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

export function decodeCursor(raw: string | null | undefined): Cursor | null {
  if (!raw) return null
  try {
    const decoded = Buffer.from(raw, 'base64url').toString('utf8')
    const separator = decoded.indexOf('|')
    if (separator <= 0) return null
    const createdAt = decoded.slice(0, separator)
    const id = decoded.slice(separator + 1)
    if (!createdAt || Number.isNaN(Date.parse(createdAt))) return null
    // Every paginated resource here (monitors, alerts, snapshots) has a uuid
    // primary key. Enforcing that shape before the id is ever interpolated
    // into a `.or()` filter string below closes off filter-string injection
    // from a hand-crafted cursor — a malformed id fails closed as "bad cursor"
    // rather than reaching query-building code as an unvalidated string.
    if (!UUID_RE.test(id)) return null
    return { createdAt, id }
  } catch {
    return null
  }
}

const DEFAULT_PAGE_LIMIT = 25
const MAX_PAGE_LIMIT = 100

/** Parses `?limit=&cursor=` from a request's search params, clamped and defaulted. Throws a field-level `ApiError` on a malformed cursor rather than silently ignoring it. */
export function parsePagination(searchParams: URLSearchParams): { limit: number; cursor: Cursor | null } {
  const rawLimit = searchParams.get('limit')
  let limit = DEFAULT_PAGE_LIMIT
  if (rawLimit !== null) {
    const parsed = Number(rawLimit)
    if (!Number.isInteger(parsed) || parsed < 1 || parsed > MAX_PAGE_LIMIT) {
      throw new ApiError(400, 'invalid_pagination', `limit must be an integer between 1 and ${MAX_PAGE_LIMIT}.`, {
        fields: { limit: [`must be an integer between 1 and ${MAX_PAGE_LIMIT}`] },
      })
    }
    limit = parsed
  }

  const rawCursor = searchParams.get('cursor')
  let cursor: Cursor | null = null
  if (rawCursor !== null) {
    cursor = decodeCursor(rawCursor)
    if (!cursor) {
      throw new ApiError(400, 'invalid_pagination', 'cursor is malformed or expired.', {
        fields: { cursor: ['malformed or expired'] },
      })
    }
  }

  return { limit, cursor }
}

// ─── Authentication ──────────────────────────────────────────────────────────

export interface ApiAuthContext {
  /** Service-role client. There is no session on this path — every query below MUST filter by `workspaceId` explicitly. */
  admin: SupabaseClient
  workspaceId: string
  apiKeyId: string
  scope: ApiKeyScope
  entitlements: Entitlements
  rateLimit: RateLimitInfo
}

/**
 * Per-plan requests-per-minute ceiling. Both listed plans already require the
 * `api` feature flag (`lib/plans.ts`) to reach this point at all; a plan with
 * no entry here is treated as zero rather than unlimited — see
 * `enforceRateLimit` — so adding a new plan to `PLAN_IDS` without adding it
 * here fails closed, not open.
 */
const RATE_LIMIT_PER_MINUTE: Partial<Record<string, number>> = {
  business: 120,
  agency: 300,
}

/**
 * Authenticates one `app/api/v1/**` request end to end: extracts the bearer
 * token, verifies it, resolves its workspace, checks the `api` entitlement,
 * enforces per-key rate limiting, and (if `requireWrite`) enforces scope.
 *
 * Throws `ApiError` for every failure — callers should catch it once, at the
 * top of the route handler, and pass it to `apiErrorResponse`.
 */
export async function authenticateApiRequest(
  request: Request,
  opts: { requireWrite?: boolean } = {}
): Promise<ApiAuthContext> {
  const authHeader = request.headers.get('authorization') ?? ''
  const match = /^Bearer\s+(.+)$/i.exec(authHeader.trim())
  const token = match?.[1]?.trim()

  // Never interpolate `token` into a log line or thrown message anywhere
  // below this point, success or failure.
  if (!token || !looksLikeApiKey(token)) {
    throw new ApiError(
      401,
      'unauthorized',
      'Missing or malformed API key. Send it as `Authorization: Bearer pw_live_...`.'
    )
  }

  const admin = createAdminClient()
  const candidateHash = hashApiKey(token)

  // Looked up by its hash (an index equality match, not a byte-by-byte
  // comparison of secret material) so this query itself carries no timing
  // signal about the key. The constant-time check below is the actual
  // equality gate on hashed secret material — see lib/api-keys.ts#verifyApiKey.
  const { data: keyRow, error: keyErr } = await admin
    .from('api_keys')
    .select('id, workspace_id, key_hash, scope, revoked_at')
    .eq('key_hash', candidateHash)
    .maybeSingle()

  if (keyErr) {
    console.error('[api-auth] key lookup failed', keyErr.message)
    throw new ApiError(500, 'internal_error', 'Could not verify the API key.')
  }

  if (!keyRow || !timingSafeEqualHex(candidateHash, keyRow.key_hash)) {
    throw new ApiError(401, 'unauthorized', 'Invalid API key.')
  }

  if (keyRow.revoked_at) {
    throw new ApiError(401, 'unauthorized', 'This API key has been revoked.')
  }

  if (!isApiKeyScope(keyRow.scope)) {
    throw new ApiError(500, 'internal_error', 'This API key has an unrecognized scope.')
  }

  if (opts.requireWrite && !scopeAllowsWrite(keyRow.scope)) {
    throw new ApiError(
      403,
      'read_only_key',
      'This API key has the `read` scope and cannot make changes. Create a `read_write` key to use this endpoint.'
    )
  }

  const workspaceId: string = keyRow.workspace_id
  const entitlements = await resolveWorkspaceEntitlements(admin, workspaceId)

  if (!hasFeature(entitlements.effective, 'api')) {
    const upgrade = cheapestPlanWith('api')
    throw new ApiError(
      403,
      'feature_locked',
      `The API is not included on your current plan (${entitlements.effective.name}).` +
        (upgrade ? ` Upgrade to ${upgrade.name} or above to use it.` : '')
    )
  }

  const rateLimit = await enforceRateLimit(admin, keyRow.id, entitlements.effective)

  // Best-effort; a failed stamp must never fail the request it's stamping.
  try {
    await admin.from('api_keys').update({ last_used_at: new Date().toISOString() }).eq('id', keyRow.id)
  } catch {
    // ignored — see above
  }

  return { admin, workspaceId, apiKeyId: keyRow.id, scope: keyRow.scope, entitlements, rateLimit }
}

async function enforceRateLimit(admin: SupabaseClient, apiKeyId: string, plan: Plan): Promise<RateLimitInfo> {
  const limit = RATE_LIMIT_PER_MINUTE[plan.id] ?? 0

  const windowStart = new Date()
  windowStart.setUTCSeconds(0, 0)
  const resetSeconds = Math.max(1, 60 - new Date().getUTCSeconds())

  if (limit <= 0) {
    // A plan that passed the `api` feature check above but has no entry in
    // RATE_LIMIT_PER_MINUTE is a bug in that map, not a legitimate
    // zero-quota tier — fail closed rather than let it through unmetered.
    throw new ApiError(403, 'feature_locked', `The API is not included on your current plan (${plan.name}).`)
  }

  const { data: count, error } = await admin.rpc('increment_api_rate_limit', {
    key_id: apiKeyId,
    window_ts: windowStart.toISOString(),
  })

  if (error) {
    // Fail open on a limiter outage: the auth, revocation, scope and
    // entitlement gates above already ran, so an unavailable counter should
    // not take the whole API down.
    console.error('[api-auth] rate limit counter failed', error.message)
    return { limit, remaining: limit, resetSeconds }
  }

  const used = typeof count === 'number' ? count : 0

  if (used > limit) {
    throw new ApiError(429, 'rate_limited', `Rate limit exceeded: ${limit} requests per minute.`, {
      extraHeaders: {
        'Retry-After': String(resetSeconds),
        ...rateLimitHeaders({ limit, remaining: 0, resetSeconds }),
      },
    })
  }

  return { limit, remaining: Math.max(0, limit - used), resetSeconds }
}

// ─── Entitlements (admin-client variant) ─────────────────────────────────────
//
// `lib/entitlements.ts#getEntitlements` resolves the caller's workspace from
// their Supabase session — there is no session on this path. This mirrors its
// shape and its usage query exactly (workspace row + monitors/active/seats/
// checks-used) using the admin client instead, so the SAME assertion
// functions (`assertCanAddMonitors`, `assertFrequencyAllowed`,
// `assertZoneCount`, `assertCheckQuota`, `assertFeature` — all imported by
// route handlers from `lib/entitlements.ts`, not reimplemented here) apply
// identically to a v1 request and a dashboard action. Only the plumbing that
// loads the inputs is duplicated, because `lib/entitlements.ts` is owned by
// another agent this pass and its usage loader isn't exported — see this
// task's final report for the follow-up suggestion to export it instead.

async function resolveWorkspaceEntitlements(admin: SupabaseClient, workspaceId: string): Promise<Entitlements> {
  const { data: workspace } = await admin
    .from('workspaces')
    .select('id, plan, plan_status, trial_ends_at')
    .eq('id', workspaceId)
    .maybeSingle()

  if (!workspace) {
    throw new ApiError(500, 'internal_error', 'Could not resolve a workspace for this key.')
  }

  const status = (workspace.plan_status ?? 'active') as PlanStatus
  const plan = effectivePlan(workspace.plan, 'active', null)
  const effective = effectivePlan(workspace.plan, status, workspace.trial_ends_at)
  const usage = await loadUsageForWorkspace(admin, workspaceId)

  return {
    workspaceId,
    plan,
    effective,
    status,
    trialEndsAt: workspace.trial_ends_at,
    usage,
    remaining: {
      monitors: Math.max(0, effective.limits.maxMonitors - usage.monitors),
      checksThisPeriod: Math.max(0, effective.limits.maxChecksPerMonth - usage.checksThisPeriod),
      seats: Math.max(0, effective.limits.maxSeats - usage.seats),
    },
  }
}

function startOfBillingPeriod(now: Date = new Date()): string {
  return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1)).toISOString().slice(0, 10)
}

async function loadUsageForWorkspace(admin: SupabaseClient, workspaceId: string): Promise<UsageSnapshot> {
  const periodStart = startOfBillingPeriod()

  const [monitors, active, seats, usageRow] = await Promise.all([
    admin.from('monitored_urls').select('id', { count: 'exact', head: true }).eq('workspace_id', workspaceId).is('deleted_at', null),
    admin
      .from('monitored_urls')
      .select('id', { count: 'exact', head: true })
      .eq('workspace_id', workspaceId)
      .is('deleted_at', null)
      .eq('is_active', true),
    admin.from('workspace_members').select('id', { count: 'exact', head: true }).eq('workspace_id', workspaceId),
    admin.from('workspace_usage').select('checks_used').eq('workspace_id', workspaceId).eq('period_start', periodStart).maybeSingle(),
  ])

  return {
    monitors: monitors.count ?? 0,
    activeMonitors: active.count ?? 0,
    seats: seats.count ?? 0,
    checksThisPeriod: usageRow.data?.checks_used ?? 0,
  }
}
