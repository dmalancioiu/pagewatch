'use client'

import Link from 'next/link'
import { useState } from 'react'
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
  Trash2,
} from 'lucide-react'

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
  if (kb < 1024) return `${kb.toFixed(0)} KB`
  return `${(kb / 1024).toFixed(1)} MB`
}

function scoreFor(openAlert: AlertItem | null, zones: Zone[], snapshots: SnapshotItem[]) {
  if (openAlert?.diff_pct != null) return Math.max(52, Math.min(84, Math.round(88 - Number(openAlert.diff_pct) * 1.3)))
  if (!snapshots.length) return 80
  return Math.min(99, 92 + Math.min(7, zones.length))
}

function severityLabel(alert: AlertItem | null) {
  if (!alert?.severity) return 'High severity'
  return `${alert.severity.charAt(0).toUpperCase()}${alert.severity.slice(1)} severity`
}

function pct(v?: number | null) {
  return Number(v ?? 0).toFixed(1)
}

function zonePct(v: number | undefined) {
  const n = Number(v ?? 0)
  return n <= 1 ? n * 100 : n
}

function PricingMock({ after = false, zones = false }: { after?: boolean; zones?: boolean }) {
  return <div className="md-shot">
    <div className="md-shot-nav"><span /><div><i /><i /><i /></div><b /></div>
    <div className="md-shot-hero"><h1 /><p /><p className="short" /></div>
    {after && <div className="md-enterprise"><div><b /><span /></div><button /></div>}
    <div className={`md-pricing ${after ? 'after' : ''}`}>
      {[0, 1, 2].map((item) => <div key={item} className={`md-plan ${item === 1 ? 'pro' : ''} ${after && item === 2 ? 'dim' : ''}`}><i /><b /><p /><p className="w90" /><p className="w80" /><button /></div>)}
    </div>
    {zones && <><div className="md-zone pricing"><span>Pricing table</span></div><div className="md-zone hero"><span>Hero CTA</span></div></>}
  </div>
}

function CaptureImage({ url, after, zones }: { url?: string | null; after?: boolean; zones?: boolean }) {
  if (url) return <div className="md-real-shot"><img src={url} alt="Monitor capture" />{zones && <PricingMock zones />}</div>
  return <PricingMock after={after} zones={zones} />
}

function TimelineThumb({ changed, selected, snap, onClick }: { changed?: boolean; selected?: boolean; snap: SnapshotItem; onClick: () => void }) {
  return <button className={`md-tl-cap ${changed ? 'changed' : ''} ${selected ? 'selected' : ''}`} onClick={onClick}>
    <div className="md-tl-thumb">{snap.signedUrl ? <img src={snap.signedUrl} alt="" /> : <PricingMock after={changed} />}</div>
    <div className="md-tl-time">{fmtTime(snap.taken_at)}</div>
  </button>
}

