/**
 * Provider-agnostic error/observability seam for the Next.js app.
 *
 * `@sentry/nextjs` is not installed (and this module must not add it — see
 * the task this file was written against). So this is the seam a real
 * provider drops into later, not the provider itself:
 *
 *   - No DSN configured (`OBSERVABILITY_DSN` unset, the default on a fresh
 *     clone): every capture is logged as one line of structured JSON to
 *     stdout/stderr. This is the whole story for local dev and for any
 *     deploy that hasn't wired a real backend yet — nothing throws, nothing
 *     is required.
 *   - DSN configured: the same structured event is POSTed as JSON to that
 *     URL with `fetch`, fire-and-forget. A failed or unreachable endpoint
 *     only logs a warning locally; it can never fail or block the caller.
 *
 * ── HOW TO SWAP IN THE REAL SENTRY SDK LATER (one file: this one) ──────────
 *   1. `npm install @sentry/nextjs` and run `npx @sentry/wizard@latest -i
 *      nextjs` (it edits `next.config.js` and adds its own client/server
 *      init files — none of that touches this file's exported API).
 *   2. In `captureError`, replace the body with
 *      `Sentry.captureException(err, { extra: sanitizeContext(context) })`.
 *   3. In `captureMessage`, replace the body with
 *      `Sentry.captureMessage(message, { level, extra: sanitizeContext(context) })`.
 *   4. In `withSpan`, replace the body with
 *      `Sentry.startSpan({ name }, fn)` (Sentry's span already times and
 *      records thrown errors, so the manual try/catch below can go).
 *   5. Delete the `dispatch`/`OBSERVABILITY_DSN` fetch branch — Sentry reads
 *      `SENTRY_DSN` itself and ships its own transport.
 * Every call site in the app (`instrumentation.ts`, route handlers, server
 * actions, ...) keeps calling `captureError`/`captureMessage`/`withSpan` from
 * this file unchanged — that's the point of the seam.
 *
 * ── Secrets never leave this module ────────────────────────────────────────
 * `sanitizeContext` and `redact` below strip anything that looks like a
 * credential (a URL with `user:pass@`, a bearer/authorization token, a known
 * provider API-key prefix such as Stripe's `sk_live_`/Resend's `re_`/Slack's
 * `xoxb-`) wherever it appears as a substring, and blank out any object value
 * whose key name looks like a secret (token/secret/password/apikey/
 * authorization/dsn/credential/cookie) regardless of its shape. This runs on
 * every error message, stack trace, and context object before it is logged
 * or sent anywhere. Callers should still prefer passing IDs (monitorId,
 * workspaceId) over raw payloads — this is the backstop, not a license to
 * pass anything through.
 */

import { env } from './env'

export interface ObservabilityContext {
  monitorId?: string
  workspaceId?: string
  [key: string]: unknown
}

const SENSITIVE_KEY_RE = /token|secret|password|passwd|apikey|api[_-]?key|authorization|dsn|credential|cookie/i

// URL userinfo (`scheme://user:pass@host`), bearer/authorization tokens, and
// known provider API-key prefixes (Stripe, Resend, Slack, GitHub, Shopify,
// Square, Anthropic, Trigger.dev webhook secrets) — the shapes most likely to
// end up embedded inside an error message rather than passed as a field.
const CREDENTIAL_PATTERNS: RegExp[] = [
  /([a-z][a-z0-9+.-]*:\/\/)([^\/\s:@]+):([^\/\s:@]*)@/gi,
  /\b(bearer|authorization)[:\s]+[a-zA-Z0-9._-]{8,}/gi,
  /\b(sk_live_|sk_test_|pk_live_|pk_test_|whsec_|re_|xox[baprs]-|ghp_|gho_|shpat_|sq0[a-z]{3}-|sk-ant-)[a-zA-Z0-9_-]{6,}/gi,
]

