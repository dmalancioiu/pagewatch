import { createServerClient as createSupabaseServerClient } from '@supabase/ssr'
import type { CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'

/**
 * Supabase client for server components, route handlers and server actions.
 *
 * Requests made through this client carry the caller's session, so every query
 * is subject to row-level security. Use `lib/supabase/admin.ts` only where the
 * service role is genuinely required (background jobs, webhooks).
 *
 * Always `await` this — it reads the cookie store, which is async.
 */
export async function createServerClient() {
  const cookieStore = await cookies()

  return createSupabaseServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet: { name: string; value: string; options: CookieOptions }[]) {
          // Server components cannot set cookies. Refreshed tokens are written
          // by middleware instead, so swallowing this is expected, not a bug.
          try {
            for (const { name, value, options } of cookiesToSet) {
              cookieStore.set(name, value, options)
            }
          } catch {
            // no-op: called from a server component render
          }
        },
      },
    }
  )
}

/** @deprecated Use `createServerClient`. Kept so existing imports keep working. */
export const createClient = createServerClient
