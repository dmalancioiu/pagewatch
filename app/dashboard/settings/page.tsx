import { redirect } from 'next/navigation'
import Link from 'next/link'
import { AlertTriangle, ArrowUpRight, Bell, Building2, CreditCard, Mail, Terminal, User } from 'lucide-react'
import { getWorkspace } from '@/lib/actions/workspace'
import { getEntitlements, toClientEntitlements } from '@/lib/entitlements'
import { createServerClient } from '@/lib/supabase/server'
import { parseSlackConfig } from '@/lib/slack'
import { cheapestPlanWith } from '@/lib/plans'
import { getApiKeys } from '@/lib/actions/api-keys'
import { getRecentWebhookDeliveries, getWebhookEndpoints } from '@/lib/actions/webhooks'
import { ManageBillingButton } from './ManageBillingButton'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Meter } from '@/components/ui/meter'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { SlackIntegrationCard, type SlackConnectionView } from './SlackIntegrationCard'
import { ApiKeysCard } from './ApiKeysCard'
import { WebhooksCard } from './WebhooksCard'

export const metadata = { title: 'Settings — PageWatch' }

interface SettingsPageProps {
  searchParams: Promise<{ slack?: string }>
}

export default async function SettingsPage({ searchParams }: SettingsPageProps) {
  const workspace = await getWorkspace()
  if (!workspace) redirect('/dashboard')

  const { slack: slackStatusParam } = await searchParams

  const supabase = await createServerClient()
  const [
    { data: channels },
    { data: slackRow },
    { data: { user } },
    entitlements,
    apiKeys,
    webhookEndpoints,
    webhookDeliveries,
  ] = await Promise.all([
    supabase.from('notification_channels').select('*').eq('workspace_id', workspace.id).eq('channel_type', 'email'),
    // Selected separately, and narrowly, from the email channel above: this
    // is the one query in the app that ever reads a Slack row's `config`
    // (which holds the bot token), and only ever from this server component —
    // never from a client component or a browser-side Supabase call. Only a
    // sanitized projection (`slackConnection` below) is ever handed to
    // `SlackIntegrationCard`; the token itself never leaves this scope.
    supabase
      .from('notification_channels')
      .select('config, is_active')
      .eq('workspace_id', workspace.id)
      .eq('channel_type', 'slack')
      .maybeSingle(),
    supabase.auth.getUser(),
    getEntitlements(),
    getApiKeys(workspace.id),
    getWebhookEndpoints(workspace.id),
    getRecentWebhookDeliveries(workspace.id),
  ])

  const emailChannel = channels?.find((c) => c.channel_type === 'email')
  const emailConfig = (emailChannel?.config ?? {}) as { email?: string; frequency?: string }
  const emailAddr = emailConfig.email ?? user?.email ?? '—'
  const emailFreq = emailConfig.frequency ?? 'daily'
  const client = entitlements ? toClientEntitlements(entitlements) : null
  const apiUpgradePlanName = cheapestPlanWith('api')?.name ?? 'Business'

  // Whether there is anything for the Stripe portal to manage. Read as a
  // boolean here so the customer id itself never crosses into a client
  // component — it is not a secret, but it has no business in the browser.
  const hasBilling = Boolean((workspace as { stripe_customer_id?: string | null })?.stripe_customer_id)

  const slackConfig = slackRow ? parseSlackConfig(slackRow.config) : null
  const slackConnection: SlackConnectionView = slackConfig
    ? slackRow?.is_active && slackConfig.channelId && slackConfig.channelName
      ? { status: 'connected', teamName: slackConfig.teamName, channelName: slackConfig.channelName }
      : { status: 'pending_channel', teamName: slackConfig.teamName, channelName: null }
    : { status: 'disconnected', teamName: null, channelName: null }
  const slackUpgradePlanName = cheapestPlanWith('slack')?.name ?? 'Pro'

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-5 px-4 py-6 sm:px-6">
      <h1 className="text-page-title text-text">Settings</h1>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Building2 className="size-4 text-text-faint" />
            <CardTitle>Workspace</CardTitle>
          </div>
          <CardDescription>Public labels and support identifiers for this workspace.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          <SettingRow label="Workspace name" value={workspace.name ?? '—'} />
          <SettingRow label="Domain" value={workspace.domain ?? '—'} />
          <SettingRow label="Workspace ID" value={workspace.id} mono />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Bell className="size-4 text-text-faint" />
            <CardTitle>Notifications</CardTitle>
          </div>
          <CardDescription>Where PageWatch sends monitor changes and alert digests.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          <div className="flex items-center justify-between gap-3 rounded border border-border bg-bg-subtle px-3 py-2.5">
            <div className="flex items-center gap-2 min-w-0">
              <Mail className="size-3.5 shrink-0 text-text-faint" />
              <div className="min-w-0">
                <p className="text-ui text-text">Email alerts</p>
                <p className="truncate text-meta text-text-muted">
                  {emailChannel ? `${emailFreq.charAt(0).toUpperCase()}${emailFreq.slice(1)} digest to ${emailAddr}` : 'Not configured'}
                </p>
              </div>
            </div>
            <Badge tone={emailChannel?.is_active ? 'ok' : 'neutral'} size="sm">
              {emailChannel?.is_active ? 'Active' : 'Inactive'}
            </Badge>
          </div>

          <SlackIntegrationCard
            connection={slackConnection}
            slackEnabled={!!client?.features.slack}
            upgradePlanName={slackUpgradePlanName}
            initialStatusParam={slackStatusParam}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <User className="size-4 text-text-faint" />
            <CardTitle>Account</CardTitle>
          </div>
          <CardDescription>Signed-in user details for this workspace.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          <SettingRow label="Email address" value={user?.email ?? '—'} />
          <SettingRow label="User ID" value={user?.id ?? '—'} mono />
        </CardContent>
      </Card>

      <Card id="billing">
        <CardHeader>
          <div className="flex items-center gap-2">
            <CreditCard className="size-4 text-text-faint" />
            <CardTitle>Plan &amp; usage</CardTitle>
          </div>
          <CardDescription>Current plan limits and this period&rsquo;s usage.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-ui-medium text-text">{client?.planName ?? 'Free'} plan</p>
              <p className="text-meta text-text-muted">
                {client ? `${client.limits.maxMonitors} monitors · ${client.limits.maxChecksPerMonth.toLocaleString()} checks/mo` : '—'}
              </p>
            </div>
            <div className="flex shrink-0 gap-2">
              {/* Only shown once there is a Stripe customer to manage —
                  a button that always errors is worse than no button. */}
              {hasBilling && <ManageBillingButton />}
              <Button asChild size="sm">
                <Link href="/#pricing">
                  Upgrade <ArrowUpRight className="size-3.5" />
                </Link>
              </Button>
            </div>
          </div>
          <Separator />
          {client && (
            <div className="flex flex-col gap-3">
              <Meter label="Monitors" value={client.usage.monitors} max={client.limits.maxMonitors} tone={client.remaining.monitors <= 0 ? 'warn' : 'accent'} />
              <Meter
                label="Checks this period"
                value={client.usage.checksThisPeriod}
                max={client.limits.maxChecksPerMonth}
                tone={client.remaining.checksThisPeriod <= 0 ? 'warn' : 'accent'}
              />
              <Meter label="Seats" value={client.usage.seats} max={client.limits.maxSeats} />
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Terminal className="size-4 text-text-faint" />
            <CardTitle>Developer</CardTitle>
          </div>
          <CardDescription>REST API keys and outbound webhooks for alert events.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <ApiKeysCard apiKeys={apiKeys} apiEnabled={!!client?.features.api} upgradePlanName={apiUpgradePlanName} />
          <Separator />
          <WebhooksCard
            endpoints={webhookEndpoints}
            deliveries={webhookDeliveries}
            apiEnabled={!!client?.features.api}
            upgradePlanName={apiUpgradePlanName}
          />
        </CardContent>
      </Card>

      <Card className="border-critical/30">
        <CardHeader>
          <div className="flex items-center gap-2">
            <AlertTriangle className="size-4 text-critical" />
            <CardTitle>Danger zone</CardTitle>
          </div>
          <CardDescription>Permanent workspace-level actions.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-2.5">
          <p className="text-ui text-text-muted">
            Deleting your workspace permanently removes monitored URLs, screenshots, and alert history. This action
            cannot be undone.
          </p>
          <Button variant="danger" size="sm" className="w-fit" disabled title="Contact support to delete your workspace">
            Delete workspace
          </Button>
          <p className="text-meta text-text-faint">
            Contact{' '}
            <a href="mailto:support@pagewatch.dev" className="text-text-muted underline hover:text-text">
              support@pagewatch.dev
            </a>{' '}
            to request account deletion.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

function SettingRow({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-label uppercase text-text-faint">{label}</span>
      <span className={mono ? 'break-all font-mono text-meta text-text' : 'text-ui text-text'}>{value}</span>
    </div>
  )
}
