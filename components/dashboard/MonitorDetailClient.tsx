'use client'

import Link from 'next/link'
import { useMemo, useState, useTransition } from 'react'
import {
  Activity, AlertTriangle, ArrowLeft, Calendar, CheckCircle2, ChevronRight,
  Columns2, Download, ExternalLink, Filter, HeartPulse, History, Image,
  Info, Maximize2, MoreHorizontal, MoveHorizontal, MousePointerClick,
  Pause, Play, Plus, Save, Target,
} from 'lucide-react'
import { ZoneSelector, type Zone } from '@/components/dashboard/ZoneSelector'
import { FullscreenMonitorViewer } from '@/components/dashboard/FullscreenMonitorViewer'
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

type ViewerTab = 'diff' | 'current' | 'zones'

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

const tabLabels: Record<ViewerTab, string> = {
  diff: 'Diff comparison',
  current: 'Current capture',
  zones: 'Zone editor',
}

function host(url?: string | null) {
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

function bytes(n?: number | null) {
  if (!n) return '—'
  const kb = n / 1024
  return kb < 1024 ? `${kb.toFixed(0)} KB` : `${(kb / 1024).toFixed(1)} MB`
}

function normalizeZones(zones: Zone[]) {
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

function scoreFor(openAlert: AlertItem | null, zones: Zone[], snapshots: SnapshotItem[]) {
  if (openAlert?.diff_pct != null) return Math.max(52, Math.min(84, Math.round(88 - Number(openAlert.diff_pct) * 1.3)))
  if (!snapshots.length) return 80
  return Math.min(99, 92 + Math.min(7, zones.length))
}

function Severity({ alert }: { alert: AlertItem | null }) {
  if (!alert?.severity) return <span className="rounded-full border border-slate-200 px-2 py-0.5 text-[10px] font-semibold text-slate-500">Low severity</span>
  return <span className="rounded-full border border-orange-200 bg-orange-50 px-2 py-0.5 text-[10px] font-semibold text-orange-700">{alert.severity[0].toUpperCase()}{alert.severity.slice(1)} severity</span>
}

function BrowserFrame({ url, after = false }: { url?: string | null; after?: boolean }) {
  return (
    <div className="absolute inset-0 flex items-start justify-center overflow-hidden bg-gradient-to-b from-slate-50 to-slate-100 p-4">
      <div className="h-full w-full max-w-[660px] overflow-hidden rounded-xl border border-slate-300 bg-white shadow-xl">
        <div className="flex h-6 items-center gap-1.5 border-b border-slate-200 bg-slate-50 px-2">
          <i className="h-1.5 w-1.5 rounded-full bg-slate-300" /><i className="h-1.5 w-1.5 rounded-full bg-slate-300" /><i className="h-1.5 w-1.5 rounded-full bg-slate-300" />
          <span className="ml-2 h-2 flex-1 rounded-full bg-slate-100" />
        </div>
        <div className="h-[calc(100%-24px)] overflow-hidden">
          {url ? <img src={url} alt="Monitor capture" className="block h-auto w-full" /> : <Placeholder after={after} />}
        </div>
      </div>
    </div>
  )
}

function Placeholder({ after = false }: { after?: boolean }) {
  return (
    <div className="h-full bg-white">
      <div className="h-24 bg-emerald-50 px-10 py-8"><div className="h-8 w-40 rounded bg-slate-900" /></div>
      <div className="flex h-11 gap-8 bg-neutral-800 px-10 py-4">{[1,2,3,4].map(i => <span key={i} className="h-2 w-20 rounded bg-white/60" />)}</div>
      <div className="grid grid-cols-3 gap-4 p-8">{[1,2,3].map(i => <div key={i} className={`rounded-xl border p-5 ${after && i === 2 ? 'border-blue-400 bg-blue-50' : 'border-slate-200'}`}><b className="mb-4 block h-5 w-24 rounded bg-slate-900" /><p className="mb-2 h-2 rounded bg-slate-200" /><p className="h-2 w-4/5 rounded bg-slate-200" /></div>)}</div>
    </div>
  )
}

function ScoreRing({ score }: { score: number }) {
  return (
    <svg width="72" height="72" viewBox="0 0 72 72">
      <circle cx="36" cy="36" r="28" fill="none" stroke="#F3F4F6" strokeWidth="7" />
      <circle cx="36" cy="36" r="28" fill="none" stroke={score >= 90 ? '#16A34A' : score >= 75 ? '#F59E0B' : '#EF4444'} strokeWidth="7" strokeDasharray={`${(score / 100) * 175.9} 175.9`} strokeLinecap="round" transform="rotate(-90 36 36)" />
      <text x="36" y="40" textAnchor="middle" fontSize="16" fontWeight="800" fill="#111827">{score}</text>
    </svg>
  )
}

function Row({ k, v, pill, red, mono }: { k: string; v: string; pill?: 'red' | 'green'; red?: boolean; mono?: boolean }) {
  return <div className="md-row mb-2 flex items-center justify-between gap-3 text-xs"><span className="text-slate-500">{k}</span><b className={`${red ? 'text-red-500' : 'text-slate-900'} ${mono ? 'font-mono' : ''} ${pill ? `rounded-full px-2 py-0.5 text-[10px] ${pill === 'red' ? 'bg-red-50 text-red-600' : 'bg-emerald-50 text-emerald-600'}` : ''}`}>{v}</b></div>
}

function TimelineThumb({ snap, changed, selected, onClick }: { snap: SnapshotItem; changed: boolean; selected: boolean; onClick: () => void }) {
  return (
    <button type="button" className={`md-tl-cap relative w-[68px] shrink-0 overflow-hidden rounded-lg border bg-white text-left ${selected ? 'border-blue-500 ring-2 ring-blue-100' : changed ? 'border-red-200' : 'border-slate-200'}`} onClick={onClick}>
      {changed ? <span className="absolute left-1 top-1 z-10 h-1.5 w-1.5 rounded-full bg-red-500 ring-2 ring-red-100" /> : null}
      <div className="md-tl-thumb h-11 overflow-hidden bg-slate-50">{snap.signedUrl ? <img src={snap.signedUrl} alt="" className="block w-full" /> : <Placeholder after={changed} />}</div>
      <div className="md-tl-time px-1 py-1 font-mono text-[9px] text-slate-400">{fmtTime(snap.taken_at)}</div>
    </button>
  )
}

export function MonitorDetailClient({ monitor, openAlert, snapshots, alerts, alertBySnapshotId, zones, lastChecked, nextRun }: Props) {
  const [tab, setTab] = useState<ViewerTab>('diff')
  const [fullscreenOpen, setFullscreenOpen] = useState(false)
  const [handle, setHandle] = useState(50)
  const [selectedId, setSelectedId] = useState(snapshots[0]?.id ?? '')
  const [localZones, setLocalZones] = useState<Zone[]>(() => normalizeZones(zones))
  const [isSavingZones, startSavingZones] = useTransition()

  const timeline = useMemo(() => snapshots.slice(0, 14), [snapshots])
  const latest = snapshots[0] ?? null
  const previous = snapshots[1] ?? null
  const selected = snapshots.find(s => s.id === selectedId) ?? latest
  const activeAlert = openAlert ?? alerts[0] ?? null
  const currentAfter = activeAlert?.afterUrl ?? latest?.signedUrl ?? null
  const beforeUrl = activeAlert?.beforeUrl ?? previous?.signedUrl ?? null
  const currentUrl = latest?.signedUrl ?? currentAfter
  const zoneImageUrl = latest?.signedUrl ?? currentAfter ?? ''
  const changedZone = activeAlert?.metadata?.zone_scores?.[0]?.label || localZones[0]?.label || 'Full page'
  const status = !monitor.is_active ? 'Paused' : openAlert ? 'Alert' : 'Healthy'
  const score = scoreFor(openAlert, localZones, snapshots)

  function drag(event: React.PointerEvent<HTMLDivElement>) {
    const rect = event.currentTarget.getBoundingClientRect()
    setHandle(Math.max(8, Math.min(92, ((event.clientX - rect.left) / rect.width) * 100)))
  }

  function updateZones(nextZones: Zone[]) {
    setLocalZones(nextZones)
    window.dispatchEvent(new CustomEvent('pagewatch:zones-updated', { detail: { zones: nextZones, source: 'main-zone-editor' } }))
  }

  function saveZones() {
    startSavingZones(async () => {
      await updateMonitoredUrl(monitor.id, { zones: localZones })
    })
  }

  function addQuickZone() {
    updateZones([...localZones, { id: `zone-${Date.now()}`, x: 0.12, y: 0.16, width: 0.72, height: 0.28, label: `Zone ${localZones.length + 1}`, instruction: '', sensitivity: 'normal' }])
  }

  return (
    <div className="md-page h-screen overflow-hidden bg-slate-50 text-slate-900">
      <header className="md-topbar flex h-[52px] items-center gap-2 border-b border-slate-200 bg-white/95 px-4">
        <Link href="/dashboard/urls" className="md-back flex h-7 w-7 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500"><ArrowLeft size={12} /></Link>
        <div className="md-vline h-5 w-px bg-slate-200" />
        <div className="md-crumbs flex min-w-0 items-center gap-1.5 text-xs"><Link href="/dashboard/urls" className="text-slate-400">Monitors</Link><ChevronRight size={11} /><span className="max-w-[180px] truncate font-bold">{monitor.name}</span><em className={`rounded-full px-2 py-0.5 not-italic ${status === 'Alert' ? 'bg-red-50 text-red-600' : status === 'Healthy' ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>{status}</em></div>
        <a className="md-url flex items-center gap-1 font-mono text-[10px] text-slate-400" href={monitor.url} target="_blank" rel="noreferrer">{host(monitor.url)}<ExternalLink size={9} /></a>
        <div className="md-grow flex-1" />
        <div className="md-checks hidden items-center gap-3 border-x border-slate-200 px-3 lg:flex"><Calendar size={11} /><span className="text-[10px] text-slate-400">Last check <b className="text-slate-700">{lastChecked}</b></span><Calendar size={11} /><span className="text-[10px] text-slate-400">Next run <b className="text-slate-700">{nextRun}</b></span></div>
        <button type="button" className="md-btn-g sm"><Activity size={11} />Run Now</button><button type="button" className="md-btn-g sm"><Pause size={11} />Pause</button><button type="button" className="md-btn-g sm icon"><MoreHorizontal size={13} /></button>
      </header>

      <div className="md-body flex h-[calc(100vh-52px)] overflow-hidden">
        <main className="md-main flex min-w-0 flex-1 flex-col gap-3 overflow-y-auto p-4">
          {activeAlert ? <section className="md-alert flex items-start gap-3 rounded-xl border border-red-100 border-l-4 border-l-red-500 bg-white p-3 shadow-sm"><div className="rounded-lg bg-red-50 p-2 text-red-500"><AlertTriangle size={13} /></div><div className="flex-1"><div className="md-alert-head mb-1 flex items-center gap-2"><b className="text-sm text-red-700">Change detected</b><Severity alert={activeAlert} /><small className="text-xs text-slate-400">{fmtDate(activeAlert.created_at)}</small></div><p className="text-sm text-slate-600">{activeAlert.ai_summary || 'A meaningful visual change was detected on this monitored page.'}</p></div><button type="button" className="md-btn-g sm"><CheckCircle2 size={10} />Resolve</button><button type="button" className="md-btn-p sm" onClick={() => setFullscreenOpen(true)}>View in full</button></section> : null}

          <section className="md-viewer overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
            <div className="md-viewer-header flex h-11 items-center border-b border-slate-100 px-3">
              {(Object.keys(tabLabels) as ViewerTab[]).map(key => <button key={key} type="button" className={`flex h-11 items-center gap-1.5 border-b-2 px-3 text-xs font-semibold ${tab === key ? 'border-blue-600 text-slate-900' : 'border-transparent text-slate-500'}`} onClick={() => setTab(key)}>{key === 'diff' ? <Columns2 size={12} /> : key === 'current' ? <Image size={12} /> : <Target size={12} />}{tabLabels[key]}</button>)}
              <div className="md-grow flex-1" /><span className="mr-2 text-xs text-slate-400">{tab === 'zones' ? 'Drag to draw zones' : 'Drag to compare'}</span><button type="button" className="md-btn-g sm" onClick={() => setFullscreenOpen(true)}><Maximize2 size={10} />Fullscreen</button>
            </div>

            {tab === 'diff' ? <><div className="md-diff relative h-[380px] cursor-ew-resize overflow-hidden bg-slate-100" onPointerDown={drag} onPointerMove={e => e.buttons === 1 && drag(e)}><div className="md-after absolute inset-0"><BrowserFrame url={currentAfter} after /></div><div className="md-before absolute inset-0 overflow-hidden" style={{ clipPath: `inset(0 ${100 - handle}% 0 0)` }}><BrowserFrame url={beforeUrl} /></div><span className="absolute left-3 top-3 rounded bg-black/60 px-2 py-1 text-[10px] font-bold uppercase text-white">Before</span><span className="absolute right-3 top-3 rounded bg-black/60 px-2 py-1 text-[10px] font-bold uppercase text-white">After</span><div className="absolute bottom-0 top-0 z-10 w-0.5 bg-white shadow" style={{ left: `${handle}%` }}><div className="absolute left-1/2 top-1/2 flex h-8 w-8 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white shadow"><MoveHorizontal size={14} /></div></div></div><ViewerFoot left={<>Changed region <b>{changedZone}</b></>} middle={<>Preview <b>Normalized viewport</b></>} right={fmtDate(activeAlert?.created_at ?? latest?.taken_at)} /></> : null}
            {tab === 'current' ? <><div className="md-current relative h-[380px] overflow-hidden bg-slate-100"><BrowserFrame url={currentUrl} after /></div><ViewerFoot left={<>Latest capture <b>{fmtDate(latest?.taken_at)}</b></>} middle={<>{bytes(latest?.file_size_bytes)} · normalized viewport</>} right={<button type="button" className="md-btn-g sm"><Download size={10} />Download</button>} /></> : null}
            {tab === 'zones' ? <><div className="md-zones h-[380px] overflow-auto bg-slate-100 p-3">{zoneImageUrl ? <div className="md-zone-selector-shell mx-auto max-w-5xl bg-white shadow"><ZoneSelector imageUrl={zoneImageUrl} zones={localZones} onChange={updateZones} /></div> : <BrowserFrame after />}</div><ViewerFoot left={<><Info size={12} />Draw zones on the real screenshot canvas.</>} middle="" right={<><button type="button" className="md-btn-g sm" onClick={addQuickZone}><Plus size={10} />Add zone</button><button type="button" className="md-btn-p sm" onClick={saveZones} disabled={isSavingZones}>{isSavingZones ? 'Saving...' : 'Save zones'}</button></>} /></> : null}
          </section>

          <section className="md-timeline overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm"><div className="md-timeline-head flex items-center gap-2 border-b border-slate-100 p-3"><History size={13} /><b className="text-sm">Capture timeline</b><span className="text-xs text-slate-400">{snapshots.length} total</span><div className="md-grow flex-1" /><button type="button" className="md-btn-g sm"><Play size={10} className="text-emerald-600" />Play</button><button type="button" className="md-btn-g sm"><Filter size={10} />Changes only</button></div><div className="md-timeline-scroll overflow-x-auto p-3"><p className="mb-2 text-[10px] font-bold uppercase tracking-wide text-slate-400">Recent</p><div className="flex gap-1.5">{timeline.map(snap => <TimelineThumb key={snap.id} snap={snap} changed={Boolean(alertBySnapshotId[snap.id])} selected={(selected?.id ?? '') === snap.id} onClick={() => setSelectedId(snap.id)} />)}</div></div><div className="md-tl-info flex items-center gap-2 border-t border-slate-100 bg-slate-50 p-3"><MousePointerClick size={11} /><span className="text-xs text-slate-500">Viewing <b className="text-slate-900">{fmtDate(selected?.taken_at)}</b>{alertBySnapshotId[selected?.id ?? ''] ? ', change detected' : ', clean capture'}</span><div className="md-grow flex-1" /><button type="button" className="md-btn-g sm"><Download size={10} />Export</button></div></section>
        </main>

        <aside className="md-inspector w-72 shrink-0 overflow-y-auto border-l border-slate-200 bg-white"><div className="md-inspector-save sticky top-0 z-10 flex items-center justify-between border-b border-slate-100 bg-white p-3"><div><b className="block text-sm">Monitor settings</b><span className="text-[10px] text-slate-400">{monitor.name}</span></div><button type="button" className="md-btn-p sm"><Save size={10} />Save</button></div><section className="border-b border-slate-100 p-4"><label className="mb-2 flex items-center gap-1 text-[10px] font-bold uppercase tracking-wide text-slate-400"><HeartPulse size={10} />Health score</label><div className="flex items-center gap-3"><ScoreRing score={score} /><div><b className="text-orange-700">{score >= 90 ? 'Good' : score >= 75 ? 'Fair' : 'Needs review'}</b><p className="text-xs text-slate-500">{alerts.length} changes detected</p><p className="text-xs text-slate-500">{localZones.length} zones configured</p></div></div></section><section className="border-b border-slate-100 p-4"><label className="mb-2 flex items-center gap-1 text-[10px] font-bold uppercase tracking-wide text-slate-400"><Activity size={10} />Latest snapshot</label><Row k="Captured" v={fmtDate(latest?.taken_at)} /><Row k="Alert status" v={openAlert ? '1 open' : 'Clean'} pill={openAlert ? 'red' : 'green'} /><Row k="File size" v={bytes(latest?.file_size_bytes)} mono /><Row k="Total checks" v={String(snapshots.length)} /><Row k="Changes found" v={String(alerts.length)} red /></section><section className="border-b border-slate-100 p-4"><label className="mb-2 flex items-center gap-1 text-[10px] font-bold uppercase tracking-wide text-slate-400"><Target size={10} />Zones</label>{localZones.length ? localZones.map((zone, index) => <div key={zone.id ?? index} className="mb-2 flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 p-2"><i className="h-2 w-2 rounded-full bg-blue-600" /><div><b className="block text-xs">{zone.label || `Zone ${index + 1}`}</b><span className="block text-[10px] text-slate-400">{zone.instruction || zone.sensitivity || 'Visual changes'}</span></div></div>) : <p className="text-xs text-slate-400">No custom zones yet.</p>}<button type="button" className="md-btn-g sm full mt-2" onClick={() => setTab('zones')}><Plus size={10} />Add zone</button></section><section className="p-4"><label className="mb-2 flex items-center gap-1 text-[10px] font-bold uppercase tracking-wide text-slate-400"><Info size={10} />Main AI instruction</label><textarea className="mb-2 min-h-20 w-full rounded-lg border border-slate-200 p-2 text-xs" defaultValue={monitor.watch_description || ''} placeholder="General page-level prompt..." /><button type="button" className="md-btn-g sm full">Update instruction</button></section></aside>
      </div>

      <FullscreenMonitorViewer open={fullscreenOpen} onOpenChange={setFullscreenOpen} initialTab={tab} monitorName={monitor.name ?? monitor.url} snapshots={snapshots} alerts={alerts} openAlert={openAlert} zones={localZones} onZonesChange={updateZones} />
    </div>
  )
}

function ViewerFoot({ left, middle, right }: { left: React.ReactNode; middle: React.ReactNode; right: React.ReactNode }) {
  return <div className="md-viewer-foot flex items-center gap-4 border-t border-slate-100 bg-slate-50 p-3"><span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wide text-slate-400">{left}</span>{middle ? <><i className="h-3 w-px bg-slate-200" /><span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wide text-slate-400">{middle}</span></> : null}<div className="md-grow flex-1" /><em className="flex items-center gap-2 text-xs not-italic text-slate-400">{right}</em></div>
}
