'use client'

import { useState, useTransition } from 'react'
import { acknowledgeAlert } from '@/lib/actions/alerts'
import { DiffViewerModal } from '@/components/dashboard/DiffViewerModal'
import type { DiffTab } from '@/components/dashboard/DiffViewerModal'
import {
  CheckCircle2, Download, Maximize2, History, ChevronRight,
  AlertTriangle, Target, Image as ImageIcon, Eye, Activity,
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

interface Zone {
  id: string
  x: number
  y: number
  width: number
  height: number
  label?: string
}

interface Props {
  openAlert: AlertWithUrls | null
  snapshots: SnapshotWithUrl[]
  alertBySnapshotId: Record<string, AlertWithUrls>
  pageUrl: string
  zones?: Zone[]
}

const ZONE_COLORS = ['#2563EB', '#16A34A', '#D97706', '#9333EA', '#0891B2', '#DC2626']

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

export function UrlDetailClient({
  openAlert, snapshots, alertBySnapshotId, pageUrl, zones = [],
}: Props) {
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

  const activeAlert = dismissed ? null : openAlert
  const totalChecks = snapshots.length
  const changeEvents = Object.keys(alertBySnapshotId).length
  const cleanRate = totalChecks > 0 ? Math.round(((totalChecks - changeEvents) / totalChecks) * 100) : 100
  const avgDiff = changeEvents > 0
    ? (Object.values(alertBySnapshotId).reduce((s, a) => s + (a.diff_pct ?? 0), 0) / changeEvents).toFixed(1)
    : null

  const filtered = snapshots.filter(s =>
    filter === 'changes' ? !!alertBySnapshotId[s.id]
    : filter === 'clean' ? !alertBySnapshotId[s.id]
    : true
  )
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

      {/* ── Active Alert Banner ── */}
      {activeAlert && (
        <div style={{
          background: 'rgba(254,242,242,0.8)',
          border: '1px solid rgba(220,38,38,0.2)',
          borderRadius: 8,
          padding: '10px 14px',
          display: 'flex', alignItems: 'flex-start', gap: 10,
        }}>
          <AlertTriangle size={13} style={{ color: '#DC2626', flexShrink: 0, marginTop: 1 }} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 4 }}>
              <span style={{ fontSize: 12, fontWeight: 700, color: '#DC2626' }}>Change Detected</span>
              <StatusBadge variant={activeAlert.severity as any ?? 'alert'} />
              {activeAlert.diff_pct != null && (
                <span style={{
                  fontSize: 10, fontWeight: 700, padding: '1px 6px', borderRadius: 4,
                  background: 'rgba(220,38,38,0.1)', color: '#DC2626',
                }}>
                  {Number(activeAlert.diff_pct).toFixed(1)}%
                </span>
              )}
              <span style={{ fontSize: 10, color: '#9CA3AF' }}>{timeAgo(activeAlert.created_at)}</span>
            </div>
            {activeAlert.ai_summary && (
              <p style={{
                fontSize: 12, color: '#374151', lineHeight: 1.6, margin: 0,
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical' as const,
                overflow: 'hidden',
              }}>
                {activeAlert.ai_summary}
              </p>
            )}
          </div>
          <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
            <button
              className="btn-dash-ghost"
              onClick={() => startTransition(async () => {
                await acknowledgeAlert(activeAlert.id)
                setDismissed(true)
              })}
              disabled={isPending}
              style={{ fontSize: 11 }}
            >
              <CheckCircle2 size={10} />
              {isPending ? 'Saving…' : 'Resolve'}
            </button>
            <button
              className="btn-dash-primary"
              onClick={() => openModal(activeAlert, null, 'compare')}
              style={{ padding: '5px 11px', fontSize: 11 }}
            >
              <Maximize2 size={10} />
              View Diff
            </button>
          </div>
        </div>
      )}

      {/* ── Monitor Snapshot Summary ── */}
      {latestSnap ? (
        <div style={{
          background: 'white',
          border: '1px solid #E5E7EB',
          borderRadius: 8,
          overflow: 'hidden',
          boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
        }}>
          <div style={{
            padding: '10px 14px',
            borderBottom: '1px solid #F3F4F6',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            background: '#FAFAFA',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
              <ImageIcon size={13} style={{ color: '#9CA3AF' }} />
              <span style={{ fontSize: 12, fontWeight: 600, color: '#374151' }}>Latest Capture</span>
              <span style={{ fontSize: 10, color: '#9CA3AF' }}>{formatDate(latestSnap.taken_at)}</span>
              {zones.length > 0 && (
                <span style={{
                  fontSize: 9, fontWeight: 700, padding: '1px 5px', borderRadius: 3,
                  background: 'rgba(37,99,235,0.08)', color: '#2563EB',
                  border: '1px solid rgba(37,99,235,0.18)',
                }}>
                  {zones.length} watched zone{zones.length !== 1 ? 's' : ''}
                </span>
              )}
            </div>
            <div style={{ display: 'flex', gap: 6 }}>
              <button
                className="btn-dash-ghost"
                onClick={() => openModal(openAlert, latestSnap, openAlert ? 'compare' : 'after')}
                style={{ padding: '4px 9px', fontSize: 11 }}
              >
                <Maximize2 size={10} /> Open capture
              </button>
              {latestSnap.signedUrl && (
                <button
                  className="btn-dash-ghost"
                  onClick={() => downloadImage(latestSnap.signedUrl!, `snap-${latestSnap.id}.png`)}
                  style={{ padding: '4px 9px', fontSize: 11 }}
                  title="Download screenshot"
                >
                  <Download size={10} />
                </button>
              )}
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr', gap: 0, minHeight: 156 }}>
            {/* Compact preview, intentionally not the main surface */}
            <button
              onClick={() => openModal(openAlert, latestSnap, openAlert ? 'compare' : 'after')}
              style={{
                border: 'none', borderRight: '1px solid #F3F4F6',
                background: '#F8FAFC', padding: 14, cursor: 'pointer', textAlign: 'left',
                display: 'flex', flexDirection: 'column', gap: 8,
              }}
            >
              <div style={{
                width: '100%', height: 94, borderRadius: 7,
                overflow: 'hidden', background: '#EEF2F7', border: '1px solid #E5E7EB',
                position: 'relative',
              }}>
                {latestSnap.signedUrl ? (
                  <img
                    src={latestSnap.signedUrl}
                    alt="Latest capture preview"
                    style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top', display: 'block' }}
                  />
                ) : (
                  <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9CA3AF' }}>
                    <ImageIcon size={16} />
                  </div>
                )}
                <div style={{
                  position: 'absolute', inset: 0,
                  background: 'linear-gradient(to bottom, transparent 40%, rgba(15,23,42,0.42))',
                }} />
                <span style={{
                  position: 'absolute', right: 7, bottom: 6,
                  display: 'inline-flex', alignItems: 'center', gap: 4,
                  fontSize: 10, color: 'white', fontWeight: 700,
                }}>
                  <Eye size={10} /> View
                </span>
              </div>
              <p style={{ fontSize: 10, color: '#9CA3AF', lineHeight: 1.45 }}>
                Preview only. Open the capture or use the zone modal for accurate positioning.
              </p>
            </button>

            {/* Monitor state */}
            <div style={{ padding: 16, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: 14 }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                  <div style={{
                    width: 28, height: 28, borderRadius: 8,
                    background: zones.length > 0 ? 'rgba(37,99,235,0.08)' : '#F3F4F6',
                    color: zones.length > 0 ? '#2563EB' : '#9CA3AF',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    border: zones.length > 0 ? '1px solid rgba(37,99,235,0.18)' : '1px solid #E5E7EB',
                  }}>
                    <Target size={14} />
                  </div>
                  <div>
                    <p style={{ fontSize: 13, fontWeight: 700, color: '#111827', margin: 0 }}>
                      {zones.length > 0 ? 'Watching selected zones' : 'Watching whole page'}
                    </p>
                    <p style={{ fontSize: 11, color: '#9CA3AF', marginTop: 2 }}>
                      {zones.length > 0
                        ? 'Zone drawing stays in the focused selector modal so this page stays stable.'
                        : 'Add focus zones from the inspector to reduce layout noise.'}
                    </p>
                  </div>
                </div>

                {zones.length > 0 ? (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                    {zones.slice(0, 6).map((z, i) => {
                      const color = ZONE_COLORS[i % ZONE_COLORS.length]
                      return (
                        <span key={z.id} style={{
                          display: 'inline-flex', alignItems: 'center', gap: 5,
                          padding: '4px 8px', borderRadius: 99,
                          fontSize: 11, fontWeight: 600,
                          color, background: `${color}10`, border: `1px solid ${color}24`,
                        }}>
                          <span style={{ width: 6, height: 6, borderRadius: '50%', background: color }} />
                          {z.label || `Zone ${i + 1}`}
                        </span>
                      )
                    })}
                    {zones.length > 6 && (
                      <span style={{ fontSize: 11, color: '#9CA3AF', padding: '4px 2px' }}>+{zones.length - 6} more</span>
                    )}
                  </div>
                ) : (
                  <p style={{ fontSize: 11, color: '#6B7280', lineHeight: 1.6, maxWidth: 520 }}>
                    Whole-page monitoring is useful for broad layout changes, but focus zones are better for prices, tables, status cards, or time-sensitive elements.
                  </p>
                )}
              </div>

              <div style={{
                display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))',
                border: '1px solid #F3F4F6', borderRadius: 8, overflow: 'hidden',
              }}>
                {[
                  { label: 'Checks', value: totalChecks },
                  { label: 'Changes', value: changeEvents, color: changeEvents > 0 ? '#EF4444' : undefined },
                  { label: 'Clean Rate', value: `${cleanRate}%`, color: cleanRate >= 90 ? '#16A34A' : undefined },
                  { label: 'Latest Diff', value: latestAlert?.diff_pct != null ? `${Number(latestAlert.diff_pct).toFixed(1)}%` : '—' },
                ].map((stat, i) => (
                  <div key={stat.label} style={{
                    padding: '9px 10px', background: i % 2 === 0 ? '#FFFFFF' : '#FAFAFA',
                    borderLeft: i > 0 ? '1px solid #F3F4F6' : undefined,
                  }}>
                    <p style={{ fontSize: 9, color: '#9CA3AF', marginBottom: 3, textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 700 }}>
                      {stat.label}
                    </p>
                    <p style={{ fontSize: 16, fontWeight: 750, color: stat.color ?? '#111827', lineHeight: 1 }}>
                      {stat.value}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {!activeAlert && (
            <div style={{
              padding: '8px 14px',
              borderTop: '1px solid #F3F4F6',
              display: 'flex', alignItems: 'center', gap: 6,
            }}>
              <CheckCircle2 size={11} style={{ color: '#16A34A' }} />
              <span style={{ fontSize: 11, color: '#6B7280' }}>No open alerts — monitor running normally</span>
            </div>
          )}
        </div>
      ) : (
        <div style={{
          background: 'white', border: '1px solid #E5E7EB', borderRadius: 8,
          padding: '40px 24px', textAlign: 'center',
        }}>
          <p style={{ fontSize: 13, color: '#9CA3AF' }}>No screenshots yet. Run a check to capture the first snapshot.</p>
        </div>
      )}

      {/* ── Snapshot History ── */}
      <div style={{
        background: 'white',
        border: '1px solid #E5E7EB',
        borderRadius: 8,
        overflow: 'hidden',
      }}>
        {/* Header + filter */}
        <div style={{
          padding: '10px 14px',
          borderBottom: '1px solid #F3F4F6',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12,
          background: '#FAFAFA',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
            <History size={13} style={{ color: '#9CA3AF' }} />
            <span style={{ fontSize: 12, fontWeight: 600, color: '#374151' }}>History</span>
            <span style={{
              fontSize: 10, fontWeight: 700, color: '#6B7280',
              background: '#F0F0F0', padding: '1px 6px', borderRadius: 99,
            }}>
              {snapshots.length}
            </span>
          </div>

          <div style={{
            display: 'flex', background: '#F3F4F6', borderRadius: 6,
            padding: 2, gap: 1,
          }}>
            {(['all', 'changes', 'clean'] as TFilter[]).map(key => (
              <button
                key={key}
                onClick={() => { setFilter(key); setVisibleCount(PAGE_SIZE) }}
                style={{
                  padding: '3px 10px', borderRadius: 5,
                  fontSize: 11, fontWeight: 600,
                  background: filter === key ? 'white' : 'transparent',
                  color: filter === key ? '#111827' : '#9CA3AF',
                  border: 'none', cursor: 'pointer',
                  boxShadow: filter === key ? '0 1px 2px rgba(0,0,0,0.08)' : 'none',
                  textTransform: 'capitalize',
                  transition: 'all 0.1s',
                }}
              >
                {key}
              </button>
            ))}
          </div>
        </div>

        {/* Timeline rows */}
        <div>
          {filtered.length === 0 ? (
            <div style={{ padding: '28px 14px', textAlign: 'center', color: '#9CA3AF', fontSize: 12 }}>
              No snapshots match this filter.
            </div>
          ) : (
            <>
              {groups.map(({ label, items }) => (
                <div key={label}>
                  <div style={{
                    padding: '8px 14px 3px',
                    fontSize: 10, fontWeight: 700, color: '#D1D5DB',
                    textTransform: 'uppercase', letterSpacing: '0.06em',
                  }}>
                    {label}
                  </div>
                  {items.map(snap => (
                    <SnapshotRow
                      key={snap.id}
                      snap={snap}
                      alert={alertBySnapshotId[snap.id]}
                      changed={!!alertBySnapshotId[snap.id]}
                      onOpen={() => openModal(
                        alertBySnapshotId[snap.id] || null,
                        snap,
                        alertBySnapshotId[snap.id] ? 'compare' : 'after'
                      )}
                      onDownload={() => snap.signedUrl && downloadImage(snap.signedUrl, `snap-${snap.id}.png`)}
                    />
                  ))}
                </div>
              ))}

              <div style={{ padding: '12px 14px', textAlign: 'center' }}>
                {hasMore ? (
                  <button
                    className="btn-dash-ghost"
                    onClick={() => setVisibleCount(c => c + PAGE_SIZE)}
                    style={{ fontSize: 11 }}
                  >
                    Show more · {filtered.length - visibleCount} remaining
                  </button>
                ) : (
                  <p style={{ fontSize: 10, color: '#D1D5DB', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                    End of History
                  </p>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      <DiffViewerModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        beforeUrl={modalAlert?.beforeUrl ?? null}
        afterUrl={modalAlert?.afterUrl ?? modalSnap?.signedUrl ?? null}
        diffUrl={modalAlert?.diffUrl ?? null}
        defaultTab={defaultTab}
        metadata={{
          diffPct: modalAlert?.diff_pct,
          severity: modalAlert?.severity,
          timestamp: modalSnap?.taken_at ?? modalAlert?.created_at,
          pageUrl,
        }}
      />
    </div>
  )
}

function SnapshotRow({ snap, alert, changed, onOpen, onDownload }: {
  snap: SnapshotWithUrl
  alert: AlertWithUrls | undefined
  changed: boolean
  onOpen: () => void
  onDownload: () => void
}) {
  const [hovered, setHovered] = useState(false)

  return (
    <div
      onClick={onOpen}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'flex', alignItems: 'center', gap: 10,
        padding: '8px 14px', cursor: 'pointer',
        borderBottom: '1px solid #F9FAFB',
        background: hovered ? '#FAFAFA' : 'transparent',
        transition: 'background 0.1s',
      }}
    >
      <div style={{
        width: 6, height: 6, borderRadius: '50%', flexShrink: 0,
        background: changed ? '#EF4444' : '#D1D5DB',
        boxShadow: changed ? '0 0 0 3px rgba(239,68,68,0.12)' : 'none',
      }} />

      <div style={{
        width: 64, height: 40, borderRadius: 5, overflow: 'hidden', flexShrink: 0,
        background: '#F3F4F6', border: '1px solid #E5E7EB',
      }}>
        {snap.signedUrl && (
          <img
            src={snap.signedUrl}
            alt=""
            style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top', display: 'block' }}
          />
        )}
      </div>

      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ fontSize: 11, fontWeight: 600, color: '#374151', marginBottom: 2 }}>
          {formatDate(snap.taken_at)}
        </p>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          {changed ? (
            <span style={{
              fontSize: 10, fontWeight: 700, color: '#EF4444',
              background: 'rgba(239,68,68,0.08)', padding: '1px 5px', borderRadius: 4,
            }}>
              {Number(alert!.diff_pct).toFixed(1)}% changed
            </span>
          ) : (
            <span style={{ fontSize: 10, color: '#9CA3AF' }}>No changes</span>
          )}
          {snap.file_size_bytes && (
            <span style={{ fontSize: 10, color: '#D1D5DB' }}>
              · {Math.round(snap.file_size_bytes / 1024)} KB
            </span>
          )}
        </div>
      </div>

      <div style={{
        display: 'flex', alignItems: 'center', gap: 5,
        opacity: hovered ? 1 : 0, transition: 'opacity 0.1s',
      }}>
        {snap.signedUrl && (
          <button
            onClick={e => { e.stopPropagation(); onDownload() }}
            className="btn-dash-ghost"
            style={{ padding: '3px 7px', fontSize: 10 }}
            title="Download"
          >
            <Download size={10} />
          </button>
        )}
        <ChevronRight size={12} style={{ color: '#D1D5DB' }} />
      </div>
    </div>
  )
}
