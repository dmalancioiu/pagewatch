'use client'

import { useEffect, useRef, useCallback, useState } from 'react'
import { X, Image as ImageIcon, GitCompare, SplitSquareHorizontal, Download } from 'lucide-react'

async function downloadImage(url: string, filename: string) {
  try {
    const res  = await fetch(url)
    const blob = await res.blob()
    const href = URL.createObjectURL(blob)
    const a    = document.createElement('a')
    a.href     = href
    a.download = filename
    a.click()
    URL.revokeObjectURL(href)
  } catch {
    window.open(url, '_blank')
  }
}

export type DiffTab = 'compare' | 'before' | 'after' | 'diff'

export interface DiffViewerModalProps {
  isOpen:      boolean
  onClose:     () => void
  beforeUrl:   string | null
  afterUrl:    string | null
  diffUrl?:    string | null
  defaultTab?: DiffTab
  metadata?: {
    diffPct?:   number | null
    severity?:  string | null
    timestamp?: string | null
    pageUrl?:   string | null
  }
}

function severityColor(s: string | null | undefined) {
  if (s === 'critical') return '#ff5555'
  if (s === 'high')     return '#ff8844'
  if (s === 'medium')   return '#ffbb44'
  return '#ffcc44'
}

/* ─── Single image panel ─── */
function ImagePanel({ url, label }: { url: string | null; label: string }) {
  if (!url) {
    return (
      <div className="flex flex-1 items-center justify-center" style={{ color: 'rgba(255,255,255,0.2)' }}>
        <p className="text-sm">{label} not available</p>
      </div>
    )
  }
  return (
    <div className="flex flex-1 items-center justify-center overflow-auto p-4">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={url}
        alt={label}
        className="max-w-full max-h-full rounded-lg object-contain"
        style={{ boxShadow: '0 8px 40px rgba(0,0,0,0.6)' }}
      />
    </div>
  )
}

