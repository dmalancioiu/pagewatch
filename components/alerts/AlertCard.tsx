'use client'

import { useState, useTransition } from 'react'
import Link from 'next/link'
import { Check, X } from 'lucide-react'
import type { Alert } from '@/lib/types/database.types'
import { SeverityBadge } from '@/components/ui/severity-badge'
import { IconButton } from '@/components/ui/icon-button'
import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/ToastProvider'
import { acknowledgeAlert, dismissAlert } from '@/lib/actions/alerts'

function timeAgo(iso: string | null | undefined): string {
  if (!iso) return ''
  const diff = Date.now() - new Date(iso).getTime()
  const m = Math.floor(diff / 60000)
  if (m < 1) return 'Just now'
  if (m < 60) return `${m}m ago`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h}h ago`
  return `${Math.floor(h / 24)}d ago`
}

function host(url: string | null | undefined) {
  try {
    return new URL(url ?? '').hostname.replace(/^www\./, '')
  } catch {
    return url || ''
  }
}

interface AlertCardProps {
  alert: Alert
}

/**
 * One alert row — grouped-by-day list is composed by the alerts page, this
 * is a single row inside it, with Acknowledge/Dismiss as row actions.
 *
 * `acknowledgeAlert`/`dismissAlert` (lib/actions/alerts.ts) are still the
 * legacy server actions — they throw rather than returning `ActionResult`.
 * lib/** is off-limits to this pass, so they are called through try/catch
 * here rather than the new action() convention.
 */
export function AlertCard({ alert }: AlertCardProps) {
  const { toast } = useToast()
  const [isPending, startTransition] = useTransition()
  const [status, setStatus] = useState(alert.status)

  if (status === 'dismissed') return null

  const name = alert.monitored_urls?.name || 'Untitled monitor'
  const url = alert.monitored_urls?.url ?? ''
  const isOpen = status === 'open'

  function handleAcknowledge() {
    startTransition(async () => {
      try {
        await acknowledgeAlert(alert.id)
        setStatus('acknowledged')
      } catch (err) {
        toast({
          title: 'Could not acknowledge alert',
          description: err instanceof Error ? err.message : undefined,
          tone: 'error',
        })
      }
    })
  }

  function handleDismiss() {
    startTransition(async () => {
      try {
        await dismissAlert(alert.id)
        setStatus('dismissed')
      } catch (err) {
        toast({
          title: 'Could not dismiss alert',
          description: err instanceof Error ? err.message : undefined,
          tone: 'error',
        })
      }
    })
  }

  return (
    <div className="flex items-start gap-3 border-b border-border px-3.5 py-3 last:border-b-0">
      <Link href={`/dashboard/urls/${alert.monitored_url_id}`} className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
          <span className="text-ui-medium text-text">{name}</span>
          {url && <span className="font-mono text-meta text-text-faint">{host(url)}</span>}
          <SeverityBadge severity={alert.severity} size="sm" />
          {!isOpen && <span className="text-meta text-text-faint">Acknowledged</span>}
        </div>
        {/* Plain-English change first — the percentage is secondary metadata (design system §7). */}
        <p className="mt-0.5 line-clamp-2 text-ui text-text-muted">
          {alert.ai_summary || alert.summary || 'A visual change was detected.'}
        </p>
      </Link>

      <div className="flex shrink-0 items-center gap-2">
        <span className="whitespace-nowrap text-meta text-text-faint">
          {timeAgo(alert.triggered_at ?? alert.created_at)}
        </span>
        {isOpen && (
          <>
            <Button
              size="sm"
              variant="secondary"
              iconLeft={<Check className="size-3.5" />}
              onClick={handleAcknowledge}
              disabled={isPending}
            >
              Acknowledge
            </Button>
            <IconButton aria-label="Dismiss alert" size="sm" onClick={handleDismiss} disabled={isPending}>
              <X className="size-3.5" />
            </IconButton>
          </>
        )}
      </div>
    </div>
  )
}
