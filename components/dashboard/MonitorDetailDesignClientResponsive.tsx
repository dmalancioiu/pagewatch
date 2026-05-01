'use client'

import Link from 'next/link'
import { useMemo, useState, useTransition } from 'react'
import { FullscreenMonitorViewer } from '@/components/dashboard/FullscreenMonitorViewer'
import {
  Activity,
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  Calendar,
  Camera,
  CheckCircle2,
  ChevronRight,
  Columns2,
  Download,
  ExternalLink,
  Filter,
  HeartPulse,
  History,
  Image,
  Info,
  Maximize2,
  MoreHorizontal,
  MoveHorizontal,
  MousePointerClick,
  Pause,
  Play,
  Plus,
  Save,
  Target,
} from 'lucide-react'
import { ZoneSelector } from '@/components/dashboard/ZoneSelector'
import { updateMonitoredUrl } from '@/lib/actions/websites'

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

type Zone = {
  id?: string
  x: number
  y: number
  width: number
  height: number
  label?: string
  instruction?: string
  sensitivity?: 'low' | 'normal' | 'high'
}

type Props = {
  monitor: any
  openAlert: AlertItem | null
  snapshots: SnapshotItem[]
  alerts: AlertItem[]
  alertBySnapshotId: Record<string, AlertItem>
  zones: Zone[]
  lastChecked: string
  nextRun: string
}

function host(url: string | null | undefined) {
  try { return new URL(url ?? '').hostname.replace(/^www\./, '') } catch { return url || 'unknown' }
}

function fmtDate(iso?: string | null) {
  if (!iso) return 'Never'
  return new Date(iso).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
}

function fmtTime(iso?: string | null) {
  if (!iso) return 'Never'
  return new Date(iso).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
}

function bytes(n: number | null) {
  if (!n) return '—'
  const kb = n / 1024
  return kb < 1024 ? `${kb.toFixed(0)} KB` : `${(kb / 1024).toFixed(1)} MB`
}

function pct(v?: number | null) {
  return Number(v ?? 0).toFixed(1)
}

function normalizeZones(zones: Zone[]) {
  return zones.map((z, i) => ({
    id: z.id ?? `zone-${i + 1}`,
    x: z.x,
    y: z.y,
    width: z.width,
    height: z.height,
    label: z.label ?? `Zone ${i + 1}`,
    instruction: z.instruction ?? '',
    sensitivity: z.sensitivity ?? 'normal',
  }))
}

function scoreFor(openAlert: AlertItem | null, zones: Zone[], snapshots: SnapshotItem[]) {
  if (openAlert?.diff_pct != null) return Math.max(52, Math.min(84, Math.round(88 - Number(openAlert.diff_pct) * 1.3)))
  if (!snapshots.length) return 80
  return Math.min(99, 92 + Math.min(7, zones.length))
}

function severityLabel(alert: AlertItem | null) {
  if (!alert?.severity) return 'Low severity'
  return `${alert.severity.charAt(0).toUpperCase()}${alert.severity.slice(1)} severity`
}

function PlaceholderSite({ after = false }: { after?: boolean }) {
  return (
    <div className="md-placeholder-site">
      <div className="ph-hero"><span /><i /><b /></div>
      <div className="ph-nav"><span /><span /><span /><span /><span /></div>
      <div className="ph-cards">
        {[0, 1, 2].map((i) => <div key={i} className={i === 1 ? 'active' : ''}><b /><p /><p />{after && i === 1 ? <em /> : null}</div>)}
      </div>
    </div>
  )
}

function ViewportShot({ url, after = false }: { url?: string | null; after?: boolean }) {
  return (
    <div className="md-shot-stage">
      <div className="md-browser-frame">
        <div className="md-browser-chrome"><i /><i /><i /><span /></div>
        <div className="md-browser-viewport">
          {url ? <img src={url} alt="Monitor capture" /> : <PlaceholderSite after={after} />}
        </div>
      </div>
    </div>
  )
}