/* ─── Reveal slider (before / after) ─── */
function SliderComparePanel({
  beforeUrl,
  afterUrl,
}: {
  beforeUrl: string | null
  afterUrl:  string | null
}) {
  const [pos, setPos]         = useState(50) // 0–100 %
  const containerRef          = useRef<HTMLDivElement>(null)
  const isDragging            = useRef(false)

  const updatePos = useCallback((clientX: number) => {
    const el = containerRef.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const pct  = Math.max(0, Math.min(100, ((clientX - rect.left) / rect.width) * 100))
    setPos(pct)
  }, [])

  const onPointerDown = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    isDragging.current = true
    e.currentTarget.setPointerCapture(e.pointerId)
    updatePos(e.clientX)
  }, [updatePos])

  const onPointerMove = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging.current) return
    updatePos(e.clientX)
  }, [updatePos])

  const onPointerUp = useCallback(() => { isDragging.current = false }, [])

  // Fallback: no before image
  if (!beforeUrl) return <ImagePanel url={afterUrl} label="After" />
  if (!afterUrl)  return <ImagePanel url={beforeUrl} label="Before" />

  return (
    <div
      ref={containerRef}
      className="flex flex-1 relative overflow-hidden select-none"
      style={{ background: '#050505', cursor: 'col-resize' }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
    >
      {/* Before — full width, sits underneath */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={beforeUrl}
        alt="Before"
        draggable={false}
        className="absolute inset-0 w-full h-full object-contain"
      />

      {/* After — clipped to reveal only the right portion */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={afterUrl}
        alt="After"
        draggable={false}
        className="absolute inset-0 w-full h-full object-contain"
        style={{ clipPath: `inset(0 0 0 ${pos}%)` }}
      />

      {/* Labels */}
      <div
        className="absolute top-3 left-4 text-[10px] font-semibold uppercase tracking-widest px-2 py-1 rounded-md pointer-events-none"
        style={{ color: 'rgba(255,255,255,0.7)', background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(4px)' }}
      >
        Before
      </div>
      <div
        className="absolute top-3 right-4 text-[10px] font-semibold uppercase tracking-widest px-2 py-1 rounded-md pointer-events-none"
        style={{ color: 'rgba(255,255,255,0.7)', background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(4px)' }}
      >
        After
      </div>

      {/* Divider line */}
      <div
        className="absolute top-0 bottom-0 w-px pointer-events-none"
        style={{ left: `${pos}%`, background: 'rgba(255,255,255,0.75)' }}
      />

      {/* Handle */}
      <div
        className="absolute top-1/2 flex items-center justify-center rounded-full pointer-events-none"
        style={{
          left:      `${pos}%`,
          transform: 'translate(-50%, -50%)',
          width:     32,
          height:    32,
          background: 'white',
          boxShadow:  '0 2px 16px rgba(0,0,0,0.7)',
        }}
      >
        {/* Left / right chevrons */}
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path d="M5 3L2 7L5 11" stroke="#111" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M9 3L12 7L9 11" stroke="#111" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
    </div>
  )
}

/* ─── Diff overlay panel ─── */
function DiffOverlayPanel({
  afterUrl,
  diffUrl,
}: {
  afterUrl: string | null
  diffUrl:  string | null
}) {
  // No after image — fall back to raw diff
  if (!afterUrl) return <ImagePanel url={diffUrl} label="Diff" />

  return (
    <div className="flex flex-1 items-center justify-center overflow-auto p-4">
      {/* Wrapper constrains both images to the same rendered size */}
      <div
        className="relative"
        style={{ maxWidth: '100%', maxHeight: '100%', display: 'inline-flex' }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={afterUrl}
          alt="After"
          className="max-w-full max-h-full rounded-lg object-contain block"
          style={{ boxShadow: '0 8px 40px rgba(0,0,0,0.6)' }}
        />
        {diffUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={diffUrl}
            alt="Diff overlay"
            className="absolute inset-0 w-full h-full rounded-lg object-contain"
            style={{ opacity: 0.65, mixBlendMode: 'hard-light' }}
          />
        )}
      </div>
    </div>
  )
}

/* ─── Main modal ─── */
export function DiffViewerModal({
  isOpen,
  onClose,
  beforeUrl,
  afterUrl,
  diffUrl,
  defaultTab,
  metadata,
}: DiffViewerModalProps) {
  const canCompare = !!(beforeUrl && afterUrl)
  const hasDiff    = !!diffUrl

  const resolvedDefault: DiffTab =
    defaultTab ??
    (canCompare ? 'compare' : afterUrl ? 'after' : 'before')

  const [tab, setTab] = useState<DiffTab>(resolvedDefault)

  useEffect(() => {
    if (isOpen) setTab(resolvedDefault)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen])

  useEffect(() => {
    if (!isOpen) return
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [isOpen, onClose])

  if (!isOpen) return null

  const allTabs: { id: DiffTab; label: string; icon: React.ReactNode; hidden: boolean }[] = [
    { id: 'compare' as DiffTab, label: 'Slider',  icon: <SplitSquareHorizontal className="w-3.5 h-3.5" />, hidden: !canCompare },
    { id: 'before'  as DiffTab, label: 'Before',  icon: <ImageIcon             className="w-3.5 h-3.5" />, hidden: !beforeUrl  },
    { id: 'after'   as DiffTab, label: 'After',   icon: <ImageIcon             className="w-3.5 h-3.5" />, hidden: !afterUrl   },
    { id: 'diff'    as DiffTab, label: 'Overlay', icon: <GitCompare            className="w-3.5 h-3.5" />, hidden: !hasDiff    },
  ]
  const tabs = allTabs.filter(t => !t.hidden)

  const sev   = metadata?.severity
  const color = severityColor(sev)

  // Resolve the URL to download for the active tab
  const downloadUrl =
    tab === 'before' ? beforeUrl :
    tab === 'after'  ? afterUrl  :
    tab === 'diff'   ? diffUrl   :
    afterUrl ?? beforeUrl // 'compare' → prefer after

  const downloadFilename =
    tab === 'before' ? 'screenshot-before.png' :
    tab === 'after'  ? 'screenshot-after.png'  :
    tab === 'diff'   ? 'screenshot-diff.png'   :
    'screenshot-after.png'

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col"
      style={{ background: 'rgba(0,0,0,0.92)', backdropFilter: 'blur(10px)' }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      {/* ── Header ── */}
      <div
        className="flex items-center justify-between px-5 py-3 flex-shrink-0"
        style={{ borderBottom: '1px solid rgba(255,255,255,0.07)', background: '#0c0c0c' }}
      >
        <div className="flex items-center gap-1">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors"
              style={{
                background: tab === t.id ? 'rgba(255,255,255,0.08)' : 'transparent',
                color:      tab === t.id ? 'rgba(255,255,255,0.9)'  : 'rgba(255,255,255,0.38)',
                border:     tab === t.id ? '1px solid rgba(255,255,255,0.12)' : '1px solid transparent',
              }}
            >
              {t.icon}
              {t.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          {/* Download current view */}
          {downloadUrl && (
            <button
              onClick={() => downloadImage(downloadUrl, downloadFilename)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors hover:bg-white/[0.08]"
              style={{ color: 'rgba(255,255,255,0.5)', border: '1px solid rgba(255,255,255,0.08)' }}
              title="Download screenshot"
            >
              <Download className="w-3.5 h-3.5" />
              Download
            </button>
          )}
          <button
            onClick={onClose}
            className="p-2 rounded-lg transition-colors hover:bg-white/[0.06]"
            style={{ color: 'rgba(255,255,255,0.4)' }}
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* ── Content ── */}
      <div className="flex flex-1 overflow-hidden" style={{ background: '#080808' }}>
        {tab === 'compare' && <SliderComparePanel beforeUrl={beforeUrl} afterUrl={afterUrl} />}
        {tab === 'before'  && <ImagePanel url={beforeUrl}      label="Before" />}
        {tab === 'after'   && <ImagePanel url={afterUrl}       label="After"  />}
        {tab === 'diff'    && <DiffOverlayPanel afterUrl={afterUrl} diffUrl={diffUrl ?? null} />}
      </div>

      {/* ── Footer ── */}
      {metadata && (
        <div
          className="flex items-center gap-4 px-5 py-2.5 flex-shrink-0 flex-wrap"
          style={{ borderTop: '1px solid rgba(255,255,255,0.06)', background: '#0c0c0c' }}
        >
          {metadata.diffPct != null && (
            <span
              className="text-xs font-bold px-2.5 py-1 rounded-lg"
              style={{ color, background: `${color}18`, border: `1px solid ${color}35` }}
            >
              {Number(metadata.diffPct).toFixed(1)}% changed
            </span>
          )}
          {sev && (
            <span
              className="text-[11px] font-semibold uppercase tracking-wide px-2 py-0.5 rounded"
              style={{ color, background: `${color}14` }}
            >
              {sev}
            </span>
          )}
          {metadata.timestamp && (
            <span className="text-xs" style={{ color: 'rgba(255,255,255,0.3)' }}>
              {new Date(metadata.timestamp).toLocaleString('en-US', {
                month: 'short', day: 'numeric',
                hour: '2-digit', minute: '2-digit',
              })}
            </span>
          )}
          {metadata.pageUrl && (
            <span className="text-xs font-mono truncate max-w-xs" style={{ color: 'rgba(255,255,255,0.2)' }}>
              {metadata.pageUrl}
            </span>
          )}
          {tab === 'compare' && canCompare && (
            <span className="text-[11px] ml-auto" style={{ color: 'rgba(255,255,255,0.2)' }}>
              Drag to compare
            </span>
          )}
        </div>
      )}
    </div>
  )
}
