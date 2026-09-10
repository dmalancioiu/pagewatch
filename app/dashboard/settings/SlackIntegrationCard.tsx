'use client'

import { useEffect, useState, useTransition } from 'react'
import { Slack } from 'lucide-react'
import { setSlackChannel, disconnectSlack } from '@/lib/actions/integrations'
import { useToast } from '@/components/ui/ToastProvider'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip'

/**
 * The Slack card on `/dashboard/settings`.
 *
 * Three states, matched to what `notification_channels` can actually hold:
 * not connected (no row, or the OAuth round trip never finished), connected
 * but no channel chosen yet (a row exists with `channel_id: null` — see
 * `app/api/slack/callback/route.ts`), and fully connected. All three render
 * unconditionally — a plan without the `slack` feature still sees the same
 * card, disabled, with a `Tooltip` naming the plan that unlocks it, per
 * design system §5's rule that a disabled control always says why.
 *
 * `connection` is a server-projected, already-sanitized view — see
 * `app/dashboard/settings/page.tsx`. It never carries the bot token; this
 * component has no way to request it either, since `setSlackChannel` and
 * `disconnectSlack` (the only calls it makes) never return one.
 */

export type SlackConnectionStatus = 'disconnected' | 'pending_channel' | 'connected'

export interface SlackConnectionView {
  status: SlackConnectionStatus
  teamName: string | null
  channelName: string | null
}

interface SlackIntegrationCardProps {
  connection: SlackConnectionView
  slackEnabled: boolean
  upgradePlanName: string
  /** From the `?slack=` query param the OAuth redirects land on — shown once, as a toast. */
  initialStatusParam?: string
}

const STATUS_MESSAGES: Record<string, { title: string; description?: string; tone: 'success' | 'error' | 'info' }> = {
  connected: { title: 'Slack connected', description: 'Choose a channel below to finish setup.', tone: 'success' },
  denied: { title: 'Slack install cancelled', tone: 'info' },
  invalid_state: { title: 'Slack connection could not be verified', description: 'Try connecting again.', tone: 'error' },
  not_configured: { title: 'Slack is not set up for this app yet', tone: 'error' },
  plan_required: { title: 'Slack requires a plan upgrade', tone: 'error' },
  no_workspace: { title: 'No workspace found', tone: 'error' },
  error: { title: 'Could not connect Slack', description: 'Please try again.', tone: 'error' },
}

export function SlackIntegrationCard({
  connection,
  slackEnabled,
  upgradePlanName,
  initialStatusParam,
}: SlackIntegrationCardProps) {
  const { toast } = useToast()
  const [channelInput, setChannelInput] = useState('')
  const [isPending, startTransition] = useTransition()

  useEffect(() => {
    if (!initialStatusParam) return
    const message = STATUS_MESSAGES[initialStatusParam]
    if (message) toast(message)
  }, [initialStatusParam, toast])

  function handleSaveChannel(e: React.FormEvent) {
    e.preventDefault()
    if (!channelInput.trim()) return

    startTransition(async () => {
      const res = await setSlackChannel({ channel: channelInput })
      if (!res.ok) {
        toast({ title: 'Could not connect that channel', description: res.message, tone: 'error' })
        return
      }
      toast({ title: 'Slack channel connected', description: `Alerts will post to #${res.data.channelName}.`, tone: 'success' })
      setChannelInput('')
    })
  }

  function handleDisconnect() {
    startTransition(async () => {
      const res = await disconnectSlack()
      if (!res.ok) {
        toast({ title: 'Could not disconnect Slack', description: res.message, tone: 'error' })
        return
      }
      toast({ title: 'Slack disconnected', tone: 'success' })
    })
  }

  return (
    <div className="flex flex-col gap-2.5 rounded border border-border bg-bg-subtle px-3 py-2.5">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 min-w-0">
          <Slack className="size-3.5 shrink-0 text-text-faint" />
          <div className="min-w-0">
            <p className="text-ui text-text">Slack delivery</p>
            <p className="truncate text-meta text-text-muted">
              {connection.status === 'connected' && connection.channelName
                ? `${connection.teamName} · #${connection.channelName}`
                : connection.status === 'pending_channel'
                  ? `${connection.teamName} · choose a channel below`
                  : slackEnabled
                    ? 'Not connected'
                    : `Available on ${upgradePlanName}`}
            </p>
          </div>
        </div>

        {connection.status === 'connected' ? (
          <div className="flex shrink-0 items-center gap-2">
            <Badge tone="ok" size="sm">
              Active
            </Badge>
            <Button variant="secondary" size="sm" onClick={handleDisconnect} loading={isPending}>
              Disconnect
            </Button>
          </div>
        ) : connection.status === 'pending_channel' ? (
          <Button variant="secondary" size="sm" onClick={handleDisconnect} loading={isPending}>
            Disconnect
          </Button>
        ) : slackEnabled ? (
          <Button asChild size="sm">
            <a href="/api/slack/install">
              <Slack className="size-3.5" />
              Connect
            </a>
          </Button>
        ) : (
          <Tooltip>
            <TooltipTrigger asChild>
              <span tabIndex={0}>
                <Button size="sm" iconLeft={<Slack className="size-3.5" />} disabled>
                  Connect
                </Button>
              </span>
            </TooltipTrigger>
            <TooltipContent>Slack delivery is available on {upgradePlanName} and above.</TooltipContent>
          </Tooltip>
        )}
      </div>

      {connection.status === 'pending_channel' && slackEnabled && (
        <form onSubmit={handleSaveChannel} className="flex items-center gap-2">
          <Input
            value={channelInput}
            onChange={(e) => setChannelInput(e.target.value)}
            placeholder="alerts"
            prefix="#"
            aria-label="Slack channel name"
            disabled={isPending}
          />
          <Button type="submit" size="sm" loading={isPending} disabled={!channelInput.trim()}>
            Save channel
          </Button>
        </form>
      )}
    </div>
  )
}
