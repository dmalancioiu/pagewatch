'use client'

import Link from 'next/link'
import { useMemo, useState } from 'react'
import { ImageIcon, Zap } from 'lucide-react'
import { OverviewCards } from './OverviewCards'
import { Panel } from '@/components/ui/panel'
import { SeverityBadge } from '@/components/ui/severity-badge'
import { EmptyState } from '@/components/ui/empty-state'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import type { AlertSeverity } from '@/lib/types/database.types'

export interface FeedAlert {
  id: string
  monitored_url_id: string
  created_at: string | null
  status: string | null
  diff_pct: number | null
  ai_summary: string | null
  severity: AlertSeverity | null
  monitored_urls?: { name?: string | null; url?: string | null; mode?: string | null } | null
  thumbUrl?: string | null
}

interface MonitorLite {
  id: string
  is_active?: boolean | null
  consecutive_failures?: number | null
}

type Props = {
  alerts: FeedAlert[]
  monitors: MonitorLite[]
  checksToday: number
}

function timeAgo(iso: string | null | undefined): string {
  if (!iso) return 'Never'
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
    return url || 'unknown'
  }
}

function FeedThumb({ src, alt }: { src?: string | null; alt: string }) {
  if (!src) {
    return (
      <div className="flex size-10 shrink-0 items-center justify-center rounded-sm border border-border bg-bg-subtle text-text-faint">
        <ImageIcon className="size-3.5" />
      </div>
    )
  }
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      className="size-10 shrink-0 rounded-sm border border-border object-cover object-top"
    />
  )
}

function FeedItem({ alert }: { alert: FeedAlert }) {
  const name = alert.monitored_urls?.name || 'Untitled monitor'
  const isOpen = alert.status === 'open'

  return (
    <Link
      href={`/dashboard/urls/${alert.monitored_url_id}`}
      className="flex items-start gap-3 border-b border-border px-3.5 py-3 text-ui transition-colors duration-120 last:border-b-0 hover:bg-panel-raised"
    >
      <FeedThumb src={alert.thumbUrl} alt={`${name} capture`} />
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
          <span className="text-ui-medium text-text">{name}</span>
          <span className="font-mono text-meta text-text-faint">{host(alert.monitored_urls?.url)}</span>
          {alert.severity && <SeverityBadge severity={alert.severity} size="sm" />}
          {!isOpen && (
            <span className="text-meta text-text-faint">Acknowledged</span>
          )}
        </div>
        {/* Design system §7: the headline is the plain-English change, never a percentage. */}
        <p className="mt-0.5 line-clamp-2 text-ui text-text-muted">
          {alert.ai_summary || 'A visual change was detected and needs review.'}
        </p>
      </div>
      <span className="shrink-0 whitespace-nowrap text-meta text-text-faint">{timeAgo(alert.created_at)}</span>
    </Link>
  )
}

export function FeedPageClient({ alerts, monitors, checksToday }: Props) {
  const [filter, setFilter] = useState<'all' | 'open'>('all')

  const openCount = alerts.filter((a) => a.status === 'open').length
  const failingCount = monitors.filter((m) => (m.consecutive_failures ?? 0) > 0).length
  const activeCount = monitors.filter((m) => m.is_active !== false).length

  const filtered = useMemo(
    () => (filter === 'open' ? alerts.filter((a) => a.status === 'open') : alerts),
    [alerts, filter]
  )

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-4 px-4 py-6 sm:px-6">
      <div className="flex items-center justify-between gap-3">
        <h1 className="text-page-title text-text">Feed</h1>
      </div>

      <OverviewCards
        openAlerts={openCount}
        failingMonitors={failingCount}
        activeMonitors={activeCount}
        checksToday={checksToday}
      />

      {alerts.length > 0 && (
        <Tabs value={filter} onValueChange={(v) => setFilter(v as 'all' | 'open')}>
          <TabsList>
            <TabsTrigger value="all">All changes {alerts.length}</TabsTrigger>
            <TabsTrigger value="open">Open {openCount}</TabsTrigger>
          </TabsList>
        </Tabs>
      )}

      {alerts.length === 0 ? (
        <EmptyState
          icon={<Zap className="size-4" />}
          title="No changes yet"
          description="When PageWatch detects a meaningful visual change, it will appear here with a plain-English summary."
        />
      ) : filtered.length === 0 ? (
        <EmptyState title="Nothing open" description="Every change has been acknowledged." />
      ) : (
        <Panel>
          {filtered.map((alert) => (
            <FeedItem key={alert.id} alert={alert} />
          ))}
        </Panel>
      )}
    </div>
  )
}
