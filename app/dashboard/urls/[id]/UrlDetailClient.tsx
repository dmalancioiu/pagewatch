'use client'

import { useState, useTransition } from 'react'
import { acknowledgeAlert } from '@/lib/actions/alerts'
import { DiffViewerModal } from '@/components/dashboard/DiffViewerModal'
import type { DiffTab } from '@/components/dashboard/DiffViewerModal'
import {
  ArrowUpRight,
  CheckCircle2,
  Download,
  History,
  Maximize2,
  Sparkles,
} from 'lucide-react'

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

export interface AlertWithUrls {
  id: string
  diff_pct: number | null
  severity: string | null
  status: string
  created_at: string
  ai_summary?: string | null
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
}

interface UrlDetailClientProps {
  openAlert: AlertWithUrls | null
  snapshots: SnapshotWithUrl[]
  alertBySnapshotId: Record<string, AlertWithUrls>
  pageUrl: string
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function severityStyle(pct: number | null) {
  if (!pct || pct < 5) return { color: '#B45309', bg: 'rgba(180,83,9,0.07)', border: 'rgba(180,83,9,0.18)' }
  if (pct < 15) return { color: '#C2410C', bg: 'rgba(194,65,12,0.07)', border: 'rgba(194,65,12,0.18)' }
  return { color: '#B91C1C', bg: 'rgba(185,28,28,0.07)', border: 'rgba(185,28,28,0.2)' }
}

function Thumbnail({
  url,
  alt,
  className = '',
  style = {},
}: {
  url: string | null
  alt: string
  className?: string
  style?: React.CSSProperties
}) {
  const [error, setError] = useState(false)

  if (!url || error) {
    return (
      <div className={`flex items-center justify-center ${className}`} style={{ ...style, background: '#F3F4F6' }}>
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

function AlertDiffPreview({
  alert,
  onViewFull,
}: {
  alert: AlertWithUrls
  onViewFull: () => void
}) {
  const [isPending, startTransition] = useTransition()
  const [dismissed, setDismissed] = useState(false)

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
    <section className="dash-card overflow-hidden">
      <div
        className="border-b px-5 py-4 sm:px-6"
        style={{ borderColor: 'rgba(185,28,28,0.1)', background: 'linear-gradient(180deg, rgba(254,242,242,0.9) 0%, #FFFFFF 100%)' }}
      >
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium" style={{ color, background: bg, border: `1px solid ${border}` }}>
              <Sparkles className="h-3.5 w-3.5" />
              Change detected
            </div>
            <h2 className="mt-3 text-lg font-semibold tracking-tight" style={{ color: '#111827' }}>
              Review the latest visual diff before trusting this page again.
            </h2>
            <p className="mt-2 text-sm leading-6" style={{ color: '#4B5563' }}>
              This monitor captured a meaningful screenshot change. Use the comparison below to decide whether the alert is expected, cosmetic, or worth escalating.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={onViewFull}
              className="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-colors"
              style={{ background: '#111827', color: '#FFFFFF', border: '1px solid #111827' }}
            >
              <Maximize2 className="h-4 w-4" />
              Open full diff
            </button>
            <button
              type="button"
              onClick={handleAcknowledge}
              disabled={isPending}
              className="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-colors disabled:opacity-50"
              style={{ background: '#FFFFFF', color: '#374151', border: '1px solid #E5E7EB' }}
            >
              <CheckCircle2 className="h-4 w-4" />
              {isPending ? 'Saving…' : 'Acknowledge'}
            </button>
          </div>
        </div>

        {alert.ai_summary && (
          <div
            className="mt-4 rounded-2xl p-4"
            style={{ background: '#FFFFFF', border: '1px solid #F1F5F9' }}
          >
            <p className="text-[11px] font-medium uppercase tracking-[0.14em]" style={{ color: '#9CA3AF' }}>AI summary</p>
            <p className="mt-2 text-sm leading-6" style={{ color: '#374151' }}>{alert.ai_summary}</p>
          </div>
        )}
      </div>

      <div className="grid gap-px bg-[#EEF2F7] lg:grid-cols-2">
        {[
          { key: 'before', label: 'Before', url: alert.beforeUrl },
          { key: 'after', label: 'After', url: alert.afterUrl },
        ].map((item) => (
          <button
            key={item.key}
            type="button"
            onClick={onViewFull}
            className="group relative overflow-hidden bg-white text-left"
          >
            <div className="absolute inset-x-0 top-0 z-10 flex items-center justify-between px-4 py-3">
              <div className="rounded-full bg-white/95 px-2.5 py-1 text-[11px] font-medium uppercase tracking-[0.14em]" style={{ color: '#6B7280', border: '1px solid #E5E7EB' }}>
                {item.label}
              </div>
              <div className="flex items-center gap-2">
                {item.key === 'after' && (
                  <span className="rounded-full px-2.5 py-1 text-[11px] font-medium" style={{ color, background: bg, border: `1px solid ${border}` }}>
                    {diffLabel}
                  </span>
                )}
                {item.url && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation()
                      downloadImage(item.url!, `${item.key}.png`)
                    }}
                    className="rounded-lg p-2 opacity-0 transition-opacity group-hover:opacity-100"
                    style={{ background: 'rgba(255,255,255,0.92)', color: '#374151', border: '1px solid #E5E7EB' }}
                    title="Download image"
                  >
                    <Download className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>
            </div>

            <Thumbnail
              url={item.url}
              alt={item.label}
              className="w-full"
              style={{ height: 300, objectFit: 'cover', objectPosition: 'top', display: 'block' }}
            />

            <div
              className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity group-hover:opacity-100"
              style={{ background: 'rgba(17,24,39,0.24)' }}
            >
              <div className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-medium" style={{ background: 'rgba(17,24,39,0.88)', color: '#FFFFFF' }}>
                <ArrowUpRight className="h-3.5 w-3.5" />
                Open comparison
              </div>
            </div>
          </button>
        ))}
      </div>
    </section>
  )
}

function SnapshotRow({
  snap,
  alert,
  onClick,
}: {
  snap: SnapshotWithUrl
  alert: AlertWithUrls | null
  onClick: () => void
}) {
  const changed = !!alert
  const { color, bg, border } = changed
    ? severityStyle(alert!.diff_pct)
    : { color: '#15803D', bg: 'rgba(22,163,74,0.07)', border: 'rgba(22,163,74,0.18)' }
  const diffPct = alert?.diff_pct != null ? `${Number(alert.diff_pct).toFixed(1)}%` : null

  return (
    <button
      type="button"
      onClick={onClick}
      className="group grid w-full items-center gap-4 px-4 py-4 text-left transition-colors sm:grid-cols-[64px_minmax(0,1fr)_auto]"
      style={{ borderTop: '1px solid #F3F4F6', background: changed ? 'rgba(185,28,28,0.02)' : '#FFFFFF' }}
    >
      <div className="relative overflow-hidden rounded-2xl" style={{ border: changed ? '1px solid rgba(185,28,28,0.18)' : '1px solid #E5E7EB' }}>
        <Thumbnail
          url={snap.signedUrl}
          alt={formatDate(snap.taken_at)}
          className="h-14 w-16"
          style={{ objectFit: 'cover', display: 'block' }}
        />
        <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity group-hover:opacity-100" style={{ background: 'rgba(17,24,39,0.32)' }}>
          <Maximize2 className="h-4 w-4" style={{ color: '#FFFFFF' }} />
        </div>
      </div>

      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <p className="text-sm font-medium" style={{ color: '#111827' }}>{formatDate(snap.taken_at)}</p>
          <span className="rounded-full px-2.5 py-1 text-[11px] font-medium" style={{ color, background: bg, border: `1px solid ${border}` }}>
            {changed ? diffPct ?? 'Changed' : 'Stable'}
          </span>
        </div>
        <div className="mt-1 flex flex-wrap items-center gap-2 text-xs" style={{ color: '#6B7280' }}>
          <span>{changed ? 'Visual change detected' : 'No change alert on this run'}</span>
          {snap.file_size_bytes ? (
            <>
              <span style={{ color: '#D1D5DB' }}>•</span>
              <span>{Math.round(snap.file_size_bytes / 1024)} KB</span>
            </>
          ) : null}
        </div>
      </div>

      <div className="flex items-center gap-2">
        {snap.signedUrl && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              downloadImage(snap.signedUrl!, `screenshot-${new Date(snap.taken_at).toISOString().slice(0, 10)}.png`)
            }}
            className="rounded-xl p-2 transition-colors"
            style={{ background: '#F9FAFB', color: '#6B7280', border: '1px solid #E5E7EB' }}
            title="Download screenshot"
          >
            <Download className="h-4 w-4" />
          </button>
        )}
        <div className="rounded-xl px-3 py-2 text-xs font-medium" style={{ background: '#F9FAFB', color: '#6B7280', border: '1px solid #E5E7EB' }}>
          Open
        </div>
      </div>
    </button>
  )
}

