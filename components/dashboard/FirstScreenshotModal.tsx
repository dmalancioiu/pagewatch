'use client'

import { useEffect, useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { CheckCircle2, AlertCircle, ArrowRight, RefreshCw, Crosshair, SkipForward, Loader2, Camera, Target, Sparkles } from 'lucide-react'
import { pollFirstSnapshot, getSignedScreenshotUrl } from '@/lib/actions/screenshots'
import { triggerManualRun } from '@/lib/actions/run-now'
import { updateMonitoredUrl } from '@/lib/actions/websites'
import { ZoneSelector } from './ZoneSelector'
import type { Zone } from '@/lib/types/database.types'

interface FirstScreenshotModalProps {
  urlId:    string
  urlName:  string
  onClose:  () => void
  onAdjust: () => void
}

type Phase = 'loading' | 'zones' | 'error'

const POLL_INTERVAL_MS = 2_500
const POLL_TIMEOUT_MS  = 90_000

function StepPill({ active, done, label }: { active?: boolean; done?: boolean; label: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 7, color: active ? '#2563EB' : done ? '#16A34A' : '#94A3B8', fontSize: 11, fontWeight: 750 }}>
      <span style={{
        width: 18, height: 18, borderRadius: 99,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: active ? 'rgba(37,99,235,0.1)' : done ? 'rgba(22,163,74,0.1)' : '#F1F5F9',
        border: active ? '1px solid rgba(37,99,235,0.22)' : done ? '1px solid rgba(22,163,74,0.22)' : '1px solid #E6EAF0',
        fontSize: 10,
      }}>
        {done ? '✓' : active ? '•' : ''}
      </span>
      {label}
    </div>
  )
}

