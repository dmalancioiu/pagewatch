import { createServerClient } from '@supabase/ssr'
import type { CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

/**
 * Refreshes the Supabase session on every matched request.
 *
 * `lib/supabase/server.ts` explains the gap this closes: Supabase SSR
 * refreshes the access token whenever a request reads the session, but a
 * server component's `cookies()` store cannot be written to — its own
 * `setAll` swallows the write with a comment saying middleware is expected to
 * do it instead. Without this file, that expectation was never met: the
 * refreshed token had nowhere to land, the cookie the browser already had
 * kept expiring on schedule, and users got signed out mid-session.
 *
 * This file is that other half. It runs before the request reaches a route,
 * calls `getUser()` to force the refresh, and — critically — writes any
 * rotated cookies onto BOTH the outgoing request (so this request's own
 * server components see the new token) and the response (so the browser
 * does). Reading the session without doing this is a stale no-op.
 */
export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: { headers: request.headers },
  })

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  // Without credentials there is no session to refresh. Returning the response
  // untouched degrades to "nobody is signed in" — the auth guard in the
  // dashboard layout still redirects. Constructing the client anyway throws,
  // and because middleware runs on every route that turned a misconfigured
  // deploy into a 500 on the marketing site too.
  if (!supabaseUrl || !supabaseKey) {
    return response
  }

  const supabase = createServerClient(
    supabaseUrl,
    supabaseKey,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet: { name: string; value: string; options: CookieOptions }[]) {
          // Mirrors the cookie onto the request first so any server component
          // rendered for THIS request reads the refreshed token rather than
          // the one it arrived with, then rebuilds the response from that
          // request so the rotated cookie also reaches the browser.
          for (const { name, value } of cookiesToSet) {
            request.cookies.set(name, value)
          }
          response = NextResponse.next({ request: { headers: request.headers } })
          for (const { name, value, options } of cookiesToSet) {
            response.cookies.set(name, value, options)
          }
        },
      },
    }
  )

  // The call itself is what triggers the refresh; the return value isn't
  // needed here — route handlers and server components re-resolve the user
  // themselves and enforce their own auth guards.
  await supabase.auth.getUser()

  return response
}

export const config = {
  matcher: [
    /**
     * Every request except:
     *  - Next's static build assets and image optimizer output
     *  - favicon.ico and common static image extensions
     *  - the Stripe webhook, which verifies a raw-body signature and must
     *    reach the route handler completely untouched — this middleware
     *    would otherwise read/consume the request before it gets there.
     */
    '/((?!_next/static|_next/image|favicon\\.ico|api/stripe/webhook|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)',
  ],
}
