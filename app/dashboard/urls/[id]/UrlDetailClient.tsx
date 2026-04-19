'use client'

import { useState, useTransition } from 'react'
import { acknowledgeAlert } from '@/lib/actions/alerts'
import { DiffViewerModal } from '@/components/dashboard/DiffViewerModal'
import type { DiffTab } from '@/components/dashboard/DiffViewerModal'
import { Maximize2, Download } from 'lucide-react'

/* ─── Download helper ─── */
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
    // fallback: open in new tab
    window.open(url, '_blank')
  }
}

/* ─── Types ─── */

export interface AlertWithUrls {
  id:                   string
  diff_pct:             number | null
  severity:             string | null
  status:               string
  created_at:           string
  beforeUrl:            string | null
  afterUrl:             string | null
  diffUrl:              string | null
}

export interface SnapshotWithUrl {
  id:              string
  storage_path:    string
  taken_at:        string
  file_size_bytes: number | null
  signedUrl:       string | null
}

interface UrlDetailClientProps {
  openAlert:           AlertWithUrls | null
  snapshots:           SnapshotWithUrl[]
  alertBySnapshotId:   Record<string, AlertWithUrls>
  pageUrl:             string
}

/* ─── Helpers ─── */

function formatDate(iso: string): string {
  return new Date(iso).toLocaleString('en-US', {
    month: 'short', day: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })
}

function severityStyle(pct: number | null) {
  if (!pct || pct < 5)  return { color: '#ffcc44', bg: 'rgba(255,200,68,0.08)',  border: 'rgba(255,200,68,0.18)'  }
  if (pct < 15)         return { color: '#ff9944', bg: 'rgba(255,130,68,0.10)', border: 'rgba(255,130,68,0.2)'   }
  return                       { color: '#ff5555', bg: 'rgba(255,68,68,0.12)',  border: 'rgba(255,68,68,0.22)'   }
}

/* ─── Thumbnail ─── */

function Thumbnail({
  url,
  alt,
  className = '',
  style = {},
}: {
  url:       string | null
  alt:       string
  className?: string
  style?:     React.CSSProperties
}) {
  const [error, setError] = useState(false)

  if (!url || error) {
    return (
      <div
        className={`flex items-center justify-center ${className}`}
        style={style}
      >
        <span className="text-[10px]" style={{ color: 'rgba(255,255,255,0.15)' }}>
          {url ? 'Failed to load' : 'No image'}
        </span>
      </div>
    )
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={url}
      alt={alt}
      className={`object-cover ${className}`}
      style={style}
      onError={() => setError(true)}
    />
  )
}

/* ─── Alert diff preview ─── */

