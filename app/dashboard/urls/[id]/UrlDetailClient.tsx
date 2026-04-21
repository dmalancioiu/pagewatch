'use client'

import { useState, useTransition } from 'react'
import { acknowledgeAlert } from '@/lib/actions/alerts'
import { DiffViewerModal } from '@/components/dashboard/DiffViewerModal'
import type { DiffTab } from '@/components/dashboard/DiffViewerModal'
import { Maximize2, Download, History } from 'lucide-react'

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
    window.open(url, '_blank')
  }
}

/* ─── Types ─── */

export interface AlertWithUrls {
  id:         string
  diff_pct:   number | null
  severity:   string | null
  status:     string
  created_at: string
  ai_summary?: string | null
  beforeUrl:  string | null
  afterUrl:   string | null
  diffUrl:    string | null
}

export interface SnapshotWithUrl {
  id:              string
  storage_path:    string
  taken_at:        string
  file_size_bytes: number | null
  signedUrl:       string | null
}

interface UrlDetailClientProps {
  openAlert:         AlertWithUrls | null
  snapshots:         SnapshotWithUrl[]
  alertBySnapshotId: Record<string, AlertWithUrls>
  pageUrl:           string
}

/* ─── Helpers ─── */

function formatDate(iso: string): string {
  return new Date(iso).toLocaleString('en-US', {
    month: 'short', day: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })
}

function severityStyle(pct: number | null) {
  if (!pct || pct < 5)  return { color: '#B45309', bg: 'rgba(180,83,9,0.07)',  border: 'rgba(180,83,9,0.18)'  }
  if (pct < 15)         return { color: '#C2410C', bg: 'rgba(194,65,12,0.07)', border: 'rgba(194,65,12,0.18)' }
  return                       { color: '#B91C1C', bg: 'rgba(185,28,28,0.07)', border: 'rgba(185,28,28,0.2)'  }
}

/* ─── Thumbnail ─── */

