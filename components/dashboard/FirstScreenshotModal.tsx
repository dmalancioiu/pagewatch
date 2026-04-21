'use client'

import { useEffect, useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { CheckCircle2, AlertCircle, ArrowRight, RefreshCw, Crosshair, SkipForward, Loader2 } from 'lucide-react'
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
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)' }}
    >
      <div
        className="w-full max-w-2xl rounded-2xl overflow-hidden flex flex-col"
        style={{
          background: '#FFFFFF',
          border:     '1px solid #E5E7EB',
          boxShadow:  '0 20px 60px rgba(0,0,0,0.15)',
          maxHeight:  '92vh',
        }}
      >
        {/* Loading phase */}
        {phase === 'loading' && (
          <div className="flex flex-col items-center justify-center px-8 py-16 text-center">
            <div className="relative mb-8">
              <div
                className="w-14 h-14 rounded-full flex items-center justify-center"
                style={{ background: '#F0FDF4', border: '1px solid rgba(22,163,74,0.2)' }}
              >
                <RefreshCw
                  className="w-6 h-6 animate-spin"
                  style={{ color: '#16A34A', animationDuration: '2s' }}
                />
              </div>
            </div>

            <h2 className="text-lg font-semibold mb-2" style={{ color: '#111827' }}>
              Taking your first screenshot…
            </h2>
            <p className="text-sm max-w-sm leading-relaxed" style={{ color: '#6B7280' }}>
              We're launching a headless browser, visiting {urlName || 'the page'}, and capturing your baseline.
              This usually takes 20–40 seconds.
            </p>

            <div
              className="mt-8 w-full max-w-xs h-1.5 rounded-full overflow-hidden"
              style={{ background: '#F3F4F6' }}
            >
              <div
                className="h-full rounded-full transition-all duration-1000"
                style={{ width: `${progressPct}%`, background: '#16A34A' }}
              />
            </div>
            <p className="text-[11px] mt-2" style={{ color: '#9CA3AF' }}>
              {Math.round(elapsedMs / 1000)}s elapsed
            </p>
          </div>
        )}

        {/* Zones phase */}
        {phase === 'zones' && signedUrl && (
          <>
            <div
              className="flex items-center gap-3 px-6 py-4 flex-shrink-0"
              style={{ borderBottom: '1px solid #F3F4F6' }}
            >
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ background: '#F0FDF4', border: '1px solid rgba(22,163,74,0.2)' }}
              >
                <CheckCircle2 className="w-4 h-4" style={{ color: '#16A34A' }} />
              </div>
              <div>
                <h2 className="text-sm font-semibold" style={{ color: '#111827' }}>
                  Baseline captured — define focus zones
                </h2>
                <p className="text-xs mt-0.5" style={{ color: '#9CA3AF' }}>
                  Draw zones over the areas you care about. Skip to watch the whole page.
                </p>
              </div>
            </div>

            <div className="overflow-y-auto flex-1 min-h-0">
              <div
                className="flex items-start gap-2.5 px-5 py-3 text-xs"
                style={{ background: '#F8FAFC', borderBottom: '1px solid #F3F4F6' }}
              >
                <Crosshair className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" style={{ color: '#16A34A' }} />
                <span style={{ color: '#6B7280' }}>
                  <span style={{ color: '#15803D', fontWeight: 600 }}>Click and drag</span> on the screenshot to mark zones.
                  Click a zone to label or delete it.
                  {zones.length > 0 && (
                    <span style={{ color: '#9CA3AF' }}>
                      {' '}· {zones.length} zone{zones.length !== 1 ? 's' : ''} defined
                    </span>
                  )}
                </span>
              </div>
              <ZoneSelector imageUrl={signedUrl} zones={zones} onChange={setZones} />
            </div>

            <div
              className="flex items-center justify-between gap-3 px-6 py-4 flex-shrink-0"
              style={{ borderTop: '1px solid #F3F4F6' }}
            >
              <button
                type="button"
                onClick={navigateToUrl}
                className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors"
                style={{ color: '#6B7280', border: '1px solid #E5E7EB', background: '#F9FAFB' }}
              >
                <SkipForward className="w-3.5 h-3.5" />
                {zones.length > 0 ? 'Skip zones' : 'Watch whole page'}
              </button>

              <button
                type="button"
                onClick={handleSaveZones}
                disabled={isSaving || zones.length === 0}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                style={{ background: '#16A34A', color: '#FFFFFF' }}
              >
                {isSaving ? (
                  <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Saving…</>
                ) : (
                  <>Save {zones.length} zone{zones.length !== 1 ? 's' : ''} <ArrowRight className="w-3.5 h-3.5" /></>
                )}
              </button>
            </div>
          </>
        )}

        {/* Error phase */}
        {phase === 'error' && (
          <div className="flex flex-col items-center justify-center px-8 py-16 text-center">
            <div
              className="w-14 h-14 rounded-full flex items-center justify-center mb-6"
              style={{ background: 'rgba(185,28,28,0.06)', border: '1px solid rgba(185,28,28,0.2)' }}
            >
              <AlertCircle className="w-6 h-6" style={{ color: '#DC2626' }} />
            </div>

            <h2 className="text-base font-semibold mb-2" style={{ color: '#111827' }}>Screenshot failed</h2>
            <p className="text-sm max-w-sm leading-relaxed mb-1" style={{ color: '#6B7280' }}>
              {errorMsg ?? 'Something went wrong taking the first screenshot.'}
            </p>
            <p className="text-xs mb-8" style={{ color: '#9CA3AF' }}>
              Make sure the URL is publicly accessible and try again.
            </p>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-lg text-sm font-medium transition-colors"
                style={{ color: '#6B7280', border: '1px solid #E5E7EB', background: '#F9FAFB' }}
              >
                Go to dashboard
              </button>
              <button
                type="button"
                onClick={onAdjust}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold"
                style={{ background: '#16A34A', color: '#FFFFFF' }}
              >
                Adjust settings
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
