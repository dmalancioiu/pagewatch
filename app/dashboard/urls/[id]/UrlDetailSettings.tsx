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

        {/* Improved header */}
        <div style={{
          padding: '11px 14px',
          borderBottom: '1px solid #E5E7EB',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          position: 'sticky', top: 0, background: 'white', zIndex: 10,
        }}>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: 12, fontWeight: 800, color: '#0F172A' }}>
              Monitor settings
            </span>
            <span style={{ fontSize: 10, color: '#94A3B8' }}>
              Schedule, capture, and zones
            </span>
          </div>
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

          <InspectorSection label="Schedule" icon={<Clock size={10} />}>
            <div style={{ display: 'flex', background: '#F3F4F6', padding: 2, borderRadius: 7, gap: 1, marginBottom: freq !== 'hourly' ? 10 : 0 }}>
              {FREQ_OPTIONS.map(f => (
                <button key={f.id} onClick={() => setFreq(f.id)} style={{ flex: 1, padding: '5px 0', borderRadius: 5, fontSize: 11, fontWeight: 600, border: 'none', cursor: 'pointer', background: freq === f.id ? 'white' : 'transparent', color: freq === f.id ? '#111827' : '#9CA3AF', boxShadow: freq === f.id ? '0 1px 2px rgba(0,0,0,0.08)' : 'none' }}>
                  {f.label}
                </button>
              ))}
            </div>
            {freq !== 'hourly' && (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: 11, color: '#6B7280' }}>Run hour (UTC)</span>
                <select value={checkHour} onChange={e => setCheckHour(Number(e.target.value))} className="dash-input" style={{ width: 'auto', padding: '4px 8px', fontSize: 11 }}>
                  {Array.from({ length: 24 }, (_, i) => (<option key={i} value={i}>{i}:00</option>))}
                </select>
              </div>
            )}
          </InspectorSection>

          <SectionDivider />

          <InspectorSection label="Capture" icon={<Globe size={10} />}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <p style={{ fontSize: 12, fontWeight: 500, color: '#374151' }}>Full Page Scroll</p>
                <p style={{ fontSize: 10, color: '#9CA3AF', marginTop: 1 }}>Capture entire page height</p>
              </div>
              <button onClick={() => setFullPage(!fullPage)} style={{ position: 'relative', width: 38, height: 22, borderRadius: 99, background: fullPage ? '#2563EB' : '#E5E7EB', border: 'none', cursor: 'pointer' }}>
                <span style={{ position: 'absolute', top: 2, borderRadius: '50%', width: 18, height: 18, background: 'white', left: fullPage ? 18 : 2 }} />
              </button>
            </div>
          </InspectorSection>

        </div>
      </div>

      {latestSnapshotUrl && (
        <ZoneSelectorModal isOpen={zoneModalOpen} onClose={() => setZoneModalOpen(false)} imageUrl={latestSnapshotUrl} zones={zones} onChange={setZones} />
      )}
    </>
  )
}
