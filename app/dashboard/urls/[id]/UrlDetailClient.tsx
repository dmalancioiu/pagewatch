'use client'

import { useState, useTransition } from 'react'
import { acknowledgeAlert } from '@/lib/actions/alerts'
import { DiffViewerModal } from '@/components/dashboard/DiffViewerModal'
import type { DiffTab } from '@/components/dashboard/DiffViewerModal'
import { CheckCircle2, Download, Maximize2, Sparkles, History, ChevronRight } from 'lucide-react'

const SF = '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Helvetica Neue", Arial, sans-serif'

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

interface Props {
  openAlert: AlertWithUrls | null
  snapshots: SnapshotWithUrl[]
  alertBySnapshotId: Record<string, AlertWithUrls>
  pageUrl: string
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
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

/* ── Diff sparkline ── */
function DiffSparkline({ snapshots, alertBySnapshotId }: { snapshots: SnapshotWithUrl[]; alertBySnapshotId: Record<string, AlertWithUrls> }) {
  const data = [...snapshots].reverse()
  if (data.length < 2) return null
  const diffs = data.map(s => alertBySnapshotId[s.id]?.diff_pct ?? 0)
  const max = Math.max(1, ...diffs)
  const H = 32, W = 7, G = 2, total = data.length * (W + G)

  return (
    <div style={{ padding: '10px 20px 12px', borderBottom: '0.5px solid rgba(0,0,0,0.05)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 7 }}>
        <span style={{ fontSize: 9, fontWeight: 700, color: '#AEAEB2', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
          Change Frequency
        </span>
        <span style={{ fontSize: 10, color: '#C7C7CC' }}>{data.length} captures</span>
      </div>
      <div style={{ overflow: 'hidden' }}>
        <svg height={H} style={{ display: 'block', width: '100%' }} viewBox={`0 0 ${total} ${H}`} preserveAspectRatio="none">
          {data.map((s, i) => {
            const d = diffs[i]
            const h = Math.max(2.5, (d / max) * (H - 2))
            return (
              <rect key={s.id} x={i * (W + G)} y={H - h} width={W} height={h} rx={2}
                fill={d > 0 ? '#FF3B30' : '#E5E5EA'} opacity={d > 0 ? 0.8 : 1} />
            )
          })}
        </svg>
      </div>
    </div>
  )
}

type TFilter = 'all' | 'changes' | 'clean'
const PAGE_SIZE = 15

export function UrlDetailClient({ openAlert, snapshots, alertBySnapshotId, pageUrl }: Props) {
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

  return (
    <div style={{ fontFamily: SF, display: 'flex', flexDirection: 'column', gap: 14 }}>

      {/* ── Stats Strip ── */}
      {totalChecks > 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}>
          {[
            { label: 'Checks', value: totalChecks, caption: 'total snapshots', hue: 'neutral' },
            { label: 'Changes', value: changeEvents, caption: 'events', hue: changeEvents > 0 ? 'red' : 'neutral' },
            { label: 'Clean Rate', value: `${cleanRate}%`, caption: 'no drift', hue: cleanRate >= 90 ? 'green' : 'neutral' },
            { label: 'Avg Diff', value: avgDiff ? `${avgDiff}%` : '—', caption: 'when triggered', hue: 'neutral' },
          ].map(stat => (
            <div key={stat.label} style={{
              background: 'white', borderRadius: 14,
              border: '0.5px solid rgba(0,0,0,0.08)',
              boxShadow: '0 1px 6px rgba(0,0,0,0.04)',
              padding: '14px 16px',
            }}>
              <p style={{ fontSize: 10, fontWeight: 700, color: '#AEAEB2', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 8 }}>
                {stat.label}
              </p>
              <p style={{
                fontSize: 26, fontWeight: 700, letterSpacing: '-0.03em', lineHeight: 1, marginBottom: 4,
                color: stat.hue === 'red' ? '#FF3B30' : stat.hue === 'green' ? '#30D158' : '#1D1D1F',
              }}>
                {stat.value}
              </p>
              <p style={{ fontSize: 10, color: '#C7C7CC', letterSpacing: '-0.01em' }}>{stat.caption}</p>
            </div>
          ))}
        </div>
      )}

      {/* ── Active Alert or All Clear ── */}
      {activeAlert ? (
        <div style={{
          background: 'white', borderRadius: 16,
          border: '0.5px solid rgba(255,59,48,0.2)',
          boxShadow: '0 2px 20px rgba(255,59,48,0.05)',
          overflow: 'hidden',
        }}>
          {/* Header row */}
          <div style={{
            padding: '14px 18px',
            borderBottom: '0.5px solid rgba(255,59,48,0.1)',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12,
            background: 'rgba(255,59,48,0.025)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{
                display: 'inline-flex', alignItems: 'center', gap: 5,
                padding: '3px 9px', borderRadius: 99,
                background: 'rgba(255,59,48,0.1)', color: '#FF3B30',
                fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em',
              }}>
                <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#FF3B30', display: 'inline-block' }} />
                Change Detected
              </span>
              <span style={{ fontSize: 11, color: '#AEAEB2', letterSpacing: '-0.01em' }}>
                {formatDate(activeAlert.created_at)}
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 7, flexShrink: 0 }}>
              <button
                onClick={() => startTransition(async () => { await acknowledgeAlert(activeAlert.id); setDismissed(true) })}
                disabled={isPending}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 5,
                  padding: '7px 13px', background: 'white', color: '#6E6E73',
                  borderRadius: 9, fontSize: 11, fontWeight: 600,
                  border: '0.5px solid rgba(0,0,0,0.12)', cursor: 'pointer',
                  letterSpacing: '-0.01em', opacity: isPending ? 0.5 : 1,
                }}
              >
                <CheckCircle2 style={{ width: 11, height: 11, color: '#30D158' }} />
                {isPending ? 'Saving…' : 'Mark resolved'}
              </button>
              <button
                onClick={() => openModal(activeAlert, null, 'compare')}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 5,
                  padding: '7px 13px', background: '#1D1D1F', color: 'white',
                  borderRadius: 9, fontSize: 11, fontWeight: 600, border: 'none', cursor: 'pointer',
                  letterSpacing: '-0.01em', boxShadow: '0 1px 6px rgba(0,0,0,0.18)',
                }}
              >
                <Maximize2 style={{ width: 11, height: 11 }} /> View screenshots
              </button>
            </div>
          </div>

