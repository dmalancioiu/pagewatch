'use client'

import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { AlertTriangle, CheckCircle2, ImageIcon, Maximize2 } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { EmptyState } from '@/components/ui/empty-state'
import { Panel, PanelHeader, PanelFooter } from '@/components/ui/panel'
import { SeverityBadge } from '@/components/ui/severity-badge'
import type { AlertSeverity } from '@/lib/types/database.types'
import type { ContentChange, PageExtract } from '@/lib/content-diff'

/**
 * The capture history for one monitor: the open alert, if any, and the grid of
 * past captures.
 *
 * Selection is a controlled prop — the parent owns which capture is showing in
 * the viewer. It used to be driven by a sibling component that found these
 * buttons with `document.querySelector` and toggled their classes directly,
 * which meant a copy change silently broke the timeline.
 *
 * The grid itself is windowed (see the "Windowing" section below) — a
 * Business monitor on hourly checks accumulates thousands of captures a
 * year, and rendering every thumbnail at once is the thing that made this
 * page slow.
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
  /** The structured changes `diffExtracts` found for this capture (lib/content-diff.ts) — see ChangeTimeline. */
  content_changes?: ContentChange[]
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
  /** Structured extraction for this capture — the price chart's data source. `null` on older, pre-extraction snapshots. */
  extract: PageExtract | null
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

// ─── Windowing ────────────────────────────────────────────────────────────
//
// Hand-rolled, on purpose (no dependency): a fixed-height scroll container,
// a scroll listener, and a slice of the full list bracketed by two spacer
// elements sized to stand in for the rows that aren't rendered. Column count
// tracks the grid's own Tailwind breakpoints (viewport width, same as
// `sm:`/`lg:` below) so the math never drifts from what's actually painted;
// row height is measured from a real rendered card, since it depends on the
// column width via the thumbnail's aspect ratio.

const VIEWPORT_HEIGHT = 640
const GRID_GAP = 8 // matches gap-2
const OVERSCAN_ROWS = 3
const FALLBACK_ROW_HEIGHT = 210