export function UrlDetailClient({
  openAlert,
  snapshots,
  alertBySnapshotId,
  pageUrl,
}: UrlDetailClientProps) {
  const [modalOpen, setModalOpen] = useState(false)
  const [modalAlert, setModalAlert] = useState<AlertWithUrls | null>(null)
  const [modalSnap, setModalSnap] = useState<SnapshotWithUrl | null>(null)
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
  const modalAfterUrl = modalAlert?.afterUrl ?? modalSnap?.signedUrl ?? null
  const modalDiffUrl = modalAlert?.diffUrl ?? null
  const modalMeta = {
    diffPct: modalAlert?.diff_pct,
    severity: modalAlert?.severity,
    timestamp: modalSnap?.taken_at ?? modalAlert?.created_at,
    pageUrl,
  }

  return (
    <>
      {openAlert ? (
        <AlertDiffPreview alert={openAlert} onViewFull={() => openAlertModal(openAlert)} />
      ) : (
        <section className="dash-card p-6">
          <div className="flex items-start gap-4">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl" style={{ background: 'rgba(22,163,74,0.08)', color: '#15803D', border: '1px solid rgba(22,163,74,0.16)' }}>
              <CheckCircle2 className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-semibold" style={{ color: '#111827' }}>No active change needs review</p>
              <p className="mt-1 text-sm leading-6" style={{ color: '#6B7280' }}>
                This monitor is currently quiet. Historical screenshots are still available below for audits and spot checks.
              </p>
            </div>
          </div>
        </section>
      )}

      <section className="dash-card overflow-hidden">
        <div className="border-b px-5 py-4 sm:px-6" style={{ borderColor: '#F3F4F6', background: '#FCFCFD' }}>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="flex items-center gap-2">
                <History className="h-4 w-4" style={{ color: '#9CA3AF' }} />
                <p className="text-xs font-medium uppercase tracking-[0.16em]" style={{ color: '#9CA3AF' }}>History</p>
              </div>
              <h2 className="mt-1 text-lg font-semibold tracking-tight" style={{ color: '#111827' }}>Screenshot timeline</h2>
              <p className="mt-1 text-sm leading-6" style={{ color: '#6B7280' }}>
                Every run is preserved here, so you can compare changes, inspect drift over time, and download source captures.
              </p>
            </div>
            <div className="rounded-full px-3 py-1.5 text-xs font-medium" style={{ background: '#F9FAFB', color: '#6B7280', border: '1px solid #E5E7EB' }}>
              {snapshots.length} screenshot{snapshots.length === 1 ? '' : 's'}
            </div>
          </div>
        </div>

        {snapshots.length === 0 ? (
          <div className="flex flex-col items-center py-16 text-center">
            <p className="text-sm font-medium" style={{ color: '#374151' }}>No screenshots yet</p>
            <p className="mt-1 text-xs" style={{ color: '#9CA3AF' }}>
              The first screenshot will appear after the next scheduled check.
            </p>
          </div>
        ) : (
          <div>
            {snapshots.slice(0, 50).map((snap) => (
              <SnapshotRow
                key={snap.id}
                snap={snap}
                alert={alertBySnapshotId[snap.id] ?? null}
                onClick={() => openSnapshotModal(snap, alertBySnapshotId[snap.id] ?? null)}
              />
            ))}

            {snapshots.length > 50 && (
              <div className="border-t px-5 py-4 text-center text-xs" style={{ color: '#9CA3AF', borderColor: '#F3F4F6' }}>
                Showing the latest 50 of {snapshots.length} screenshots.
              </div>
            )}
          </div>
        )}
      </section>

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
