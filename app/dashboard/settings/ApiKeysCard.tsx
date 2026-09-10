'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Check, Copy, Key } from 'lucide-react'
import { createApiKey, revokeApiKey, type ApiKeySummary } from '@/lib/actions/api-keys'
import { useToast } from '@/components/ui/ToastProvider'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Field } from '@/components/ui/field'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
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
 * API keys section of `/dashboard/settings`.
 *
 * The plaintext key exists in this component's state for exactly as long as
 * the "here it is, once" dialog is open — it comes straight from
 * `createApiKey`'s return value, never from a fetch that could be repeated.
 * Closing the dialog (or navigating away) discards it; there is nothing in
 * this file, or anywhere server-side, that can produce it again — see
 * `lib/api-keys.ts`'s header comment.
 */

type Scope = 'read' | 'read_write'

interface ApiKeysCardProps {
  apiKeys: ApiKeySummary[]
  apiEnabled: boolean
  upgradePlanName: string
}

export function ApiKeysCard({ apiKeys, apiEnabled, upgradePlanName }: ApiKeysCardProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [isPending, startTransition] = useTransition()

  const [createOpen, setCreateOpen] = useState(false)
  const [name, setName] = useState('')
  const [scope, setScope] = useState<Scope>('read')

  const [revealKey, setRevealKey] = useState<{ name: string; plaintext: string } | null>(null)
  const [copied, setCopied] = useState(false)

  const [confirmRevoke, setConfirmRevoke] = useState<ApiKeySummary | null>(null)

  const activeKeys = apiKeys.filter((key) => !key.revoked_at)

  function handleCreate(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim()) return

    startTransition(async () => {
      const res = await createApiKey({ name: name.trim(), scope })
      if (!res.ok) {
        toast({
          title: 'Could not create key',
          description: res.message,
          tone: 'error',
          action:
            res.kind === 'entitlement' && res.upgradeTo
              ? { label: `Upgrade to ${res.upgradeTo}`, href: '/dashboard/settings#billing' }
              : undefined,
        })
        return
      }

      setCreateOpen(false)
      setName('')
      setScope('read')
      setCopied(false)
      setRevealKey({ name: res.data.name, plaintext: res.data.plaintext })
      router.refresh()
    })
  }

  function handleRevoke(key: ApiKeySummary) {
    startTransition(async () => {
      const res = await revokeApiKey({ id: key.id })
      if (!res.ok) {
        toast({ title: 'Could not revoke key', description: res.message, tone: 'error' })
        return
      }
      toast({ title: 'API key revoked', description: `"${key.name}" can no longer be used.`, tone: 'success' })
      setConfirmRevoke(null)
      router.refresh()
    })
  }

  async function copyRevealedKey() {
    if (!revealKey) return
    try {
      await navigator.clipboard.writeText(revealKey.plaintext)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2000)
    } catch {
      toast({ title: 'Could not copy', description: 'Select and copy the key manually.', tone: 'error' })
    }
  }

  return (
    <div className="flex flex-col gap-2.5">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 min-w-0">
          <Key className="size-3.5 shrink-0 text-text-faint" />
          <div className="min-w-0">
            <p className="text-ui text-text">API keys</p>
            <p className="truncate text-meta text-text-muted">
              {apiEnabled
                ? activeKeys.length > 0
                  ? `${activeKeys.length} active`
                  : 'No keys yet'
                : `Available on ${upgradePlanName}`}
            </p>
          </div>
        </div>

        {apiEnabled ? (
          <Button size="sm" iconLeft={<Key className="size-3.5" />} onClick={() => setCreateOpen(true)}>
            New key
          </Button>
        ) : (
          <Tooltip>
            <TooltipTrigger asChild>
              <span tabIndex={0}>
                <Button size="sm" iconLeft={<Key className="size-3.5" />} disabled>
                  New key
                </Button>
              </span>
            </TooltipTrigger>
            <TooltipContent>The API is available on {upgradePlanName} and above.</TooltipContent>
          </Tooltip>
        )}
      </div>

      {apiEnabled && activeKeys.length > 0 && (
        <div className="flex flex-col gap-1.5">
          {activeKeys.map((key) => (
            <div
              key={key.id}
              className="flex items-center justify-between gap-3 rounded border border-border bg-bg-subtle px-3 py-2"
            >
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="truncate text-ui text-text">{key.name}</span>
                  <Badge tone={key.scope === 'read_write' ? 'accent' : 'neutral'} size="sm">
                    {key.scope === 'read_write' ? 'read/write' : 'read'}
                  </Badge>
                </div>
                <p className="truncate font-mono text-meta text-text-faint">
                  {key.key_prefix}&hellip; &middot; created {formatDate(key.created_at)} &middot;{' '}
                  {key.last_used_at ? `last used ${formatDate(key.last_used_at)}` : 'never used'}
                </p>
              </div>
              <Button
                variant="danger"
                size="sm"
                className="shrink-0"
                onClick={() => setConfirmRevoke(key)}
                disabled={isPending}
              >
                Revoke
              </Button>
            </div>
          ))}
        </div>
      )}

      {/* Create key */}
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent>
          <form onSubmit={handleCreate}>
            <DialogHeader>
              <DialogTitle>New API key</DialogTitle>
              <DialogDescription>
                Grants access to the PageWatch REST API on this workspace. The key is shown once, right after
                creation.
              </DialogDescription>
            </DialogHeader>
            <div className="flex flex-col gap-3 py-4">
              <Field label="Name" htmlFor="api-key-name" description="Helps you tell keys apart later.">
                <Input
                  id="api-key-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="CI pipeline"
                  maxLength={120}
                  disabled={isPending}
                  autoFocus
                />
              </Field>
              <Field label="Scope" htmlFor="api-key-scope">
                <Select value={scope} onValueChange={(v) => setScope(v as Scope)}>
                  <SelectTrigger id="api-key-scope">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="read">Read — list monitors, alerts, snapshots</SelectItem>
                    <SelectItem value="read_write">Read/write — also create, edit, run checks</SelectItem>
                  </SelectContent>
                </Select>
              </Field>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="secondary">
                  Cancel
                </Button>
              </DialogClose>
              <Button type="submit" loading={isPending} disabled={!name.trim()}>
                Create key
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Reveal — shown exactly once */}
      <Dialog open={!!revealKey} onOpenChange={(open) => !open && setRevealKey(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{revealKey?.name}</DialogTitle>
            <DialogDescription>Copy this key now. You will not be able to see it again.</DialogDescription>
          </DialogHeader>
          <div className="flex items-center gap-2 py-2">
            <code className="flex-1 truncate rounded border border-border-strong bg-bg-subtle px-2.5 py-2 font-mono text-meta text-text">
              {revealKey?.plaintext}
            </code>
            <Button
              variant="secondary"
              size="sm"
              className="shrink-0"
              onClick={copyRevealedKey}
              iconLeft={copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
            >
              {copied ? 'Copied' : 'Copy'}
            </Button>
          </div>
          <p className="text-meta text-warn">
            PageWatch stores only a one-way hash of this key. If you lose it, revoke it and create a new one — there
            is no way to recover it.
          </p>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="secondary">Done</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Revoke — behind a confirm */}
      <Dialog open={!!confirmRevoke} onOpenChange={(open) => !open && setConfirmRevoke(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Revoke &ldquo;{confirmRevoke?.name}&rdquo;?</DialogTitle>
            <DialogDescription>
              Any integration using this key stops working immediately. This cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="secondary">Cancel</Button>
            </DialogClose>
            <Button variant="danger" loading={isPending} onClick={() => confirmRevoke && handleRevoke(confirmRevoke)}>
              Revoke key
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })
}
