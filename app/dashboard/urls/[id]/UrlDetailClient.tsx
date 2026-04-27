'use client'

import { useState, useTransition } from 'react'
import { acknowledgeAlert } from '@/lib/actions/alerts'
import { DiffViewerModal } from '@/components/dashboard/DiffViewerModal'
import type { DiffTab } from '@/components/dashboard/DiffViewerModal'
import {
  CheckCircle2, Download, Maximize2, History, ChevronRight,
  AlertTriangle, Target, Image as ImageIcon, Eye, Plus, Sparkles,
} from 'lucide-react'
import { StatusBadge } from '@/components/dashboard/StatusBadge'

async function downloadImage(url: string, filename: string) {
  try {
    const res = await fetch(url)
    const blob = await res.blob()
    const href = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = href; a.download = filename; a.click()
    URL.revokeObjectURL(href)
  } catch {
    window.open(url, '_blank')
  }
}

type ZoneScore = {
  label?: string
  instruction?: string | null
  sensitivity?: 'low' | 'normal' | 'high'
  diff_pct?: number
  alert_score?: number
  passes_threshold?: boolean
}

export interface AlertWithUrls {
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

export interface SnapshotWithUrl {
  id: string
  storage_path: string
  taken_at: string
  file_size_bytes: number | null
  signedUrl: string | null
}

interface Zone {
  id: string
  x: number
  y: number
  width: number
  height: number
  label?: string
  instruction?: string
  sensitivity?: 'low' | 'normal' | 'high'
}

interface Props {
  openAlert: AlertWithUrls | null
  snapshots: SnapshotWithUrl[]
  alertBySnapshotId: Record<string, AlertWithUrls>
  pageUrl: string
  zones?: Zone[]
}

const ZONE_COLORS = ['#2563EB', '#16A34A', '#D97706', '#9333EA', '#0891B2', '#DC2626']

function zoneScores(alert?: AlertWithUrls | null): ZoneScore[] {
  return Array.isArray(alert?.metadata?.zone_scores) ? alert!.metadata.zone_scores : []
}

function scoreForZone(alert: AlertWithUrls | undefined, zone: Zone, index: number): ZoneScore | null {
  const label = zone.label?.trim() || `Zone ${index + 1}`
  return zoneScores(alert).find(s => (s.label ?? '').trim().toLowerCase() === label.toLowerCase()) ?? null
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleString('en-US', {
    month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit',
  })
}

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime()
  const m = Math.floor(diff / 60000)
  if (m < 1) return 'Just now'
  if (m < 60) return `${m}m ago`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h}h ago`
  return `${Math.floor(h / 24)}d ago`
}

function getDateGroup(iso: string): string {
  const diffDays = Math.floor((Date.now() - new Date(iso).getTime()) / 86400000)
  if (diffDays === 0) return 'Today'
  if (diffDays === 1) return 'Yesterday'
  if (diffDays < 7) return 'This week'
  if (diffDays < 30) return 'This month'
  return 'Older'
}
const GROUP_ORDER = ['Today', 'Yesterday', 'This week', 'This month', 'Older']

type TFilter = 'all' | 'changes' | 'clean'
const PAGE_SIZE = 15

export function UrlDetailClient({ openAlert, snapshots, alertBySnapshotId, pageUrl, zones = [] }: Props) {
  const [modalOpen, setModalOpen] = useState(false)
  const [modalAlert, setModalAlert] = useState<AlertWithUrls | null>(null)
  const [modalSnap, setModalSnap] = useState<SnapshotWithUrl | null>(null)
  const [defaultTab, setDefaultTab] = useState<DiffTab>('compare')
  const [isPending, startTransition] = useTransition()
  const [dismissed, setDismissed] = useState(false)
  const [filter, setFilter] = useState<TFilter>('all')
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE)

  function openModal(alert: AlertWithUrls | null, snap: SnapshotWithUrl | null, tab: DiffTab) {
    setModalAlert(alert); setModalSnap(snap); setDefaultTab(tab); setModalOpen(true)
  }

  function openZoneEditor() {
    if (!latestSnap) return
    openModal(null, latestSnap, 'after')
  }

  const activeAlert = dismissed ? null : openAlert
  const totalChecks = snapshots.length
  const changeEvents = Object.keys(alertBySnapshotId).length
  const cleanRate = totalChecks > 0 ? Math.round(((totalChecks - changeEvents) / totalChecks) * 100) : 100

  const filtered = snapshots.filter(s => filter === 'changes' ? !!alertBySnapshotId[s.id] : filter === 'clean' ? !alertBySnapshotId[s.id] : true)
  const visible = filtered.slice(0, visibleCount)
  const hasMore = filtered.length > visibleCount

  const groupMap = new Map<string, SnapshotWithUrl[]>()
  for (const s of visible) {
    const lbl = getDateGroup(s.taken_at)
    if (!groupMap.has(lbl)) groupMap.set(lbl, [])
    groupMap.get(lbl)!.push(s)
  }
  const groups = GROUP_ORDER.filter(l => groupMap.has(l)).map(l => ({ label: l, items: groupMap.get(l)! }))

  const latestSnap = snapshots[0] ?? null
  const latestAlert = latestSnap ? alertBySnapshotId[latestSnap.id] : undefined

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      {activeAlert && (
        <div style={{ background: 'linear-gradient(90deg, rgba(254,242,242,0.92), rgba(255,255,255,0.92))', border: '1px solid rgba(220,38,38,0.18)', borderRadius: 12, padding: '11px 14px', display: 'flex', alignItems: 'center', gap: 11, boxShadow: '0 8px 24px rgba(220,38,38,0.04)' }}>
          <div style={{ width: 28, height: 28, borderRadius: 9, background: 'rgba(220,38,38,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><AlertTriangle size={14} style={{ color: '#DC2626' }} /></div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
              <span style={{ fontSize: 12, fontWeight: 750, color: '#B91C1C' }}>Change detected</span>
              <StatusBadge variant={activeAlert.severity as any ?? 'alert'} />
              {activeAlert.diff_pct != null && <span style={{ fontSize: 10, fontWeight: 750, color: '#DC2626' }}>{Number(activeAlert.diff_pct).toFixed(1)}% diff</span>}
              <span style={{ fontSize: 10, color: '#9CA3AF' }}>{timeAgo(activeAlert.created_at)}</span>
            </div>
            {activeAlert.ai_summary && <p style={{ fontSize: 12, color: '#374151', lineHeight: 1.55, marginTop: 3 }}>{activeAlert.ai_summary}</p>}
          </div>
          <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
            <button className="btn-dash-ghost" onClick={() => startTransition(async () => { await acknowledgeAlert(activeAlert.id); setDismissed(true) })} disabled={isPending} style={{ fontSize: 11 }}><CheckCircle2 size={10} /> {isPending ? 'Saving…' : 'Resolve'}</button>
            <button className="btn-dash-primary" onClick={() => openModal(activeAlert, null, 'compare')} style={{ padding: '5px 11px', fontSize: 11 }}><Maximize2 size={10} /> View Diff</button>
          </div>
        </div>
      )}

      {latestSnap ? (
        <div style={{ background: '#FFFFFF', border: '1px solid rgba(15,23,42,0.08)', borderRadius: 16, overflow: 'hidden', boxShadow: '0 18px 48px rgba(15,23,42,0.06), 0 1px 2px rgba(15,23,42,0.04)' }}>
          <div style={{ padding: '16px 18px 14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 14, background: 'linear-gradient(180deg, #FFFFFF 0%, #FBFCFF 100%)', borderBottom: '1px solid #F1F5F9' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 11 }}>
              <div style={{ width: 34, height: 34, borderRadius: 11, background: 'rgba(37,99,235,0.08)', border: '1px solid rgba(37,99,235,0.16)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Target size={16} style={{ color: '#2563EB' }} /></div>
              <div>
                <p style={{ fontSize: 15, fontWeight: 800, color: '#0F172A', margin: 0, letterSpacing: '-0.02em' }}>Watched Zones</p>
                <p style={{ fontSize: 11, color: '#94A3B8', marginTop: 3 }}>{zones.length > 0 ? `${zones.length} focused region${zones.length !== 1 ? 's' : ''}. Only meaningful changes inside these areas should alert you.` : 'No focus zones yet. Start by selecting the parts of the page that matter.'}</p>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 7 }}>
              <button className="btn-dash-primary" onClick={openZoneEditor} style={{ padding: '7px 13px', fontSize: 12, borderRadius: 9, boxShadow: '0 8px 18px rgba(37,99,235,0.18)' }}><Sparkles size={12} /> Edit zones</button>
              <button className="btn-dash-ghost" onClick={() => openModal(openAlert, latestSnap, openAlert ? 'compare' : 'after')} style={{ padding: '7px 12px', fontSize: 12, borderRadius: 9 }}><Maximize2 size={11} /> Capture</button>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 250px', minHeight: 238 }}>
            <div style={{ padding: 18 }}>
              {zones.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
                  {zones.map((z, i) => {
                    const color = ZONE_COLORS[i % ZONE_COLORS.length]
                    const score = scoreForZone(latestAlert, z, i)
                    const changed = Boolean(score?.passes_threshold)
                    const diff = score?.diff_pct ?? null
                    const alertScore = score?.alert_score ?? null
                    return (
                      <button
                        key={z.id}
                        onClick={openZoneEditor}
                        style={{ position: 'relative', display: 'grid', gridTemplateColumns: 'minmax(160px, 220px) 1fr auto', alignItems: 'center', gap: 16, padding: '13px 14px', border: '1px solid rgba(15,23,42,0.07)', borderRadius: 13, background: changed ? 'linear-gradient(90deg, rgba(255,255,255,1), rgba(254,242,242,0.46))' : 'linear-gradient(90deg, #FFFFFF, #FBFDFF)', boxShadow: '0 1px 2px rgba(15,23,42,0.03)', cursor: 'pointer', textAlign: 'left', width: '100%' }}
                        title="Edit this zone on the screenshot"
                      >
                        <div style={{ position: 'absolute', left: 0, top: 12, bottom: 12, width: 3, borderRadius: 99, background: color }} />
                        <div style={{ minWidth: 0, paddingLeft: 5 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                            <span style={{ width: 8, height: 8, borderRadius: '50%', background: color, boxShadow: `0 0 0 4px ${color}14`, flexShrink: 0 }} />
                            <p style={{ fontSize: 13, fontWeight: 800, color: '#0F172A', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{z.label || `Zone ${i + 1}`}</p>
                          </div>
                          <p style={{ fontSize: 10, color: '#94A3B8', marginTop: 5, textTransform: 'capitalize', fontWeight: 650 }}>{z.sensitivity ?? 'normal'} sensitivity</p>
                        </div>
                        <div style={{ minWidth: 0 }}>
                          <p style={{ fontSize: 11, color: '#64748B', lineHeight: 1.45, margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{z.instruction?.trim() || `Alert if ${z.label || `Zone ${i + 1}`} changes.`}</p>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginTop: 7 }}>
                            <span style={{ fontSize: 10, color: '#94A3B8' }}>Latest diff</span>
                            <span style={{ fontSize: 11, fontWeight: 800, color: changed ? '#DC2626' : '#0F172A' }}>{diff != null ? `${Number(diff).toFixed(1)}%` : '—'}</span>
                            {alertScore != null && <span style={{ fontSize: 10, color: '#94A3B8' }}>Score {Number(alertScore).toFixed(0)}</span>}
                          </div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <span style={{ fontSize: 10, fontWeight: 800, borderRadius: 999, padding: '4px 8px', color: changed ? '#B91C1C' : '#15803D', background: changed ? 'rgba(220,38,38,0.07)' : 'rgba(22,163,74,0.08)', border: changed ? '1px solid rgba(220,38,38,0.14)' : '1px solid rgba(22,163,74,0.14)' }}>{changed ? 'Changed' : 'Clean'}</span>
                          <span
                            onClick={(e) => { e.stopPropagation(); openModal(openAlert, latestSnap, openAlert ? 'compare' : 'after') }}
                            style={{ background: '#F8FAFC', padding: '6px 8px', borderRadius: 8, fontSize: 11, color: '#2563EB', fontWeight: 750, cursor: 'pointer' }}
                          >
                            View diff
                          </span>
                        </div>
                      </button>
                    )
                  })}
                </div>
              ) : (
                <div style={{ border: '1px dashed #CBD5E1', borderRadius: 14, padding: '32px 20px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', background: 'linear-gradient(180deg, #F8FAFC, #FFFFFF)' }}>
                  <div style={{ width: 44, height: 44, borderRadius: 14, background: 'rgba(37,99,235,0.08)', color: '#2563EB', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 12 }}><Target size={19} /></div>
                  <p style={{ fontSize: 14, fontWeight: 800, color: '#0F172A', marginBottom: 5 }}>Select what matters</p>
                  <p style={{ fontSize: 12, color: '#64748B', lineHeight: 1.6, maxWidth: 390, marginBottom: 14 }}>Draw zones for prices, status panels, tables, or content blocks. PageWatch will ignore the rest of the page.</p>
                  <button className="btn-dash-primary" onClick={openZoneEditor} style={{ fontSize: 12, borderRadius: 9 }}><Plus size={11} /> Create focus zones</button>
                </div>
              )}
            </div>

            <div style={{ borderLeft: '1px solid #F1F5F9', background: 'linear-gradient(180deg, #F8FAFC, #FFFFFF)', padding: 16 }}>
              <button onClick={() => openModal(openAlert, latestSnap, openAlert ? 'compare' : 'after')} style={{ border: 'none', background: 'transparent', padding: 0, cursor: 'pointer', width: '100%', textAlign: 'left' }}>
                <div style={{ width: '100%', height: 118, borderRadius: 13, overflow: 'hidden', background: '#EEF2F7', border: '1px solid rgba(15,23,42,0.08)', position: 'relative', boxShadow: '0 10px 28px rgba(15,23,42,0.09)' }}>
                  {latestSnap.signedUrl ? <img src={latestSnap.signedUrl} alt="Latest capture preview" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top', display: 'block' }} /> : <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9CA3AF' }}><ImageIcon size={16} /></div>}
                  <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, transparent 30%, rgba(15,23,42,0.52))' }} />
                  <span style={{ position: 'absolute', right: 9, bottom: 8, display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 10, color: 'white', fontWeight: 800 }}><Eye size={10} /> Open capture</span>
                </div>
              </button>
              <div style={{ marginTop: 13, display: 'flex', flexDirection: 'column', gap: 1, borderTop: '1px solid #E5E7EB', borderBottom: '1px solid #E5E7EB' }}>
                {[{ label: 'Checks', value: totalChecks }, { label: 'Changes', value: changeEvents, color: changeEvents > 0 ? '#DC2626' : undefined }, { label: 'Clean rate', value: `${cleanRate}%`, color: cleanRate >= 90 ? '#16A34A' : undefined }, { label: 'Latest diff', value: latestAlert?.diff_pct != null ? `${Number(latestAlert.diff_pct).toFixed(1)}%` : '—' }].map(stat => <div key={stat.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', padding: '9px 0' }}><span style={{ fontSize: 10, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 800 }}>{stat.label}</span><span style={{ fontSize: 14, fontWeight: 850, color: stat.color ?? '#0F172A' }}>{stat.value}</span></div>)}
              </div>
              {latestSnap.signedUrl && <button className="btn-dash-ghost" onClick={() => downloadImage(latestSnap.signedUrl!, `snap-${latestSnap.id}.png`)} style={{ width: '100%', justifyContent: 'center', marginTop: 12, fontSize: 11, borderRadius: 9 }}><Download size={10} /> Download capture</button>}
            </div>
          </div>
        </div>
      ) : <div style={{ background: 'white', border: '1px solid #E5E7EB', borderRadius: 8, padding: '40px 24px', textAlign: 'center' }}><p style={{ fontSize: 13, color: '#9CA3AF' }}>No screenshots yet. Run a check to capture the first snapshot.</p></div>}

      <div style={{ background: 'white', border: '1px solid #E5E7EB', borderRadius: 8, overflow: 'hidden' }}>
        <div style={{ padding: '10px 14px', borderBottom: '1px solid #F3F4F6', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, background: '#FAFAFA' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}><History size={13} style={{ color: '#9CA3AF' }} /><span style={{ fontSize: 12, fontWeight: 600, color: '#374151' }}>History</span><span style={{ fontSize: 10, fontWeight: 700, color: '#6B7280', background: '#F0F0F0', padding: '1px 6px', borderRadius: 99 }}>{snapshots.length}</span></div>
          <div style={{ display: 'flex', background: '#F3F4F6', borderRadius: 6, padding: 2, gap: 1 }}>{(['all', 'changes', 'clean'] as TFilter[]).map(key => <button key={key} onClick={() => { setFilter(key); setVisibleCount(PAGE_SIZE) }} style={{ padding: '3px 10px', borderRadius: 5, fontSize: 11, fontWeight: 600, background: filter === key ? 'white' : 'transparent', color: filter === key ? '#111827' : '#9CA3AF', border: 'none', cursor: 'pointer', boxShadow: filter === key ? '0 1px 2px rgba(0,0,0,0.08)' : 'none', textTransform: 'capitalize', transition: 'all 0.1s' }}>{key}</button>)}</div>
        </div>
        <div>{filtered.length === 0 ? <div style={{ padding: '28px 14px', textAlign: 'center', color: '#9CA3AF', fontSize: 12 }}>No snapshots match this filter.</div> : <>{groups.map(({ label, items }) => <div key={label}><div style={{ padding: '8px 14px 3px', fontSize: 10, fontWeight: 700, color: '#D1D5DB', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{label}</div>{items.map(snap => <SnapshotRow key={snap.id} snap={snap} alert={alertBySnapshotId[snap.id]} changed={!!alertBySnapshotId[snap.id]} onOpen={() => openModal(alertBySnapshotId[snap.id] || null, snap, alertBySnapshotId[snap.id] ? 'compare' : 'after')} onDownload={() => snap.signedUrl && downloadImage(snap.signedUrl, `snap-${snap.id}.png`)} />)}</div>)}<div style={{ padding: '12px 14px', textAlign: 'center' }}>{hasMore ? <button className="btn-dash-ghost" onClick={() => setVisibleCount(c => c + PAGE_SIZE)} style={{ fontSize: 11 }}>Show more · {filtered.length - visibleCount} remaining</button> : <p style={{ fontSize: 10, color: '#D1D5DB', letterSpacing: '0.06em', textTransform: 'uppercase' }}>End of History</p>}</div></>}
        </div>
      </div>

      <DiffViewerModal isOpen={modalOpen} onClose={() => setModalOpen(false)} beforeUrl={modalAlert?.beforeUrl ?? null} afterUrl={modalAlert?.afterUrl ?? modalSnap?.signedUrl ?? null} diffUrl={modalAlert?.diffUrl ?? null} defaultTab={defaultTab} metadata={{ diffPct: modalAlert?.diff_pct, severity: modalAlert?.severity, timestamp: modalSnap?.taken_at ?? modalAlert?.created_at, pageUrl }} />
    </div>
  )
}

function SnapshotRow({ snap, alert, changed, onOpen, onDownload }: { snap: SnapshotWithUrl; alert: AlertWithUrls | undefined; changed: boolean; onOpen: () => void; onDownload: () => void }) {
  const [hovered, setHovered] = useState(false)
  return <div onClick={onOpen} onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 14px', cursor: 'pointer', borderBottom: '1px solid #F9FAFB', background: hovered ? '#FAFAFA' : 'transparent', transition: 'background 0.1s' }}><div style={{ width: 6, height: 6, borderRadius: '50%', flexShrink: 0, background: changed ? '#EF4444' : '#D1D5DB', boxShadow: changed ? '0 0 0 3px rgba(239,68,68,0.12)' : 'none' }} /><div style={{ width: 64, height: 40, borderRadius: 5, overflow: 'hidden', flexShrink: 0, background: '#F3F4F6', border: '1px solid #E5E7EB' }}>{snap.signedUrl && <img src={snap.signedUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top', display: 'block' }} />}</div><div style={{ flex: 1, minWidth: 0 }}><p style={{ fontSize: 11, fontWeight: 600, color: '#374151', marginBottom: 2 }}>{formatDate(snap.taken_at)}</p><div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>{changed ? <span style={{ fontSize: 10, fontWeight: 700, color: '#EF4444', background: 'rgba(239,68,68,0.08)', padding: '1px 5px', borderRadius: 4 }}>{Number(alert!.diff_pct).toFixed(1)}% changed</span> : <span style={{ fontSize: 10, color: '#9CA3AF' }}>No changes</span>}{snap.file_size_bytes && <span style={{ fontSize: 10, color: '#D1D5DB' }}>· {Math.round(snap.file_size_bytes / 1024)} KB</span>}</div></div><div style={{ display: 'flex', alignItems: 'center', gap: 5, opacity: hovered ? 1 : 0, transition: 'opacity 0.1s' }}>{snap.signedUrl && <button onClick={e => { e.stopPropagation(); onDownload() }} className="btn-dash-ghost" style={{ padding: '3px 7px', fontSize: 10 }} title="Download"><Download size={10} /></button>}<ChevronRight size={12} style={{ color: '#D1D5DB' }} /></div></div>
}