/** Masks credential-shaped substrings anywhere in a string. */
export function redact(value: string): string {
  let out = value
  for (const pattern of CREDENTIAL_PATTERNS) {
    out = out.replace(pattern, (match, ...groups) => {
      // The URL-userinfo pattern captures the scheme separately so the host
      // stays readable (useful for debugging which target failed); every
      // other pattern is masked outright.
      if (groups.length >= 3 && typeof groups[0] === 'string' && groups[0].includes('://')) {
        return `${groups[0]}[redacted]@`
      }
      return '[redacted]'
    })
  }
  return out
}

/** Deep-walks a context object, blanking sensitive keys and redacting string values. Never throws — an object it can't safely walk becomes a short placeholder rather than being dropped or leaked whole. */
export function sanitizeContext(context: ObservabilityContext, depth = 0): Record<string, unknown> {
  if (depth > 6) return { note: '[truncated]' }
  const out: Record<string, unknown> = {}
  try {
    for (const [key, value] of Object.entries(context)) {
      if (SENSITIVE_KEY_RE.test(key)) {
        out[key] = '[redacted]'
      } else {
        out[key] = sanitizeValue(value, depth + 1)
      }
    }
  } catch {
    return { note: '[context unserializable]' }
  }
  return out
}

function sanitizeValue(value: unknown, depth: number): unknown {
  if (depth > 6) return '[truncated]'
  if (typeof value === 'string') return redact(value)
  if (Array.isArray(value)) return value.map((v) => sanitizeValue(v, depth + 1))
  if (value && typeof value === 'object') {
    return sanitizeContext(value as ObservabilityContext, depth + 1)
  }
  return value
}

function buildEvent(kind: 'error' | 'message' | 'span', fields: Record<string, unknown>) {
  return {
    kind,
    service: 'pagewatch-app',
    environment: env.OBSERVABILITY_ENVIRONMENT,
    timestamp: new Date().toISOString(),
    ...fields,
  }
}

function dispatch(event: Record<string, unknown>, severity: 'error' | 'info'): void {
  const dsn = env.OBSERVABILITY_DSN

  if (!dsn) {
    const line = JSON.stringify(event)
    if (severity === 'error') console.error(line)
    else console.log(line)
    return
  }

  // Fire-and-forget: telemetry delivery must never block or fail the caller.
  fetch(dsn, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(event),
  }).catch((err) => {
    console.warn('[observability] delivery failed', err instanceof Error ? err.message : String(err))
  })
}

/** Records an error. Never throws. */
export function captureError(err: unknown, context: ObservabilityContext = {}): void {
  const message = err instanceof Error ? err.message : String(err)
  const stack = err instanceof Error ? err.stack : undefined

  dispatch(
    buildEvent('error', {
      message: redact(message),
      stack: stack ? redact(stack) : undefined,
      context: sanitizeContext(context),
    }),
    'error'
  )
}

/** Records a message that isn't an exception (a warning, a notable event). Never throws. */
export function captureMessage(
  message: string,
  context: ObservabilityContext = {},
  level: 'info' | 'warning' = 'info'
): void {
  dispatch(
    buildEvent('message', {
      message: redact(message),
      level,
      context: sanitizeContext(context),
    }),
    level === 'warning' ? 'error' : 'info'
  )
}

/**
 * Times an operation and records it as a span. On success the span is
 * recorded as `ok`; on failure it is recorded as `error` (which also calls
 * `captureError`) and the original error is rethrown unchanged so callers'
 * error handling and Trigger.dev/Next.js's own retry logic never see a
 * different error than the one that actually happened.
 */
export async function withSpan<T>(
  name: string,
  fn: () => Promise<T> | T,
  context: ObservabilityContext = {}
): Promise<T> {
  const start = Date.now()
  try {
    const result = await fn()
    dispatch(buildEvent('span', { name, status: 'ok', durationMs: Date.now() - start, context: sanitizeContext(context) }), 'info')
    return result
  } catch (err) {
    dispatch(buildEvent('span', { name, status: 'error', durationMs: Date.now() - start, context: sanitizeContext(context) }), 'error')
    captureError(err, { ...context, span: name })
    throw err
  }
}
