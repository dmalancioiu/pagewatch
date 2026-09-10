/**
 * Provider-agnostic error/observability seam for the Trigger.dev worker.
 *
 * This is the worker-side twin of `lib/observability.ts` — same shape
 * (`captureError` / `captureMessage` / `withSpan`), same behaviour, same
 * "swap in a real SDK later" plan (see that file's header comment for the
 * step-by-step). It is a separate file, not a shared import, on purpose: the
 * Next.js app and the Trigger.dev worker are bundled independently (esbuild
 * for the worker, via `trigger.config.ts`, vs. Next's own build), and this
 * file deliberately reads `process.env` directly instead of going through
 * `lib/env.ts` — every other file under `trigger/` does the same (see
 * `trigger/tasks/run-single-url.ts`, `trigger/lib/entitlements.ts`), so the
 * worker has no dependency on the Next app's zod-validated env module.
 *
 * No DSN configured (`OBSERVABILITY_DSN` unset — the default on a fresh
 * clone): every capture is a line of structured JSON to stdout, which lands
 * in the Trigger.dev run log. DSN configured: the same event is POSTed to it
 * with `fetch`, fire-and-forget, never throwing and never blocking the task
 * that triggered the capture.
 *
 * ── HOW TO SWAP IN THE REAL SENTRY SDK LATER (one file: this one) ──────────
 * Trigger.dev v4 has its own first-party Sentry integration
 * (`@trigger.dev/sdk`'s error reporting hooks / `onFailure` lifecycle, or
 * `@sentry/node` directly since the worker runs as plain Node). Once that
 * dependency is added: replace `captureError`'s body with
 * `Sentry.captureException(err, { extra: sanitizeContext(context) })`,
 * `captureMessage`'s with `Sentry.captureMessage(...)`, `withSpan`'s with
 * `Sentry.startSpan({ name }, fn)`, and delete the `dispatch` fetch branch —
 * every call site (`run-single-url.ts` and anywhere else in `trigger/`) keeps
 * calling these same three functions unchanged.
 *
 * ── Secrets never leave this module ────────────────────────────────────────
 * Identical redaction to the app-side module: URL userinfo, bearer/
 * authorization tokens, and known provider API-key prefixes are masked
 * wherever they appear as substrings; any context value whose key looks like
 * a secret (token/secret/password/apikey/authorization/dsn/credential/
 * cookie) is blanked outright regardless of shape. Every capture in
 * `run-single-url.ts` passes `monitorId`/`workspaceId` plus the already-
 * sanitised `reason` string from `sanitiseError` — never the monitor's raw
 * URL or the underlying error's message, since a fetch/DNS failure can carry
 * the full target URL (which, for a monitoring product, can itself embed
 * credentials).
 */

export interface ObservabilityContext {
  monitorId?: string
  workspaceId?: string
  [key: string]: unknown
}

const SENSITIVE_KEY_RE = /token|secret|password|passwd|apikey|api[_-]?key|authorization|dsn|credential|cookie/i

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
      if (groups.length >= 3 && typeof groups[0] === 'string' && groups[0].includes('://')) {
        return `${groups[0]}[redacted]@`
      }
      return '[redacted]'
    })
  }
  return out
}

/** Deep-walks a context object, blanking sensitive keys and redacting string values. Never throws. */
export function sanitizeContext(context: ObservabilityContext, depth = 0): Record<string, unknown> {
  if (depth > 6) return { note: '[truncated]' }
  const out: Record<string, unknown> = {}
  try {
    for (const [key, value] of Object.entries(context)) {
      out[key] = SENSITIVE_KEY_RE.test(key) ? '[redacted]' : sanitizeValue(value, depth + 1)
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
  if (value && typeof value === 'object') return sanitizeContext(value as ObservabilityContext, depth + 1)
  return value
}

function buildEvent(kind: 'error' | 'message' | 'span', fields: Record<string, unknown>) {
  return {
    kind,
    service: 'pagewatch-worker',
    environment: process.env.OBSERVABILITY_ENVIRONMENT || 'development',
    timestamp: new Date().toISOString(),
    ...fields,
  }
}

function dispatch(event: Record<string, unknown>, severity: 'error' | 'info'): void {
  const dsn = process.env.OBSERVABILITY_DSN

  if (!dsn) {
    const line = JSON.stringify(event)
    if (severity === 'error') console.error(line)
    else console.log(line)
    return
  }

  fetch(dsn, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(event),
  }).catch((err) => {
    console.warn('[observability] delivery failed', err instanceof Error ? err.message : String(err))
  })
}

/** Records an error. Never throws — the failure path calling this must still complete its own retry/notify logic. */
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

/** Records a message that isn't an exception. Never throws. */
export function captureMessage(
  message: string,
  context: ObservabilityContext = {},
  level: 'info' | 'warning' = 'info'
): void {
  dispatch(
    buildEvent('message', { message: redact(message), level, context: sanitizeContext(context) }),
    level === 'warning' ? 'error' : 'info'
  )
}

/**
 * Times an operation and records it as a span. Rethrows the original error
 * unchanged on failure — critical here specifically, since
 * `run-single-url.ts`'s retry/backoff and Trigger.dev's own run log depend
 * on seeing the real thrown error, not a wrapped one.
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
