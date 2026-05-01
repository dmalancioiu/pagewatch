'use client'

import { useEffect, useMemo, useState } from 'react'
import { Columns2, Download, Image, Maximize2, Minimize2, MoveHorizontal, Target, X } from 'lucide-react'
import { ZoneSelector, type Zone } from '@/components/dashboard/ZoneSelector'

type AlertItem = {
  id: string
  diff_pct: number | null
  severity: string | null
  status: string
  created_at: string
  ai_summary?: string | null
  metadata?: any
  beforeUrl: string | null
  afterUrl: string | null
  diffUrl: string | null
}

type SnapshotItem = {
  id: string
  storage_path: string
  taken_at: string
  file_size_bytes: number | null
  signedUrl: string | null
}

type Props = {
  monitorName: string
  snapshots: SnapshotItem[]
  alerts: AlertItem[]
  openAlert: AlertItem | null
  zones: Zone[]
}

type Tab = 'diff' | 'current' | 'zones'

function fmtDate(iso?: string | null) {
  if (!iso) return 'Never'
  return new Date(iso).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
}

function bytes(n: number | null) {
  if (!n) return '—'
  const kb = n / 1024
  return kb < 1024 ? `${kb.toFixed(0)} KB` : `${(kb / 1024).toFixed(1)} MB`
}

function pct(v?: number | null) {
  return Number(v ?? 0).toFixed(1)
}

function normaliseZones(zones: Zone[]) {
  return zones.map((zone, index) => ({
    id: zone.id ?? `zone-${index + 1}`,
    x: zone.x,
    y: zone.y,
    width: zone.width,
    height: zone.height,
    label: zone.label ?? `Zone ${index + 1}`,
    instruction: zone.instruction ?? '',
    sensitivity: zone.sensitivity ?? 'normal',
  }))
}

function downloadUrl(url: string | null, filename: string) {
  if (!url) return
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.target = '_blank'
  document.body.appendChild(a)
  a.click()
  a.remove()
}

function getActiveViewerTab(hasDiff: boolean): Tab {
  const activeTabText = Array.from(document.querySelectorAll<HTMLButtonElement>('.md-viewer-header button.active'))[0]?.textContent?.toLowerCase() ?? ''
  if (activeTabText.includes('zone')) return 'zones'
  if (activeTabText.includes('current')) return 'current'
  return hasDiff ? 'diff' : 'current'
}

function buttonLikeTarget(target: EventTarget | null): HTMLElement | null {
  if (!(target instanceof HTMLElement)) return null
  return target.closest<HTMLElement>('button, [role="button"], a')
}

function isFullscreenButton(target: EventTarget | null): boolean {
  const button = buttonLikeTarget(target)
  if (!button) return false

  const text = button.textContent?.replace(/\s+/g, ' ').trim().toLowerCase() ?? ''
  const label = button.getAttribute('aria-label')?.toLowerCase() ?? ''
  const title = button.getAttribute('title')?.toLowerCase() ?? ''
  const dataset = (button as HTMLElement).dataset?.monitorFullscreen === 'true'

  return dataset || text === 'fullscreen' || text.includes('fullscreen') || label.includes('fullscreen') || title.includes('fullscreen')
}