function Thumbnail({
  url,
  alt,
  className = '',
  style = {},
}: {
  url:        string | null
  alt:        string
  className?: string
  style?:     React.CSSProperties
}) {
  const [error, setError] = useState(false)

  if (!url || error) {
    return (
      <div
        className={`flex items-center justify-center ${className}`}
        style={{ ...style, background: '#F3F4F6' }}
      >
        <span className="text-[10px]" style={{ color: '#9CA3AF' }}>
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
  const [dismissed, setDismissed]   = useState(false)

  if (dismissed) return null

  function handleAcknowledge() {
    startTransition(async () => {
      await acknowledgeAlert(alert.id)
      setDismissed(true)
    })
  }

  const { color, bg, border } = severityStyle(alert.diff_pct)
  const diffLabel = `${Number(alert.diff_pct ?? 0).toFixed(1)}% changed`
  const summary = alert.ai_summary

  return (
    <div
      className="dash-card overflow-hidden"
      style={{ borderColor: 'rgba(185,28,28,0.25)' }}
    >
      {/* Title bar */}
      <div
        className="flex items-center justify-between px-5 py-3"
        style={{ borderBottom: '1px solid rgba(185,28,28,0.12)', background: 'rgba(185,28,28,0.03)' }}
      >
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span
              className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75"
              style={{ background: '#DC2626' }}
            />
            <span className="relative inline-flex rounded-full h-2 w-2" style={{ background: '#DC2626' }} />
          </span>
          <span className="text-sm font-semibold" style={{ color: '#B91C1C' }}>
            Change detected — needs review
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onViewFull}
            className="text-xs font-medium px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5"
            style={{ background: '#F3F4F6', color: '#374151', border: '1px solid #E5E7EB' }}
          >
            <Maximize2 className="w-3 h-3" />
            Full diff
          </button>
          <button
            type="button"
            onClick={handleAcknowledge}
            disabled={isPending}
            className="text-xs font-medium px-3 py-1.5 rounded-lg transition-colors disabled:opacity-50"
            style={{ background: '#F9FAFB', color: '#6B7280', border: '1px solid #E5E7EB' }}
          >
            {isPending ? 'Saving…' : 'Acknowledge'}
          </button>
        </div>
      </div>

      {/* AI summary (if present) */}
      {summary && (
        <div
          className="px-5 py-3"
          style={{ borderBottom: '1px solid #F3F4F6', background: '#F8FAFC' }}
        >
          <p className="text-[11px] font-semibold mb-1" style={{ color: '#9CA3AF' }}>What changed</p>
          <p className="text-sm leading-relaxed" style={{ color: '#374151' }}>{summary}</p>
        </div>
      )}

      {/* Before / After thumbnails */}
      <div className="grid grid-cols-2" style={{ gap: 1, background: '#F3F4F6' }}>
        {/* Before */}
        <div
          className="relative group/thumb cursor-pointer overflow-hidden"
          style={{ background: '#F8FAFC' }}
          onClick={onViewFull}
        >
          <div
            className="absolute top-0 left-0 right-0 z-10 px-3 py-2 flex items-center justify-between"
            style={{ background: 'linear-gradient(to bottom, rgba(248,250,252,0.9) 0%, transparent 100%)' }}
          >
            <span className="text-[10px] font-semibold uppercase tracking-widest" style={{ color: '#6B7280' }}>
              Before
            </span>
            {alert.beforeUrl && (
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); downloadImage(alert.beforeUrl!, 'before.png') }}
                className="p-1 rounded opacity-0 group-hover/thumb:opacity-100 transition-opacity"
                style={{ background: 'rgba(0,0,0,0.12)', color: '#374151' }}
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
            style={{ height: 200, objectFit: 'cover', objectPosition: 'top', display: 'block' }}
          />

          <div
            className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/thumb:opacity-100 transition-opacity"
            style={{ background: 'rgba(0,0,0,0.25)' }}
          >
            <div
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium"
              style={{ background: 'rgba(0,0,0,0.7)', color: 'white' }}
            >
              <Maximize2 className="w-3.5 h-3.5" /> Expand
            </div>
          </div>
        </div>

        {/* After */}
        <div
          className="relative group/thumb cursor-pointer overflow-hidden"
          style={{ background: '#F8FAFC' }}
          onClick={onViewFull}
        >
          <div
            className="absolute top-0 left-0 right-0 z-10 px-3 py-2 flex items-center justify-between"
            style={{ background: 'linear-gradient(to bottom, rgba(248,250,252,0.9) 0%, transparent 100%)' }}
          >
            <span className="text-[10px] font-semibold uppercase tracking-widest" style={{ color: '#6B7280' }}>
              After
            </span>
            <div className="flex items-center gap-2">
              <span
                className="text-[10px] font-semibold px-2 py-0.5 rounded-md"
                style={{ color, background: bg, border: `1px solid ${border}` }}
              >
                {diffLabel}
              </span>
              {alert.afterUrl && (
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); downloadImage(alert.afterUrl!, 'after.png') }}
                  className="p-1 rounded opacity-0 group-hover/thumb:opacity-100 transition-opacity"
                  style={{ background: 'rgba(0,0,0,0.12)', color: '#374151' }}
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
            style={{ height: 200, objectFit: 'cover', objectPosition: 'top', display: 'block' }}
          />

          <div
            className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/thumb:opacity-100 transition-opacity"
            style={{ background: 'rgba(0,0,0,0.25)' }}
          >
            <div
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium"
              style={{ background: 'rgba(0,0,0,0.7)', color: 'white' }}
            >
              <Maximize2 className="w-3.5 h-3.5" /> Expand
            </div>
          </div>
        </div>
      </div>

      {/* Footer hint */}
      <div
        className="px-5 py-2.5 flex items-center justify-between"
        style={{ borderTop: '1px solid #F3F4F6' }}
      >
        <span
          className="text-xs font-semibold px-2 py-0.5 rounded-md"
          style={{ color, background: bg, border: `1px solid ${border}` }}
        >
          {diffLabel}
        </span>
        <span className="text-xs" style={{ color: '#9CA3AF' }}>
          Click images to open slider comparison
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
    : { color: '#15803D', bg: 'rgba(22,163,74,0.07)', border: 'rgba(22,163,74,0.18)' }
  const diffPct = alert?.diff_pct != null ? `${Number(alert.diff_pct).toFixed(1)}%` : null

  return (
    <div
      className="flex items-center gap-4 px-5 py-3 group transition-colors"
      style={{
        borderBottom: '1px solid #F3F4F6',
        background: changed ? 'rgba(185,28,28,0.02)' : 'transparent',
      }}
    >
      {/* Thumbnail — click to open modal */}
      <button
        type="button"
        className="w-12 h-9 rounded-lg flex-shrink-0 overflow-hidden relative"
        style={{
          background: '#F3F4F6',
          border: changed ? '1px solid rgba(185,28,28,0.2)' : '1px solid #E5E7EB',
        }}
        onClick={onClick}
      >
        <Thumbnail
          url={snap.signedUrl}
          alt={formatDate(snap.taken_at)}
          className="w-full h-full"
          style={{ objectFit: 'cover' }}
        />
        <div
          className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
          style={{ background: 'rgba(0,0,0,0.35)' }}
        >
          <Maximize2 className="w-3 h-3" style={{ color: 'white' }} />
        </div>
      </button>

      {/* Timestamp — click to open modal */}
      <button
        type="button"
        className="flex-1 min-w-0 text-left"
        onClick={onClick}
      >
        <p className="text-sm font-medium" style={{ color: '#111827' }}>{formatDate(snap.taken_at)}</p>
        {changed && (
          <p className="text-xs mt-0.5" style={{ color: '#9CA3AF' }}>
            Visual change detected
          </p>
        )}
      </button>

      {/* Status */}
      <span
        className="text-[11px] font-semibold px-2 py-0.5 rounded-md flex-shrink-0"
        style={{ color, background: bg, border: `1px solid ${border}` }}
      >
        {changed ? (diffPct ?? 'Changed') : 'OK'}
      </span>

      {/* Size */}
      {snap.file_size_bytes && (
        <span className="text-[11px] font-mono flex-shrink-0" style={{ color: '#D1D5DB' }}>
          {Math.round(snap.file_size_bytes / 1024)}KB
        </span>
      )}

      {/* Download */}
      {snap.signedUrl && (
        <button
          type="button"
          onClick={() => downloadImage(snap.signedUrl!, `screenshot-${new Date(snap.taken_at).toISOString().slice(0, 10)}.png`)}
          className="flex items-center justify-center w-6 h-6 rounded-md flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
          style={{ background: '#F3F4F6', color: '#6B7280', border: '1px solid #E5E7EB' }}
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
      {/* Open alert preview */}
      {openAlert && (
        <AlertDiffPreview
          alert={openAlert}
          onViewFull={() => openAlertModal(openAlert)}
        />
      )}

      {/* Screenshot history */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <History className="w-4 h-4" style={{ color: '#9CA3AF' }} />
          <h2 className="text-sm font-semibold" style={{ color: '#374151' }}>Screenshot history</h2>
        </div>

        {snapshots.length === 0 ? (
          <div className="dash-card flex flex-col items-center py-12 text-center">
            <p className="text-sm font-medium mb-1" style={{ color: '#374151' }}>No screenshots yet</p>
            <p className="text-xs" style={{ color: '#9CA3AF' }}>
              The first screenshot will be taken on the next scheduled check.
            </p>
          </div>
        ) : (
          <div className="dash-card overflow-hidden" style={{ padding: 0 }}>
            {/* Column headers */}
            <div
              className="grid px-5 py-2.5"
              style={{
                gridTemplateColumns: '48px 1fr auto auto auto',
                borderBottom: '1px solid #F3F4F6',
                background: '#F8FAFC',
              }}
            >
              {['', 'Timestamp', 'Status', 'Size', ''].map((h, i) => (
                <span
                  key={i}
                  className="text-[10px] font-semibold uppercase tracking-wider"
                  style={{ color: '#9CA3AF' }}
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
                <p className="text-xs" style={{ color: '#9CA3AF' }}>
                  Showing 50 of {snapshots.length} screenshots.
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Diff viewer modal */}
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
