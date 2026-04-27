'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Settings2, Clock, Globe, Play, Pause, Trash2, Save, Loader2, Sparkles, Activity, AlertCircle, Target } from 'lucide-react'
import { deleteMonitoredUrl, pauseMonitoredUrl, updateMonitoredUrl } from '@/lib/actions/websites'
import { triggerManualRun } from '@/lib/actions/run-now'
import { ZoneSelectorModal } from '@/components/dashboard/ZoneSelectorModal'
import type { CheckFrequency, Zone } from '@/lib/types/database.types'

const SF = '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Helvetica Neue", Arial, sans-serif'

const FREQ_OPTIONS: { id: CheckFrequency; label: string }[] = [
  { id: 'hourly', label: 'Hourly' },
  { id: 'daily', label: 'Daily' },
  { id: 'weekly', label: 'Weekly' },
]

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p style={{
      fontSize: 10, fontWeight: 700, color: '#AEAEB2',
      textTransform: 'uppercase', letterSpacing: '0.08em',
      marginBottom: 10,
    }}>
      {children}
    </p>
  )
}

function Divider() {
  return <div style={{ height: '0.5px', background: 'rgba(0,0,0,0.06)', margin: '2px 0' }} />
}

export function UrlDetailSettings({ url, latestSnapshotUrl }: { url: any; latestSnapshotUrl: string | null }) {
  const router = useRouter()
  const [freq, setFreq] = useState<CheckFrequency>(url.check_frequency)
  const [checkHour, setCheckHour] = useState<number>(url.check_hour ?? 9)
  const [description, setDescription] = useState<string>(url.watch_description ?? '')
  const [fullPage, setFullPage] = useState<boolean>(url.full_page !== false)
  const [zones, setZones] = useState<Zone[]>(() => Array.isArray(url.zones) ? url.zones as Zone[] : [])
  const [paused, setPaused] = useState(!url.is_active)
  const [runState, setRunState] = useState<'idle' | 'running' | 'done'>('idle')
  const [isSaving, startSave] = useTransition()
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [zoneModalOpen, setZoneModalOpen] = useState(false)

  const isArchive = url.mode === 'archive'

  function handleSave() {
    startSave(async () => {
      await updateMonitoredUrl(url.id, {
        check_frequency: freq,
        check_hour: freq !== 'hourly' ? checkHour : null,
        watch_description: description.trim() || null,
        full_page: fullPage,
        zones: zones.length > 0 ? zones : null,
      })
      router.refresh()
    })
  }

  async function handleRunNow() {
    setRunState('running')
    try {
      await triggerManualRun(url.id)
      setRunState('done')
      setTimeout(() => setRunState('idle'), 3000)
      router.refresh()
    } catch {
      setRunState('idle')
    }
  }

  return (
    <>
      <div style={{
        background: 'white', borderRadius: 16,
        border: '0.5px solid rgba(0,0,0,0.08)',
        boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
        overflow: 'hidden',
        fontFamily: SF,
      }}>

        {/* Header */}
        <div style={{
          padding: '12px 16px',
          borderBottom: '0.5px solid rgba(0,0,0,0.06)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          background: '#FAFAFA',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: 12, fontWeight: 600, color: '#1D1D1F', letterSpacing: '-0.01em' }}>
            <Settings2 style={{ width: 13, height: 13, color: '#AEAEB2' }} />
            Inspector
          </div>
          <button
            onClick={handleSave}
            disabled={isSaving}
            style={{
              display: 'flex', alignItems: 'center', gap: 5,
              padding: '6px 14px', background: '#16A34A', color: 'white',
              borderRadius: 8, fontSize: 12, fontWeight: 600, border: 'none', cursor: 'pointer',
              opacity: isSaving ? 0.6 : 1,
              boxShadow: '0 1px 4px rgba(22,163,74,0.3)',
              letterSpacing: '-0.01em',
            }}
          >
            {isSaving ? <Loader2 style={{ width: 11, height: 11 }} className="animate-spin" /> : <Save style={{ width: 11, height: 11 }} />}
            Save
          </button>
        </div>

        <div style={{ padding: '18px 16px', display: 'flex', flexDirection: 'column', gap: 22 }}>

          {/* Quick Actions */}
          <section>
            <SectionLabel>Quick Actions</SectionLabel>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              <button
                onClick={handleRunNow}
                disabled={runState === 'running' || paused}
                style={{
                  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
                  padding: '12px 8px', borderRadius: 12,
                  background: '#F5F5F7', border: '0.5px solid rgba(0,0,0,0.08)',
                  cursor: (paused || runState === 'running') ? 'not-allowed' : 'pointer',
                  color: '#1D1D1F', opacity: (paused || runState === 'running') ? 0.4 : 1,
                  transition: 'background 0.15s',
                  fontFamily: SF,
                }}
              >
                {runState === 'running'
                  ? <Loader2 style={{ width: 16, height: 16, color: '#16A34A' }} className="animate-spin" />
                  : <Activity style={{ width: 16, height: 16, color: '#16A34A' }} />
                }
                <span style={{ fontSize: 11, fontWeight: 600, color: '#1D1D1F', letterSpacing: '-0.01em' }}>
                  {runState === 'done' ? 'Queued ✓' : 'Run Now'}
                </span>
              </button>

              <button
                onClick={() => {
                  const next = !paused
                  setPaused(next)
                  pauseMonitoredUrl(url.id, next).then(() => router.refresh())
                }}
                style={{
                  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
                  padding: '12px 8px', borderRadius: 12,
                  background: '#F5F5F7', border: '0.5px solid rgba(0,0,0,0.08)',
                  cursor: 'pointer', color: '#1D1D1F',
                  transition: 'background 0.15s',
                  fontFamily: SF,
                }}
              >
                {paused
                  ? <Play style={{ width: 16, height: 16, color: '#30D158' }} />
                  : <Pause style={{ width: 16, height: 16, color: '#FF9500' }} />
                }
                <span style={{ fontSize: 11, fontWeight: 600, color: '#1D1D1F', letterSpacing: '-0.01em' }}>
                  {paused ? 'Resume' : 'Pause'}
                </span>
              </button>
            </div>
          </section>

          <Divider />

          {/* Schedule */}
          <section>
            <SectionLabel>
              <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                <Clock style={{ width: 10, height: 10 }} /> Schedule
              </span>
            </SectionLabel>

            <div style={{ display: 'flex', background: '#EBEBEB', padding: 2, borderRadius: 9, gap: 1, marginBottom: freq !== 'hourly' ? 12 : 0 }}>
              {FREQ_OPTIONS.map(f => (
                <button
                  key={f.id}
                  onClick={() => setFreq(f.id)}
                  style={{
                    flex: 1, padding: '6px 0', borderRadius: 7,
                    fontSize: 12, fontWeight: 600, border: 'none', cursor: 'pointer',
                    background: freq === f.id ? 'white' : 'transparent',
                    color: freq === f.id ? '#1D1D1F' : '#8E8E93',
                    boxShadow: freq === f.id ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                    letterSpacing: '-0.01em',
                    transition: 'all 0.15s',
                    fontFamily: SF,
                  }}
                >
                  {f.label}
                </button>
              ))}
            </div>

            {freq !== 'hourly' && (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: 12, color: '#6E6E73', letterSpacing: '-0.01em' }}>Run hour (UTC)</span>
                <select
                  value={checkHour}
                  onChange={e => setCheckHour(Number(e.target.value))}
                  style={{
                    fontSize: 12, color: '#1D1D1F', background: '#F5F5F7',
                    border: '0.5px solid rgba(0,0,0,0.1)', borderRadius: 7,
                    padding: '5px 10px', outline: 'none', fontFamily: SF,
                  }}
                >
                  {Array.from({ length: 24 }, (_, i) => <option key={i} value={i}>{i}:00</option>)}
                </select>
              </div>
            )}
          </section>

          {!isArchive && (
            <>
              <Divider />

              {/* Capture Rules */}
              <section>
                <SectionLabel>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                    <Globe style={{ width: 10, height: 10 }} /> Capture Rules
                  </span>
                </SectionLabel>

                {/* Full page toggle */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
                  <div>
                    <p style={{ fontSize: 13, fontWeight: 500, color: '#1D1D1F', letterSpacing: '-0.01em' }}>Full Page Scroll</p>
                    <p style={{ fontSize: 11, color: '#AEAEB2', marginTop: 2 }}>Capture entire page, not just viewport</p>
                  </div>
                  <button
                    onClick={() => setFullPage(!fullPage)}
                    style={{
                      position: 'relative', width: 42, height: 24, borderRadius: 99,
                      background: fullPage ? '#30D158' : '#E5E5EA',
                      border: 'none', cursor: 'pointer',
                      transition: 'background 0.2s', flexShrink: 0,
                      boxShadow: fullPage ? '0 0 0 0.5px rgba(48,209,88,0.3)' : 'none',
                    }}
                  >
                    <span style={{
                      position: 'absolute', top: 2.5, borderRadius: '50%',
                      width: 19, height: 19, background: 'white',
                      left: fullPage ? 20.5 : 2.5,
                      transition: 'left 0.18s cubic-bezier(0.34,1.56,0.64,1)',
                      boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
                    }} />
                  </button>
                </div>

                {/* Focus Zones — modal trigger */}
                <div style={{
                  background: '#F5F5F7', borderRadius: 12,
                  border: '0.5px solid rgba(0,0,0,0.07)',
                  overflow: 'hidden',
                }}>
                  {/* Zone preview header */}
                  <div style={{
                    padding: '12px 14px',
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{
                        width: 28, height: 28, borderRadius: 8,
                        background: zones.length > 0 ? 'rgba(22,163,74,0.1)' : 'rgba(0,0,0,0.05)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}>
                        <Target style={{ width: 13, height: 13, color: zones.length > 0 ? '#16A34A' : '#AEAEB2' }} />
                      </div>
                      <div>
                        <p style={{ fontSize: 12, fontWeight: 600, color: '#1D1D1F', letterSpacing: '-0.01em' }}>
                          Focus Zones
                        </p>
                        <p style={{ fontSize: 10, color: '#AEAEB2', marginTop: 1 }}>
                          {zones.length > 0 ? `${zones.length} zone${zones.length !== 1 ? 's' : ''} defined` : 'Whole page monitored'}
                        </p>
                      </div>
                    </div>

                    {latestSnapshotUrl ? (
                      <button
                        onClick={() => setZoneModalOpen(true)}
                        style={{
                          padding: '6px 13px',
                          background: '#16A34A', color: 'white',
                          border: 'none', borderRadius: 8,
                          fontSize: 12, fontWeight: 600, cursor: 'pointer',
                          letterSpacing: '-0.01em',
                          boxShadow: '0 1px 4px rgba(22,163,74,0.3)',
                          fontFamily: SF,
                        }}
                      >
                        {zones.length > 0 ? 'Edit Zones' : 'Add Zones'}
                      </button>
                    ) : (
                      <span style={{ fontSize: 10, color: '#AEAEB2', fontStyle: 'italic' }}>
                        Run a check first
                      </span>
                    )}
                  </div>

                  {/* Zone chips preview */}
                  {zones.length > 0 && (
                    <div style={{
                      padding: '0 14px 12px',
                      display: 'flex', flexWrap: 'wrap', gap: 5,
                    }}>
                      {zones.map((z, i) => {
                        const colors = ['#16A34A', '#30D158', '#FF9500', '#AF52DE', '#32ADE6', '#FF3B30']
                        const c = colors[i % colors.length]
                        return (
                          <span key={z.id} style={{
                            display: 'inline-flex', alignItems: 'center', gap: 5,
                            padding: '3px 9px', borderRadius: 99,
                            background: 'white', border: `0.5px solid ${c}44`,
                            fontSize: 11, fontWeight: 600, color: '#1D1D1F',
                            boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
                          }}>
                            <span style={{ width: 7, height: 7, borderRadius: '50%', background: c, flexShrink: 0 }} />
                            {z.label?.trim() || `Zone ${i + 1}`}
                          </span>
                        )
                      })}
                    </div>
                  )}

                  {/* Screenshot mini-preview (readonly) */}
                  {latestSnapshotUrl && zones.length > 0 && (
                    <div
                      onClick={() => setZoneModalOpen(true)}
                      style={{ cursor: 'pointer', borderTop: '0.5px solid rgba(0,0,0,0.06)', overflow: 'hidden', maxHeight: 100 }}
                    >
                      <div style={{ position: 'relative' }}>
                        <img
                          src={latestSnapshotUrl}
                          alt="Preview"
                          style={{ width: '100%', display: 'block', objectFit: 'cover', objectPosition: 'top', maxHeight: 100 }}
                        />
                        <div style={{
                          position: 'absolute', inset: 0,
                          background: 'rgba(0,0,0,0.12)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}>
                          <span style={{
                            fontSize: 11, fontWeight: 600, color: 'white',
                            background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)',
                            padding: '4px 10px', borderRadius: 7,
                          }}>
                            Click to edit zones
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </section>

              <Divider />

              {/* AI Prompt */}
              <section>
                <SectionLabel>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                    <Sparkles style={{ width: 10, height: 10 }} /> AI Alert Prompt
                  </span>
                </SectionLabel>
                <textarea
                  rows={3}
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  placeholder="e.g. Alert me only if the pricing numbers change."
                  style={{
                    width: '100%', fontSize: 12, padding: '10px 12px',
                    background: '#F5F5F7', border: '0.5px solid rgba(0,0,0,0.08)', borderRadius: 10,
                    resize: 'none', outline: 'none', color: '#1D1D1F', lineHeight: 1.6,
                    fontFamily: SF, boxSizing: 'border-box', letterSpacing: '-0.01em',
                  }}
                />
                <p style={{ fontSize: 10, color: '#AEAEB2', marginTop: 7, lineHeight: 1.5, letterSpacing: '-0.01em' }}>
                  Claude will focus its analysis on what matters to you.
                </p>
              </section>
            </>
          )}

          <Divider />

          {/* Delete */}
          <section>
            {!confirmDelete ? (
              <button
                onClick={() => setConfirmDelete(true)}
                style={{
                  width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                  padding: '9px', background: 'rgba(255,59,48,0.06)', color: '#FF3B30',
                  borderRadius: 10, fontSize: 12, fontWeight: 600,
                  border: '0.5px solid rgba(255,59,48,0.15)', cursor: 'pointer',
                  letterSpacing: '-0.01em', fontFamily: SF,
                }}
              >
                <Trash2 style={{ width: 12, height: 12 }} /> Delete Monitor
              </button>
            ) : (
              <div style={{
                padding: '14px', background: 'rgba(255,59,48,0.04)',
                borderRadius: 12, border: '0.5px solid rgba(255,59,48,0.18)',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
                  <AlertCircle style={{ width: 13, height: 13, color: '#FF3B30' }} />
                  <span style={{ fontSize: 12, fontWeight: 700, color: '#FF3B30', letterSpacing: '-0.01em' }}>
                    Confirm deletion
                  </span>
                </div>
                <p style={{ fontSize: 12, color: '#6E6E73', marginBottom: 12, letterSpacing: '-0.01em', lineHeight: 1.5 }}>
                  Permanently deletes <strong style={{ color: '#1D1D1F' }}>{url.name}</strong> and all its snapshots. This cannot be undone.
                </p>
                <div style={{ display: 'flex', gap: 7 }}>
                  <button
                    onClick={() => deleteMonitoredUrl(url.id).then(() => router.push('/dashboard/urls'))}
                    style={{
                      flex: 1, padding: '8px',
                      background: '#FF3B30', color: 'white',
                      borderRadius: 9, fontSize: 12, fontWeight: 700,
                      border: 'none', cursor: 'pointer', letterSpacing: '-0.01em',
                      fontFamily: SF,
                    }}
                  >
                    Delete
                  </button>
                  <button
                    onClick={() => setConfirmDelete(false)}
                    style={{
                      flex: 1, padding: '8px',
                      background: 'white', color: '#1D1D1F',
                      borderRadius: 9, fontSize: 12, fontWeight: 600,
                      border: '0.5px solid rgba(0,0,0,0.12)', cursor: 'pointer',
                      letterSpacing: '-0.01em', fontFamily: SF,
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </section>

        </div>
      </div>

      {/* Zone selector modal */}
      {latestSnapshotUrl && (
        <ZoneSelectorModal
          isOpen={zoneModalOpen}
          onClose={() => setZoneModalOpen(false)}
          imageUrl={latestSnapshotUrl}
          zones={zones}
          onChange={setZones}
        />
      )}
    </>
  )
}
