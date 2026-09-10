'use client'

import { useEffect, useState } from 'react'
import * as DialogPrimitive from '@radix-ui/react-dialog'
import { Columns2, Download, Image as ImageIcon, Minimize2, MoveHorizontal, X } from 'lucide-react'
import { IconButton } from '@/components/ui/icon-button'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

type Tab = 'diff' | 'current'

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  tab: Tab
  onTabChange: (tab: Tab) => void
  monitorName: string
  beforeUrl: string | null
  afterUrl: string | null
  currentUrl: string | null
  region: string
  aiSummary: string | null
  diffPct: number | null
  capturedAt: string | null
}

function fmtDate(iso?: string | null) {
  if (!iso) return 'Never'
  return new Date(iso).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
}

function fmtPct(v?: number | null) {
  return Number(v ?? 0).toFixed(1)
}

function triggerDownload(url: string, filename: string) {
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.target = '_blank'
  document.body.appendChild(a)
  a.click()
  a.remove()
}

/**
 * Immersive fullscreen take on the same before/after/diff viewer — opened
 * from the inline viewer's Fullscreen button or the `F` key. Built on the raw
 * Radix Dialog primitives (not the centered `Dialog`) so it gets focus-trap,
 * Escape-to-close and scroll-lock for free while filling the screen.
 */
export function FullscreenMonitorViewer({
  open,
  onOpenChange,
  tab,
  onTabChange,
  monitorName,
  beforeUrl,
  afterUrl,
  currentUrl,
  region,
  aiSummary,
  diffPct,
  capturedAt,
}: Props) {
  const [handle, setHandle] = useState(50)
  const hasDiff = Boolean(beforeUrl && afterUrl)

  const tabs: Array<{ id: Tab; label: string; Icon: typeof Columns2; disabled: boolean }> = [
    { id: 'diff', label: 'Diff comparison', Icon: Columns2, disabled: !hasDiff },
    { id: 'current', label: 'Current capture', Icon: ImageIcon, disabled: !currentUrl },
  ]

  function onDrag(e: React.PointerEvent) {
    const rect = e.currentTarget.getBoundingClientRect()
    setHandle(Math.max(3, Math.min(97, ((e.clientX - rect.left) / rect.width) * 100)))
  }

  function onKeyDown(e: React.KeyboardEvent) {
    if (tab !== 'diff') return
    if (e.key === 'ArrowLeft') setHandle((h) => Math.max(3, h - 4))
    else if (e.key === 'ArrowRight') setHandle((h) => Math.min(97, h + 4))
  }

  // Reset the slider each time the dialog opens so it doesn't carry a stale
  // position from the previous capture.
  useEffect(() => {
    if (open) setHandle(50)
  }, [open])

  // 'F' closes fullscreen (it's the toggle), matching the inline viewer's shortcut.
  useEffect(() => {
    if (!open) return
    function handler(e: KeyboardEvent) {
      const target = e.target as HTMLElement | null
      if (target && ['INPUT', 'TEXTAREA'].includes(target.tagName)) return
      if (e.key === 'f' || e.key === 'F') onOpenChange(false)
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [open, onOpenChange])

  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-bg/95 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <DialogPrimitive.Content
          className="fixed inset-0 z-50 flex flex-col bg-bg text-text outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0"
          onKeyDown={onKeyDown}
          aria-describedby={undefined}
        >
          <DialogPrimitive.Title className="sr-only">{monitorName} — fullscreen viewer</DialogPrimitive.Title>

          <header className="flex h-12 shrink-0 items-center gap-3 border-b border-border px-3 sm:px-4">
            <div className="min-w-0 flex-1">
              <p className="truncate text-ui-medium text-text">{monitorName}</p>
              <p className="truncate text-meta text-text-muted">
                {tab === 'diff' ? `Changed region: ${region}` : `Captured ${fmtDate(capturedAt)}`}
              </p>
            </div>

            <nav className="hidden items-center gap-1 sm:flex">
              {tabs.map(({ id, label, Icon, disabled }) => (
                <button
                  key={id}
                  type="button"
                  disabled={disabled}
                  onClick={() => onTabChange(id)}
                  className={cn(
                    'flex h-8 items-center gap-1.5 rounded px-2.5 text-ui text-text-muted transition-colors duration-120',
                    'hover:text-text disabled:pointer-events-none disabled:opacity-45',
                    tab === id && 'bg-panel-raised text-text'
                  )}
                >
                  <Icon className="size-3.5" />
                  {label}
                </button>
              ))}
            </nav>

            {tab === 'current' && currentUrl && (
              <Button
                variant="secondary"
                size="sm"
                iconLeft={<Download className="size-3.5" />}
                onClick={() => triggerDownload(currentUrl, `${monitorName}-capture.png`)}
              >
                Download
              </Button>
            )}
            <IconButton aria-label="Exit fullscreen" onClick={() => onOpenChange(false)}>
              <Minimize2 className="size-4" />
            </IconButton>
            <DialogPrimitive.Close asChild>
              <IconButton aria-label="Close fullscreen viewer">
                <X className="size-4" />
              </IconButton>
            </DialogPrimitive.Close>
          </header>

          <main className="min-h-0 flex-1">
            {tab === 'diff' && hasDiff && (
              <div
                className="relative h-full select-none overflow-hidden bg-bg-subtle"
                style={{ cursor: 'ew-resize' }}
                onPointerDown={onDrag}
                onPointerMove={(e) => e.buttons === 1 && onDrag(e)}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={afterUrl!} alt="After capture" className="absolute inset-0 size-full object-contain" />
                <div className="absolute inset-0 overflow-hidden" style={{ clipPath: `inset(0 ${100 - handle}% 0 0)` }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={beforeUrl!} alt="Before capture" className="absolute inset-0 size-full object-contain" />
                </div>
                <span className="absolute left-5 top-4 rounded-sm bg-bg/80 px-2 py-1 text-label uppercase text-text">Before</span>
                <span className="absolute right-5 top-4 rounded-sm bg-bg/80 px-2 py-1 text-label uppercase text-text">After</span>
                <div className="pointer-events-none absolute inset-y-0 w-0.5 bg-panel" style={{ left: `${handle}%` }} />
                <div
                  className="pointer-events-none absolute top-1/2 flex size-9 items-center justify-center rounded-full bg-panel shadow-popover"
                  style={{ left: `${handle}%`, transform: 'translate(-50%, -50%)' }}
                >
                  <MoveHorizontal className="size-4 text-text" />
                </div>
                <footer className="absolute inset-x-4 bottom-4 flex items-center gap-3 rounded-md border border-border bg-panel-raised/95 px-3.5 py-2.5 shadow-popover backdrop-blur">
                  <p className="text-ui-medium text-text">{region}</p>
                  <p className="min-w-0 flex-1 truncate text-meta text-text-muted">
                    {aiSummary || 'Compare the before and after captures.'}
                  </p>
                  <em className="shrink-0 font-mono text-meta not-italic text-text-faint">
                    {diffPct != null ? `${fmtPct(diffPct)}% diff` : fmtDate(capturedAt)}
                  </em>
                </footer>
              </div>
            )}

            {tab === 'current' && currentUrl && (
              <div className="flex h-full items-start justify-center overflow-auto p-6">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={currentUrl} alt="Current capture" className="block max-w-[min(100%,1440px)] rounded-md border border-border shadow-popover" />
              </div>
            )}
          </main>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  )
}
