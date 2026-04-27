'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Clock, Globe, Trash2, Save, Loader2, AlertCircle, Target, Plus, Edit2 } from 'lucide-react'
import { deleteMonitoredUrl, updateMonitoredUrl } from '@/lib/actions/websites'
import { ZoneSelectorModal } from '@/components/dashboard/ZoneSelectorModal'
import type { CheckFrequency, Zone, ZoneSensitivity } from '@/lib/types/database.types'

const FREQ_OPTIONS: { id: CheckFrequency; label: string }[] = [
  { id: 'hourly', label: 'Hourly' },
  { id: 'daily', label: 'Daily' },
  { id: 'weekly', label: 'Weekly' },
]

const ZONE_COLORS = ['#2563EB', '#16A34A', '#D97706', '#9333EA', '#0891B2', '#DC2626']

function InspectorSection({ label, icon, children, noPad }: {
  label: string
  icon?: React.ReactNode
  children: React.ReactNode
  noPad?: boolean
}) {
  return (
    <div style={{ padding: noPad ? '14px 0' : '14px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 10, padding: noPad ? '0 14px' : undefined }}>
        {icon && <span style={{ color: '#9CA3AF', display: 'flex', alignItems: 'center' }}>{icon}</span>}
        <p className="inspector-label" style={{ margin: 0 }}>{label}</p>
      </div>
      {children}
    </div>
  )
}

function SectionDivider() {
  return <div style={{ height: 1, background: '#F3F4F6' }} />
}

export function UrlDetailSettings({ url, latestSnapshotUrl }: { url: any; latestSnapshotUrl: string | null }) {
  const router = useRouter()
  const [freq, setFreq] = useState<CheckFrequency>(url.check_frequency)
  const [checkHour, setCheckHour] = useState<number>(url.check_hour ?? 9)
  const [fullPage, setFullPage] = useState<boolean>(url.full_page !== false)
  const [zones, setZones] = useState<Zone[]>(() => Array.isArray(url.zones) ? url.zones as Zone[] : [])
  const [isSaving, startSave] = useTransition()
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [zoneModalOpen, setZoneModalOpen] = useState(false)

  // Whole-page instruction (used when no zones defined)
  const [globalInstruction, setGlobalInstruction] = useState<string>(url.watch_description ?? '')

  const isArchive = url.mode === 'archive'
  const hasZones = zones.length > 0

  function updateZone(id: string, patch: Partial<Zone>) {
    setZones(prev => prev.map(z => z.id === id ? { ...z, ...patch } : z))
  }

  function handleSave() {
    startSave(async () => {
      await updateMonitoredUrl(url.id, {
        check_frequency: freq,
        check_hour: freq !== 'hourly' ? checkHour : null,
        full_page: fullPage,
        zones: zones.length > 0 ? zones : null,
        watch_description: zones.length === 0 ? (globalInstruction.trim() || null) : null,
      })
      router.refresh()
    })
  }

  return (
    <>
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100%' }}>

        {/* Sticky header */}
        <div style={{
          padding: '11px 14px',
          borderBottom: '1px solid #E5E7EB',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          position: 'sticky', top: 0, background: 'white', zIndex: 10,
        }}>
          <span style={{ fontSize: 11, fontWeight: 700, color: '#374151' }}>Inspector</span>
          <button
            className="btn-dash-primary"
            onClick={handleSave}
            disabled={isSaving}
            style={{ padding: '5px 12px', fontSize: 11 }}
          >
            {isSaving ? <Loader2 size={10} className="animate-spin" /> : <Save size={10} />}
            {isSaving ? 'Saving…' : 'Save'}
          </button>
        </div>

        <div style={{ flex: 1 }}>

          {/* ── Schedule (monitor-level) ── */}
          <InspectorSection label="Schedule" icon={<Clock size={10} />}>
            <div style={{
              display: 'flex', background: '#F3F4F6', padding: 2,
              borderRadius: 7, gap: 1, marginBottom: freq !== 'hourly' ? 10 : 0,
            }}>
              {FREQ_OPTIONS.map(f => (
                <button
                  key={f.id}
                  onClick={() => setFreq(f.id)}
                  style={{
                    flex: 1, padding: '5px 0', borderRadius: 5,
                    fontSize: 11, fontWeight: 600, border: 'none', cursor: 'pointer',
                    background: freq === f.id ? 'white' : 'transparent',
                    color: freq === f.id ? '#111827' : '#9CA3AF',
                    boxShadow: freq === f.id ? '0 1px 2px rgba(0,0,0,0.08)' : 'none',
                    transition: 'all 0.1s',
                  }}
                >
                  {f.label}
                </button>
              ))}
            </div>
            {freq !== 'hourly' && (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: 11, color: '#6B7280' }}>Run hour (UTC)</span>
                <select
                  value={checkHour}
                  onChange={e => setCheckHour(Number(e.target.value))}
                  className="dash-input"
                  style={{ width: 'auto', padding: '4px 8px', fontSize: 11 }}
                >
                  {Array.from({ length: 24 }, (_, i) => (
                    <option key={i} value={i}>{i}:00</option>
                  ))}
                </select>
              </div>
            )}
          </InspectorSection>

          {!isArchive && (
            <>
              <SectionDivider />

              {/* ── Capture (monitor-level) ── */}
              <InspectorSection label="Capture" icon={<Globe size={10} />}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    <p style={{ fontSize: 12, fontWeight: 500, color: '#374151' }}>Full Page Scroll</p>
                    <p style={{ fontSize: 10, color: '#9CA3AF', marginTop: 1 }}>Capture entire page height</p>
                  </div>
                  <button
                    onClick={() => setFullPage(!fullPage)}
                    style={{
                      position: 'relative', width: 38, height: 22, borderRadius: 99,
                      background: fullPage ? '#2563EB' : '#E5E7EB',
                      border: 'none', cursor: 'pointer',
                      transition: 'background 0.2s', flexShrink: 0,
                    }}
                  >
                    <span style={{
                      position: 'absolute', top: 2, borderRadius: '50%',
                      width: 18, height: 18, background: 'white',
                      left: fullPage ? 18 : 2,
                      transition: 'left 0.18s cubic-bezier(0.34,1.56,0.64,1)',
                      boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
                    }} />
                  </button>
                </div>
              </InspectorSection>

              <SectionDivider />

              {/* ── Focus Zones (zone-level) ── */}
              <InspectorSection label="Focus Zones" icon={<Target size={10} />} noPad>
                <div style={{ padding: '0 14px', display: 'flex', flexDirection: 'column', gap: 8 }}>

                  {/* No zones — whole page with single instruction */}
                  {!hasZones && (
                    <div style={{
                      background: '#F9FAFB', border: '1px solid #E5E7EB',
                      borderRadius: 7, padding: '10px 11px',
                    }}>
                      <p style={{ fontSize: 10, color: '#9CA3AF', marginBottom: 6 }}>
                        Whole page monitored
                      </p>
                      <p style={{ fontSize: 10, fontWeight: 700, color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 5 }}>
                        Watch instruction
                      </p>
                      <textarea
                        rows={2}
                        value={globalInstruction}
                        onChange={e => setGlobalInstruction(e.target.value)}
                        placeholder="e.g. Alert me if pricing changes."
                        className="dash-input"
                        style={{ resize: 'none', padding: '7px 9px', fontSize: 11, lineHeight: 1.5 }}
                      />
                      <p style={{ fontSize: 10, color: '#D1D5DB', marginTop: 5 }}>
                        Claude focuses its analysis on what matters to you.
                      </p>
                    </div>
                  )}

                  {/* Zone cards */}
                  {zones.map((z, i) => (
                    <ZoneCard
                      key={z.id}
                      zone={z}
                      index={i}
                      color={ZONE_COLORS[i % ZONE_COLORS.length]}
                      onChange={patch => updateZone(z.id, patch)}
                    />
                  ))}

                  {/* Add / Edit zones button */}
                  {latestSnapshotUrl ? (
                    <button
                      onClick={() => setZoneModalOpen(true)}
                      className="btn-dash-ghost"
                      style={{ width: '100%', justifyContent: 'center', fontSize: 11, padding: '7px' }}
                    >
                      <Plus size={10} />
                      {hasZones ? 'Edit zones on screenshot' : 'Add focus zones'}
                    </button>
                  ) : (
                    <p style={{ fontSize: 10, color: '#9CA3AF', textAlign: 'center', padding: '4px 0', fontStyle: 'italic' }}>
                      Run a check first to enable zone drawing
                    </p>
                  )}
                </div>
              </InspectorSection>
            </>
          )}

          <SectionDivider />

          {/* ── Danger Zone ── */}
          <InspectorSection label="Danger Zone">
            {!confirmDelete ? (
              <button
                onClick={() => setConfirmDelete(true)}
                style={{
                  width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5,
                  padding: '8px', background: 'rgba(220,38,38,0.05)', color: '#DC2626',
                  borderRadius: 7, fontSize: 11, fontWeight: 600,
                  border: '1px solid rgba(220,38,38,0.18)', cursor: 'pointer',
                }}
              >
                <Trash2 size={10} /> Delete Monitor
              </button>
            ) : (
              <div style={{
                padding: '12px', background: 'rgba(220,38,38,0.03)',
                borderRadius: 7, border: '1px solid rgba(220,38,38,0.18)',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 7 }}>
                  <AlertCircle size={11} style={{ color: '#DC2626' }} />
                  <span style={{ fontSize: 11, fontWeight: 700, color: '#DC2626' }}>Confirm deletion</span>
                </div>
                <p style={{ fontSize: 11, color: '#6B7280', marginBottom: 10, lineHeight: 1.5 }}>
                  Permanently deletes <strong style={{ color: '#111827' }}>{url.name}</strong> and all its snapshots.
                </p>
                <div style={{ display: 'flex', gap: 6 }}>
                  <button
                    onClick={() => deleteMonitoredUrl(url.id).then(() => router.push('/dashboard/urls'))}
                    style={{
                      flex: 1, padding: '7px',
                      background: '#DC2626', color: 'white',
                      borderRadius: 6, fontSize: 11, fontWeight: 700,
                      border: 'none', cursor: 'pointer',
                    }}
                  >
                    Delete
                  </button>
                  <button
                    onClick={() => setConfirmDelete(false)}
                    className="btn-dash-ghost"
                    style={{ flex: 1, padding: '7px', justifyContent: 'center', fontSize: 11 }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </InspectorSection>

        </div>
      </div>

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

/* ── Zone card ── */
function ZoneCard({ zone, index, color, onChange }: {
  zone: Zone
  index: number
  color: string
  onChange: (patch: Partial<Zone>) => void
}) {
  const [expanded, setExpanded] = useState(true)

  const sensitivity = zone.sensitivity ?? 'normal'

  return (
    <div style={{
      background: '#F9FAFB', border: `1px solid ${color}33`,
      borderLeft: `3px solid ${color}`,
      borderRadius: 7, overflow: 'hidden',
    }}>
      {/* Zone header */}
      <div
        style={{
          padding: '8px 10px',
          display: 'flex', alignItems: 'center', gap: 8,
          cursor: 'pointer',
        }}
        onClick={() => setExpanded(e => !e)}
      >
        <span style={{
          width: 8, height: 8, borderRadius: '50%', background: color, flexShrink: 0,
        }} />
        <input
          type="text"
          value={zone.label ?? ''}
          onChange={e => { e.stopPropagation(); onChange({ label: e.target.value }) }}
          onClick={e => e.stopPropagation()}
          placeholder={`Zone ${index + 1}`}
          style={{
            flex: 1, background: 'transparent', border: 'none', outline: 'none',
            fontSize: 12, fontWeight: 600, color: '#374151', cursor: 'text',
          }}
        />
        <Edit2 size={9} style={{ color: '#D1D5DB', flexShrink: 0 }} />
      </div>

      {/* Zone details */}
      {expanded && (
        <div style={{ padding: '0 10px 10px', display: 'flex', flexDirection: 'column', gap: 8 }}>

          {/* Watch instruction */}
          <div>
            <p style={{ fontSize: 10, fontWeight: 700, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 4 }}>
              Watch instruction
            </p>
            <textarea
              rows={2}
              value={zone.instruction ?? ''}
              onChange={e => onChange({ instruction: e.target.value })}
              placeholder={`e.g. Alert if ${zone.label || 'this area'} changes.`}
              className="dash-input"
              style={{ resize: 'none', padding: '6px 8px', fontSize: 11, lineHeight: 1.5 }}
            />
          </div>

          {/* Sensitivity */}
          <div>
            <p style={{ fontSize: 10, fontWeight: 700, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 4 }}>
              Sensitivity
            </p>
            <div style={{ display: 'flex', gap: 4 }}>
              {(['low', 'normal', 'high'] as ZoneSensitivity[]).map(s => (
                <button
                  key={s}
                  onClick={() => onChange({ sensitivity: s })}
                  style={{
                    flex: 1, padding: '4px 0', borderRadius: 5, fontSize: 10, fontWeight: 600,
                    border: `1px solid ${sensitivity === s ? color : '#E5E7EB'}`,
                    background: sensitivity === s ? `${color}12` : 'white',
                    color: sensitivity === s ? color : '#9CA3AF',
                    cursor: 'pointer', textTransform: 'capitalize', transition: 'all 0.1s',
                  }}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