function TimelineThumb({ snap, changed, selected, onClick }: { snap: SnapshotItem; changed?: boolean; selected?: boolean; onClick: () => void }) {
  return (
    <button className={`md-tl-cap ${changed ? 'changed' : ''} ${selected ? 'selected' : ''}`} onClick={onClick}>
      <div className="md-tl-thumb">{snap.signedUrl ? <img src={snap.signedUrl} alt="" /> : <PlaceholderSite after={changed} />}</div>
      <div className="md-tl-time">{fmtTime(snap.taken_at)}</div>
    </button>
  )
}

export function MonitorDetailDesignClientResponsive({ monitor, openAlert, snapshots, alerts, alertBySnapshotId, zones, lastChecked, nextRun }: Props) {
  const [tab, setTab] = useState<'diff' | 'current' | 'zones'>('diff')
  const [handle, setHandle] = useState(50)
  const [selectedId, setSelectedId] = useState(snapshots[0]?.id ?? '')
  const [localZones, setLocalZones] = useState<any[]>(normalizeZones(zones))
  const [isSavingZones, startSavingZones] = useTransition()
  const [fsOpen, setFsOpen] = useState(false)

  const latest = snapshots[0] ?? null
  const previous = snapshots[1] ?? null
  const selected = snapshots.find((s) => s.id === selectedId) ?? latest
  const activeAlert = openAlert ?? alerts[0] ?? null
  const currentAfter = activeAlert?.afterUrl ?? latest?.signedUrl ?? null
  const beforeUrl = activeAlert?.beforeUrl ?? previous?.signedUrl ?? null
  const zoneImageUrl = latest?.signedUrl ?? currentAfter ?? ''
  const status = !monitor.is_active ? 'Paused' : openAlert ? 'Alert' : 'Healthy'
  const score = scoreFor(openAlert, localZones, snapshots)
  const healthTone = score >= 90 ? 'Good' : score >= 75 ? 'Fair' : 'Needs review'
  const changedZone = activeAlert?.metadata?.zone_scores?.[0]?.label || localZones[0]?.label || 'Full page'

  const timeline = useMemo(() => snapshots.slice(0, 14), [snapshots])

  function drag(e: React.PointerEvent<HTMLDivElement>) {
    const rect = e.currentTarget.getBoundingClientRect()
    setHandle(Math.max(8, Math.min(92, ((e.clientX - rect.left) / rect.width) * 100)))
  }

  function saveZones() {
    startSavingZones(async () => {
      await updateMonitoredUrl(monitor.id, { zones: localZones })
    })
  }

  function addQuickZone() {
    setLocalZones(prev => [...prev, {
      id: `zone-${Date.now()}`,
      x: 0.12,
      y: 0.16,
      width: 0.72,
      height: 0.28,
      label: `Zone ${prev.length + 1}`,
      instruction: '',
      sensitivity: 'normal',
    }])
  }

  return (
    <div className="md-page">
      <header className="md-topbar">
        <Link href="/dashboard/urls" className="md-back"><ArrowLeft size={12} /></Link>
        <div className="md-vline" />
        <div className="md-crumbs"><Link href="/dashboard/urls">Monitors</Link><ChevronRight size={11} /><span>{monitor.name}</span><em className={status.toLowerCase()}><i />{status}</em></div>
        <a className="md-url" href={monitor.url} target="_blank" rel="noreferrer">{host(monitor.url)}<ExternalLink size={9} /></a>
        <div className="md-grow" />
        <div className="md-checks"><div><Calendar size={11} /><span><small>Last check</small><b>{lastChecked}</b></span></div><i /><div><Calendar size={11} /><span><small>Next run</small><b>{nextRun}</b></span></div></div>
        <button className="md-btn-g sm"><Activity size={11} />Run Now</button>
        <button className="md-btn-g sm"><Pause size={11} />Pause</button>
        <button className="md-btn-g sm icon"><MoreHorizontal size={13} /></button>
      </header>

      <div className="md-body">
        <main className="md-main">
          {activeAlert && <section className="md-alert"><div className="md-alert-icon"><AlertTriangle size={13} /></div><div><div className="md-alert-head"><b>Change detected</b><span>+{pct(activeAlert.diff_pct)}% diff</span><em>{severityLabel(activeAlert)}</em><small>{fmtDate(activeAlert.created_at)}</small></div><p>{activeAlert.ai_summary || 'A meaningful visual change was detected on this monitored page.'}</p></div><div className="md-alert-actions"><button className="md-btn-g sm"><CheckCircle2 size={10} />Resolve</button><button className="md-btn-p sm" onClick={() => setFsOpen(true)}>View in full<ArrowRight size={10} /></button></div></section>}

          <section className="md-viewer">
            <div className="md-viewer-header"><button className={tab === 'diff' ? 'active' : ''} onClick={() => setTab('diff')}><Columns2 size={12} />Diff comparison</button><button className={tab === 'current' ? 'active' : ''} onClick={() => setTab('current')}><Image size={12} />Current capture</button><button className={tab === 'zones' ? 'active' : ''} onClick={() => setTab('zones')}><Target size={12} />Zone editor</button><div className="md-grow" /><span>{tab === 'zones' ? 'Drag to draw zones' : 'Drag to compare'}</span><button className="md-btn-g sm" onClick={() => setFsOpen(true)}><Maximize2 size={10} />Fullscreen</button></div>

            {tab === 'diff' && <><div className="md-diff" onPointerDown={drag} onPointerMove={(e) => e.buttons === 1 && drag(e)}><div className="md-after"><ViewportShot url={currentAfter} after /></div><div className="md-before" style={{ clipPath: `inset(0 ${100 - handle}% 0 0)` }}><ViewportShot url={beforeUrl} /></div><div className="md-label before">BEFORE</div><div className="md-label after">AFTER</div><div className="md-handle" style={{ left: `${handle}%` }}><div><MoveHorizontal size={14} /></div></div></div><div className="md-viewer-foot"><span>Changed region <b>{changedZone}</b></span><i /><span>Pixel diff <b className="red">+{pct(activeAlert?.diff_pct)}%</b></span><i /><span>Preview <b>Normalized viewport</b></span><div className="md-grow" /><em>{fmtDate(activeAlert?.created_at ?? latest?.taken_at)}</em></div></>}

            {tab === 'current' && <><div className="md-current"><ViewportShot url={latest?.signedUrl ?? currentAfter} after /></div><div className="md-viewer-foot"><span>Latest capture <b>{fmtDate(latest?.taken_at)}</b></span><em>{bytes(latest?.file_size_bytes ?? null)} · normalized viewport</em><div className="md-grow" /><button className="md-btn-g sm"><Download size={10} />Download</button></div></>}

            {tab === 'zones' && <><div className="md-zones">{zoneImageUrl ? <div className="md-zone-selector-shell"><ZoneSelector imageUrl={zoneImageUrl} zones={localZones} onChange={setLocalZones} /></div> : <ViewportShot after />}</div><div className="md-viewer-foot"><Info size={12} /><em>Draw zones on the real screenshot canvas. The preview tab always uses a normalized browser viewport.</em><div className="md-grow" /><button className="md-btn-g sm" onClick={addQuickZone}><Plus size={10} />Add zone</button><button className="md-btn-p sm" onClick={saveZones} disabled={isSavingZones}>{isSavingZones ? 'Saving...' : 'Save zones'}</button></div></>}
          </section>

          <section className="md-timeline"><div className="md-timeline-head"><History size={13} /><b>Capture timeline</b><span>{snapshots.length} total</span><div className="md-grow" /><button className="md-btn-g sm"><Play size={10} className="green" />Play</button><button className="md-btn-g sm"><Filter size={10} />Changes only</button></div><div className="md-timeline-scroll"><div className="md-tl-group"><p>Recent</p><div>{timeline.map((snap, index) => <TimelineThumb key={snap.id} snap={snap} changed={Boolean(alertBySnapshotId[snap.id])} selected={(selected?.id ?? '') === snap.id || index === 0 && !selectedId} onClick={() => setSelectedId(snap.id)} />)}</div></div></div><div className="md-tl-info"><MousePointerClick size={11} /><span>Viewing <b>{fmtDate(selected?.taken_at)}</b>{alertBySnapshotId[selected?.id ?? ''] ? `, change detected (+${pct(alertBySnapshotId[selected?.id ?? '']?.diff_pct)}%)` : ', clean capture'}</span><div className="md-grow" /><button className="md-btn-g sm"><Download size={10} />Export</button></div></section>
        </main>

        <aside className="md-inspector"><div className="md-inspector-save"><div><b>Monitor settings</b><span>{monitor.name}</span></div><button className="md-btn-p sm"><Save size={10} />Save</button></div><section><label><HeartPulse size={10} />Health score</label><div className="md-score"><svg width="72" height="72" viewBox="0 0 72 72"><circle cx="36" cy="36" r="28" fill="none" stroke="#F3F4F6" strokeWidth="7"/><circle cx="36" cy="36" r="28" fill="none" stroke={score >= 90 ? '#16A34A' : score >= 75 ? '#F59E0B' : '#EF4444'} strokeWidth="7" strokeDasharray={`${(score / 100) * 175.9} 175.9`} strokeLinecap="round" transform="rotate(-90 36 36)"/><text x="36" y="40" textAnchor="middle" fontSize="16" fontWeight="800" fill="#111827">{score}</text></svg><div><b>{healthTone}</b><p><i className="red" />{alerts.length} changes detected</p><p><i className="green" />{snapshots.length ? '94%' : '—'} uptime</p><p><i className="green" />{localZones.length} zones configured</p></div></div></section><section><label><Activity size={10} />Latest snapshot</label><Row k="Captured" v={fmtDate(latest?.taken_at)} /><Row k="Alert status" v={openAlert ? '1 open' : 'Clean'} pill={openAlert ? 'red' : 'green'} /><Row k="Pixel diff" v={`+${pct(activeAlert?.diff_pct)}%`} red /><Row k="File size" v={bytes(latest?.file_size_bytes ?? null)} mono /><Row k="Total checks" v={String(snapshots.length)} /><Row k="Changes found" v={String(alerts.length)} red /></section><section><label><Calendar size={10} />Schedule</label><div className="md-freq"><button className={monitor.check_frequency === 'hourly' ? 'active' : ''}>Hourly</button><button className={!monitor.check_frequency || monitor.check_frequency === 'daily' ? 'active' : ''}>Daily</button><button className={monitor.check_frequency === 'weekly' ? 'active' : ''}>Weekly</button></div><Row k="Run at (UTC)" v={monitor.check_hour != null ? `${monitor.check_hour}:00` : '9:00 AM'} /></section><section><label><Camera size={10} />Capture</label><Toggle title="Full page scroll" subtitle="Capture entire page height" on={monitor.full_page !== false} /><Toggle title="Hide cookie banners" subtitle="Dismiss overlays before capture" on /></section><section><label><Target size={10} />Zones</label>{localZones.length ? localZones.map((z, i) => <div key={z.id ?? i} className="md-zone-chip"><i style={{ background: i === 0 ? '#2563EB' : '#16A34A' }} /><div><b>{z.label || `Zone ${i + 1}`}</b><span>{z.instruction || z.sensitivity || 'Visual changes'}</span></div></div>) : <p className="md-muted">No custom zones yet.</p>}<button className="md-btn-g sm full" onClick={() => setTab('zones')}><Plus size={10} />Add zone</button></section><section><label><Info size={10} />AI instruction</label><textarea defaultValue={monitor.watch_description || 'Only alert me when pricing, CTA, or layout changes could affect conversion.'} /><button className="md-btn-g sm full">Update instruction</button></section></aside>
      </div>
      <FullscreenMonitorViewer
        open={fsOpen}
        onOpenChange={setFsOpen}
        initialTab={tab}
        monitorName={monitor.name ?? monitor.url}
        snapshots={snapshots}
        alerts={alerts}
        openAlert={openAlert}
        zones={localZones}
        onZonesChange={setLocalZones}
      />
    </div>
  )
}

function Row({ k, v, pill, red, mono }: { k: string; v: string; pill?: 'red' | 'green'; red?: boolean; mono?: boolean }) {
  return <div className="md-row"><span>{k}</span>{pill ? <b className={`pill ${pill}`}>{v}</b> : <b className={`${red ? 'red' : ''} ${mono ? 'mono' : ''}`}>{v}</b>}</div>
}

function Toggle({ title, subtitle, on }: { title: string; subtitle: string; on: boolean }) {
  return <div className="md-toggle"><div><b>{title}</b><span>{subtitle}</span></div><button className={on ? 'on' : ''}><i /></button></div>
}

