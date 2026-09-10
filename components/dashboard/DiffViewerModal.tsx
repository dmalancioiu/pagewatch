'use client'

import { useCallback, useRef, useState } from 'react'
import { Download, GitCompare, Image as ImageIcon, MoveHorizontal, SplitSquareHorizontal } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { SeverityBadge } from '@/components/ui/severity-badge'
import type { AlertSeverity } from '@/lib/types/database.types'
import { cn } from '@/lib/utils'

async function downloadImage(url: string, filename: string) {
  try {
    const res = await fetch(url)
    const blob = await res.blob()
    const href = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = href
    a.download = filename
    a.click()
    URL.revokeObjectURL(href)
  } catch {
    window.open(url, '_blank')
  }
}

export type DiffTab = 'compare' | 'before' | 'after' | 'diff'

export interface DiffViewerModalProps {
  isOpen: boolean
  onClose: () => void
  beforeUrl: string | null
  afterUrl: string | null
  diffUrl?: string | null
  defaultTab?: DiffTab
  metadata?: {
    diffPct?: number | null
    severity?: AlertSeverity | null
    timestamp?: string | null
    pageUrl?: string | null
  }
}

function ImagePanel({ url, label }: { url: string | null; label: string }) {
  if (!url) {
    return (
      <div className="flex flex-1 items-center justify-center text-meta text-text-faint">
        {label} not available
      </div>
    )
  }
  return (
    <div className="flex flex-1 items-center justify-center overflow-auto p-4">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={url} alt={label} className="max-h-full max-w-full rounded-md object-contain shadow-popover" />
    </div>
  )
}

function SliderComparePanel({ beforeUrl, afterUrl }: { beforeUrl: string | null; afterUrl: string | null }) {
  const [pos, setPos] = useState(50)
  const containerRef = useRef<HTMLDivElement>(null)
  const isDragging = useRef(false)

  const updatePos = useCallback((clientX: number) => {
    const el = containerRef.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    setPos(Math.max(0, Math.min(100, ((clientX - rect.left) / rect.width) * 100)))
  }, [])

  const onPointerDown = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      isDragging.current = true
      e.currentTarget.setPointerCapture(e.pointerId)
      updatePos(e.clientX)
    },
    [updatePos]
  )
  const onPointerMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (!isDragging.current) return
      updatePos(e.clientX)
    },
    [updatePos]
  )
  const onPointerUp = useCallback(() => {
    isDragging.current = false
  }, [])
  const onKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft') setPos((p) => Math.max(0, p - 4))
    else if (e.key === 'ArrowRight') setPos((p) => Math.min(100, p + 4))
  }, [])

  if (!beforeUrl) return <ImagePanel url={afterUrl} label="After" />
  if (!afterUrl) return <ImagePanel url={beforeUrl} label="Before" />

  return (
    <div
      ref={containerRef}
      role="slider"
      tabIndex={0}
      aria-label="Before/after comparison position"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(pos)}
      className="relative flex flex-1 select-none overflow-hidden bg-bg-subtle outline-none"
      style={{ cursor: 'col-resize' }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onKeyDown={onKeyDown}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={beforeUrl} alt="Before" draggable={false} className="absolute inset-0 size-full object-contain" />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={afterUrl}
        alt="After"
        draggable={false}
        className="absolute inset-0 size-full object-contain"
        style={{ clipPath: `inset(0 0 0 ${pos}%)` }}
      />

      <div className="pointer-events-none absolute left-3 top-3 rounded-sm bg-bg/80 px-2 py-1 text-label uppercase text-text">
        Before
      </div>
      <div className="pointer-events-none absolute right-3 top-3 rounded-sm bg-bg/80 px-2 py-1 text-label uppercase text-text">
        After
      </div>

      {/* Divider position is a genuinely computed drag value. */}
      <div className="pointer-events-none absolute inset-y-0 w-px bg-panel" style={{ left: `${pos}%` }} />
      <div
        className="pointer-events-none absolute top-1/2 flex size-8 items-center justify-center rounded-full bg-panel shadow-popover"
        style={{ left: `${pos}%`, transform: 'translate(-50%, -50%)' }}
      >
        <MoveHorizontal className="size-3.5 text-text" />
      </div>
    </div>
  )
}

function DiffOverlayPanel({ afterUrl, diffUrl }: { afterUrl: string | null; diffUrl: string | null }) {
  if (!afterUrl) return <ImagePanel url={diffUrl} label="Diff" />

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-3 overflow-auto p-4">
      <div className="relative inline-flex max-h-full max-w-full">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={afterUrl} alt="After" className="block max-h-full max-w-full rounded-md object-contain shadow-popover" />
        {diffUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={diffUrl}
            alt="Detected changes"
            className="absolute inset-0 size-full rounded-md object-contain"
            style={{ opacity: 0.7, mixBlendMode: 'screen' }}
          />
        )}
      </div>
      {diffUrl && (
        <span className="inline-flex items-center gap-1.5 rounded-sm border border-diff/35 bg-diff-subtle px-2 py-0.5 text-label uppercase text-diff">
          Changed pixels highlighted
        </span>
      )}
    </div>
  )
}

