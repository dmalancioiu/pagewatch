'use client'

import { useEffect, useMemo, useState } from 'react'
import { createPortal } from 'react-dom'
import {
  Columns2, Download, Image, Maximize2,
  Minimize2, MoveHorizontal, Target, X,
} from 'lucide-react'
import { ZoneSelector, type Zone } from '@/components/dashboard/ZoneSelector'

// ─── Types ────────────────────────────────────────────────────────────────────

interface AlertItem {
  id: string
  diff_pct: number | null
  severity: string | null
  status: string
  created_at: string
  ai_summary?: string | null
  metadata?: Record<string, any>
  beforeUrl: string | null
  afterUrl: string | null
  diffUrl: string | null
}

interface SnapshotItem {
  id: string
  storage_path: string
  taken_at: string
  file_size_bytes: number | null
  signedUrl: string | null
}

type Tab = 'diff' | 'current' | 'zones'

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  initialTab: Tab
  monitorName: string
  snapshots: SnapshotItem[]
  alerts: AlertItem[]
  openAlert: AlertItem | null
  zones: Zone[]
  onZonesChange?: (zones: Zone[]) => void
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function fmtDate(iso?: string | null) {
  if (!iso) return 'Never'
  return new Date(iso).toLocaleString('en-US', {
    month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit',
  })
}

