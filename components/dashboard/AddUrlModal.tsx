'use client'

import { useState, useTransition } from 'react'
import { X, ArrowRight, Check, Clock, Eye, Archive, Globe, Sparkles, ShieldCheck } from 'lucide-react'
import { addMonitoredUrls } from '@/lib/actions/websites'
import type { CheckFrequency, MonitoredUrlMode } from '@/lib/types/database.types'

interface AddUrlModalProps {
  workspaceId: string
  onClose: () => void
  onCreated?: (urlId: string) => void
}

function deriveName(raw: string): string {
  try {
    const full = raw.startsWith('http') ? raw : `https://${raw}`
    const { hostname, pathname } = new URL(full)
    const path = pathname.replace(/\/$/, '')
    return path ? `${hostname}${path}` : hostname
  } catch { return raw }
}

function getDomain(raw: string): string {
  try {
    const full = raw.startsWith('http') ? raw : `https://${raw}`
    return new URL(full).hostname
  } catch { return '' }
}

function faviconUrl(raw: string): string {
  const domain = getDomain(raw)
  if (!domain) return ''
  return `https://www.google.com/s2/favicons?sz=32&domain=${domain}`
}

const SCHEDULES: { id: CheckFrequency; label: string; sub: string }[] = [
  { id: 'hourly', label: 'Hourly', sub: 'Critical pages' },
  { id: 'daily', label: 'Daily', sub: 'Recommended' },
  { id: 'weekly', label: 'Weekly', sub: 'Stable pages' },
]

function hourLabel(h: number): string {
  if (h === 0) return '12:00 AM'
  if (h === 12) return '12:00 PM'
  return h < 12 ? `${h}:00 AM` : `${h - 12}:00 PM`
}