function useColumns(): number {
  const [columns, setColumns] = useState(2)
  useEffect(() => {
    const sm = window.matchMedia('(min-width: 640px)')
    const lg = window.matchMedia('(min-width: 1024px)')
    const update = () => setColumns(lg.matches ? 4 : sm.matches ? 3 : 2)
    update()
    sm.addEventListener('change', update)
    lg.addEventListener('change', update)
    return () => {
      sm.removeEventListener('change', update)
      lg.removeEventListener('change', update)
    }
  }, [])
  return columns
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
  const [scrollTop, setScrollTop] = useState(0)
  const [rowHeight, setRowHeight] = useState(FALLBACK_ROW_HEIGHT)
  const [focusIndex, setFocusIndex] = useState(0)

  const scrollRef = useRef<HTMLDivElement>(null)
  const measureRef = useRef<HTMLDivElement>(null)
  const columns = useColumns()

  const filtered = useMemo(
    () =>
      snapshots.filter((snapshot) => {
        if (filter === 'changes') return Boolean(alertBySnapshotId[snapshot.id])
        if (filter === 'clean') return !alertBySnapshotId[snapshot.id]
        return true
      }),
    [snapshots, filter, alertBySnapshotId]
  )

  const changeCount = Object.keys(alertBySnapshotId).length

  // Reset the scroll window (not the roving focus target) whenever the
  // filter changes the underlying list.
  useEffect(() => {
    setScrollTop(0)
    if (scrollRef.current) scrollRef.current.scrollTop = 0
    setFocusIndex(0)
  }, [filter])

  const totalRows = Math.max(1, Math.ceil(filtered.length / columns))
  const scrollRow = Math.floor(scrollTop / rowHeight)
  const startRow = Math.max(0, scrollRow - OVERSCAN_ROWS)
  const visibleRowCount = Math.ceil(VIEWPORT_HEIGHT / rowHeight) + OVERSCAN_ROWS * 2
  const endRow = Math.min(totalRows, startRow + visibleRowCount)
  const startIndex = startRow * columns
  const endIndex = Math.min(filtered.length, endRow * columns)
  const windowItems = filtered.slice(startIndex, endIndex)
  const topSpacer = startRow * rowHeight
  const bottomSpacer = Math.max(0, (totalRows - endRow) * rowHeight)

  // Measure the real rendered card height (thumbnail aspect ratio + meta row)
  // — column width, and so row height, depends on the container's actual
  // pixel width, not just the breakpoint.
  useLayoutEffect(() => {
    const measured = measureRef.current?.getBoundingClientRect().height
    if (!measured) return
    const next = Math.round(measured + GRID_GAP)
    setRowHeight((prev) => (Math.abs(next - prev) > 1 ? next : prev))
    // Re-measure whenever the rendered window's first card or the column
    // count changes — not every render, which is what the missing-deps
    // warning here would otherwise be flagging as an update-loop risk.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [windowItems[0]?.id, columns])

  useEffect(() => {
    const el = scrollRef.current
    if (!el || typeof ResizeObserver === 'undefined') return
    const ro = new ResizeObserver(() => {
      const measured = measureRef.current?.getBoundingClientRect().height
      if (measured) setRowHeight(Math.round(measured + GRID_GAP))
    })
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  function onScroll() {
    if (scrollRef.current) setScrollTop(scrollRef.current.scrollTop)
  }

  // Keep the roving focus target inside the filtered list and its row inside
  // the rendered window — this is what keeps a windowed grid from breaking
  // keyboard navigation: arrowing past the rendered edge scrolls it into view.
  useEffect(() => {
    if (focusIndex > filtered.length - 1) setFocusIndex(Math.max(0, filtered.length - 1))
  }, [filtered.length, focusIndex])

  function ensureVisible(index: number) {
    const row = Math.floor(index / columns)
    const rowTop = row * rowHeight
    const rowBottom = rowTop + rowHeight
    const el = scrollRef.current
    if (!el) return
    if (rowTop < el.scrollTop) el.scrollTop = rowTop
    else if (rowBottom > el.scrollTop + VIEWPORT_HEIGHT) el.scrollTop = rowBottom - VIEWPORT_HEIGHT
    setScrollTop(el.scrollTop)
  }

  function moveFocus(next: number) {
    const clamped = Math.max(0, Math.min(filtered.length - 1, next))
    setFocusIndex(clamped)
    ensureVisible(clamped)
  }

  function onGridKeyDown(e: React.KeyboardEvent) {
    if (filtered.length === 0) return
    switch (e.key) {
      case 'ArrowRight':
        e.preventDefault()
        moveFocus(focusIndex + 1)
        break
      case 'ArrowLeft':
        e.preventDefault()
        moveFocus(focusIndex - 1)
        break
      case 'ArrowDown':
        e.preventDefault()
        moveFocus(focusIndex + columns)
        break
      case 'ArrowUp':
        e.preventDefault()
        moveFocus(focusIndex - columns)
        break
      case 'Home':
        e.preventDefault()
        moveFocus(0)
        break
      case 'End':
        e.preventDefault()
        moveFocus(filtered.length - 1)
        break
      case 'Enter':
      case ' ':
        e.preventDefault()
        if (filtered[focusIndex]) onSelectSnapshot(filtered[focusIndex].id)
        break
    }
  }

  function selectCapture(index: number, id: string) {
    setFocusIndex(index)
    onSelectSnapshot(id)
  }

  const activeId = filtered[focusIndex]?.id

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
                onClick={() => setFilter(key)}
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

        {filtered.length === 0 ? (
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
          <div
            ref={scrollRef}
            onScroll={onScroll}
            className="overflow-y-auto p-3"
            style={{ height: VIEWPORT_HEIGHT }}
          >
            <div
              role="listbox"
              aria-label="Captures"
              aria-activedescendant={activeId ? `capture-${activeId}` : undefined}
              tabIndex={0}
              onKeyDown={onGridKeyDown}
              className="outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
            >
              {/* Top spacer — stands in for the rows scrolled past above. */}
              {topSpacer > 0 && <div style={{ height: topSpacer }} aria-hidden />}

              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
                {windowItems.map((snapshot, i) => {
                  const index = startIndex + i
                  const alert = alertBySnapshotId[snapshot.id]
                  const isSelected = snapshot.id === selectedId
                  const isFocusTarget = index === focusIndex

                  return (
                    <div
                      key={snapshot.id}
                      ref={i === 0 ? measureRef : undefined}
                      id={`capture-${snapshot.id}`}
                      role="option"
                      aria-selected={isSelected}
                      tabIndex={-1}
                      onClick={() => selectCapture(index, snapshot.id)}
                      className={
                        'group cursor-pointer overflow-hidden rounded-md border text-left transition-colors ' +
                        (isSelected
                          ? 'border-accent ring-1 ring-accent'
                          : isFocusTarget
                            ? 'border-border-strong'
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
                    </div>
                  )
                })}
              </div>

              {/* Bottom spacer — stands in for the rows not yet scrolled to. */}
              {bottomSpacer > 0 && <div style={{ height: bottomSpacer }} aria-hidden />}
            </div>
          </div>
        )}

        <PanelFooter>
          <span className="text-meta text-text-faint tabular-nums">
            {filtered.length} capture{filtered.length === 1 ? '' : 's'}
            {filter !== 'all' ? ' (filtered)' : ''}
          </span>
        </PanelFooter>
      </Panel>
    </div>
  )
}
