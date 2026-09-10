'use client'

import { useEffect, useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { AlertCircle, Camera, CheckCircle2, RefreshCw, SkipForward, Sparkles, Target } from 'lucide-react'
import { pollFirstSnapshot, getSignedScreenshotUrl } from '@/lib/actions/screenshots'
import { triggerManualRun } from '@/lib/actions/run-now'
import { updateMonitoredUrl } from '@/lib/actions/websites'
import { ZoneSelector } from './ZoneSelector'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import type { Zone } from '@/lib/types/database.types'

interface FirstScreenshotModalProps {
  urlId: string
  urlName: string
  onClose: () => void
  onAdjust: () => void
}

type Phase = 'loading' | 'zones' | 'error'

const POLL_INTERVAL_MS = 2_500
const POLL_TIMEOUT_MS = 90_000

function ProgressStepper({ phase }: { phase: Phase }) {
  const captureDone = phase === 'zones'
  return (
    <div className="flex items-center gap-1.5 text-meta">
      <span className={captureDone ? 'flex items-center gap-1 text-ok' : 'flex items-center gap-1 text-accent'}>
        {captureDone ? <CheckCircle2 className="size-3" /> : <Camera className="size-3" />} Capture
      </span>
      <span className="h-px w-4 bg-border" />
      <span className={phase === 'zones' ? 'flex items-center gap-1 text-accent' : 'flex items-center gap-1 text-text-faint'}>
        <Target className="size-3" /> Zones
      </span>
    </div>
  )
}

export function FirstScreenshotModal({ urlId, urlName, onClose, onAdjust }: FirstScreenshotModalProps) {
  const router = useRouter()

  const [phase, setPhase] = useState<Phase>('loading')
  const [signedUrl, setSignedUrl] = useState<string | null>(null)
  const [elapsedMs, setElapsedMs] = useState(0)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [zones, setZones] = useState<Zone[]>([])
  const [isSaving, startSave] = useTransition()

  useEffect(() => {
    triggerManualRun({ id: urlId }).then((res) => {
      if (!res.ok) {
        setErrorMsg(res.message)
        setPhase('error')
      }
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
          if (url) {
            setSignedUrl(url)
            setPhase('zones')
          } else {
            setErrorMsg('Screenshot saved but could not load preview.')
            setPhase('error')
          }
        }
      } catch {
        /* retry on next tick */
      }
    }, POLL_INTERVAL_MS)
    return () => clearInterval(interval)
  }, [phase, urlId])

  function navigateToUrl() {
    onClose()
    router.push(`/dashboard/urls/${urlId}`)
    router.refresh()
  }

  function handleSaveZones() {
    startSave(async () => {
      await updateMonitoredUrl({ id: urlId, zones: zones.length > 0 ? zones : null })
      navigateToUrl()
    })
  }

  const progressPct = Math.min((elapsedMs / POLL_TIMEOUT_MS) * 100, 95)

  return (
    <Dialog open onOpenChange={(open) => !open && phase !== 'zones' && onClose()}>
      <DialogContent className={phase === 'zones' ? 'max-w-4xl' : 'max-w-md'}>
        <DialogHeader className="flex-row items-center justify-between gap-4 space-y-0 pr-0">
          <div>
            <DialogTitle>
              {phase === 'loading' ? 'Capturing baseline' : phase === 'zones' ? 'Choose focus zones' : 'Capture failed'}
            </DialogTitle>
            <DialogDescription>
              {phase === 'loading'
                ? `Opening ${urlName || 'the page'} in a browser.`
                : phase === 'zones'
                  ? 'Draw around the parts that matter. Everything else becomes background noise.'
                  : 'We could not complete the first capture.'}
            </DialogDescription>
          </div>
          {phase !== 'error' && <ProgressStepper phase={phase} />}
        </DialogHeader>

        {phase === 'loading' && (
          <div className="flex flex-col items-center gap-4 py-8 text-center">
            <div className="flex size-14 items-center justify-center rounded-md bg-accent-subtle">
              <RefreshCw className="size-6 animate-spin text-accent" style={{ animationDuration: '2s' }} />
            </div>
            <div className="flex flex-col gap-1">
              <p className="text-ui-medium text-text">Taking the first screenshot</p>
              <p className="max-w-sm text-ui text-text-muted">
                PageWatch is loading the target, removing noisy overlays, and saving the baseline you&rsquo;ll use to
                select zones.
              </p>
            </div>
            <div className="h-1.5 w-full max-w-[280px] overflow-hidden rounded-full bg-bg-subtle">
              <div
                className="h-full rounded-full bg-accent transition-[width] duration-1000 ease-out"
                style={{ width: `${progressPct}%` }}
              />
            </div>
            <p className="text-meta text-text-faint">{Math.round(elapsedMs / 1000)}s elapsed</p>
          </div>
        )}

        {phase === 'zones' && signedUrl && (
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between gap-3 rounded-md border border-border bg-bg-subtle px-3 py-2">
              <p className="text-ui text-text-muted">
                Click and drag on the screenshot, then label each zone and add watch instructions.
              </p>
              <Badge tone={zones.length > 0 ? 'accent' : 'neutral'} size="sm">
                {zones.length} zone{zones.length !== 1 ? 's' : ''}
              </Badge>
            </div>
            <div className="max-h-[60vh] overflow-y-auto rounded-md border border-border bg-bg-subtle">
              <ZoneSelector imageUrl={signedUrl} zones={zones} onChange={setZones} />
            </div>
            <div className="flex items-center justify-between gap-3">
              <span className="flex items-center gap-1.5 text-meta text-text-faint">
                <Sparkles className="size-3" /> Zones are optional, but they make alerts much cleaner.
              </span>
              <div className="flex gap-2">
                <Button variant="secondary" size="sm" iconLeft={<SkipForward className="size-3.5" />} onClick={navigateToUrl}>
                  {zones.length > 0 ? 'Skip saving zones' : 'Watch whole page'}
                </Button>
                <Button size="sm" onClick={handleSaveZones} loading={isSaving} disabled={zones.length === 0}>
                  Save zones
                </Button>
              </div>
            </div>
          </div>
        )}

        {phase === 'error' && (
          <div className="flex flex-col items-center gap-4 py-8 text-center">
            <div className="flex size-12 items-center justify-center rounded-md bg-critical-subtle">
              <AlertCircle className="size-5 text-critical" />
            </div>
            <div className="flex flex-col gap-1">
              <p className="text-ui-medium text-text">Screenshot failed</p>
              <p className="max-w-sm text-ui text-text-muted">
                {errorMsg ?? 'Something went wrong taking the first screenshot.'}
              </p>
              <p className="text-meta text-text-faint">Make sure the URL is public and reachable.</p>
            </div>
            <div className="flex gap-2">
              <Button variant="secondary" size="sm" onClick={onClose}>
                Go to dashboard
              </Button>
              <Button size="sm" onClick={onAdjust}>
                Adjust settings
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