          {/* AI summary — the primary signal */}
          <div style={{ padding: '20px 20px 18px' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
              <div style={{
                width: 28, height: 28, borderRadius: 8, flexShrink: 0, marginTop: 1,
                background: 'rgba(22,163,74,0.08)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <Sparkles style={{ width: 13, height: 13, color: '#16A34A' }} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontSize: 10, fontWeight: 700, color: '#AEAEB2', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 8 }}>
                  What changed
                </p>
                <p style={{ fontSize: 14, color: '#1D1D1F', lineHeight: 1.72, letterSpacing: '-0.012em', fontWeight: 400, margin: 0 }}>
                  {activeAlert.ai_summary ?? 'Visual change detected. Open screenshots to see the diff.'}
                </p>
              </div>
            </div>

            {/* Metadata row */}
            <div style={{
              marginTop: 16, paddingTop: 14,
              borderTop: '0.5px solid rgba(0,0,0,0.06)',
              display: 'flex', alignItems: 'center', gap: 20,
            }}>
              {activeAlert.diff_pct != null && (
                <div>
                  <p style={{ fontSize: 9, fontWeight: 700, color: '#C7C7CC', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 3 }}>Pixels changed</p>
                  <p style={{ fontSize: 20, fontWeight: 700, color: '#FF3B30', letterSpacing: '-0.03em', lineHeight: 1 }}>
                    {Number(activeAlert.diff_pct).toFixed(1)}%
                  </p>
                </div>
              )}
              {activeAlert.severity && (
                <div>
                  <p style={{ fontSize: 9, fontWeight: 700, color: '#C7C7CC', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 3 }}>Severity</p>
                  <p style={{ fontSize: 13, fontWeight: 600, color: '#1D1D1F', letterSpacing: '-0.01em', textTransform: 'capitalize', lineHeight: 1 }}>
                    {activeAlert.severity}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        /* All clear */
        <div style={{
          background: 'white', borderRadius: 14,
          border: '0.5px solid rgba(0,0,0,0.08)',
          boxShadow: '0 1px 6px rgba(0,0,0,0.04)',
          display: 'flex', alignItems: 'center', gap: 14, padding: '14px 18px',
        }}>
          <div style={{
            width: 36, height: 36, borderRadius: 10,
            background: 'rgba(48,209,88,0.1)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
          }}>
            <CheckCircle2 style={{ width: 17, height: 17, color: '#30D158' }} />
          </div>
          <div style={{ flex: 1 }}>
            <p style={{ fontSize: 13, fontWeight: 600, color: '#1D1D1F', letterSpacing: '-0.01em' }}>All Clear</p>
            <p style={{ fontSize: 12, color: '#AEAEB2', marginTop: 2, letterSpacing: '-0.01em' }}>No open alerts — monitor is running normally.</p>
          </div>
          {snapshots[0]?.signedUrl && (
            <button
              onClick={() => openModal(null, snapshots[0], 'after')}
              style={{
                padding: '7px 14px', background: '#F5F5F7', color: '#1D1D1F',
                borderRadius: 9, fontSize: 12, fontWeight: 600,
                border: '0.5px solid rgba(0,0,0,0.1)', cursor: 'pointer',
                letterSpacing: '-0.01em', flexShrink: 0,
              }}
            >
              View Latest
            </button>
          )}
        </div>
      )}

      {/* ── Snapshot History ── */}
      <div style={{
        background: 'white', borderRadius: 16,
        border: '0.5px solid rgba(0,0,0,0.08)',
        boxShadow: '0 1px 6px rgba(0,0,0,0.04)',
        overflow: 'hidden',
      }}>
        {/* Header + filter */}
        <div style={{
          padding: '13px 20px',
          borderBottom: '0.5px solid rgba(0,0,0,0.06)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12,
          background: '#FAFAFA',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <History style={{ width: 14, height: 14, color: '#AEAEB2' }} />
            <span style={{ fontSize: 13, fontWeight: 600, color: '#1D1D1F', letterSpacing: '-0.01em' }}>History</span>
            <span style={{
              fontSize: 10, fontWeight: 700, color: '#6E6E73',
              background: '#F0F0F0', padding: '2px 7px', borderRadius: 99,
            }}>
              {snapshots.length}
            </span>
          </div>

          {/* Segmented filter */}
          <div style={{
            display: 'flex', background: '#EBEBEB', borderRadius: 8,
            padding: 2, gap: 1,
          }}>
            {(['all', 'changes', 'clean'] as TFilter[]).map(key => (
              <button
                key={key}
                onClick={() => { setFilter(key); setVisibleCount(PAGE_SIZE) }}
                style={{
                  padding: '4px 11px', borderRadius: 6,
                  fontSize: 11, fontWeight: 600,
                  background: filter === key ? 'white' : 'transparent',
                  color: filter === key ? '#1D1D1F' : '#8E8E93',
                  border: 'none', cursor: 'pointer',
                  boxShadow: filter === key ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                  textTransform: 'capitalize', letterSpacing: '-0.01em',
                  transition: 'all 0.15s',
                }}
              >
                {key}
              </button>
            ))}
          </div>
        </div>

        {/* Sparkline */}
        <DiffSparkline snapshots={snapshots} alertBySnapshotId={alertBySnapshotId} />

        {/* Timeline rows */}
        <div>
          {filtered.length === 0 ? (
            <div style={{ padding: '32px 20px', textAlign: 'center', color: '#AEAEB2', fontSize: 12 }}>
              No snapshots match this filter.
            </div>
          ) : (
            <>
              {groups.map(({ label, items }) => (
                <div key={label}>
                  <div style={{
                    padding: '10px 20px 4px',
                    fontSize: 10, fontWeight: 700, color: '#C7C7CC',
                    textTransform: 'uppercase', letterSpacing: '0.07em',
                  }}>
                    {label}
                  </div>
                  {items.map(snap => (
                    <SnapshotRow
                      key={snap.id}
                      snap={snap}
                      alert={alertBySnapshotId[snap.id]}
                      changed={!!alertBySnapshotId[snap.id]}
                      onOpen={() => openModal(alertBySnapshotId[snap.id] || null, snap, alertBySnapshotId[snap.id] ? 'compare' : 'after')}
                      onDownload={() => snap.signedUrl && downloadImage(snap.signedUrl, `snap-${snap.id}.png`)}
                    />
                  ))}
                </div>
              ))}

              <div style={{ padding: '14px 20px', textAlign: 'center' }}>
                {hasMore ? (
                  <button
                    onClick={() => setVisibleCount(c => c + PAGE_SIZE)}
                    style={{
                      padding: '7px 18px', background: '#F5F5F7', color: '#6E6E73',
                      borderRadius: 9, fontSize: 12, fontWeight: 600,
                      border: '0.5px solid rgba(0,0,0,0.1)', cursor: 'pointer',
                      letterSpacing: '-0.01em',
                    }}
                  >
                    Show more · {filtered.length - visibleCount} remaining
                  </button>
                ) : (
                  <p style={{ fontSize: 10, color: '#C7C7CC', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
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
  snap: SnapshotWithUrl; alert: AlertWithUrls | undefined
  changed: boolean; onOpen: () => void; onDownload: () => void
}) {
  const [hovered, setHovered] = useState(false)

  return (
    <div
      onClick={onOpen}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'flex', alignItems: 'center', gap: 12,
        padding: '9px 20px', cursor: 'pointer',
        borderBottom: '0.5px solid rgba(0,0,0,0.04)',
        background: hovered ? '#F9F9FB' : 'transparent',
        transition: 'background 0.1s',
        fontFamily: SF,
      }}
    >
      {/* Status dot */}
      <div style={{
        width: 7, height: 7, borderRadius: '50%', flexShrink: 0,
        background: changed ? '#FF3B30' : '#E5E5EA',
        boxShadow: changed ? '0 0 0 3px rgba(255,59,48,0.12)' : 'none',
      }} />

      {/* Thumbnail */}
      <div style={{
        width: 72, height: 44, borderRadius: 7, overflow: 'hidden', flexShrink: 0,
        background: '#F5F5F7', border: '0.5px solid rgba(0,0,0,0.07)',
      }}>
        {snap.signedUrl && (
          <img src={snap.signedUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top', display: 'block' }} />
        )}
      </div>

      {/* Info */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ fontSize: 12, fontWeight: 600, color: '#1D1D1F', letterSpacing: '-0.01em', marginBottom: 3 }}>
          {formatDate(snap.taken_at)}
        </p>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          {changed ? (
            <span style={{
              fontSize: 10, fontWeight: 700, color: '#FF3B30',
              background: 'rgba(255,59,48,0.08)', padding: '1px 6px', borderRadius: 5,
              textTransform: 'uppercase', letterSpacing: '0.04em',
            }}>
              {Number(alert!.diff_pct).toFixed(1)}% changed
            </span>
          ) : (
            <span style={{ fontSize: 11, color: '#AEAEB2', letterSpacing: '-0.01em' }}>No changes</span>
          )}
          {snap.file_size_bytes && (
            <span style={{ fontSize: 10, color: '#D1D1D6', letterSpacing: '-0.01em' }}>
              · {Math.round(snap.file_size_bytes / 1024)} KB
            </span>
          )}
        </div>
      </div>

      {/* Actions */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 6,
        opacity: hovered ? 1 : 0, transition: 'opacity 0.15s',
      }}>
        {snap.signedUrl && (
          <button
            onClick={e => { e.stopPropagation(); onDownload() }}
            style={{
              width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: 'white', border: '0.5px solid rgba(0,0,0,0.1)', borderRadius: 7,
              cursor: 'pointer', flexShrink: 0,
            }}
          >
            <Download style={{ width: 12, height: 12, color: '#6E6E73' }} />
          </button>
        )}
        <ChevronRight style={{ width: 14, height: 14, color: '#C7C7CC', flexShrink: 0 }} />
      </div>
    </div>
  )
}