export function FirstScreenshotModal({ urlId, urlName, onClose, onAdjust }: FirstScreenshotModalProps) {
  const router = useRouter()

  const [phase,     setPhase]     = useState<Phase>('loading')
  const [signedUrl, setSignedUrl] = useState<string | null>(null)
  const [elapsedMs, setElapsedMs] = useState(0)
  const [errorMsg,  setErrorMsg]  = useState<string | null>(null)
  const [zones,     setZones]     = useState<Zone[]>([])
  const [isSaving,  startSave]    = useTransition()

  useEffect(() => {
    triggerManualRun(urlId).catch((err) => {
      setErrorMsg(err?.message ?? 'Failed to trigger screenshot.')
      setPhase('error')
    })
  }, [urlId])

  useEffect(() => {
    if (phase !== 'loading') return
    const startedAt = Date.now()
    const interval = setInterval(async () => {
      const elapsed = Date.now() - startedAt
      setElapsedMs(elapsed)
      if (elapsed >= POLL_TIMEOUT_MS) {
        clearInterval(interval)
        setErrorMsg('Screenshot is taking longer than expected. Try again or check the URL.')
        setPhase('error')
        return
      }
      try {
        const result = await pollFirstSnapshot(urlId)
        if (result) {
          clearInterval(interval)
          const url = await getSignedScreenshotUrl(result.storagePath)
          if (url) { setSignedUrl(url); setPhase('zones') }
          else { setErrorMsg('Screenshot saved but could not load preview.'); setPhase('error') }
        }
      } catch { /* retry on next tick */ }
    }, POLL_INTERVAL_MS)
    return () => clearInterval(interval)
  }, [phase, urlId])

  function navigateToUrl() {
    router.push(`/dashboard/urls/${urlId}`)
    router.refresh()
  }

  function handleSaveZones() {
    startSave(async () => {
      await updateMonitoredUrl(urlId, { zones: zones.length > 0 ? zones : null })
      navigateToUrl()
    })
  }

  const progressPct = Math.min((elapsedMs / POLL_TIMEOUT_MS) * 100, 95)

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(15,23,42,0.42)', backdropFilter: 'blur(14px)' }}>
      <div style={{ width: '100%', maxWidth: phase === 'zones' ? 980 : 560, maxHeight: '92vh', overflow: 'hidden', background: '#FFFFFF', borderRadius: 18, border: '1px solid rgba(15,23,42,0.08)', boxShadow: '0 34px 100px rgba(15,23,42,0.22), 0 1px 2px rgba(15,23,42,0.08)', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '16px 20px', borderBottom: '1px solid #EEF2F7', background: 'linear-gradient(180deg, #FFFFFF, #FBFCFF)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, flexShrink: 0 }}>
          <div>
            <h2 style={{ fontSize: 16, fontWeight: 760, color: '#0F172A', margin: 0, letterSpacing: '-0.025em' }}>
              {phase === 'loading' ? 'Capturing baseline' : phase === 'zones' ? 'Choose focus zones' : 'Capture failed'}
            </h2>
            <p style={{ fontSize: 12, color: '#64748B', marginTop: 4 }}>
              {phase === 'loading' ? `Opening ${urlName || 'the page'} in a browser.` : phase === 'zones' ? 'Draw around the parts that matter. Everything else becomes background noise.' : 'We could not complete the first capture.'}
            </p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <StepPill label="Capture" active={phase === 'loading'} done={phase === 'zones'} />
            <StepPill label="Zones" active={phase === 'zones'} />
          </div>
        </div>

        {phase === 'loading' && (
          <div style={{ padding: '54px 48px 46px', textAlign: 'center' }}>
            <div style={{ width: 66, height: 66, borderRadius: 22, background: 'rgba(37,99,235,0.08)', border: '1px solid rgba(37,99,235,0.16)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 22px', position: 'relative' }}>
              <RefreshCw className="w-6 h-6 animate-spin" style={{ color: '#2563EB', animationDuration: '2s' }} />
              <span style={{ position: 'absolute', inset: -7, borderRadius: 28, border: '1px solid rgba(37,99,235,0.08)' }} />
            </div>
            <h3 style={{ fontSize: 17, fontWeight: 760, color: '#0F172A', marginBottom: 7 }}>Taking the first screenshot</h3>
            <p style={{ fontSize: 13, color: '#64748B', lineHeight: 1.65, maxWidth: 410, margin: '0 auto' }}>
              PageWatch is loading the target, removing noisy overlays, and saving the baseline you’ll use to select zones.
            </p>
            <div style={{ margin: '28px auto 0', width: '100%', maxWidth: 340, height: 7, borderRadius: 99, background: '#EEF2F7', overflow: 'hidden' }}>
              <div style={{ width: `${progressPct}%`, height: '100%', borderRadius: 99, background: 'linear-gradient(90deg, #2563EB, #38BDF8)', transition: 'width 1s ease' }} />
            </div>
            <p style={{ fontSize: 11, color: '#94A3B8', marginTop: 9 }}>{Math.round(elapsedMs / 1000)}s elapsed</p>
          </div>
        )}

        {phase === 'zones' && signedUrl && (
          <>
            <div style={{ padding: '12px 18px', borderBottom: '1px solid #EEF2F7', background: '#FBFCFF', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 14, flexShrink: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 32, height: 32, borderRadius: 10, background: 'rgba(37,99,235,0.08)', border: '1px solid rgba(37,99,235,0.16)', color: '#2563EB', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Target size={15} /></div>
                <div>
                  <p style={{ fontSize: 13, fontWeight: 760, color: '#0F172A', margin: 0 }}>Define what PageWatch should care about</p>
                  <p style={{ fontSize: 11, color: '#94A3B8', marginTop: 2 }}>Click and drag on the screenshot. Then label each zone and add watch instructions.</p>
                </div>
              </div>
              <span style={{ fontSize: 11, fontWeight: 750, color: zones.length > 0 ? '#2563EB' : '#94A3B8', background: zones.length > 0 ? 'rgba(37,99,235,0.08)' : '#F1F5F9', border: zones.length > 0 ? '1px solid rgba(37,99,235,0.16)' : '1px solid #E6EAF0', borderRadius: 999, padding: '5px 9px' }}>
                {zones.length} zone{zones.length !== 1 ? 's' : ''}
              </span>
            </div>
            <div style={{ overflowY: 'auto', flex: 1, minHeight: 0, background: '#F8FAFC' }}>
              <ZoneSelector imageUrl={signedUrl} zones={zones} onChange={setZones} />
            </div>
            <div style={{ padding: '13px 18px', borderTop: '1px solid #EEF2F7', background: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, flexShrink: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 7, color: '#94A3B8', fontSize: 11 }}><Sparkles size={13} /> Zones are optional, but they make alerts much cleaner.</div>
              <div style={{ display: 'flex', gap: 8 }}>
                <button type="button" onClick={navigateToUrl} style={{ height: 36, padding: '0 13px', borderRadius: 10, border: '1px solid #E6EAF0', background: '#FFFFFF', color: '#64748B', fontSize: 12, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 7, cursor: 'pointer' }}>
                  <SkipForward size={13} /> {zones.length > 0 ? 'Skip saving zones' : 'Watch whole page'}
                </button>
                <button type="button" onClick={handleSaveZones} disabled={isSaving || zones.length === 0} style={{ height: 36, padding: '0 15px', borderRadius: 10, border: 'none', background: '#2563EB', color: '#FFFFFF', fontSize: 12, fontWeight: 760, display: 'flex', alignItems: 'center', gap: 8, cursor: isSaving || zones.length === 0 ? 'not-allowed' : 'pointer', opacity: isSaving || zones.length === 0 ? 0.55 : 1, boxShadow: '0 8px 18px rgba(37,99,235,0.22)' }}>
                  {isSaving ? <><Loader2 size={13} className="animate-spin" /> Saving…</> : <>Save zones <ArrowRight size={14} /></>}
                </button>
              </div>
            </div>
          </>
        )}

        {phase === 'error' && (
          <div style={{ padding: '54px 48px 46px', textAlign: 'center' }}>
            <div style={{ width: 64, height: 64, borderRadius: 22, background: 'rgba(220,38,38,0.07)', border: '1px solid rgba(220,38,38,0.16)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}><AlertCircle size={25} style={{ color: '#DC2626' }} /></div>
            <h3 style={{ fontSize: 17, fontWeight: 760, color: '#0F172A', marginBottom: 7 }}>Screenshot failed</h3>
            <p style={{ fontSize: 13, color: '#64748B', lineHeight: 1.65, maxWidth: 420, margin: '0 auto 4px' }}>{errorMsg ?? 'Something went wrong taking the first screenshot.'}</p>
            <p style={{ fontSize: 12, color: '#94A3B8', marginBottom: 24 }}>Make sure the URL is public and reachable.</p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: 9 }}>
              <button type="button" onClick={onClose} style={{ height: 36, padding: '0 14px', borderRadius: 10, border: '1px solid #E6EAF0', background: '#FFFFFF', color: '#64748B', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>Go to dashboard</button>
              <button type="button" onClick={onAdjust} style={{ height: 36, padding: '0 15px', borderRadius: 10, border: 'none', background: '#2563EB', color: '#FFFFFF', fontSize: 12, fontWeight: 760, cursor: 'pointer' }}>Adjust settings</button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