function AlertDiffPreview({
  alert,
  onViewFull,
}: {
  alert:      AlertWithUrls
  onViewFull: () => void
}) {
  const [isPending, startTransition] = useTransition()
  const [dismissed,  setDismissed]   = useState(false)

  if (dismissed) return null

  function handleAcknowledge() {
    startTransition(async () => {
      await acknowledgeAlert(alert.id)
      setDismissed(true)
    })
  }

  const { color, bg, border } = severityStyle(alert.diff_pct)
  const diffLabel = `${Number(alert.diff_pct ?? 0).toFixed(1)}% changed`

  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{ border: '1px solid rgba(255,68,68,0.18)', background: 'rgba(255,50,50,0.04)' }}
    >
      {/* ── Title bar ── */}
      <div
        className="flex items-center justify-between px-5 py-3"
        style={{ borderBottom: '1px solid rgba(255,68,68,0.12)' }}
      >
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span
              className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75"
              style={{ background: '#ff4444' }}
            />
            <span className="relative inline-flex rounded-full h-2 w-2" style={{ background: '#ff4444' }} />
          </span>
          <span className="text-sm font-semibold" style={{ color: '#ff8080' }}>
            Open alert — change needs review
          </span>
        </div>

        {/* Inline actions */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onViewFull}
            className="text-xs font-medium px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5"
            style={{ background: 'rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.75)', border: '1px solid rgba(255,255,255,0.1)' }}
          >
            <Maximize2 className="w-3 h-3" />
            View full diff
          </button>
          <button
            type="button"
            onClick={handleAcknowledge}
            disabled={isPending}
            className="text-xs font-medium px-3 py-1.5 rounded-lg transition-colors disabled:opacity-50"
            style={{ background: 'rgba(255,255,255,0.04)', color: 'rgba(255,255,255,0.4)', border: '1px solid rgba(255,255,255,0.07)' }}
          >
            {isPending ? 'Saving…' : 'Acknowledge'}
          </button>
        </div>
      </div>

      {/* ── Before / After ── */}
      <div className="grid grid-cols-2" style={{ gap: 1, background: 'rgba(255,255,255,0.05)' }}>
        {/* Before */}
        <div
          className="relative group/thumb cursor-pointer overflow-hidden"
          style={{ background: '#0d0d0d' }}
          onClick={onViewFull}
        >
          {/* Label */}
          <div
            className="absolute top-0 left-0 right-0 z-10 px-4 py-2.5 flex items-center justify-between"
            style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.7) 0%, transparent 100%)' }}
          >
            <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.55)' }}>
              Before
            </span>
            {alert.beforeUrl && (
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); downloadImage(alert.beforeUrl!, 'before.png') }}
                className="p-1 rounded opacity-0 group-hover/thumb:opacity-100 transition-opacity"
                style={{ background: 'rgba(0,0,0,0.5)', color: 'rgba(255,255,255,0.7)' }}
                title="Download"
              >
                <Download className="w-3 h-3" />
              </button>
            )}
          </div>

          <Thumbnail
            url={alert.beforeUrl}
            alt="Before"
            className="w-full"
            style={{ height: 220, objectFit: 'cover', objectPosition: 'top', display: 'block' }}
          />

          {/* Expand overlay */}
          <div
            className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/thumb:opacity-100 transition-opacity"
            style={{ background: 'rgba(0,0,0,0.4)' }}
          >
            <div
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium"
              style={{ background: 'rgba(0,0,0,0.7)', color: 'white', border: '1px solid rgba(255,255,255,0.15)' }}
            >
              <Maximize2 className="w-3.5 h-3.5" /> Expand
            </div>
          </div>
        </div>

        {/* After */}
        <div
          className="relative group/thumb cursor-pointer overflow-hidden"
          style={{ background: '#0d0d0d' }}
          onClick={onViewFull}
        >
          {/* Label row — includes diff badge */}
          <div
            className="absolute top-0 left-0 right-0 z-10 px-4 py-2.5 flex items-center justify-between"
            style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.7) 0%, transparent 100%)' }}
          >
            <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.55)' }}>
              After
            </span>
            <div className="flex items-center gap-2">
              <span
                className="text-[11px] font-bold px-2 py-0.5 rounded-md"
                style={{ color, background: bg, border: `1px solid ${border}` }}
              >
                {diffLabel}
              </span>
              {alert.afterUrl && (
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); downloadImage(alert.afterUrl!, 'after.png') }}
                  className="p-1 rounded opacity-0 group-hover/thumb:opacity-100 transition-opacity"
                  style={{ background: 'rgba(0,0,0,0.5)', color: 'rgba(255,255,255,0.7)' }}
                  title="Download"
                >
                  <Download className="w-3 h-3" />
                </button>
              )}
            </div>
          </div>

          <Thumbnail
            url={alert.afterUrl}
            alt="After"
            className="w-full"
            style={{ height: 220, objectFit: 'cover', objectPosition: 'top', display: 'block' }}
          />

          {/* Expand overlay */}
          <div
            className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/thumb:opacity-100 transition-opacity"
            style={{ background: 'rgba(0,0,0,0.4)' }}
          >
            <div
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium"
              style={{ background: 'rgba(0,0,0,0.7)', color: 'white', border: '1px solid rgba(255,255,255,0.15)' }}
            >
              <Maximize2 className="w-3.5 h-3.5" /> Expand
            </div>
          </div>
        </div>
      </div>

      {/* ── Severity footer ── */}
      <div
        className="flex items-center gap-3 px-5 py-2.5"
        style={{ borderTop: '1px solid rgba(255,68,68,0.1)' }}
      >
        <span
          className="text-xs font-bold px-2.5 py-1 rounded-lg"
          style={{ color, background: bg, border: `1px solid ${border}` }}
        >
          {diffLabel}
        </span>
        {alert.severity && (
          <span
            className="text-[11px] font-semibold uppercase tracking-wide"
            style={{ color: `${color}cc` }}
          >
            {alert.severity}
          </span>
        )}
        <span className="text-xs ml-auto" style={{ color: 'rgba(255,255,255,0.2)' }}>
          Click any image to open slider diff
        </span>
      </div>
    </div>
  )
}

