'use client'

import Link from 'next/link'
import { useMemo, useState } from 'react'
import { ArrowRight, CheckCheck, CheckCircle2, ChevronDown, ChevronsDown, Image, MoreHorizontal, Search, Sparkles, Target } from 'lucide-react'

type AlertItem = {
  id: string
  monitored_url_id: string
  created_at: string | null
  status: string | null
  diff_pct: number | null
  ai_summary: string | null
  monitored_urls?: { name?: string | null; url?: string | null; mode?: string | null } | null
  metadata?: any
}

type MonitorItem = {
  id: string
  name?: string | null
  url?: string | null
  check_frequency?: string | null
  last_checked_at?: string | null
  is_active?: boolean | null
}

type Props = {
  alerts: AlertItem[]
  monitors: MonitorItem[]
  checksToday: number
}

function timeAgo(iso: string | null | undefined): string {
  if (!iso) return 'Never'
  const diff = Date.now() - new Date(iso).getTime()
  const m = Math.floor(diff / 60000)
  if (m < 1) return 'Just now'
  if (m < 60) return `${m}m ago`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h}h ago`
  return `${Math.floor(h / 24)}d ago`
}

function host(url: string | null | undefined) {
  try { return new URL(url ?? '').hostname.replace(/^www\./, '') } catch { return url || 'unknown' }
}

function severity(diff: number | null | undefined) {
  const value = Number(diff ?? 0)
  if (value >= 8) return { label: 'High', cls: 'high' }
  if (value >= 3) return { label: 'Medium', cls: 'medium' }
  return { label: 'Low', cls: 'low' }
}

function dayTitle(iso: string | null | undefined) {
  if (!iso) return 'Earlier'
  const d = new Date(iso)
  const today = new Date(); today.setHours(0,0,0,0)
  const y = new Date(today); y.setDate(y.getDate() - 1)
  const start = new Date(d); start.setHours(0,0,0,0)
  if (start.getTime() === today.getTime()) return `Today · ${d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`
  if (start.getTime() === y.getTime()) return `Yesterday · ${d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

function zoneLabel(alert: AlertItem) {
  const zones = Array.isArray(alert.metadata?.zone_scores) ? alert.metadata.zone_scores : []
  return zones[0]?.label || (alert.monitored_urls?.mode === 'archive' ? 'Full page' : 'Changed region')
}

function Favicon({ name, url }: { name: string; url: string }) {
  const h = host(url)
  const stripe = h.includes('stripe')
  const lemon = h.includes('lemon')
  const notion = h.includes('notion')
  return <span className="pw-event-favicon" style={{ background: stripe || notion ? '#fff' : lemon ? '#7C3AED' : '#EFF6FF' }}>{stripe ? <><span style={{ display:'block', height:7, background:'#0A2540' }} /><span style={{ display:'block', margin:2, height:5, borderRadius:1, background:'#635BFF' }} /></> : notion ? <span style={{ display:'grid', placeItems:'center', height:'100%' }}><span style={{ width:9, height:9, borderRadius:2, background:'#111' }} /></span> : lemon ? <span style={{ display:'grid', placeItems:'center', height:'100%' }}><span style={{ width:10, height:10, borderRadius:2, background:'rgba(255,255,255,.82)' }} /></span> : <span style={{ display:'grid', placeItems:'center', height:'100%', color:'#2563EB', fontSize:9, fontWeight:800 }}>{name.slice(0,2).toUpperCase()}</span>}</span>
}

function MiniShot({ after, diff }: { after?: boolean; diff: number }) {
  return <div className="pw-ss-thumb">
    <div style={{ height:'100%', background:'#fff' }}>
      <div style={{ height:12, background:'#0A2540', display:'flex', alignItems:'center', padding:'0 5px' }}><div style={{ width:12, height:4, borderRadius:1, background:'rgba(255,255,255,.6)' }} /></div>
      <div style={{ padding:'5px 5px 0' }}>
        {after && <div style={{ background:'rgba(239,68,68,.12)', border:'1px solid rgba(239,68,68,.3)', borderRadius:3, padding:'2px 4px', marginBottom:3, display:'flex', gap:3 }}><span style={{ width:8, height:3, borderRadius:1, background:'#EF4444' }} /><span style={{ flex:1, height:3, borderRadius:1, background:'rgba(239,68,68,.3)' }} /></div>}
        {!after && <><div style={{ width:'55%', height:5, borderRadius:2, background:'#111', margin:'0 auto 3px' }} /><div style={{ width:'80%', height:3, borderRadius:1, background:'#E9ECEF', margin:'0 auto 6px' }} /></>}
        <div style={{ display:'flex', gap:3, height: after ? 46 : 52 }}>
          {[0,1,2].map((i) => <div key={i} style={{ flex:1, border: i === 1 ? '2px solid #635BFF' : '1px solid #E5E7EB', borderRadius:4, padding:4, background:i === 1 ? '#F8F5FF' : '#fff', opacity: after ? .72 : 1 }}>
            <div style={{ height:3, background:i === 1 ? '#DDD6FE' : '#E9ECEF', borderRadius:1, marginBottom:2 }} />
            <div style={{ height:6, background:i === 1 ? '#635BFF' : '#111', borderRadius:1, marginBottom:3 }} />
            <div style={{ height:5, background:i === 1 ? '#635BFF' : i === 2 ? '#6B7280' : '#E9ECEF', borderRadius:2 }} />
          </div>)}
        </div>
      </div>
    </div>
    {after && <div style={{ position:'absolute', top:13, left:4, right:4, height:18, border:'2px solid rgba(239,68,68,.7)', background:'rgba(239,68,68,.1)', borderRadius:3, pointerEvents:'none' }} />}
  </div>
}

function EventCard({ alert }: { alert: AlertItem }) {
  const name = alert.monitored_urls?.name || 'Untitled monitor'
  const url = alert.monitored_urls?.url || ''
  const diff = Number(alert.diff_pct ?? 0)
  const sev = severity(diff)
  const isOpen = alert.status === 'open'
  return <article className={`pw-event-card ${isOpen ? 'pw-event-open' : 'pw-event-ack'}`}>
    <div className="pw-event-header">
      <div className="pw-event-monitor-info"><Favicon name={name} url={url} /><span className="pw-event-name" style={{ color: isOpen ? undefined : 'var(--pw-t3)' }}>{name}</span><span className="pw-event-url">{host(url)}</span>{!isOpen && <span className="pw-ack-chip">Acknowledged</span>}</div>
      <div style={{ display:'flex', alignItems:'center', gap:7 }}><span className={`pw-sev-badge pw-sev-${sev.cls}`}>{sev.label}</span><span className={`pw-diff-badge ${!isOpen ? 'pw-diff-ack' : ''}`}>+{diff.toFixed(1)}%</span><span className="pw-event-time">{timeAgo(alert.created_at)}</span>{isOpen && <button className="pw-icon-btn"><MoreHorizontal size={13} /></button>}</div>
    </div>
    <div className="pw-event-body">
      <div className="pw-event-screenshots"><div className="pw-ss-wrap"><span className="pw-ss-label">Before</span><MiniShot diff={diff} /></div><div className="pw-ss-arrow"><ArrowRight size={14} /><span className="pw-ss-diff-num">+{diff.toFixed(1)}%</span></div><div className="pw-ss-wrap"><span className="pw-ss-label">After</span><MiniShot after diff={diff} /></div></div>
      <div className="pw-event-content"><div className="pw-ai-summary-block"><span className="pw-ai-pill"><Sparkles size={8} /> AI</span><p className="pw-ai-text">{alert.ai_summary || `Visual change detected on ${name}. Review the highlighted page region and compare the before and after screenshots.`}</p></div><div className="pw-event-footer"><span className="pw-zone-chip"><Target size={10} /> {zoneLabel(alert)}</span><span className="pw-zone-chip muted"><Image size={10} /> Full page</span><div className="pw-event-actions">{isOpen && <button className="pw-btn-g small"><CheckCircle2 size={10} style={{ color:'#16A34A' }} /> Resolve</button>}<Link className={isOpen ? 'pw-btn-p small' : 'pw-btn-g small'} href={`/dashboard/urls/${alert.monitored_url_id}`}>View diff <ArrowRight size={10} /></Link></div></div></div>
    </div>
  </article>
}

function CleanGroup({ title, subtitle, rows, id }: { title: string; subtitle: string; rows: MonitorItem[]; id: string }) {
  const [open, setOpen] = useState(false)
  return <div className={`pw-clean-group ${open ? 'expanded' : ''}`}><button className="pw-clean-group-header" onClick={() => setOpen(!open)}><span className="pw-dot pw-dot-g" /><span style={{ fontSize:12, fontWeight:650, color:'var(--pw-t2)' }}>{title}</span><span style={{ fontSize:11.5, color:'var(--pw-t4)', flex:1, marginLeft:4, textAlign:'left' }}>{subtitle}</span><ChevronDown size={13} style={{ color:'var(--pw-t4)', transform: open ? 'rotate(180deg)' : undefined, transition:'transform .2s' }} /></button><div className="pw-clean-group-rows">{rows.map((row) => <Link key={`${id}-${row.id}`} href={`/dashboard/urls/${row.id}`} className="pw-clean-row"><span className="pw-dot pw-dot-g" /><span style={{ fontWeight:600, color:'var(--pw-t2)', minWidth:130 }}>{row.name || 'Untitled monitor'}</span><span style={{ fontFamily:'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace', fontSize:10.5, color:'var(--pw-t4)', flex:1, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{host(row.url)}</span><span style={{ fontSize:10.5, color:'var(--pw-t4)' }}>{row.check_frequency || 'Daily'} check</span><span style={{ fontSize:11, color:'var(--pw-t4)', minWidth:60, textAlign:'right' }}>{timeAgo(row.last_checked_at)}</span></Link>)}</div></div>
}

export function FeedPageClient({ alerts, monitors, checksToday }: Props) {
  const [filter, setFilter] = useState<'all' | 'changes' | 'clean'>('all')
  const openCount = alerts.filter((a) => a.status === 'open').length
  const groups = useMemo(() => {
    const map = new Map<string, AlertItem[]>()
    alerts.forEach((a) => { const key = dayTitle(a.created_at); map.set(key, [...(map.get(key) || []), a]) })
    return Array.from(map.entries())
  }, [alerts])
  const cleanRows = monitors.filter((m) => m.is_active !== false).slice(0, 6)
  const showChanges = filter !== 'clean'
  const showClean = filter !== 'changes'

  return <div className="pw-feed-page"><style jsx global>{css}</style><header className="pw-feed-topbar"><div style={{ display:'flex', alignItems:'center', gap:8 }}><p style={{ fontSize:14, fontWeight:760, color:'var(--pw-t1)', letterSpacing:'-.022em', margin:0 }}>Feed</p><span style={{ fontSize:10.5, fontWeight:650, color:'var(--pw-red)', background:'rgba(239,68,68,.08)', padding:'2px 8px', borderRadius:999, border:'1px solid rgba(239,68,68,.16)' }}>{openCount} unread</span></div><div style={{ flex:1 }} /><div style={{ position:'relative' }}><Search size={12} style={{ position:'absolute', left:9, top:'50%', transform:'translateY(-50%)', color:'var(--pw-t4)', pointerEvents:'none' }} /><input placeholder="Search events..." className="pw-search" /></div><button className="pw-btn-g"><CheckCheck size={12} style={{ color:'#16A34A' }} /> Mark all read</button></header><main className="pw-feed-content"><div className="pw-feed-container"><div style={{ display:'flex', alignItems:'center', gap:7, marginBottom:22, flexWrap:'wrap' }}><button className={`pw-filter-pill ${filter === 'all' ? 'pw-filter-active' : 'pw-filter-inactive'}`} onClick={() => setFilter('all')}>All events</button><button className={`pw-filter-pill ${filter === 'changes' ? 'pw-filter-active' : 'pw-filter-inactive'}`} onClick={() => setFilter('changes')}><span className="pw-dot pw-dot-r" style={{ width:5, height:5, marginRight:3 }} />Changes only</button><button className={`pw-filter-pill ${filter === 'clean' ? 'pw-filter-active' : 'pw-filter-inactive'}`} onClick={() => setFilter('clean')}><span className="pw-dot pw-dot-g" style={{ width:5, height:5, marginRight:3 }} />Clean checks</button><div style={{ width:1, height:20, background:'var(--pw-border)', margin:'0 2px' }} /><select className="pw-select"><option>All monitors</option>{monitors.map((m) => <option key={m.id}>{m.name || host(m.url)}</option>)}</select><select className="pw-select"><option>All severities</option><option>High</option><option>Medium</option><option>Low</option></select><div style={{ flex:1 }} /><span style={{ fontSize:11.5, color:'var(--pw-t4)' }}>{checksToday + alerts.length} events today</span></div>{showChanges && groups.map(([label, items], idx) => <section key={label} className="pw-day-section"><div className="pw-day-label">{idx === 0 && openCount > 0 && <span className="pw-dot pw-dot-r" style={{ width:5, height:5 }} />}{label}</div>{items.map((alert) => <EventCard key={alert.id} alert={alert} />)}</section>)}{showClean && <section className="pw-day-section"><div className="pw-day-label"><span className="pw-dot pw-dot-g" style={{ width:5, height:5 }} />Clean checks</div><CleanGroup id="today" title={`${Math.max(checksToday - alerts.length, cleanRows.length)} clean checks`} subtitle={cleanRows.length ? cleanRows.map((r) => r.name || host(r.url)).slice(0,4).join(', ') : 'No clean checks yet'} rows={cleanRows} /></section>}{alerts.length === 0 && showChanges && <section className="pw-empty"><CheckCircle2 size={22} /><h2>No changes yet</h2><p>When PageWatch detects a meaningful visual change, it will appear here with screenshots, an AI summary, severity, and actions.</p></section>}<div style={{ textAlign:'center', padding:'8px 0 16px' }}><button className="pw-btn-g" style={{ padding:'7px 18px' }}><ChevronsDown size={12} /> Load earlier events</button></div></div></main></div>
}

const css = `
:root{--pw-bg:#F7F8FA;--pw-surface:#fff;--pw-border:#E5E7EB;--pw-border-s:#F3F4F6;--pw-t1:#111827;--pw-t2:#374151;--pw-t3:#6B7280;--pw-t4:#9CA3AF;--pw-t5:#D1D5DB;--pw-blue:#2563EB;--pw-blue-s:#EFF6FF;--pw-green:#16A34A;--pw-red:#EF4444;--pw-amber:#F59E0B;--pw-r:12px;--pw-r-sm:8px;--pw-sh:0 1px 2px rgba(0,0,0,.05),0 1px 3px rgba(0,0,0,.04);--pw-sh-md:0 4px 12px rgba(0,0,0,.06),0 2px 4px rgba(0,0,0,.04)}
.pw-feed-page{height:100vh;overflow-y:auto;background:var(--pw-bg);color:var(--pw-t1);font-family:Inter,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;font-size:13px;line-height:1.5}.pw-feed-topbar{height:52px;position:sticky;top:0;z-index:30;background:rgba(255,255,255,.92);backdrop-filter:blur(12px);border-bottom:1px solid var(--pw-border);display:flex;align-items:center;padding:0 20px;gap:10px}.pw-feed-content{padding:24px}.pw-feed-container{max-width:900px;margin:0 auto}.pw-btn-p,.pw-btn-g{display:inline-flex;align-items:center;gap:5px;border-radius:var(--pw-r-sm);font-size:12px;white-space:nowrap;text-decoration:none;cursor:pointer}.pw-btn-p{padding:6px 12px;background:var(--pw-blue);color:#fff;border:0;font-weight:600}.pw-btn-p:hover{background:#1D4ED8;box-shadow:0 4px 14px rgba(37,99,235,.32)}.pw-btn-g{padding:6px 11px;background:#fff;color:var(--pw-t2);border:1px solid var(--pw-border);font-weight:500}.pw-btn-g:hover{background:#F9FAFB;border-color:#D1D5DB}.small{font-size:11px;padding:5px 10px}@keyframes pwPg{0%,100%{box-shadow:0 0 0 0 rgba(22,163,74,.45)}50%{box-shadow:0 0 0 4px rgba(22,163,74,0)}}@keyframes pwPr{0%,100%{box-shadow:0 0 0 0 rgba(239,68,68,.45)}50%{box-shadow:0 0 0 4px rgba(239,68,68,0)}}.pw-dot{width:6px;height:6px;border-radius:50%;display:inline-block;flex-shrink:0}.pw-dot-g{background:#16A34A;animation:pwPg 3s ease infinite}.pw-dot-r{background:#EF4444;animation:pwPr 1.8s ease infinite}.pw-search{height:30px;width:190px;border:1px solid var(--pw-border);border-radius:var(--pw-r-sm);padding:0 10px 0 28px;font-size:12px;color:var(--pw-t1);background:#fff;font-family:inherit;outline:none}.pw-search:focus{border-color:rgba(37,99,235,.4);box-shadow:0 0 0 3px rgba(37,99,235,.08)}.pw-filter-pill{height:28px;padding:0 12px;border-radius:99px;font-size:11.5px;font-weight:550;border:1px solid transparent;display:inline-flex;align-items:center}.pw-filter-active{background:var(--pw-t1);color:white;border-color:var(--pw-t1)}.pw-filter-inactive{background:transparent;color:var(--pw-t3);border-color:var(--pw-border)}.pw-filter-inactive:hover{background:#F9FAFB;color:var(--pw-t2)}.pw-select{height:28px;border:1px solid var(--pw-border);border-radius:99px;padding:0 10px;font-size:11.5px;color:var(--pw-t2);font-family:inherit;background:#fff;outline:none}.pw-day-section{margin-bottom:28px}.pw-day-label{display:flex;align-items:center;gap:10px;margin-bottom:12px;font-size:11.5px;font-weight:700;color:var(--pw-t4);text-transform:uppercase;letter-spacing:.06em}.pw-day-label:after{content:"";flex:1;height:1px;background:var(--pw-border-s)}.pw-event-card{background:var(--pw-surface);border:1px solid var(--pw-border);border-left:3px solid var(--pw-border);border-radius:var(--pw-r);box-shadow:var(--pw-sh);margin-bottom:10px;overflow:hidden;transition:box-shadow .18s,transform .18s;animation:pwFade .3s ease both}.pw-event-card:hover{box-shadow:var(--pw-sh-md);transform:translateY(-1px)}.pw-event-open{border-left-color:var(--pw-red)}.pw-event-ack{border-left-color:var(--pw-t5);opacity:.82}.pw-event-header{padding:11px 14px;display:flex;align-items:center;gap:10px;border-bottom:1px solid var(--pw-border-s);background:linear-gradient(180deg,#fff,#FAFBFD)}.pw-event-monitor-info{display:flex;align-items:center;gap:8px;flex:1;min-width:0}.pw-event-favicon{width:20px;height:20px;border-radius:5px;overflow:hidden;flex-shrink:0;border:1px solid var(--pw-border)}.pw-event-name{font-size:13px;font-weight:720;color:var(--pw-t1);letter-spacing:-.018em;white-space:nowrap}.pw-event-url{font-size:10.5px;font-family:ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,monospace;color:var(--pw-t4);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.pw-ack-chip{font-size:10px;font-weight:700;color:var(--pw-t4);background:var(--pw-border-s);padding:2px 7px;border-radius:99px;border:1px solid var(--pw-border)}.pw-sev-badge{display:inline-flex;padding:2px 7px;border-radius:99px;font-size:10px;font-weight:720;flex-shrink:0}.pw-sev-high{color:#C2410C;background:rgba(234,88,12,.09);border:1px solid rgba(234,88,12,.18)}.pw-sev-medium{color:#B45309;background:rgba(245,158,11,.09);border:1px solid rgba(245,158,11,.18)}.pw-sev-low{color:#6B7280;background:rgba(107,114,128,.07);border:1px solid rgba(107,114,128,.14)}.pw-diff-badge{font-size:11px;font-weight:760;color:var(--pw-red);background:rgba(239,68,68,.08);border:1px solid rgba(239,68,68,.16);padding:2px 8px;border-radius:99px;flex-shrink:0;font-family:ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,monospace}.pw-diff-ack{color:var(--pw-t3);background:var(--pw-border-s);border-color:var(--pw-border)}.pw-event-time{font-size:11px;color:var(--pw-t4);white-space:nowrap;flex-shrink:0}.pw-icon-btn{width:24px;height:24px;border:0;border-radius:5px;background:transparent;color:var(--pw-t4);display:flex;align-items:center;justify-content:center}.pw-icon-btn:hover{background:#F3F4F6}.pw-event-body{display:flex;gap:0;min-height:130px}.pw-event-screenshots{flex-shrink:0;width:300px;padding:12px;border-right:1px solid var(--pw-border-s);display:flex;align-items:center;gap:8px;background:#FAFBFD}.pw-ss-wrap{flex:1;display:flex;flex-direction:column;gap:5px;min-width:0}.pw-ss-label{font-size:9px;font-weight:700;color:var(--pw-t4);text-transform:uppercase;letter-spacing:.08em}.pw-ss-thumb{height:88px;border-radius:7px;overflow:hidden;border:1px solid var(--pw-border);box-shadow:0 2px 8px rgba(0,0,0,.06);position:relative;flex-shrink:0;background:#fff}.pw-ss-arrow{flex-shrink:0;display:flex;flex-direction:column;align-items:center;gap:4px;color:var(--pw-t4)}.pw-ss-diff-num{font-size:13px;font-weight:800;color:var(--pw-red);font-family:ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,monospace;letter-spacing:-.03em}.pw-event-content{flex:1;padding:14px 16px;display:flex;flex-direction:column;gap:10px;min-width:0}.pw-ai-summary-block{display:flex;gap:8px;flex:1}.pw-ai-pill{display:inline-flex;align-items:center;gap:3px;padding:2px 6px;border-radius:5px;font-size:9px;font-weight:800;color:#6D28D9;background:rgba(109,40,217,.08);border:1px solid rgba(109,40,217,.14);flex-shrink:0;height:fit-content;margin-top:2px;letter-spacing:.02em}.pw-ai-text{font-size:13px;color:var(--pw-t2);line-height:1.6;flex:1;min-width:0;margin:0}.pw-event-footer{display:flex;align-items:center;gap:8px;flex-wrap:wrap;margin-top:auto}.pw-zone-chip{display:inline-flex;align-items:center;gap:4px;padding:3px 8px;border-radius:5px;font-size:10.5px;font-weight:600;color:var(--pw-t2);background:var(--pw-border-s);border:1px solid var(--pw-border)}.pw-zone-chip.muted{color:var(--pw-t4)}.pw-event-actions{display:flex;gap:6px;margin-left:auto;flex-shrink:0}.pw-clean-group{background:#fff;border:1px solid var(--pw-border);border-radius:var(--pw-r-sm);margin-bottom:10px;overflow:hidden;box-shadow:var(--pw-sh);animation:pwFade .3s ease both}.pw-clean-group-header{width:100%;padding:9px 14px;display:flex;align-items:center;gap:8px;cursor:pointer;transition:background .1s;user-select:none;background:transparent;border:0;font-family:inherit}.pw-clean-group-header:hover{background:#FAFAFA}.pw-clean-group-rows{display:none;border-top:1px solid var(--pw-border-s)}.pw-clean-group.expanded .pw-clean-group-rows{display:block}.pw-clean-row{display:flex;align-items:center;gap:10px;padding:8px 14px;border-bottom:1px solid var(--pw-border-s);font-size:12px;color:var(--pw-t3);transition:background .1s;text-decoration:none}.pw-clean-row:last-child{border-bottom:0}.pw-clean-row:hover{background:#FAFAFA}.pw-empty{background:#fff;border:1px solid var(--pw-border);border-radius:12px;padding:42px 18px;text-align:center;color:var(--pw-t4);box-shadow:var(--pw-sh)}.pw-empty h2{margin:10px 0 5px;color:var(--pw-t1);font-size:16px}.pw-empty p{margin:0 auto;max-width:430px;font-size:12.5px;line-height:1.6}@keyframes pwFade{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}@media(max-width:980px){.pw-event-body{flex-direction:column}.pw-event-screenshots{width:100%;border-right:0;border-bottom:1px solid var(--pw-border-s)}.pw-feed-content{padding:16px}}
`
