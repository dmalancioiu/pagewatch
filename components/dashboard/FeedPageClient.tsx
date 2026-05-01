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

  return <div className="pw-feed-page"><header className="pw-feed-topbar"><div style={{ display:'flex', alignItems:'center', gap:8 }}><p style={{ fontSize:14, fontWeight:760, color:'var(--pw-t1)', letterSpacing:'-.022em', margin:0 }}>Feed</p><span style={{ fontSize:10.5, fontWeight:650, color:'var(--pw-red)', background:'rgba(239,68,68,.08)', padding:'2px 8px', borderRadius:999, border:'1px solid rgba(239,68,68,.16)' }}>{openCount} unread</span></div><div style={{ flex:1 }} /><div style={{ position:'relative' }}><Search size={12} style={{ position:'absolute', left:9, top:'50%', transform:'translateY(-50%)', color:'var(--pw-t4)', pointerEvents:'none' }} /><input placeholder="Search events..." className="pw-search" /></div><button className="pw-btn-g"><CheckCheck size={12} style={{ color:'#16A34A' }} /> Mark all read</button></header><main className="pw-feed-content"><div className="pw-feed-container"><div style={{ display:'flex', alignItems:'center', gap:7, marginBottom:22, flexWrap:'wrap' }}><button className={`pw-filter-pill ${filter === 'all' ? 'pw-filter-active' : 'pw-filter-inactive'}`} onClick={() => setFilter('all')}>All events</button><button className={`pw-filter-pill ${filter === 'changes' ? 'pw-filter-active' : 'pw-filter-inactive'}`} onClick={() => setFilter('changes')}><span className="pw-dot pw-dot-r" style={{ width:5, height:5, marginRight:3 }} />Changes only</button><button className={`pw-filter-pill ${filter === 'clean' ? 'pw-filter-active' : 'pw-filter-inactive'}`} onClick={() => setFilter('clean')}><span className="pw-dot pw-dot-g" style={{ width:5, height:5, marginRight:3 }} />Clean checks</button><div style={{ width:1, height:20, background:'var(--pw-border)', margin:'0 2px' }} /><select className="pw-select"><option>All monitors</option>{monitors.map((m) => <option key={m.id}>{m.name || host(m.url)}</option>)}</select><select className="pw-select"><option>All severities</option><option>High</option><option>Medium</option><option>Low</option></select><div style={{ flex:1 }} /><span style={{ fontSize:11.5, color:'var(--pw-t4)' }}>{checksToday + alerts.length} events today</span></div>{showChanges && groups.map(([label, items], idx) => <section key={label} className="pw-day-section"><div className="pw-day-label">{idx === 0 && openCount > 0 && <span className="pw-dot pw-dot-r" style={{ width:5, height:5 }} />}{label}</div>{items.map((alert) => <EventCard key={alert.id} alert={alert} />)}</section>)}{showClean && <section className="pw-day-section"><div className="pw-day-label"><span className="pw-dot pw-dot-g" style={{ width:5, height:5 }} />Clean checks</div><CleanGroup id="today" title={`${Math.max(checksToday - alerts.length, cleanRows.length)} clean checks`} subtitle={cleanRows.length ? cleanRows.map((r) => r.name || host(r.url)).slice(0,4).join(', ') : 'No clean checks yet'} rows={cleanRows} /></section>}{alerts.length === 0 && showChanges && <section className="pw-empty"><CheckCircle2 size={22} /><h2>No changes yet</h2><p>When PageWatch detects a meaningful visual change, it will appear here with screenshots, an AI summary, severity, and actions.</p></section>}<div style={{ textAlign:'center', padding:'8px 0 16px' }}><button className="pw-btn-g" style={{ padding:'7px 18px' }}><ChevronsDown size={12} /> Load earlier events</button></div></div></main></div>
}