function fmtBytes(n: number | null) {
  if (!n) return '—'
  const kb = n / 1024
  return kb < 1024 ? `${kb.toFixed(0)} KB` : `${(kb / 1024).toFixed(1)} MB`
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

// ─── Component ────────────────────────────────────────────────────────────────

export function FullscreenMonitorViewer({
  open,
  onOpenChange,
  initialTab,
  monitorName,
  snapshots,
  alerts,
  openAlert,
  zones,
  onZonesChange,
}: Props) {
  const [tab, setTab]       = useState<Tab>(initialTab)
  const [handle, setHandle] = useState(50)
  const [mounted, setMounted] = useState(false)

  // Mount guard — createPortal requires the DOM to exist
  useEffect(() => { setMounted(true) }, [])

  // Sync tab when caller opens with a different tab
  useEffect(() => {
    if (open) setTab(initialTab)
  }, [open, initialTab])

  // Lock body scroll and handle Escape while open
  useEffect(() => {
    if (!open) return
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onOpenChange(false)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => {
      document.body.style.overflow = prevOverflow
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [open, onOpenChange])

  // Derived values — computed fresh each render, no extra state
  const latest      = snapshots[0] ?? null
  const previous    = snapshots[1] ?? null
  const activeAlert = openAlert ?? alerts[0] ?? null
  const afterUrl    = activeAlert?.afterUrl ?? latest?.signedUrl ?? null
  const beforeUrl   = activeAlert?.beforeUrl ?? previous?.signedUrl ?? null
  const currentUrl  = latest?.signedUrl ?? afterUrl
  const zoneImgUrl  = latest?.signedUrl ?? afterUrl
  const hasDiff     = Boolean(beforeUrl && afterUrl)
  const region      = activeAlert?.metadata?.zone_scores?.[0]?.label
                   ?? zones[0]?.label
                   ?? 'Full page'

  const tabs = useMemo<Array<{ id: Tab; label: string; Icon: typeof Columns2; disabled: boolean }>>(() => [
    { id: 'diff',    label: 'Diff comparison', Icon: Columns2, disabled: !hasDiff    },
    { id: 'current', label: 'Current capture', Icon: Image,    disabled: !currentUrl },
    { id: 'zones',   label: 'Zone editor',     Icon: Target,   disabled: !zoneImgUrl },
  ], [hasDiff, currentUrl, zoneImgUrl])

  function onDrag(e: React.PointerEvent) {
    const rect = e.currentTarget.getBoundingClientRect()
    setHandle(Math.max(3, Math.min(97, ((e.clientX - rect.left) / rect.width) * 100)))
  }

  function onZoneChange(next: Zone[]) {
    onZonesChange?.(next)
    window.dispatchEvent(
      new CustomEvent('pagewatch:zones-updated', {
        detail: { zones: next, source: 'fullscreen-viewer' },
      })
    )
  }

  if (!mounted || !open) return null

  return createPortal(
    <div className="pw-fso" role="dialog" aria-modal="true" aria-label="Fullscreen monitor viewer">
      {/* Backdrop */}
      <div className="pw-fso-backdrop" onClick={() => onOpenChange(false)} />

      {/* Shell */}
      <div className="pw-fso-shell">

        {/* ── Header ── */}
        <header className="pw-fso-header">
          <div className="pw-fso-title">
            <span className="pw-fso-title-icon"><Maximize2 size={14} /></span>
            <div>
              <b>{monitorName}</b>
              <small>
                {tab === 'diff'    && `Changed region: ${region}`}
                {tab === 'current' && `Captured ${fmtDate(latest?.taken_at)}`}
                {tab === 'zones'   && `${zones.length} zone${zones.length !== 1 ? 's' : ''} configured`}
              </small>
            </div>
          </div>

          <nav className="pw-fso-tabs">
            {tabs.map(({ id, label, Icon, disabled }) => (
              <button
                key={id}
                type="button"
                disabled={disabled}
                className={tab === id ? 'active' : ''}
                onClick={() => setTab(id)}
              >
                <Icon size={14} />{label}
              </button>
            ))}
          </nav>

          <div className="pw-fso-actions">
            {tab === 'current' && currentUrl && (
              <button
                type="button"
                onClick={() => triggerDownload(currentUrl, `${monitorName}-capture.png`)}
              >
                <Download size={13} />Download
              </button>
            )}
            <button type="button" onClick={() => onOpenChange(false)}>
              <Minimize2 size={13} />Exit
            </button>
            <button
              type="button"
              className="icon"
              onClick={() => onOpenChange(false)}
              aria-label="Close fullscreen viewer"
            >
              <X size={16} />
            </button>
          </div>
        </header>

        {/* ── Main ── */}
        <main className="pw-fso-main">

          {/* Diff tab */}
          {tab === 'diff' && hasDiff && (
            <div
              className="pw-fso-diff"
              onPointerDown={onDrag}
              onPointerMove={(e) => e.buttons === 1 && onDrag(e)}
            >
              <div className="pw-fso-layer after">
                <img src={afterUrl!} alt="After capture" />
              </div>
              <div
                className="pw-fso-layer before"
                style={{ clipPath: `inset(0 ${100 - handle}% 0 0)` }}
              >
                <img src={beforeUrl!} alt="Before capture" />
              </div>
              <span className="pw-fso-badge before">Before</span>
              <span className="pw-fso-badge after">After</span>
              <div className="pw-fso-handle" style={{ left: `${handle}%` }}>
                <span><MoveHorizontal size={16} /></span>
              </div>
              <footer className="pw-fso-footer">
                <b>{region}</b>
                <span>{activeAlert?.ai_summary || 'Compare the before and after captures.'}</span>
                <em>
                  {activeAlert?.diff_pct != null
                    ? `${fmtPct(activeAlert.diff_pct)}% diff`
                    : fmtDate(activeAlert?.created_at)}
                </em>
              </footer>
            </div>
          )}

          {/* Current capture tab */}
          {tab === 'current' && currentUrl && (
            <div className="pw-fso-current">
              <img src={currentUrl} alt="Current capture" />
              <footer className="pw-fso-footer" style={{ position: 'static', margin: '18px 18px 0' }}>
                <b>Selected capture</b>
                <span>
                  {fmtDate(latest?.taken_at)} · {fmtBytes(latest?.file_size_bytes ?? null)}
                </span>
              </footer>
            </div>
          )}

          {/* Zone editor tab */}
          {tab === 'zones' && zoneImgUrl && (
            <div className="pw-fso-zones">
              <div className="pw-fso-zone-canvas">
                <div>
                  <ZoneSelector
                    imageUrl={zoneImgUrl}
                    zones={zones}
                    onChange={onZoneChange}
                  />
                </div>
              </div>
              <aside className="pw-fso-zone-aside">
                <b>Fullscreen zone editor</b>
                <p>
                  Draw zones directly on the screenshot.
                  Changes sync with the sidebar immediately.
                </p>
                {zones.length > 0
                  ? zones.map((z, i) => (
                      <span key={z.id ?? i}>{z.label || `Zone ${i + 1}`}</span>
                    ))
                  : <em>No zones yet — drag on the screenshot to create one.</em>}
              </aside>
            </div>
          )}

        </main>
      </div>
    </div>,
    document.body
  )
}