export function AddUrlModal({ workspaceId, onClose, onCreated }: AddUrlModalProps) {
  const [url, setUrl] = useState('')
  const [mode, setMode] = useState<MonitoredUrlMode>('watch')
  const [freq, setFreq] = useState<CheckFrequency>('daily')
  const [checkHour, setCheckHour] = useState<number>(9)
  const [description, setDescription] = useState('')
  const [fullPage, setFullPage] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isPending, start] = useTransition()

  const domain = getDomain(url)
  const favicon = url.trim() ? faviconUrl(url) : ''
  const derivedName = url ? deriveName(url) : ''
  const isWatch = mode === 'watch'
  const showTimePicker = freq === 'daily' || freq === 'weekly'

  function handleSubmit() {
    if (!url.trim()) return
    setError(null)
    start(async () => {
      try {
        const res = await addMonitoredUrls({ urls: [{
          url,
          name: derivedName,
          check_frequency: freq,
          check_hour: showTimePicker ? checkHour : null,
          threshold_pct: 5,
          watch_description: isWatch && description.trim() ? description.trim() : null,
          full_page: fullPage,
          mode,
        }] })
        if (!res.ok) throw new Error(res.message)
        const newId = res.data[0]?.id
        if (newId && onCreated) onCreated(newId)
        else onClose()
      } catch (err: any) {
        setError(err?.message ?? 'Failed to add URL')
      }
    })
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(15,23,42,0.42)', backdropFilter: 'blur(14px)' }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div style={{
        width: '100%', maxWidth: 620, maxHeight: '90vh', overflow: 'hidden',
        background: '#FFFFFF', borderRadius: 18,
        border: '1px solid rgba(15,23,42,0.08)',
        boxShadow: '0 34px 100px rgba(15,23,42,0.22), 0 1px 2px rgba(15,23,42,0.08)',
        display: 'flex', flexDirection: 'column',
      }}>
        <div style={{ padding: '18px 22px', borderBottom: '1px solid #EEF2F7', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'linear-gradient(180deg, #FFFFFF, #FBFCFF)' }}>
          <div>
            <h2 style={{ fontSize: 17, fontWeight: 750, color: '#0F172A', letterSpacing: '-0.025em', margin: 0 }}>Add monitor</h2>
            <p style={{ fontSize: 12, color: '#64748B', marginTop: 4 }}>Choose what to watch. We’ll capture a baseline next.</p>
          </div>
          <button onClick={onClose} style={{ width: 31, height: 31, border: 'none', borderRadius: 9, background: '#F8FAFC', color: '#94A3B8', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <X size={17} />
          </button>
        </div>

        <div style={{ padding: 22, overflowY: 'auto' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <section>
              <label style={{ display: 'block', fontSize: 10, fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>Target URL</label>
              <div style={{ position: 'relative' }}>
                {favicon && <img src={favicon} alt="" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', width: 18, height: 18, borderRadius: 4 }} onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }} />}
                <input
                  type="text"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                  placeholder="https://example.com/pricing"
                  autoFocus
                  style={{
                    width: '100%', height: 48, borderRadius: 12,
                    border: '1px solid #DDE3EA', background: '#FBFCFF',
                    padding: favicon ? '0 14px 0 42px' : '0 14px',
                    outline: 'none', fontSize: 14, color: '#0F172A',
                    boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.8)',
                  }}
                />
              </div>
              {domain && <p style={{ fontSize: 11, color: '#94A3B8', marginTop: 7 }}>Target detected: <span style={{ color: '#475569', fontWeight: 650 }}>{domain}</span></p>}
            </section>

            <section>
              <label style={{ display: 'block', fontSize: 10, fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>Mode</label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                <button type="button" onClick={() => setMode('watch')} style={{ padding: '12px 13px', borderRadius: 13, border: `1px solid ${mode === 'watch' ? 'rgba(37,99,235,0.35)' : '#E6EAF0'}`, background: mode === 'watch' ? '#F3F7FF' : '#FFFFFF', display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', textAlign: 'left' }}>
                  <Eye size={16} style={{ color: mode === 'watch' ? '#2563EB' : '#94A3B8' }} />
                  <div><p style={{ fontSize: 13, fontWeight: 720, color: '#0F172A', margin: 0 }}>Watch changes</p><p style={{ fontSize: 11, color: '#94A3B8', marginTop: 2 }}>Alert on meaningful diffs</p></div>
                </button>
                <button type="button" onClick={() => setMode('archive')} style={{ padding: '12px 13px', borderRadius: 13, border: `1px solid ${mode === 'archive' ? 'rgba(37,99,235,0.35)' : '#E6EAF0'}`, background: mode === 'archive' ? '#F3F7FF' : '#FFFFFF', display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', textAlign: 'left' }}>
                  <Archive size={16} style={{ color: mode === 'archive' ? '#2563EB' : '#94A3B8' }} />
                  <div><p style={{ fontSize: 13, fontWeight: 720, color: '#0F172A', margin: 0 }}>Archive only</p><p style={{ fontSize: 11, color: '#94A3B8', marginTop: 2 }}>Keep snapshots, no alerts</p></div>
                </button>
              </div>
            </section>

            <section>
              <label style={{ display: 'block', fontSize: 10, fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>Schedule</label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
                {SCHEDULES.map(s => {
                  const isActive = freq === s.id
                  return <button key={s.id} type="button" onClick={() => setFreq(s.id)} style={{ borderRadius: 13, border: `1px solid ${isActive ? 'rgba(37,99,235,0.38)' : '#E6EAF0'}`, background: isActive ? '#F3F7FF' : '#FFFFFF', padding: '12px 12px', textAlign: 'left', cursor: 'pointer' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}><span style={{ fontSize: 13, fontWeight: 720, color: '#0F172A' }}>{s.label}</span>{isActive && <Check size={14} style={{ color: '#2563EB' }} />}</div>
                    <span style={{ fontSize: 11, color: '#94A3B8' }}>{s.sub}</span>
                  </button>
                })}
              </div>

              {showTimePicker && <div style={{ marginTop: 10, padding: '12px 13px', borderRadius: 13, border: '1px solid #E6EAF0', background: '#FBFCFF', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#475569', fontSize: 12, fontWeight: 650 }}><Clock size={14} style={{ color: '#94A3B8' }} /> Run at (UTC)</div>
                <select value={checkHour} onChange={(e) => setCheckHour(Number(e.target.value))} style={{ height: 32, minWidth: 120, border: '1px solid #DDE3EA', borderRadius: 9, background: 'white', padding: '0 9px', fontSize: 12, color: '#0F172A', outline: 'none' }}>
                  {Array.from({ length: 24 }, (_, h) => <option key={h} value={h}>{hourLabel(h)}</option>)}
                </select>
              </div>}
            </section>

            {isWatch && <section>
              <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 10, fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}><Sparkles size={12} /> Watch instruction <span style={{ fontWeight: 600, textTransform: 'none', letterSpacing: 0 }}>(optional)</span></label>
              <textarea rows={3} value={description} onChange={(e) => setDescription(e.target.value)} placeholder='e.g. Alert me if pricing changes, availability changes, or the headline updates.' style={{ width: '100%', resize: 'none', borderRadius: 13, border: '1px solid #DDE3EA', background: '#FBFCFF', padding: 13, outline: 'none', fontSize: 13, lineHeight: 1.5, color: '#0F172A' }} />
            </section>}

            <section>
              <button type="button" onClick={() => setFullPage(!fullPage)} style={{ width: '100%', border: '1px solid #E6EAF0', borderRadius: 14, background: '#FFFFFF', padding: 14, display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', boxShadow: '0 4px 14px rgba(15,23,42,0.035)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 11, textAlign: 'left' }}>
                  <div style={{ width: 34, height: 34, borderRadius: 10, background: '#F3F7FF', color: '#2563EB', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Globe size={16} /></div>
                  <div><p style={{ fontSize: 13, fontWeight: 750, color: '#0F172A', margin: 0 }}>{fullPage ? 'Full page capture' : 'Viewport capture'}</p><p style={{ fontSize: 11, color: '#94A3B8', marginTop: 2 }}>{fullPage ? 'Capture the full scrollable page.' : 'Capture only the visible viewport.'}</p></div>
                </div>
                <span style={{ width: 39, height: 23, borderRadius: 99, background: fullPage ? '#2563EB' : '#CBD5E1', position: 'relative', display: 'inline-block', flexShrink: 0 }}><span style={{ position: 'absolute', top: 3, left: fullPage ? 19 : 3, width: 17, height: 17, borderRadius: '50%', background: 'white', boxShadow: '0 1px 3px rgba(15,23,42,0.24)', transition: 'left 0.16s ease' }} /></span>
              </button>
            </section>

            {error && <div style={{ padding: 12, borderRadius: 12, background: '#FEF2F2', border: '1px solid rgba(220,38,38,0.18)', color: '#B91C1C', fontSize: 12, fontWeight: 650 }}>{error}</div>}
          </div>
        </div>

        <div style={{ padding: '14px 22px', borderTop: '1px solid #EEF2F7', background: '#FBFCFF', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 7, color: '#94A3B8', fontSize: 11 }}><ShieldCheck size={13} /> First screenshot starts after deploy.</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <button onClick={onClose} style={{ height: 36, padding: '0 14px', border: 'none', borderRadius: 10, background: 'transparent', color: '#64748B', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>Cancel</button>
            <button onClick={handleSubmit} disabled={!url.trim() || isPending} style={{ height: 36, padding: '0 16px', border: 'none', borderRadius: 10, background: '#2563EB', color: 'white', fontSize: 12, fontWeight: 760, display: 'flex', alignItems: 'center', gap: 8, cursor: !url.trim() || isPending ? 'not-allowed' : 'pointer', opacity: !url.trim() || isPending ? 0.55 : 1, boxShadow: '0 8px 18px rgba(37,99,235,0.22)' }}>
              {isPending ? 'Deploying…' : <>{mode === 'archive' ? 'Start archive' : 'Deploy monitor'} <ArrowRight size={14} /></>}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
