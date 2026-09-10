import { NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { getWorkspace } from '@/lib/actions/workspace'
import { env } from '@/lib/env'
import { verifyState } from '@/lib/slack'

/**
 * Slack OAuth v2 callback.
 *
 * Every branch that fails redirects to `/dashboard/settings?slack=<reason>`
 * rather than rendering an error page or throwing — this is a redirect target
 * the user never chose to visit directly, so there is nothing useful to show
 * except "go back to settings and see what happened."
 *
 * `state` is verified before anything else touches the database. An
 * unverified `state` is exactly the CSRF hole this exists to close: without
 * it, a forged callback URL (`code` from an attacker's own Slack install,
 * `state` blank or guessed) could attach an attacker-controlled Slack team to
 * a victim's workspace, and every alert meant for the victim would start
 * posting into the attacker's channel instead.
 */
export async function GET(request: Request) {
  const appUrl = env.NEXT_PUBLIC_APP_URL
  const { searchParams } = new URL(request.url)

  // Slack sends `?error=access_denied` (among others) when the user cancels
  // the install on Slack's own consent screen — never a `code` alongside it.
  const deniedOrError = searchParams.get('error')
  if (deniedOrError) {
    return NextResponse.redirect(`${appUrl}/dashboard/settings?slack=denied`)
  }

  if (!env.SLACK_CLIENT_ID || !env.SLACK_CLIENT_SECRET) {
    return NextResponse.redirect(`${appUrl}/dashboard/settings?slack=not_configured`)
  }

  const code = searchParams.get('code')
  const state = searchParams.get('state')

  if (!code) {
    return NextResponse.redirect(`${appUrl}/dashboard/settings?slack=error`)
  }

  const statePayload = verifyState(state, env.SLACK_CLIENT_SECRET)
  if (!statePayload) {
    console.warn('[slack] callback rejected — state missing, tampered, or expired')
    return NextResponse.redirect(`${appUrl}/dashboard/settings?slack=invalid_state`)
  }

  // A session can be gone by the time Slack redirects back — the user's
  // cookie expired mid-consent, or they completed the OAuth screen in a
  // different browser/tab than the one that started it.
  const supabase = await createServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.redirect(`${appUrl}/login?next=%2Fdashboard%2Fsettings`)
  }

  const workspace = await getWorkspace()
  // The signed state names the workspace this install was started for. If the
  // signed-in user's current workspace doesn't match, the state is being
  // replayed against the wrong session — reject rather than attach a Slack
  // team to a workspace nobody chose it for.
  if (!workspace || workspace.id !== statePayload.workspaceId) {
    console.warn('[slack] callback rejected — state workspace does not match session')
    return NextResponse.redirect(`${appUrl}/dashboard/settings?slack=invalid_state`)
  }

  let tokenResponse: {
    ok: boolean
    error?: string
    access_token?: string
    team?: { id: string; name: string }
  }

  try {
    const res = await fetch('https://slack.com/api/oauth.v2.access', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: env.SLACK_CLIENT_ID,
        client_secret: env.SLACK_CLIENT_SECRET,
        code,
        redirect_uri: `${appUrl}/api/slack/callback`,
      }),
    })
    tokenResponse = await res.json()
  } catch (err) {
    // Never log `code` or anything from the response body — a leaked auth
    // code or token in a log line is as good as leaking the credential.
    console.error('[slack] oauth exchange request failed', err instanceof Error ? err.message : 'unknown error')
    return NextResponse.redirect(`${appUrl}/dashboard/settings?slack=error`)
  }

  if (!tokenResponse.ok || !tokenResponse.access_token || !tokenResponse.team) {
    console.warn('[slack] oauth exchange rejected', tokenResponse.error ?? 'missing fields')
    return NextResponse.redirect(`${appUrl}/dashboard/settings?slack=error`)
  }

  // Service role from here: this write does not go through the user's
  // session client because the value being written — a bot token — must
  // never round-trip through anything the browser could observe, and the
  // admin client keeps this route's one write consistent with how every
  // other webhook-style handler in this codebase writes credentials
  // (`app/api/stripe/webhook/route.ts`).
  const admin = createAdminClient()
  const { error } = await admin.from('notification_channels').upsert(
    {
      workspace_id: workspace.id,
      channel_type: 'slack',
      config: {
        team_id: tokenResponse.team.id,
        team_name: tokenResponse.team.name,
        channel_id: null,
        channel_name: null,
        bot_token: tokenResponse.access_token,
      },
      // Flips true once `setSlackChannel` (lib/actions/integrations.ts)
      // confirms a real channel the bot can post to — a bare team connection
      // with no channel chosen yet has nowhere to send an alert.
      is_active: false,
    },
    { onConflict: 'workspace_id,channel_type' }
  )

  if (error) {
    console.error('[slack] failed to store channel', error.message)
    return NextResponse.redirect(`${appUrl}/dashboard/settings?slack=error`)
  }

  return NextResponse.redirect(`${appUrl}/dashboard/settings?slack=connected`)
}