export function MonitorDetailDesignClient({ monitor, openAlert, snapshots, alerts, alertBySnapshotId, zones, lastChecked, nextRun }: Props) {
  const [tab, setTab] = useState<'diff' | 'current' | 'zones'>('diff')
  const [handle, setHandle] = useState(50)
  const [selectedId, setSelectedId] = useState(snapshots[0]?.id ?? '')
  const latest = snapshots[0] ?? null
  const previous = snapshots[1] ?? null
  const selected = snapshots.find((s) => s.id === selectedId) ?? latest
  const activeAlert = openAlert ?? alerts[0] ?? null
  const score = scoreFor(openAlert, zones, snapshots)
  const healthTone = score >= 90 ? 'Good' : score >= 75 ? 'Fair' : 'Needs review'
  const status = !monitor.is_active ? 'Paused' : openAlert ? 'Alert' : 'Healthy'
  const totalChanges = alerts.length
  const currentAfter = activeAlert?.afterUrl ?? latest?.signedUrl ?? null
  const beforeUrl = activeAlert?.beforeUrl ?? previous?.signedUrl ?? null

  function drag(e: React.PointerEvent<HTMLDivElement>) {
    const rect = e.currentTarget.getBoundingClientRect()
    const next = Math.max(8, Math.min(92, ((e.clientX - rect.left) / rect.width) * 100))
    setHandle(next)
  }

  return <div className="md-page"><style jsx global>{css}</style>
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
        {activeAlert && <section className="md-alert"><div className="md-alert-icon"><AlertTriangle size={13} /></div><div><div className="md-alert-head"><b>Change detected</b><span>+{pct(activeAlert.diff_pct)}% diff</span><em>{severityLabel(activeAlert)}</em><small>{fmtDate(activeAlert.created_at)}</small></div><p>{activeAlert.ai_summary || 'A meaningful visual change was detected on this monitored page.'}</p></div><div className="md-alert-actions"><button className="md-btn-g sm"><CheckCircle2 size={10} />Resolve</button><button className="md-btn-p sm">View in full<ArrowRight size={10} /></button></div></section>}

        <section className="md-viewer">
          <div className="md-viewer-header">
            <button className={tab === 'diff' ? 'active' : ''} onClick={() => setTab('diff')}><Columns2 size={12} />Diff comparison</button>
            <button className={tab === 'current' ? 'active' : ''} onClick={() => setTab('current')}><Image size={12} />Current capture</button>
            <button className={tab === 'zones' ? 'active' : ''} onClick={() => setTab('zones')}><Target size={12} />Zone editor</button>
            <div className="md-grow" />
            <span>Drag to compare</span>
            <button className="md-btn-g sm"><Maximize2 size={10} />Fullscreen</button>
          </div>
          {tab === 'diff' && <><div className="md-diff" onPointerDown={drag} onPointerMove={(e) => e.buttons === 1 && drag(e)}>
            <div className="md-after"><CaptureImage url={currentAfter} after /></div>
            <div className="md-before" style={{ clipPath: `inset(0 ${100 - handle}% 0 0)` }}><CaptureImage url={beforeUrl} /></div>
            <div className="md-label before">BEFORE</div><div className="md-label after">AFTER</div>
            <div className="md-handle" style={{ left: `${handle}%` }}><div><MoveHorizontal size={14} /></div></div>
          </div><div className="md-viewer-foot"><span>Changed region <b>{activeAlert?.metadata?.zone_scores?.[0]?.label || zones[0]?.label || 'Pricing table header'}</b></span><i /><span>Pixel diff <b className="red">+{pct(activeAlert?.diff_pct)}%</b></span><i /><span>Zone <b>{zones[0]?.label || 'Full page'}</b></span><div className="md-grow" /><em>{fmtDate(activeAlert?.created_at ?? latest?.taken_at)}</em></div></>}
          {tab === 'current' && <><div className="md-current"><CaptureImage url={latest?.signedUrl ?? currentAfter} after /></div><div className="md-viewer-foot"><span>Latest capture <b>{fmtDate(latest?.taken_at)}</b></span><em>{bytes(latest?.file_size_bytes ?? null)} · Full page</em><div className="md-grow" /><button className="md-btn-g sm"><Download size={10} />Download</button></div></>}
          {tab === 'zones' && <><div className="md-zones"><CaptureImage url={latest?.signedUrl ?? currentAfter} zones /><div className="md-zone-tools"><button className="md-btn-g sm"><Plus size={10} />Add zone</button><button className="md-btn-g sm danger"><Trash2 size={10} />Clear all</button></div></div><div className="md-viewer-foot"><Info size={12} /><em>Click and drag on the screenshot to draw a new zone. Click a zone to edit its label and AI instruction.</em><div className="md-grow" /><button className="md-btn-p sm">Save zones</button></div></>}
        </section>

        <section className="md-timeline">
          <div className="md-timeline-head"><History size={13} /><b>Capture timeline</b><span>{snapshots.length} total</span><div className="md-grow" /><button className="md-btn-g sm"><Play size={10} className="green" />Play</button><button className="md-btn-g sm"><Filter size={10} />Changes only</button></div>
          <div className="md-timeline-scroll"><div className="md-tl-group"><p>Recent</p><div>{snapshots.slice(0, 14).map((snap, index) => <TimelineThumb key={snap.id} snap={snap} changed={Boolean(alertBySnapshotId[snap.id])} selected={(selected?.id ?? '') === snap.id || index === 0 && !selectedId} onClick={() => setSelectedId(snap.id)} />)}</div></div></div>
          <div className="md-tl-info"><MousePointerClick size={11} /><span>Viewing <b>{fmtDate(selected?.taken_at)}</b>{alertBySnapshotId[selected?.id ?? ''] ? `, change detected (+${pct(alertBySnapshotId[selected?.id ?? '']?.diff_pct)}%)` : ', clean capture'}</span><div className="md-grow" /><button className="md-btn-g sm"><Download size={10} />Export</button></div>
        </section>
      </main>

      <aside className="md-inspector">
        <div className="md-inspector-save"><div><b>Monitor settings</b><span>{monitor.name}</span></div><button className="md-btn-p sm"><Save size={10} />Save</button></div>
        <section><label><HeartPulse size={10} />Health score</label><div className="md-score"><svg width="72" height="72" viewBox="0 0 72 72"><circle cx="36" cy="36" r="28" fill="none" stroke="#F3F4F6" strokeWidth="7"/><circle cx="36" cy="36" r="28" fill="none" stroke={score >= 90 ? '#16A34A' : score >= 75 ? '#F59E0B' : '#EF4444'} strokeWidth="7" strokeDasharray={`${(score / 100) * 175.9} 175.9`} strokeLinecap="round" transform="rotate(-90 36 36)"/><text x="36" y="40" textAnchor="middle" fontSize="16" fontWeight="800" fill="#111827">{score}</text></svg><div><b>{healthTone}</b><p><i className="red" />{totalChanges} changes detected</p><p><i className="green" />{snapshots.length ? '94%' : '—'} uptime</p><p><i className="green" />{zones.length} zones configured</p></div></div></section>
        <section><label><Activity size={10} />Latest snapshot</label><Row k="Captured" v={fmtDate(latest?.taken_at)} /><Row k="Alert status" v={openAlert ? '1 open' : 'Clean'} pill={openAlert ? 'red' : 'green'} /><Row k="Pixel diff" v={`+${pct(activeAlert?.diff_pct)}%`} red /><Row k="File size" v={bytes(latest?.file_size_bytes ?? null)} mono /><Row k="Total checks" v={String(snapshots.length)} /><Row k="Changes found" v={String(totalChanges)} red /></section>
        <section><label><Calendar size={10} />Schedule</label><div className="md-freq"><button className={monitor.check_frequency === 'hourly' ? 'active' : ''}>Hourly</button><button className={!monitor.check_frequency || monitor.check_frequency === 'daily' ? 'active' : ''}>Daily</button><button className={monitor.check_frequency === 'weekly' ? 'active' : ''}>Weekly</button></div><Row k="Run at (UTC)" v={monitor.check_hour != null ? `${monitor.check_hour}:00` : '9:00 AM'} /></section>
        <section><label><Camera size={10} />Capture</label><Toggle title="Full page scroll" subtitle="Capture entire page height" on={monitor.full_page !== false} /><Toggle title="Hide cookie banners" subtitle="Dismiss overlays before capture" on /></section>
        <section><label><Target size={10} />Zones</label>{zones.length ? zones.map((z, i) => <div key={z.id ?? i} className="md-zone-chip"><i style={{ background: i === 0 ? '#2563EB' : '#16A34A' }} /><div><b>{z.label || `Zone ${i + 1}`}</b><span>{z.instruction || z.sensitivity || 'Visual changes'}</span></div></div>) : <p className="md-muted">No custom zones yet.</p>}<button className="md-btn-g sm full"><Plus size={10} />Add zone</button></section>
        <section><label><Info size={10} />AI instruction</label><textarea defaultValue={monitor.watch_description || 'Only alert me when pricing, CTA, or layout changes could affect conversion.'} /><button className="md-btn-g sm full">Update instruction</button></section>
      </aside>
    </div>
  </div>
}