/* ─── Snapshot row ─── */

function SnapshotRow({
  snap,
  alert,
  onClick,
}: {
  snap:    SnapshotWithUrl
  alert:   AlertWithUrls | null
  onClick: () => void
}) {
  const changed = !!alert
  const { color, bg, border } = changed
    ? severityStyle(alert!.diff_pct)
    : { color: '#00ff88', bg: 'rgba(0,255,136,0.06)', border: 'rgba(0,255,136,0.15)' }
  const diffPct = alert?.diff_pct != null ? `${Number(alert.diff_pct).toFixed(1)}%` : null

  return (
    <div
      className="w-full flex items-center gap-4 px-5 py-3.5 group transition-colors text-left"
      style={{
        borderBottom: '1px solid rgba(255,255,255,0.04)',
        background:   changed ? 'rgba(255,50,50,0.025)' : 'transparent',
      }}
    >
      {/* Snapshot thumbnail — click to open modal */}
      <button
        type="button"
        className="w-12 h-9 rounded-lg flex-shrink-0 overflow-hidden relative"
        style={{
          background: changed ? 'rgba(255,68,68,0.12)' : 'rgba(255,255,255,0.05)',
          border:     changed ? '1px solid rgba(255,68,68,0.2)' : '1px solid rgba(255,255,255,0.06)',
        }}
        onClick={onClick}
      >
        <Thumbnail
          url={snap.signedUrl}
          alt={formatDate(snap.taken_at)}
          className="w-full h-full"
          style={{ objectFit: 'cover' }}
        />
        {/* Hover reveal */}
        <div
          className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
          style={{ background: 'rgba(0,0,0,0.5)' }}
        >
          <Maximize2 className="w-3 h-3 text-white" />
        </div>
      </button>

      {/* Timestamp — click to open modal */}
      <button
        type="button"
        className="flex-1 min-w-0 text-left"
        onClick={onClick}
      >
        <p className="text-sm font-medium text-white">{formatDate(snap.taken_at)}</p>
        {changed && (
          <p className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.38)' }}>
            Visual change detected
          </p>
        )}
      </button>

      {/* Status badge */}
      <span
        className="text-[11px] font-semibold px-2 py-0.5 rounded-md flex-shrink-0"
        style={{ color, background: bg, border: `1px solid ${border}` }}
      >
        {changed ? (diffPct ?? 'CHANGED') : 'OK'}
      </span>

      {/* Size */}
      {snap.file_size_bytes && (
        <span className="text-[11px] font-mono flex-shrink-0" style={{ color: 'rgba(255,255,255,0.2)' }}>
          {Math.round(snap.file_size_bytes / 1024)}KB
        </span>
      )}

      {/* Download */}
      {snap.signedUrl && (
        <button
          type="button"
          onClick={() => downloadImage(snap.signedUrl!, `screenshot-${new Date(snap.taken_at).toISOString().slice(0,10)}.png`)}
          className="flex items-center justify-center w-6 h-6 rounded-md flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
          style={{ background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.5)' }}
          title="Download screenshot"
        >
          <Download className="w-3 h-3" />
        </button>
      )}
    </div>
  )
}

