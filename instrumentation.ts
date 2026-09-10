/**
 * Next.js instrumentation hook.
 *
 * Next.js loads this file once per server runtime it boots (Node.js, and
 * separately the Edge runtime, if any route uses it) before that runtime
 * handles its first request. This is the supported seam for registering a
 * global error/observability hook without `@sentry/nextjs`'s
 * `withSentryConfig` wrapper — see `lib/observability.ts` for the seam
 * itself and exactly how to swap in the real SDK later.
 *
 * Stable in this Next.js version with no config flag required (the
 * `experimental.instrumentationHook` flag some docs mention was for Next 13
 * and no longer exists in 14). Nothing here reads an env var directly, and
 * `lib/observability.ts` treats every one of its env vars as optional, so
 * this file is a no-op-but-present on a fresh clone with zero configuration
 * — it must never be the thing that makes a route throw.
 */
export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    const { captureError } = await import('./lib/observability')

    // Node-only: `process.on` doesn't exist on the Edge runtime.
    process.on('unhandledRejection', (reason) => {
      captureError(reason, { source: 'unhandledRejection' })
    })
    process.on('uncaughtException', (err) => {
      captureError(err, { source: 'uncaughtException' })
    })
  }
}

/**
 * Next's App Router error hook (server components, route handlers, server
 * actions). Present in this Next.js version but additive-only: if a future
 * upgrade stops calling it, `register()`'s process-level handlers above and
 * each route's own try/catch remain the real safety net either way.
 */
export async function onRequestError(
  err: unknown,
  request: { path?: string; method?: string },
  context?: Record<string, unknown>
) {
  const { captureError } = await import('./lib/observability')
  captureError(err, {
    source: 'onRequestError',
    path: request?.path,
    method: request?.method,
    routerKind: (context as { routerKind?: string } | undefined)?.routerKind,
  })
}
