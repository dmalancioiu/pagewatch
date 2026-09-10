import { NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'
import { getWorkspace } from '@/lib/actions/workspace'
import { getEntitlements } from '@/lib/entitlements'
import { env } from '@/lib/env'
import { signState } from '@/lib/slack'

/**
 * Starts Slack's OAuth v2 install flow.
 *
 * Reached by the "Connect" link on `/dashboard/settings` — a plain GET
 * navigation, not a server action, because the next step is a redirect to
 * slack.com. Requests exactly `chat:write` and `chat:write.public`: enough to
 * post alerts into a channel the bot has been invited to, or any public
 * channel, and nothing that would let the bot read messages, users, or
 * anything else.
 *
 * The `state` param is what makes the round trip through Slack safe:
 * `signState` binds it to this workspace and signs it, and
 * `/api/slack/callback` refuses to proceed unless that signature verifies —
 * see `lib/slack.ts` for why a signed, self-expiring token was chosen over a
 * database-backed state row.
 */
export async function GET() {
  const appUrl = env.NEXT_PUBLIC_APP_URL

  if (!env.SLACK_CLIENT_ID || !env.SLACK_CLIENT_SECRET) {
    return NextResponse.redirect(`${appUrl}/dashboard/settings?slack=not_configured`)
  }

  const supabase = await createServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.redirect(`${appUrl}/login?next=%2Fdashboard%2Fsettings`)
  }

  const workspace = await getWorkspace()
  if (!workspace) {
    return NextResponse.redirect(`${appUrl}/dashboard/settings?slack=no_workspace`)
  }

  const entitlements = await getEntitlements()
  if (!entitlements?.effective.features.slack) {
    return NextResponse.redirect(`${appUrl}/dashboard/settings?slack=plan_required`)
  }

  const state = signState({ workspaceId: workspace.id }, env.SLACK_CLIENT_SECRET)

  const authorizeUrl = new URL('https://slack.com/oauth/v2/authorize')
  authorizeUrl.searchParams.set('client_id', env.SLACK_CLIENT_ID)
  authorizeUrl.searchParams.set('scope', 'chat:write,chat:write.public')
  authorizeUrl.searchParams.set('redirect_uri', `${appUrl}/api/slack/callback`)
  authorizeUrl.searchParams.set('state', state)

  return NextResponse.redirect(authorizeUrl.toString())
}