function Row({ k, v, pill, red, mono }: { k: string; v: string; pill?: 'red' | 'green'; red?: boolean; mono?: boolean }) {
  return <div className="md-row"><span>{k}</span>{pill ? <b className={`pill ${pill}`}>{v}</b> : <b className={`${red ? 'red' : ''} ${mono ? 'mono' : ''}`}>{v}</b>}</div>
}

function Toggle({ title, subtitle, on }: { title: string; subtitle: string; on: boolean }) {
  return <div className="md-toggle"><div><b>{title}</b><span>{subtitle}</span></div><button className={on ? 'on' : ''}><i /></button></div>
}

const css = `
:root{--md-bg:#F7F8FA;--md-surface:#fff;--md-border:#E5E7EB;--md-border-s:#F3F4F6;--md-t1:#111827;--md-t2:#374151;--md-t3:#6B7280;--md-t4:#9CA3AF;--md-t5:#D1D5DB;--md-blue:#2563EB;--md-blue-s:#EFF6FF;--md-green:#16A34A;--md-red:#EF4444;--md-amber:#F59E0B;--md-r:12px;--md-r-sm:8px;--md-sh:0 1px 2px rgba(0,0,0,.05),0 1px 3px rgba(0,0,0,.04);--md-sh-md:0 4px 12px rgba(0,0,0,.07),0 2px 4px rgba(0,0,0,.04);--md-sh-lg:0 12px 40px rgba(0,0,0,.1),0 4px 8px rgba(0,0,0,.04)}.md-page{height:100vh;overflow:hidden;background:var(--md-bg);font-family:Inter,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;color:var(--md-t1);font-size:13px}.md-topbar{height:52px;background:rgba(255,255,255,.92);backdrop-filter:blur(12px);border-bottom:1px solid var(--md-border);display:flex;align-items:center;padding:0 16px;gap:8px;z-index:40}.md-back{display:flex;align-items:center;justify-content:center;width:26px;height:26px;border-radius:6px;border:1px solid var(--md-border);background:#fff;color:var(--md-t3)}.md-back:hover{background:#F9FAFB}.md-vline{width:1px;height:20px;background:var(--md-border);flex-shrink:0}.md-crumbs{display:flex;align-items:center;gap:5px;min-width:0}.md-crumbs a{font-size:12px;color:var(--md-t4);font-weight:500;text-decoration:none}.md-crumbs span{font-size:13px;font-weight:720;color:var(--md-t1);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:180px}.md-crumbs em{display:inline-flex;align-items:center;gap:4px;padding:2px 7px;border-radius:99px;font-size:10px;font-weight:720;font-style:normal;flex-shrink:0}.md-crumbs em i{width:5px;height:5px;border-radius:50%;display:block}.md-crumbs em.alert{background:rgba(239,68,68,.07);border:1px solid rgba(239,68,68,.16);color:#DC2626}.md-crumbs em.alert i{background:#EF4444}.md-crumbs em.healthy{background:rgba(22,163,74,.08);border:1px solid rgba(22,163,74,.16);color:#15803D}.md-crumbs em.healthy i{background:#16A34A}.md-crumbs em.paused{background:rgba(107,114,128,.08);border:1px solid rgba(107,114,128,.14);color:#6B7280}.md-crumbs em.paused i{background:#9CA3AF}.md-url{font-size:10.5px;color:var(--md-t4);font-family:ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,monospace;display:flex;align-items:center;gap:3px;text-decoration:none}.md-grow{flex:1}.md-checks{display:flex;align-items:center;gap:13px;padding:0 14px;border-left:1px solid var(--md-border);border-right:1px solid var(--md-border);flex-shrink:0}.md-checks>div{display:flex;align-items:center;gap:5px}.md-checks i{width:1px;height:18px;background:var(--md-border)}.md-checks small{display:block;font-size:9px;color:var(--md-t4);line-height:1;margin-bottom:2px}.md-checks b{display:block;font-size:11px;color:var(--md-t2);font-weight:650;line-height:1}.md-btn-p,.md-btn-g{display:inline-flex;align-items:center;gap:5px;border-radius:var(--md-r-sm);font-size:12px;white-space:nowrap;cursor:pointer;text-decoration:none}.md-btn-p{padding:6px 12px;background:var(--md-blue);color:white;border:0;font-weight:600}.md-btn-g{padding:6px 11px;background:white;color:var(--md-t2);border:1px solid var(--md-border);font-weight:500}.md-btn-g:hover{background:#F9FAFB;border-color:#D1D5DB}.md-btn-p:hover{background:#1D4ED8;box-shadow:0 4px 14px rgba(37,99,235,.32)}.sm{padding:4px 9px;font-size:11px}.icon{width:28px;padding:0;justify-content:center}.full{width:100%;justify-content:center}.danger svg{color:var(--md-red)}.md-body{height:calc(100vh - 52px);display:flex;overflow:hidden}.md-main{flex:1;overflow-y:auto;padding:18px 18px 40px;display:flex;flex-direction:column;gap:12px;min-width:0}.md-inspector{width:288px;flex-shrink:0;border-left:1px solid var(--md-border);background:#fff;overflow-y:auto;display:flex;flex-direction:column}.md-alert{background:#fff;border:1px solid rgba(239,68,68,.16);border-left:3px solid var(--md-red);border-radius:var(--md-r-sm);padding:11px 14px;display:flex;align-items:flex-start;gap:12px;box-shadow:0 3px 14px rgba(239,68,68,.07)}.md-alert-icon{width:30px;height:30px;border-radius:8px;background:rgba(239,68,68,.08);display:flex;align-items:center;justify-content:center;flex-shrink:0;color:var(--md-red)}.md-alert>div:nth-child(2){flex:1;min-width:0}.md-alert-head{display:flex;align-items:center;gap:7px;margin-bottom:3px;flex-wrap:wrap}.md-alert-head b{font-size:13px;font-weight:750;color:#B91C1C}.md-alert-head span{font-size:10px;font-weight:800;color:var(--md-red);background:rgba(239,68,68,.08);padding:1px 7px;border-radius:99px;border:1px solid rgba(239,68,68,.16)}.md-alert-head em{font-size:10px;font-weight:700;color:#C2410C;background:rgba(234,88,12,.08);padding:1px 7px;border-radius:99px;border:1px solid rgba(234,88,12,.16);font-style:normal}.md-alert-head small{font-size:11px;color:var(--md-t4)}.md-alert p{font-size:12px;color:var(--md-t2);line-height:1.58;margin:0}.md-alert-actions{display:flex;gap:6px;flex-shrink:0}.md-viewer,.md-timeline{background:#fff;border:1px solid var(--md-border);border-radius:var(--md-r);box-shadow:var(--md-sh);overflow:hidden}.md-viewer-header{padding:0 14px;border-bottom:1px solid var(--md-border-s);display:flex;align-items:center;height:42px}.md-viewer-header>button:not(.md-btn-g){height:42px;padding:0 13px;display:flex;align-items:center;gap:6px;font-size:12px;font-weight:550;color:var(--md-t3);border:0;background:transparent;border-bottom:2px solid transparent;cursor:pointer;position:relative;top:1px}.md-viewer-header>button.active{color:var(--md-t1);font-weight:680;border-bottom-color:var(--md-blue)}.md-viewer-header span{font-size:11px;color:var(--md-t4);margin-right:6px}.md-diff,.md-current,.md-zones{height:380px;position:relative;overflow:hidden;background:#F3F4F6}.md-diff{cursor:ew-resize;user-select:none}.md-after,.md-before{position:absolute;inset:0;overflow:hidden}.md-handle{position:absolute;top:0;bottom:0;width:2px;background:white;transform:translateX(-50%);box-shadow:0 0 0 1px rgba(0,0,0,.08),0 2px 16px rgba(0,0,0,.14);z-index:10}.md-handle>div{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:32px;height:32px;border-radius:50%;background:white;box-shadow:0 2px 12px rgba(0,0,0,.16);display:flex;align-items:center;justify-content:center}.md-label{position:absolute;top:10px;padding:3px 8px;border-radius:5px;font-size:10px;font-weight:720;background:rgba(0,0,0,.55);color:white;z-index:5;pointer-events:none;letter-spacing:.04em}.md-label.before{left:10px}.md-label.after{right:10px}.md-viewer-foot{padding:10px 14px;border-top:1px solid var(--md-border-s);display:flex;align-items:center;gap:16px;background:#FAFBFD}.md-viewer-foot span{display:flex;align-items:center;gap:5px;font-size:10px;font-weight:800;color:var(--md-t4);text-transform:uppercase;letter-spacing:.06em}.md-viewer-foot b{font-size:11.5px;font-weight:700;color:var(--md-t1);text-transform:none;letter-spacing:0}.md-viewer-foot b.red{color:var(--md-red);font-family:ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,monospace}.md-viewer-foot i{width:1px;height:14px;background:var(--md-border)}.md-viewer-foot em{font-size:11px;color:var(--md-t4);font-style:normal}.md-shot{background:#fff;height:100%;overflow:hidden;position:relative}.md-shot-nav{height:44px;background:#0A2540;display:flex;align-items:center;padding:0 28px;gap:16px}.md-shot-nav span{width:72px;height:16px;border-radius:3px;background:rgba(255,255,255,.82)}.md-shot-nav div{flex:1;display:flex;gap:16px;padding-left:20px}.md-shot-nav div i{height:9px;width:48px;border-radius:2px;background:rgba(255,255,255,.22)}.md-shot-nav b{height:30px;width:100px;border-radius:5px;background:#635BFF}.md-shot-hero{padding:28px 40px 18px;text-align:center}.md-shot-hero h1{display:block;width:340px;height:20px;border-radius:4px;background:#111;margin:0 auto 10px}.md-shot-hero p{width:460px;height:11px;border-radius:3px;background:#E9ECEF;margin:0 auto 6px}.md-shot-hero p.short{width:380px;margin-bottom:16px}.md-enterprise{margin:0 28px 16px;background:#FFF7ED;border:1.5px solid #FED7AA;border-radius:10px;padding:14px 18px;display:flex;align-items:center;gap:14px}.md-enterprise div{display:flex;flex-direction:column;gap:5px;flex:1}.md-enterprise b{height:10px;width:90px;border-radius:2px;background:#EA580C}.md-enterprise span{height:8px;width:220px;border-radius:2px;background:#FED7AA}.md-enterprise button{height:32px;width:110px;border-radius:6px;background:#EA580C;border:0}.md-pricing{display:flex;gap:14px;padding:0 28px;margin-top:16px}.md-pricing.after{margin-top:0}.md-plan{flex:1;border:1px solid #E5E7EB;border-radius:10px;padding:18px}.md-plan.pro{border:2px solid #635BFF;background:#F8F5FF}.md-plan.dim{opacity:.55}.md-plan i{display:block;height:9px;width:45%;border-radius:2px;background:#6B7280;margin-bottom:10px}.md-plan.pro i{background:#7C3AED}.md-plan b{display:block;height:22px;width:62%;border-radius:3px;background:#111;margin-bottom:10px}.md-plan.pro b{background:#635BFF}.md-plan p{height:8px;border-radius:2px;background:#E9ECEF;margin-bottom:6px}.md-plan.pro p{background:#DDD6FE}.md-plan p.w90{width:90%}.md-plan p.w80{width:80%;margin-bottom:14px}.md-plan button{height:32px;border-radius:6px;background:#E9ECEF;border:0;width:100%}.md-plan.pro button{background:#635BFF}.md-real-shot{height:100%;position:relative;background:#fff;overflow:hidden}.md-real-shot img{width:100%;height:100%;object-fit:cover;object-position:top;display:block}.md-zone{position:absolute;border-radius:8px;pointer-events:none}.md-zone span{position:absolute;top:-10px;left:8px;color:white;font-size:9px;font-weight:720;padding:1px 7px;border-radius:4px}.md-zone.pricing{left:28px;top:160px;right:28px;height:160px;border:2.5px solid #2563EB;background:rgba(37,99,235,.08)}.md-zone.pricing span{background:#2563EB}.md-zone.hero{left:28px;top:44px;right:28px;height:108px;border:2.5px solid #16A34A;background:rgba(22,163,74,.07)}.md-zone.hero span{background:#16A34A}.md-zone-tools{position:absolute;top:10px;right:10px;display:flex;flex-direction:column;gap:5px}.md-timeline-head{padding:10px 14px;border-bottom:1px solid var(--md-border-s);display:flex;align-items:center;gap:8px}.md-timeline-head b{font-size:13px;font-weight:720;color:var(--md-t1);letter-spacing:-.018em}.md-timeline-head span{font-size:11px;color:var(--md-t4);margin-left:2px}.green{color:#16A34A}.md-timeline-scroll{overflow-x:auto;overflow-y:hidden;padding:12px 14px;display:flex;gap:8px}.md-tl-group{display:flex;flex-direction:column;gap:6px}.md-tl-group>p{font-size:9px;font-weight:800;color:var(--md-t4);text-transform:uppercase;letter-spacing:.08em;white-space:nowrap;margin:0}.md-tl-group>div{display:flex;gap:5px}.md-tl-cap{width:68px;flex-shrink:0;cursor:pointer;border:1.5px solid var(--md-border);border-radius:7px;overflow:hidden;transition:border-color .15s,box-shadow .15s,transform .15s;position:relative;background:white;padding:0;text-align:left}.md-tl-cap:hover{border-color:var(--md-blue);box-shadow:0 2px 10px rgba(37,99,235,.14);transform:translateY(-1px)}.md-tl-cap.selected{border-color:var(--md-blue);box-shadow:0 0 0 2px rgba(37,99,235,.2)}.md-tl-cap.changed{border-color:rgba(239,68,68,.2)}.md-tl-cap.changed:after{content:"";position:absolute;top:4px;left:4px;width:6px;height:6px;border-radius:50%;background:var(--md-red);box-shadow:0 0 0 2px rgba(239,68,68,.2)}.md-tl-thumb{height:44px;overflow:hidden;position:relative;background:#fff}.md-tl-thumb img{width:100%;height:100%;object-fit:cover;object-position:top}.md-tl-thumb .md-shot{transform:scale(.15);transform-origin:top left;width:660%;height:660%}.md-tl-time{font-size:9px;font-family:ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,monospace;color:var(--md-t4);padding:3px 5px;line-height:1.2}.md-tl-info{padding:9px 14px;border-top:1px solid var(--md-border-s);background:#FAFBFD;display:flex;align-items:center;gap:10px}.md-tl-info span{font-size:11.5px;color:var(--md-t3)}.md-tl-info b{color:var(--md-t1)}.md-inspector-save{padding:11px 14px;border-bottom:1px solid var(--md-border-s);display:flex;align-items:center;justify-content:space-between;position:sticky;top:0;background:#fff;z-index:10}.md-inspector-save b{display:block;font-size:12px;font-weight:760;color:var(--md-t1);letter-spacing:-.015em}.md-inspector-save span{display:block;font-size:10px;color:var(--md-t4);margin-top:1px}.md-inspector section{padding:14px;border-bottom:1px solid var(--md-border-s)}.md-inspector label{font-size:9px;font-weight:800;color:var(--md-t4);text-transform:uppercase;letter-spacing:.1em;margin-bottom:10px;display:flex;align-items:center;gap:6px}.md-score{display:flex;align-items:center;gap:14px}.md-score b{font-size:13px;font-weight:720;color:#B45309}.md-score p{display:flex;align-items:center;gap:5px;font-size:10.5px;color:var(--md-t3);margin:3px 0}.md-score p i{width:7px;height:7px;border-radius:50%;display:block}.red{color:var(--md-red)!important}.green{background:var(--md-green)!important}.md-score p i.red{background:var(--md-red)}.md-score p i.green{background:var(--md-green)}.md-row{display:flex;align-items:center;justify-content:space-between;gap:8px;margin-bottom:7px}.md-row span{font-size:11px;color:var(--md-t3);font-weight:500}.md-row b{font-size:11.5px;font-weight:660;color:var(--md-t1);text-align:right}.mono{font-family:ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,monospace}.pill{font-size:10px!important;font-weight:800!important;padding:2px 7px;border-radius:99px}.pill.red{color:var(--md-red)!important;background:rgba(239,68,68,.08);border:1px solid rgba(239,68,68,.14)}.pill.green{color:#15803D!important;background:rgba(22,163,74,.08)!important;border:1px solid rgba(22,163,74,.14)}.md-freq{display:flex;background:#F3F4F6;border-radius:6px;padding:2px;gap:1px;margin-bottom:10px}.md-freq button{flex:1;padding:4px 0;border:0;border-radius:4px;font-size:11px;font-weight:600;background:transparent;color:var(--md-t3)}.md-freq button.active{background:#fff;color:var(--md-t1);box-shadow:0 1px 3px rgba(0,0,0,.07)}.md-toggle{display:flex;align-items:center;justify-content:space-between;gap:10px;margin-bottom:10px}.md-toggle b{display:block;font-size:12px;font-weight:500;color:var(--md-t1)}.md-toggle span{font-size:10px;color:var(--md-t4)}.md-toggle button{position:relative;width:36px;height:20px;border-radius:99px;border:0;background:#D1D5DB;cursor:pointer;flex-shrink:0}.md-toggle button.on{background:var(--md-blue)}.md-toggle button i{position:absolute;top:2px;left:2px;width:16px;height:16px;border-radius:50%;background:white;box-shadow:0 1px 2px rgba(0,0,0,.2);transition:left .2s}.md-toggle button.on i{left:18px}.md-zone-chip{display:flex;align-items:center;gap:6px;padding:6px 8px;border:1px solid var(--md-border);border-radius:6px;background:#FAFAFA;margin-bottom:5px}.md-zone-chip>i{width:8px;height:8px;border-radius:50%;flex-shrink:0}.md-zone-chip b{display:block;font-size:11.5px;color:var(--md-t1)}.md-zone-chip span{display:block;font-size:10px;color:var(--md-t4);margin-top:1px}.md-muted{font-size:11px;color:var(--md-t4);margin:0 0 8px}.md-inspector textarea{width:100%;min-height:82px;resize:vertical;border:1px solid var(--md-border);border-radius:8px;padding:8px;font-size:11.5px;line-height:1.5;color:var(--md-t2);font-family:inherit;outline:none;margin-bottom:8px}.md-inspector textarea:focus{border-color:rgba(37,99,235,.4);box-shadow:0 0 0 3px rgba(37,99,235,.08)}@media(max-width:1100px){.md-inspector{display:none}.md-checks{display:none}.md-url{display:none}}@media(max-width:780px){.md-topbar{gap:6px;padding:0 10px}.md-main{padding:12px}.md-alert{flex-direction:column}.md-alert-actions{width:100%}.md-diff,.md-current,.md-zones{height:300px}.md-viewer-foot{overflow-x:auto}.md-crumbs span{max-width:120px}}
`