export function FullscreenMonitorViewer({ monitorName, snapshots, alerts, openAlert, zones }: Props) {
  const latest = snapshots[0] ?? null
  const previous = snapshots[1] ?? null
  const activeAlert = openAlert ?? alerts[0] ?? null
  const [open, setOpen] = useState(false)
  const [tab, setTab] = useState<Tab>('diff')
  const [handle, setHandle] = useState(50)
  const [localZones, setLocalZones] = useState<Zone[]>(() => normaliseZones(zones))

  const afterUrl = activeAlert?.afterUrl ?? latest?.signedUrl ?? null
  const beforeUrl = activeAlert?.beforeUrl ?? previous?.signedUrl ?? null
  const currentUrl = latest?.signedUrl ?? afterUrl
  const zoneImageUrl = latest?.signedUrl ?? afterUrl
  const changedRegion = activeAlert?.metadata?.zone_scores?.[0]?.label ?? localZones[0]?.label ?? 'Full page'

  const hasDiff = Boolean(beforeUrl && afterUrl)

  useEffect(() => {
    setLocalZones(normaliseZones(zones))
  }, [zones])

  useEffect(() => {
    function handleExternalZones(event: Event) {
      const detail = (event as CustomEvent<{ zones?: Zone[]; source?: string }>).detail
      if (!Array.isArray(detail?.zones) || detail.source === 'fullscreen-viewer') return
      setLocalZones(normaliseZones(detail.zones))
    }

    window.addEventListener('pagewatch:zones-updated', handleExternalZones)
    return () => window.removeEventListener('pagewatch:zones-updated', handleExternalZones)
  }, [])

  function updateZones(nextZones: Zone[]) {
    setLocalZones(nextZones)
    window.dispatchEvent(new CustomEvent('pagewatch:zones-updated', {
      detail: { zones: nextZones, source: 'fullscreen-viewer' },
    }))
  }

  function openFullscreen() {
    setTab(getActiveViewerTab(hasDiff))
    setOpen(true)
  }

  useEffect(() => {
    function markButtons() {
      document.querySelectorAll<HTMLElement>('button, [role="button"], a').forEach((button) => {
        const text = button.textContent?.replace(/\s+/g, ' ').trim().toLowerCase() ?? ''
        const label = button.getAttribute('aria-label')?.toLowerCase() ?? ''
        const title = button.getAttribute('title')?.toLowerCase() ?? ''
        if (text.includes('fullscreen') || label.includes('fullscreen') || title.includes('fullscreen')) {
          button.dataset.monitorFullscreen = 'true'
          if (button instanceof HTMLButtonElement) button.type = 'button'
        }
      })
    }

    markButtons()
    const observer = new MutationObserver(markButtons)
    observer.observe(document.body, { childList: true, subtree: true })

    function handleOpenEvent(event: Event) {
      event.preventDefault()
      openFullscreen()
    }

    function handlePointer(event: PointerEvent) {
      if (!isFullscreenButton(event.target)) return
      event.preventDefault()
      event.stopPropagation()
      openFullscreen()
    }

    function handleClick(event: MouseEvent) {
      if (!isFullscreenButton(event.target)) return
      event.preventDefault()
      event.stopPropagation()
      openFullscreen()
    }

    window.addEventListener('pagewatch:open-fullscreen', handleOpenEvent)
    window.addEventListener('pointerdown', handlePointer, true)
    document.addEventListener('click', handleClick, true)

    return () => {
      observer.disconnect()
      window.removeEventListener('pagewatch:open-fullscreen', handleOpenEvent)
      window.removeEventListener('pointerdown', handlePointer, true)
      document.removeEventListener('click', handleClick, true)
    }
  }, [hasDiff])

  useEffect(() => {
    if (!open) return
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') setOpen(false)
    }
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKeyDown)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [open])

  function drag(e: React.PointerEvent<HTMLDivElement>) {
    const rect = e.currentTarget.getBoundingClientRect()
    setHandle(Math.max(3, Math.min(97, ((e.clientX - rect.left) / rect.width) * 100)))
  }

  const tabButtons = useMemo(() => [
    { id: 'diff' as const, label: 'Diff comparison', icon: Columns2, disabled: !hasDiff },
    { id: 'current' as const, label: 'Current capture', icon: Image, disabled: !currentUrl },
    { id: 'zones' as const, label: 'Zone editor', icon: Target, disabled: !zoneImageUrl },
  ], [currentUrl, hasDiff, zoneImageUrl])

  if (!open) return null

  return (
    <div className="pw-fullscreen-viewer" role="dialog" aria-modal="true" aria-label="Fullscreen monitor viewer">
      <style jsx global>{css}</style>
      <div className="pw-fs-backdrop" onClick={() => setOpen(false)} />
      <div className="pw-fs-shell">
        <header className="pw-fs-header">
          <div className="pw-fs-title">
            <span><Maximize2 size={14} /></span>
            <div>
              <b>{monitorName}</b>
              <small>{tab === 'diff' ? `Changed region: ${changedRegion}` : tab === 'current' ? `Captured ${fmtDate(latest?.taken_at)}` : `${localZones.length} zones configured`}</small>
            </div>
          </div>

          <nav className="pw-fs-tabs">
            {tabButtons.map((item) => {
              const Icon = item.icon
              return (
                <button key={item.id} disabled={item.disabled} className={tab === item.id ? 'active' : ''} onClick={() => setTab(item.id)}>
                  <Icon size={14} />{item.label}
                </button>
              )
            })}
          </nav>

          <div className="pw-fs-actions">
            {tab === 'current' && currentUrl && <button onClick={() => downloadUrl(currentUrl, `${monitorName}-capture.png`)}><Download size={13} />Download</button>}
            <button onClick={() => setOpen(false)}><Minimize2 size={13} />Exit</button>
            <button className="icon" onClick={() => setOpen(false)} aria-label="Close fullscreen viewer"><X size={16} /></button>
          </div>
        </header>

        <main className="pw-fs-main">
          {tab === 'diff' && hasDiff && (
            <section className="pw-fs-diff" onPointerDown={drag} onPointerMove={(e) => e.buttons === 1 && drag(e)}>
              <div className="pw-fs-layer after"><img src={afterUrl!} alt="After capture" /></div>
              <div className="pw-fs-layer before" style={{ clipPath: `inset(0 ${100 - handle}% 0 0)` }}><img src={beforeUrl!} alt="Before capture" /></div>
              <span className="pw-fs-label before">Before</span>
              <span className="pw-fs-label after">After</span>
              <div className="pw-fs-handle" style={{ left: `${handle}%` }}><span><MoveHorizontal size={16} /></span></div>
              <footer>
                <b>{changedRegion}</b>
                <span>{activeAlert?.ai_summary || 'Compare the before and after captures.'}</span>
                <em>{activeAlert?.diff_pct != null ? `${pct(activeAlert.diff_pct)}% technical diff` : fmtDate(activeAlert?.created_at)}</em>
              </footer>
            </section>
          )}

          {tab === 'current' && currentUrl && (
            <section className="pw-fs-current">
              <div><img src={currentUrl} alt="Current capture" /></div>
              <footer>
                <b>Selected capture</b>
                <span>{fmtDate(latest?.taken_at)} · {bytes(latest?.file_size_bytes ?? null)}</span>
              </footer>
            </section>
          )}

          {tab === 'zones' && zoneImageUrl && (
            <section className="pw-fs-zones">
              <div className="pw-fs-zone-canvas">
                <ZoneSelector imageUrl={zoneImageUrl} zones={localZones} onChange={updateZones} />
              </div>
              <aside>
                <b>Fullscreen zone editor</b>
                <p>Draw or delete zones on the larger screenshot. Changes sync with the right sidebar immediately.</p>
                <div className="pw-fs-zone-list">
                  {localZones.length ? localZones.map((zone, index) => (
                    <span key={zone.id ?? index}>{zone.label || `Zone ${index + 1}`}</span>
                  )) : <em>No zones yet. Drag on the screenshot to create one.</em>}
                </div>
              </aside>
            </section>
          )}
        </main>
      </div>
    </div>
  )
}

