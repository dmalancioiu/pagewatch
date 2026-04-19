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
  urlId:       string
  urlName:     string
  onClose:     () => void
  onAdjust:    () => void   // go back to AddUrlModal with settings
}

type Phase = 'loading' | 'zones' | 'error'

const POLL_INTERVAL_MS  = 2_500
const POLL_TIMEOUT_MS   = 90_000

export function FirstScreenshotModal({
  urlId, urlName, onClose, onAdjust,
}: FirstScreenshotModalProps) {
  const router = useRouter()

  const [phase,      setPhase]      = useState<Phase>('loading')
  const [signedUrl,  setSignedUrl]  = useState<string | null>(null)
  const [elapsedMs,  setElapsedMs]  = useState(0)
  const [errorMsg,   setErrorMsg]   = useState<string | null>(null)
  const [zones,      setZones]      = useState<Zone[]>([])
  const [isSaving,   startSave]     = useTransition()

  // Trigger the first run when the modal mounts
  useEffect(() => {
    triggerManualRun(urlId).catch((err) => {
      console.error('[FirstScreenshotModal] trigger failed:', err)
      setErrorMsg(err?.message ?? 'Failed to trigger screenshot.')
      setPhase('error')
    })
  }, [urlId])

  // Poll for the snapshot
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
          if (url) {
            setSignedUrl(url)
            setPhase('zones')
          } else {
            setErrorMsg('Screenshot saved but could not load preview.')
            setPhase('error')
          }
        }
      } catch (err) {
        console.warn('[FirstScreenshotModal] poll error (will retry):', err)
      }
    }, POLL_INTERVAL_MS)

    return () => clearInterval(interval)
  }, [phase, urlId])

  function navigateToUrl() {
    router.push(`/dashboard/urls/${urlId}`)
    router.refresh()
  }

  function handleSkip() {
    navigateToUrl()
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
      style={{ background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(12px)' }}
    >
      <div
        className="w-full max-w-2xl rounded-2xl overflow-hidden flex flex-col"
        style={{
          background: '#0f0f0f',
          border:     '1px solid rgba(255,255,255,0.09)',
          boxShadow:  '0 32px 80px rgba(0,0,0,0.85)',
          maxHeight:  '92vh',
        }}
      >
        {/* ── Loading phase ── */}
        {phase === 'loading' && (
          <div className="flex flex-col items-center justify-center px-8 py-16 text-center">
            <div className="relative mb-8">
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center"
                style={{ background: 'rgba(0,255,136,0.07)', border: '1px solid rgba(0,255,136,0.2)' }}
              >
                <RefreshCw
                  className="w-7 h-7 animate-spin"
                  style={{ color: '#00ff88', animationDuration: '2s' }}
                />
              </div>
              <div
                className="absolute inset-0 rounded-full animate-ping"
                style={{ background: 'rgba(0,255,136,0.08)', animationDuration: '2.5s' }}
              />
            </div>

            <h2 className="text-lg font-semibold text-white mb-2">
              Taking your first screenshot…
            </h2>
            <p className="text-sm max-w-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.45)' }}>
              We're launching a headless browser, visiting {urlName || 'the page'}, and capturing your baseline.
              This usually takes 20–40 seconds.
            </p>

            <div
              className="mt-8 w-full max-w-xs h-1 rounded-full overflow-hidden"
              style={{ background: 'rgba(255,255,255,0.06)' }}
            >
              <div
                className="h-full rounded-full transition-all duration-1000"
                style={{ width: `${progressPct}%`, background: '#00ff88' }}
              />
            </div>
            <p className="text-[11px] mt-2" style={{ color: 'rgba(255,255,255,0.22)' }}>
              {Math.round(elapsedMs / 1000)}s elapsed
            </p>
          </div>
        )}

        {/* ── Zones phase ── */}
        {phase === 'zones' && signedUrl && (
          <>
            {/* Header */}
            <div
              className="flex items-center gap-3 px-6 py-4 flex-shrink-0"
              style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}
            >
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ background: 'rgba(0,255,136,0.08)', border: '1px solid rgba(0,255,136,0.18)' }}
              >
                <CheckCircle2 className="w-4 h-4" style={{ color: '#00ff88' }} />
              </div>
              <div>
                <h2 className="text-sm font-semibold text-white">Baseline captured — define tracking zones</h2>
                <p className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.4)' }}>
                  Draw rectangles over the areas you care about. Skip to watch the whole page.
                </p>
              </div>
            </div>

            {/* Screenshot with zone selector — scrollable */}
            <div className="overflow-y-auto flex-1 min-h-0">
              {/* Instructions strip */}
              <div
                className="flex items-start gap-2.5 px-5 py-3 text-xs"
                style={{ background: 'rgba(0,255,136,0.04)', borderBottom: '1px solid rgba(0,255,136,0.1)' }}
              >
                <Crosshair className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" style={{ color: '#00ff88' }} />
                <span style={{ color: 'rgba(255,255,255,0.5)' }}>
                  <span style={{ color: 'rgba(0,255,136,0.85)' }}>Click and drag</span> on the screenshot to mark zones.
                  Click a zone to label or delete it.
                  {zones.length > 0 && (
                    <span style={{ color: 'rgba(255,255,255,0.35)' }}>
                      {' '}· {zones.length} zone{zones.length !== 1 ? 's' : ''} defined
                    </span>
                  )}
                </span>
              </div>

              {/* Zone selector */}
              <ZoneSelector
                imageUrl={signedUrl}
                zones={zones}
                onChange={setZones}
              />
            </div>

            {/* Actions */}
            <div
              className="flex items-center justify-between gap-3 px-6 py-4 flex-shrink-0"
              style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}
            >
              <button
                type="button"
                onClick={handleSkip}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors"
                style={{ color: 'rgba(255,255,255,0.4)', border: '1px solid rgba(255,255,255,0.07)' }}
              >
                <SkipForward className="w-3.5 h-3.5" />
                {zones.length > 0 ? 'Skip zones' : 'Watch whole page'}
              </button>

              <button
                type="button"
                onClick={handleSaveZones}
                disabled={isSaving || zones.length === 0}
                className="btn-neon flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold disabled:opacity-40 disabled:cursor-not-allowed"
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

        {/* ── Error phase ── */}
        {phase === 'error' && (
          <div className="flex flex-col items-center justify-center px-8 py-16 text-center">
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center mb-6"
              style={{ background: 'rgba(255,68,68,0.08)', border: '1px solid rgba(255,68,68,0.2)' }}
            >
              <AlertCircle className="w-7 h-7" style={{ color: '#ff7070' }} />
            </div>

            <h2 className="text-base font-semibold text-white mb-2">Screenshot failed</h2>
            <p className="text-sm max-w-sm leading-relaxed mb-1" style={{ color: 'rgba(255,255,255,0.45)' }}>
              {errorMsg ?? 'Something went wrong taking the first screenshot.'}
            </p>
            <p className="text-xs mb-8" style={{ color: 'rgba(255,255,255,0.28)' }}>
              Check the URL is publicly accessible and try again.
            </p>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl text-sm font-medium transition-colors"
                style={{ color: 'rgba(255,255,255,0.4)', border: '1px solid rgba(255,255,255,0.07)' }}
              >
                Go to dashboard
              </button>
              <button
                type="button"
                onClick={onAdjust}
                className="btn-neon flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm"
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
