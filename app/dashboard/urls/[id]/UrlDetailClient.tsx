'use client'

import { useMemo, useState } from 'react'
import { AlertTriangle, CheckCircle2, ImageIcon, Maximize2 } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { EmptyState } from '@/components/ui/empty-state'
import { Panel, PanelHeader, PanelFooter } from '@/components/ui/panel'
import { SeverityBadge } from '@/components/ui/severity-badge'
import type { AlertSeverity } from '@/lib/types/database.types'

/**
 * The capture history for one monitor: the open alert, if any, and the grid of
 * past captures.
 *
 * Selection is a controlled prop — the parent owns which capture is showing in
 * the viewer. It used to be driven by a sibling component that found these
 * buttons with `document.querySelector` and toggled their classes directly,
 * which meant a copy change silently broke the timeline.
 */

/**
 * Per-zone diff detail recorded on an alert by the capture pipeline. Typed
 * here rather than reached for through `any`, since the inspector reads it to
 * name which zone actually triggered.
 */
export interface ZoneScore {
  label?: string
  instruction?: string | null
  sensitivity?: 'low' | 'normal' | 'high'
  diff_pct?: number
  alert_score?: number
  passes_threshold?: boolean
}

export interface AlertMetadata {
  zone_scores?: ZoneScore[]
  alert_score?: number
  page_diff_pct?: number
  zone_diff_pct?: number | null
  passed_zone_count?: number
  [key: string]: unknown
}

export interface AlertWithUrls {
  id: string
  diff_pct: number | null
  severity: AlertSeverity | null
  status: string
  created_at: string
  ai_summary?: string | null
  metadata?: AlertMetadata | null
  beforeUrl: string | null
  afterUrl: string | null
  diffUrl: string | null
}

export interface SnapshotWithUrl {
  id: string
  storage_path: string
  taken_at: string
  file_size_bytes: number | null
  signedUrl: string | null
  /** 480px capture thumbnail — falls back to the full-size `signedUrl`. */
  thumbUrl: string | null
}

interface Props {
  snapshots: SnapshotWithUrl[]
  alertBySnapshotId: Record<string, AlertWithUrls>
  openAlert: AlertWithUrls | null
  onResolveAlert: () => void
  isResolvingAlert: boolean
  selectedId: string | null
  onSelectSnapshot: (id: string) => void
  onOpenFullscreen: () => void
}

type CaptureFilter = 'all' | 'changes' | 'clean'

const PAGE_SIZE = 12