/** Standalone before/after/diff compare dialog — a lighter-weight alternative to the fullscreen viewer. */
export function DiffViewerModal({ isOpen, onClose, beforeUrl, afterUrl, diffUrl, defaultTab, metadata }: DiffViewerModalProps) {
  const canCompare = Boolean(beforeUrl && afterUrl)
  const hasDiff = Boolean(diffUrl)
  const resolvedDefault: DiffTab = defaultTab ?? (canCompare ? 'compare' : afterUrl ? 'after' : 'before')
  const [tab, setTab] = useState<DiffTab>(resolvedDefault)

  function handleOpenChange(next: boolean) {
    if (!next) onClose()
    else setTab(resolvedDefault)
  }

  // Annotated before `.filter`, not after: filtering an unannotated literal
  // widens `id` to string, which no longer satisfies DiffTab.
  const allTabs: { id: DiffTab; label: string; icon: React.ReactNode; hidden: boolean }[] = [
    { id: 'compare', label: 'Slider', icon: <SplitSquareHorizontal className="size-3.5" />, hidden: !canCompare },
    { id: 'before', label: 'Before', icon: <ImageIcon className="size-3.5" />, hidden: !beforeUrl },
    { id: 'after', label: 'After', icon: <ImageIcon className="size-3.5" />, hidden: !afterUrl },
    { id: 'diff', label: 'Diff', icon: <GitCompare className="size-3.5" />, hidden: !hasDiff },
  ]
  const tabs = allTabs.filter((t) => !t.hidden)

  const downloadUrl = tab === 'before' ? beforeUrl : tab === 'after' ? afterUrl : tab === 'diff' ? diffUrl : afterUrl ?? beforeUrl
  const downloadFilename =
    tab === 'before' ? 'screenshot-before.png' : tab === 'diff' ? 'screenshot-diff.png' : 'screenshot-after.png'

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="flex h-[min(88vh,760px)] w-[min(96vw,980px)] max-w-none flex-col gap-0 p-0">
        <DialogHeader className="flex-row items-center justify-between gap-3 border-b border-border p-3 pr-12 sm:p-4">
          <div className="min-w-0">
            <DialogTitle>Capture comparison</DialogTitle>
            {metadata?.pageUrl && (
              <DialogDescription className="truncate font-mono">{metadata.pageUrl}</DialogDescription>
            )}
          </div>
        </DialogHeader>

        <Tabs value={tab} onValueChange={(v) => setTab(v as DiffTab)} className="flex min-h-0 flex-1 flex-col">
          <div className="flex items-center justify-between gap-2 border-b border-border px-3 sm:px-4">
            <TabsList className="border-none">
              {tabs.map((t) => (
                <TabsTrigger key={t.id} value={t.id} className="gap-1.5">
                  {t.icon}
                  {t.label}
                </TabsTrigger>
              ))}
            </TabsList>
            {downloadUrl && (
              <Button
                variant="ghost"
                size="sm"
                iconLeft={<Download className="size-3.5" />}
                onClick={() => downloadImage(downloadUrl, downloadFilename)}
              >
                Download
              </Button>
            )}
          </div>

          <div className="flex min-h-0 flex-1 bg-bg-subtle">
            <TabsContent value="compare" className="flex flex-1 data-[state=inactive]:hidden">
              <SliderComparePanel beforeUrl={beforeUrl} afterUrl={afterUrl} />
            </TabsContent>
            <TabsContent value="before" className="flex flex-1 data-[state=inactive]:hidden">
              <ImagePanel url={beforeUrl} label="Before" />
            </TabsContent>
            <TabsContent value="after" className="flex flex-1 data-[state=inactive]:hidden">
              <ImagePanel url={afterUrl} label="After" />
            </TabsContent>
            <TabsContent value="diff" className="flex flex-1 data-[state=inactive]:hidden">
              <DiffOverlayPanel afterUrl={afterUrl} diffUrl={diffUrl ?? null} />
            </TabsContent>
          </div>
        </Tabs>

        {metadata && (metadata.diffPct != null || metadata.severity || metadata.timestamp) && (
          <div className="flex flex-wrap items-center gap-3 border-t border-border px-3 py-2 sm:px-4">
            {metadata.diffPct != null && (
              <span className="text-meta text-text-muted">
                <span className="font-mono tabular-nums text-text">{Number(metadata.diffPct).toFixed(1)}%</span> changed
              </span>
            )}
            {metadata.severity && <SeverityBadge severity={metadata.severity} size="sm" />}
            {metadata.timestamp && (
              <span className={cn('text-meta text-text-faint', metadata.diffPct == null && !metadata.severity && 'ml-0')}>
                {new Date(metadata.timestamp).toLocaleString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </span>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
