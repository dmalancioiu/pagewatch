'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Check, Copy, Eye, EyeOff, Webhook } from 'lucide-react'
import {
  createWebhookEndpoint,
  deleteWebhookEndpoint,
  regenerateWebhookSecret,
  setWebhookEndpointActive,
  type WebhookDeliverySummary,
  type WebhookEndpointRow,
} from '@/lib/actions/webhooks'
import { useToast } from '@/components/ui/ToastProvider'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Field } from '@/components/ui/field'
import { Switch } from '@/components/ui/switch'
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

/**
 * Webhooks section of `/dashboard/settings`.
 *
 * Unlike an API key, a webhook secret IS re-visible here (behind an explicit
 * reveal toggle, never shown by default) — see `lib/webhooks.ts`'s header
 * comment for why: the worker has to read it back on every delivery, and the
 * customer has to read it back to configure their receiver's verification.
 */

interface WebhooksCardProps {
  endpoints: WebhookEndpointRow[]
  deliveries: WebhookDeliverySummary[]
  apiEnabled: boolean
  upgradePlanName: string
}

export function WebhooksCard({ endpoints, deliveries, apiEnabled, upgradePlanName }: WebhooksCardProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [isPending, startTransition] = useTransition()

  const [createOpen, setCreateOpen] = useState(false)
  const [url, setUrl] = useState('')
  const [description, setDescription] = useState('')

  const [revealedIds, setRevealedIds] = useState<Set<string>>(new Set())
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [confirmDelete, setConfirmDelete] = useState<WebhookEndpointRow | null>(null)

  function toggleReveal(id: string) {
    setRevealedIds((prev) => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  function handleCreate(e: React.FormEvent) {
    e.preventDefault()
    if (!url.trim()) return

    startTransition(async () => {
      const res = await createWebhookEndpoint({ url: url.trim(), description: description.trim() || undefined })
      if (!res.ok) {
        toast({
          title: 'Could not add endpoint',
          description: res.message,
          tone: 'error',
          action:
            res.kind === 'entitlement' && res.upgradeTo
              ? { label: `Upgrade to ${res.upgradeTo}`, href: '/dashboard/settings#billing' }
              : undefined,
        })
        return
      }
      toast({ title: 'Webhook endpoint added', tone: 'success' })
      setCreateOpen(false)
      setUrl('')
      setDescription('')
      router.refresh()
    })
  }

  function handleToggleActive(endpoint: WebhookEndpointRow) {
    startTransition(async () => {
      const res = await setWebhookEndpointActive({ id: endpoint.id, isActive: !endpoint.is_active })
      if (!res.ok) {
        toast({ title: 'Could not update endpoint', description: res.message, tone: 'error' })
        return
      }
      router.refresh()
    })
  }

  function handleRegenerateSecret(endpoint: WebhookEndpointRow) {
    startTransition(async () => {
      const res = await regenerateWebhookSecret({ id: endpoint.id })
      if (!res.ok) {
        toast({ title: 'Could not regenerate secret', description: res.message, tone: 'error' })
        return
      }
      toast({
        title: 'Signing secret regenerated',
        description: 'Update your receiver with the new secret — the old one no longer verifies.',
        tone: 'success',
      })
      router.refresh()
    })
  }

  function handleDelete(endpoint: WebhookEndpointRow) {
    startTransition(async () => {
      const res = await deleteWebhookEndpoint({ id: endpoint.id })
      if (!res.ok) {
        toast({ title: 'Could not remove endpoint', description: res.message, tone: 'error' })
        return
      }
      toast({ title: 'Webhook endpoint removed', tone: 'success' })
      setConfirmDelete(null)
      router.refresh()
    })
  }

  async function copySecret(endpoint: WebhookEndpointRow) {
    try {
      await navigator.clipboard.writeText(endpoint.secret)
      setCopiedId(endpoint.id)
      window.setTimeout(() => setCopiedId(null), 2000)
    } catch {
      toast({ title: 'Could not copy', description: 'Select and copy the secret manually.', tone: 'error' })
    }
  }

  return (
    <div className="flex flex-col gap-2.5">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 min-w-0">
          <Webhook className="size-3.5 shrink-0 text-text-faint" />
          <div className="min-w-0">
            <p className="text-ui text-text">Webhooks</p>
            <p className="truncate text-meta text-text-muted">
              {apiEnabled
                ? endpoints.length > 0
                  ? `${endpoints.length} endpoint${endpoints.length === 1 ? '' : 's'}`
                  : 'No endpoints yet'
                : `Available on ${upgradePlanName}`}
            </p>
          </div>
        </div>

        {apiEnabled ? (
          <Button size="sm" iconLeft={<Webhook className="size-3.5" />} onClick={() => setCreateOpen(true)}>
            Add endpoint
          </Button>
        ) : (
          <Tooltip>
            <TooltipTrigger asChild>
              <span tabIndex={0}>
                <Button size="sm" iconLeft={<Webhook className="size-3.5" />} disabled>
                  Add endpoint
                </Button>
              </span>
            </TooltipTrigger>
            <TooltipContent>Webhooks are available on {upgradePlanName} and above.</TooltipContent>
          </Tooltip>
        )}
      </div>

      {apiEnabled && endpoints.length > 0 && (
        <div className="flex flex-col gap-1.5">
          {endpoints.map((endpoint) => {
            const revealed = revealedIds.has(endpoint.id)
            return (
              <div key={endpoint.id} className="flex flex-col gap-2 rounded border border-border bg-bg-subtle px-3 py-2.5">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate font-mono text-ui text-text">{endpoint.url}</p>
                    <p className="truncate text-meta text-text-faint">
                      {endpoint.description || 'No description'} &middot; added {formatDate(endpoint.created_at)}
                    </p>
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    <Badge tone={endpoint.is_active ? 'ok' : 'neutral'} size="sm">
                      {endpoint.is_active ? 'Active' : 'Paused'}
                    </Badge>
                    <Switch
                      checked={endpoint.is_active}
                      onCheckedChange={() => handleToggleActive(endpoint)}
                      disabled={isPending}
                      aria-label={endpoint.is_active ? 'Pause endpoint' : 'Activate endpoint'}
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <code className="flex-1 truncate rounded border border-border bg-panel px-2 py-1.5 font-mono text-meta text-text">
                    {revealed ? endpoint.secret : maskSecret(endpoint.secret)}
                  </code>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="shrink-0"
                    onClick={() => toggleReveal(endpoint.id)}
                    aria-label={revealed ? 'Hide signing secret' : 'Reveal signing secret'}
                    iconLeft={revealed ? <EyeOff className="size-3.5" /> : <Eye className="size-3.5" />}
                  >
                    {revealed ? 'Hide' : 'Reveal'}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="shrink-0"
                    onClick={() => copySecret(endpoint)}
                    aria-label="Copy signing secret"
                    iconLeft={copiedId === endpoint.id ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
                  >
                    {copiedId === endpoint.id ? 'Copied' : 'Copy'}
                  </Button>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => handleRegenerateSecret(endpoint)}
                    loading={isPending}
                  >
                    Regenerate secret
                  </Button>
                  <Button variant="danger" size="sm" onClick={() => setConfirmDelete(endpoint)} disabled={isPending}>
                    Remove
                  </Button>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {apiEnabled && deliveries.length > 0 && (
        <div className="flex flex-col gap-1.5 rounded border border-border bg-bg-subtle px-3 py-2.5">
          <p className="text-label uppercase text-text-faint">Recent deliveries</p>
          <div className="flex flex-col gap-1">
            {deliveries.slice(0, 6).map((delivery) => (
              <div key={delivery.id} className="flex items-center justify-between gap-3 text-meta">
                <div className="flex min-w-0 items-center gap-2">
                  <Badge tone={delivery.status === 'success' ? 'ok' : 'critical'} size="sm">
                    {delivery.status}
                  </Badge>
                  <span className="truncate text-text-muted">
                    {delivery.event_type}
                    {delivery.response_status ? ` · HTTP ${delivery.response_status}` : ''}
                    {delivery.attempt_number > 1 ? ` · attempt ${delivery.attempt_number}` : ''}
                  </span>
                </div>
                <span className="shrink-0 text-text-faint">{formatDate(delivery.created_at)}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add endpoint */}
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent>
          <form onSubmit={handleCreate}>
            <DialogHeader>
              <DialogTitle>Add webhook endpoint</DialogTitle>
              <DialogDescription>
                PageWatch signs every delivery with HMAC-SHA256 — see the verification recipe in the API docs.
              </DialogDescription>
            </DialogHeader>
            <div className="flex flex-col gap-3 py-4">
              <Field label="Endpoint URL" htmlFor="webhook-url" description="Must be publicly reachable over https.">
                <Input
                  id="webhook-url"
                  type="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://example.com/webhooks/pagewatch"
                  disabled={isPending}
                  autoFocus
                />
              </Field>
              <Field label="Description" htmlFor="webhook-description" description="Optional — shown in this list only.">
                <Input
                  id="webhook-description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Zapier"
                  maxLength={200}
                  disabled={isPending}
                />
              </Field>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="secondary">
                  Cancel
                </Button>
              </DialogClose>
              <Button type="submit" loading={isPending} disabled={!url.trim()}>
                Add endpoint
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Remove — behind a confirm */}
      <Dialog open={!!confirmDelete} onOpenChange={(open) => !open && setConfirmDelete(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Remove this endpoint?</DialogTitle>
            <DialogDescription>
              PageWatch stops sending alert events to <span className="font-mono">{confirmDelete?.url}</span>. This
              cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="secondary">Cancel</Button>
            </DialogClose>
            <Button variant="danger" loading={isPending} onClick={() => confirmDelete && handleDelete(confirmDelete)}>
              Remove endpoint
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

function maskSecret(secret: string): string {
  const visible = secret.slice(0, 10)
  return `${visible}${'•'.repeat(24)}`
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })
}