const FILTER_LABELS: Record<CaptureFilter, string> = {
  all: 'All',
  changes: 'Changes',
  clean: 'No change',
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function timeAgo(iso: string): string {
  const minutes = Math.floor((Date.now() - new Date(iso).getTime()) / 60000)
  if (minutes < 1) return 'just now'
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  return `${Math.floor(hours / 24)}d ago`
}

export function UrlDetailClient({
  snapshots,
  alertBySnapshotId,
  openAlert,
  onResolveAlert,
  isResolvingAlert,
  selectedId,
  onSelectSnapshot,
  onOpenFullscreen,
}: Props) {
  const [filter, setFilter] = useState<CaptureFilter>('all')
  const [page, setPage] = useState(0)

  const filtered = useMemo(
    () =>
      snapshots.filter((snapshot) => {
        if (filter === 'changes') return Boolean(alertBySnapshotId[snapshot.id])
        if (filter === 'clean') return !alertBySnapshotId[snapshot.id]
        return true
      }),
    [snapshots, filter, alertBySnapshotId]
  )

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const safePage = Math.min(page, pageCount - 1)
  const visible = filtered.slice(safePage * PAGE_SIZE, safePage * PAGE_SIZE + PAGE_SIZE)

  const changeCount = Object.keys(alertBySnapshotId).length

  return (
    <div className="flex flex-col gap-4">
      {openAlert && (
        <Panel className="border-critical/25 bg-critical-subtle">
          <div className="flex flex-wrap items-start gap-3 p-4">
            <AlertTriangle className="mt-0.5 size-4 shrink-0 text-critical" aria-hidden />

            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-ui-medium text-text">Change detected</span>
                {openAlert.severity && <SeverityBadge severity={openAlert.severity} size="sm" />}
                <span className="text-meta text-text-faint">{timeAgo(openAlert.created_at)}</span>
              </div>

              {/* The summary is the headline. The percentage is engineering
                  detail and stays secondary. */}
              <p className="mt-1 text-ui text-text-muted">
                {openAlert.ai_summary ?? 'A change was detected on this page.'}
              </p>

              {openAlert.diff_pct != null && (
                <p className="mt-1 font-mono text-meta text-text-faint tabular-nums">
                  {Number(openAlert.diff_pct).toFixed(1)}% of pixels differ
                </p>
              )}
            </div>

            <div className="flex shrink-0 gap-2">
              <Button variant="secondary" size="sm" onClick={onOpenFullscreen}>
                <Maximize2 className="size-3.5" aria-hidden />
                Compare
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={onResolveAlert}
                disabled={isResolvingAlert}
              >
                <CheckCircle2 className="size-3.5" aria-hidden />
                {isResolvingAlert ? 'Resolving…' : 'Resolve'}
              </Button>
            </div>
          </div>
        </Panel>
      )}

      <Panel>
        <PanelHeader className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-section-title text-text">Captures</h2>
            <p className="text-meta text-text-faint">
              {snapshots.length} total · {changeCount} with changes
            </p>
          </div>

          <div
            role="group"
            aria-label="Filter captures"
            className="flex gap-1 rounded-md bg-bg-subtle p-1"
          >
            {(Object.keys(FILTER_LABELS) as CaptureFilter[]).map((key) => (
              <button
                key={key}
                type="button"
                aria-pressed={filter === key}
                onClick={() => {
                  setFilter(key)
                  setPage(0)
                }}
                className={
                  filter === key
                    ? 'rounded px-2.5 py-1 text-meta font-medium bg-panel text-text'
                    : 'rounded px-2.5 py-1 text-meta text-text-faint hover:text-text'
                }
              >
                {FILTER_LABELS[key]}
              </button>
            ))}
          </div>
        </PanelHeader>

        {visible.length === 0 ? (
          <EmptyState
            icon={<ImageIcon className="size-4" aria-hidden />}
            title={snapshots.length === 0 ? 'No captures yet' : 'Nothing matches this filter'}
            description={
              snapshots.length === 0
                ? 'The first check runs shortly. Alerts start once there is a previous capture to compare against.'
                : 'Try a different filter to see more captures.'
            }
          />
        ) : (
          <div className="grid grid-cols-2 gap-2 p-3 sm:grid-cols-3 lg:grid-cols-4">
            {visible.map((snapshot) => {
              const alert = alertBySnapshotId[snapshot.id]
              const isSelected = snapshot.id === selectedId

              return (
                <button
                  key={snapshot.id}
                  type="button"
                  aria-pressed={isSelected}
                  onClick={() => onSelectSnapshot(snapshot.id)}
                  className={
                    'group overflow-hidden rounded-md border text-left transition-colors ' +
                    (isSelected
                      ? 'border-accent ring-1 ring-accent'
                      : 'border-border hover:border-border-strong')
                  }
                >
                  <div className="relative aspect-[4/3] overflow-hidden bg-bg-subtle">
                    {/* Thumbnails are written at 480px per capture so this grid
                        never pulls the multi-megabyte originals. */}
                    {snapshot.thumbUrl ?? snapshot.signedUrl ? (
                      <img
                        src={(snapshot.thumbUrl ?? snapshot.signedUrl) as string}
                        alt=""
                        loading="lazy"
                        className="size-full object-cover object-top"
                      />
                    ) : (
                      <div className="flex size-full items-center justify-center text-text-faint">
                        <ImageIcon className="size-4" aria-hidden />
                      </div>
                    )}

                    {alert && (
                      <span className="absolute left-2 top-2">
                        <Badge tone="critical" size="sm">
                          Changed
                        </Badge>
                      </span>
                    )}
                  </div>

                  <div className="flex items-baseline justify-between gap-2 px-2.5 py-2">
                    <span className="truncate text-meta text-text">
                      {formatDate(snapshot.taken_at)}
                    </span>
                    {alert?.diff_pct != null && (
                      <span className="shrink-0 font-mono text-meta text-text-faint tabular-nums">
                        {Number(alert.diff_pct).toFixed(1)}%
                      </span>
                    )}
                  </div>
                </button>
              )
            })}
          </div>
        )}

        {pageCount > 1 && (
          <PanelFooter className="flex items-center justify-between">
            <span className="text-meta text-text-faint tabular-nums">
              Page {safePage + 1} of {pageCount}
            </span>
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setPage((p) => Math.max(0, p - 1))}
                disabled={safePage === 0}
              >
                Previous
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setPage((p) => Math.min(pageCount - 1, p + 1))}
                disabled={safePage >= pageCount - 1}
              >
                Next
              </Button>
            </div>
          </PanelFooter>
        )}
      </Panel>
    </div>
  )
}