/* ─── Root export ─── */

export function UrlDetailClient({
  openAlert,
  snapshots,
  alertBySnapshotId,
  pageUrl,
}: UrlDetailClientProps) {
  const [modalOpen, setModalOpen]   = useState(false)
  const [modalAlert, setModalAlert] = useState<AlertWithUrls | null>(null)
  const [modalSnap,  setModalSnap]  = useState<SnapshotWithUrl | null>(null)
  const [defaultTab, setDefaultTab] = useState<DiffTab>('compare')

  function openAlertModal(alert: AlertWithUrls) {
    setModalAlert(alert)
    setModalSnap(null)
    setDefaultTab('compare')
    setModalOpen(true)
  }

  function openSnapshotModal(snap: SnapshotWithUrl, alert: AlertWithUrls | null) {
    setModalSnap(snap)
    setModalAlert(alert)
    setDefaultTab(alert ? 'compare' : 'after')
    setModalOpen(true)
  }

  // Derive modal image URLs
  const modalBeforeUrl = modalAlert?.beforeUrl ?? null
  const modalAfterUrl  = modalAlert?.afterUrl  ?? modalSnap?.signedUrl ?? null
  const modalDiffUrl   = modalAlert?.diffUrl   ?? null
  const modalMeta      = {
    diffPct:   modalAlert?.diff_pct,
    severity:  modalAlert?.severity,
    timestamp: modalSnap?.taken_at ?? modalAlert?.created_at,
    pageUrl,
  }

  return (
    <>
      {/* ── Open alert preview ── */}
      {openAlert && (
        <AlertDiffPreview
          alert={openAlert}
          onViewFull={() => openAlertModal(openAlert)}
        />
      )}

      {/* ── Screenshot history ── */}
      <div>
        <h2 className="text-base font-semibold text-white mb-3">Screenshot history</h2>
        {snapshots.length === 0 ? (
          <div className="dash-card flex flex-col items-center py-12 text-center">
            <p className="text-sm font-semibold text-white mb-1">No screenshots yet.</p>
            <p className="text-xs" style={{ color: 'rgba(255,255,255,0.35)' }}>
              The first screenshot will be taken on the next scheduled check.
            </p>
          </div>
        ) : (
          <div className="dash-card overflow-hidden" style={{ padding: 0 }}>
            {/* Header row */}
            <div
              className="grid px-5 py-2.5"
              style={{
                gridTemplateColumns: '48px 1fr auto auto auto',
                borderBottom: '1px solid rgba(255,255,255,0.06)',
                background: 'rgba(255,255,255,0.015)',
              }}
            >
              {['', 'Timestamp', 'Status', 'Size', ''].map((h, i) => (
                <span
                  key={i}
                  className="text-[10px] font-semibold uppercase tracking-wider"
                  style={{ color: 'rgba(255,255,255,0.28)' }}
                >
                  {h}
                </span>
              ))}
            </div>

            {snapshots.slice(0, 50).map((snap) => (
              <SnapshotRow
                key={snap.id}
                snap={snap}
                alert={alertBySnapshotId[snap.id] ?? null}
                onClick={() => openSnapshotModal(snap, alertBySnapshotId[snap.id] ?? null)}
              />
            ))}

            {snapshots.length > 50 && (
              <div className="px-5 py-3 text-center">
                <p className="text-xs" style={{ color: 'rgba(255,255,255,0.3)' }}>
                  Showing 50 of {snapshots.length} screenshots.
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ── Diff viewer modal ── */}
      <DiffViewerModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        beforeUrl={modalBeforeUrl}
        afterUrl={modalAfterUrl}
        diffUrl={modalDiffUrl}
        defaultTab={defaultTab}
        metadata={modalMeta}
      />
    </>
  )
}