const css = `
.pw-fullscreen-viewer{position:fixed;inset:0;z-index:10020;font-family:Inter,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif}.pw-fs-backdrop{position:absolute;inset:0;background:rgba(15,23,42,.62);backdrop-filter:blur(16px);-webkit-backdrop-filter:blur(16px)}.pw-fs-shell{position:absolute;inset:18px;background:#F8FAFC;border:1px solid rgba(255,255,255,.62);border-radius:20px;box-shadow:0 30px 90px rgba(15,23,42,.34);overflow:hidden;display:flex;flex-direction:column}.pw-fs-header{height:58px;background:rgba(255,255,255,.96);border-bottom:1px solid #E5E7EB;display:flex;align-items:center;gap:14px;padding:0 14px}.pw-fs-title{display:flex;align-items:center;gap:10px;min-width:230px}.pw-fs-title>span{width:32px;height:32px;border-radius:11px;background:#EFF6FF;color:#2563EB;display:flex;align-items:center;justify-content:center}.pw-fs-title b{display:block;font-size:13px;font-weight:760;color:#0F172A;line-height:1.2}.pw-fs-title small{display:block;margin-top:2px;font-size:11px;font-weight:500;color:#64748B;max-width:320px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.pw-fs-tabs{height:36px;background:#F1F5F9;border:1px solid #E2E8F0;border-radius:11px;padding:3px;display:flex;gap:2px}.pw-fs-tabs button{height:28px;border:0;border-radius:8px;background:transparent;color:#64748B;font-size:12px;font-weight:650;display:flex;align-items:center;gap:6px;padding:0 12px;cursor:pointer}.pw-fs-tabs button.active{background:#fff;color:#0F172A;box-shadow:0 1px 3px rgba(15,23,42,.08)}.pw-fs-tabs button:disabled{opacity:.35;cursor:not-allowed}.pw-fs-actions{margin-left:auto;display:flex;align-items:center;gap:8px}.pw-fs-actions button{height:32px;border:1px solid #E2E8F0;border-radius:10px;background:#fff;color:#334155;font-size:12px;font-weight:650;display:flex;align-items:center;gap:6px;padding:0 11px;cursor:pointer}.pw-fs-actions button.icon{width:32px;padding:0;justify-content:center;color:#64748B}.pw-fs-main{flex:1;min-height:0;overflow:hidden;background:linear-gradient(180deg,#F8FAFC,#EEF2F7)}.pw-fs-diff{height:100%;position:relative;overflow:hidden;cursor:ew-resize;background:#E2E8F0;user-select:none}.pw-fs-layer{position:absolute;inset:0;overflow:auto;display:flex;align-items:flex-start;justify-content:center;padding:24px 26px 82px}.pw-fs-layer img{display:block;max-width:min(100%,1440px);height:auto;background:#fff;border-radius:14px;box-shadow:0 18px 55px rgba(15,23,42,.22);border:1px solid #CBD5E1}.pw-fs-label{position:absolute;top:18px;z-index:8;padding:5px 9px;border-radius:8px;background:rgba(15,23,42,.74);color:white;font-size:11px;font-weight:800;text-transform:uppercase;letter-spacing:.06em}.pw-fs-label.before{left:20px}.pw-fs-label.after{right:20px}.pw-fs-handle{position:absolute;top:0;bottom:0;width:2px;background:#fff;z-index:10;transform:translateX(-50%);box-shadow:0 0 0 1px rgba(15,23,42,.15),0 4px 26px rgba(15,23,42,.25)}.pw-fs-handle span{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:36px;height:36px;border-radius:50%;background:#fff;display:flex;align-items:center;justify-content:center;box-shadow:0 4px 20px rgba(15,23,42,.25);color:#334155}.pw-fs-diff footer,.pw-fs-current footer{position:absolute;left:18px;right:18px;bottom:18px;min-height:46px;border:1px solid rgba(226,232,240,.88);background:rgba(255,255,255,.9);backdrop-filter:blur(14px);border-radius:14px;box-shadow:0 14px 40px rgba(15,23,42,.13);display:flex;align-items:center;gap:10px;padding:10px 13px}.pw-fs-diff footer b,.pw-fs-current footer b{font-size:12px;font-weight:800;color:#0F172A}.pw-fs-diff footer span,.pw-fs-current footer span{font-size:12px;color:#475569;line-height:1.4}.pw-fs-diff footer em{margin-left:auto;font-size:11px;color:#94A3B8;font-style:normal;font-family:ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,monospace}.pw-fs-current{height:100%;position:relative;overflow:auto;padding:24px 26px 84px}.pw-fs-current>div{display:flex;justify-content:center;align-items:flex-start}.pw-fs-current img{display:block;max-width:min(100%,1440px);height:auto;background:#fff;border-radius:14px;box-shadow:0 18px 55px rgba(15,23,42,.2);border:1px solid #CBD5E1}.pw-fs-zones{height:100%;display:grid;grid-template-columns:minmax(0,1fr) 300px;gap:0;overflow:hidden}.pw-fs-zone-canvas{overflow:auto;padding:24px;background:#EEF2F7}.pw-fs-zone-canvas>div{max-width:1440px;margin:0 auto;background:#fff;border-radius:14px;box-shadow:0 18px 55px rgba(15,23,42,.2);border:1px solid #CBD5E1;overflow:hidden}.pw-fs-zones aside{border-left:1px solid #E2E8F0;background:rgba(255,255,255,.92);padding:18px;overflow:auto}.pw-fs-zones aside b{display:block;font-size:13px;font-weight:800;color:#0F172A}.pw-fs-zones aside p{margin:8px 0 16px;color:#64748B;font-size:12px;line-height:1.5}.pw-fs-zone-list{display:flex;flex-direction:column;gap:7px}.pw-fs-zone-list span{border:1px solid #E2E8F0;background:#F8FAFC;border-radius:10px;padding:8px 10px;font-size:12px;font-weight:650;color:#334155}.pw-fs-zone-list em{font-size:12px;color:#94A3B8;font-style:normal;line-height:1.5}
`
