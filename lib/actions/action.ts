import { z } from 'zod'
import { createServerClient } from '../supabase/server'
import { requireEntitlements, EntitlementError, type Entitlements } from '../entitlements'

/**
 * A typed wrapper for server actions.
 *
 * Every action in this app repeats the same four steps: validate the input,
 * resolve the session, resolve entitlements, then do the work — and each one
 * currently does it slightly differently, or not at all. `addMonitoredUrls`
 * validates nothing and trusts a caller-supplied workspace id; `pauseMonitoredUrl`
 * skips entitlements entirely and leans on RLS.
 *
 * This makes the correct shape the easy one:
 *
 *     export const renameMonitor = action
 *       .input(z.object({ id: z.string().uuid(), name: z.string().min(1).max(120) }))
 *       .handler(async ({ input, ctx }) => {
 *         await ctx.supabase
 *           .from('monitored_urls')
 *           .update({ name: input.name })
 *           .eq('id', input.id)
 *       })
 *
 * The handler receives validated input and a context carrying the Supabase
 * client, the user and the workspace's entitlements. It never has to think
 * about auth plumbing again.
 *
 * ## Why the result is a value, not a thrown error
 *
 * Next serialises anything thrown from a server action into a generic
 * `Error` with an opaque digest in production — `instanceof EntitlementError`
 * is false on the client and the message is gone. So a plan refusal thrown
 * across that boundary arrives as "An error occurred", which is exactly the
 * dead-end this codebase currently shows.
 *
 * Actions here return a discriminated union instead. A refusal survives the
 * boundary intact, with the upgrade target attached, so the UI can render
 * "Pro raises this to 15 monitors — Upgrade" from real data.
 */

// ─── Result ──────────────────────────────────────────────────────────────────

export type ActionResult<T> =
  | { ok: true; data: T }
  | {
      ok: false
      /**
       * `validation` — the input failed its schema; `fieldErrors` says where.
       * `entitlement` — refused on plan grounds; `upgradeTo` names the fix.
       * `auth` — no session, or no workspace yet.
       * `error` — anything else. The message is safe to display.
       */
      kind: 'validation' | 'entitlement' | 'auth' | 'error'
      message: string
      /** Present on `entitlement`: which limit was hit. */
      code?: EntitlementError['code']
      /** Present on `entitlement`: the plan id that lifts the limit, if any. */
      upgradeTo?: string | null
      /** Present on `validation`: per-field messages, keyed by field path. */
      fieldErrors?: Record<string, string[]>
    }

/** Narrowing helper so callers can `if (isOk(result))` without repeating the shape. */
export function isOk<T>(result: ActionResult<T>): result is { ok: true; data: T } {
  return result.ok
}

// ─── Context ─────────────────────────────────────────────────────────────────

export interface ActionContext {
  supabase: Awaited<ReturnType<typeof createServerClient>>
  userId: string
  /** Resolved entitlements for the caller's workspace. */
  entitlements: Entitlements
  /** Shorthand for `entitlements.workspaceId` — the most-used field by far. */
  workspaceId: string
}

// ─── Builder ─────────────────────────────────────────────────────────────────

interface ActionBuilder<TInput> {
  /** Attach (or replace) the input schema. */
  input<TNext>(schema: z.ZodType<TNext>): ActionBuilder<TNext>
  /** Provide the body. Returns the callable server action. */
  handler<TOutput>(
    fn: (args: { input: TInput; ctx: ActionContext }) => Promise<TOutput>
  ): (input: TInput) => Promise<ActionResult<TOutput>>
}

function build<TInput>(schema: z.ZodType<TInput> | null): ActionBuilder<TInput> {
  return {
    input<TNext>(next: z.ZodType<TNext>) {
      return build<TNext>(next)
    },

    handler<TOutput>(fn: (args: { input: TInput; ctx: ActionContext }) => Promise<TOutput>) {
      return async function run(rawInput: TInput): Promise<ActionResult<TOutput>> {
        // 1. Validate before anything touches the database.
        let input = rawInput
        if (schema) {
          const parsed = schema.safeParse(rawInput)
          if (!parsed.success) {
            return {
              ok: false,
              kind: 'validation',
              message: 'Check the highlighted fields and try again.',
              fieldErrors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
            }
          }
          input = parsed.data
        }

        // 2. Session and entitlements. `requireEntitlements` throws when there
        //    is no user or no workspace — both mean "not signed in far enough
        //    to do this", which is an auth outcome, not a bug.
        let ctx: ActionContext
        try {
          const supabase = await createServerClient()
          const {
            data: { user },
          } = await supabase.auth.getUser()

          if (!user) {
            return { ok: false, kind: 'auth', message: 'Sign in to continue.' }
          }

          const entitlements = await requireEntitlements()

          ctx = {
            supabase,
            userId: user.id,
            entitlements,
            workspaceId: entitlements.workspaceId,
          }
        } catch {
          return {
            ok: false,
            kind: 'auth',
            message: 'We could not load your workspace. Try reloading the page.',
          }
        }

        // 3. The body. Plan refusals become a typed result; everything else is
        //    logged server-side and reported generically, so an unexpected
        //    failure never leaks a stack trace or a database message to the UI.
        try {
          return { ok: true, data: await fn({ input, ctx }) }
        } catch (err) {
          if (err instanceof EntitlementError) {
            return {
              ok: false,
              kind: 'entitlement',
              message: err.message,
              code: err.code,
              upgradeTo: err.upgradeTo,
            }
          }

          console.error('[action] unhandled failure', err)
          return {
            ok: false,
            kind: 'error',
            message: 'Something went wrong. Please try again.',
          }
        }
      }
    },
  }
}

/**
 * Entry point. Start every server action with `action.input(...)`, or
 * `action.handler(...)` directly when it takes no arguments.
 */
export const action = build<void>(null)
