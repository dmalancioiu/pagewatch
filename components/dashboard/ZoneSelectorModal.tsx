'use client'

import { useEffect, useState } from 'react'
import { Target, MousePointer2, Trash2, Info } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { IconButton } from '@/components/ui/icon-button'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { ZoneSelector, zoneTone } from './ZoneSelector'
import type { Zone } from './ZoneSelector'
import type { ZoneSensitivity } from '@/lib/types/database.types'
import { useToast } from '@/components/ui/ToastProvider'
import { cn } from '@/lib/utils'

interface Props {
  isOpen: boolean
  onClose: () => void
  imageUrl: string
  zones: Zone[]
  onChange: (zones: Zone[]) => void
  /** Plan ceiling on zone count for this monitor — disables drawing past it. */
  maxZones?: number
}

const SENSITIVITIES: ZoneSensitivity[] = ['low', 'normal', 'high']

export function ZoneSelectorModal({ isOpen, onClose, imageUrl, zones, onChange, maxZones }: Props) {
  const [localZones, setLocalZones] = useState<Zone[]>(zones)
  const { success, info } = useToast()

  // Re-seed local edits from the latest saved zones each time the dialog opens.
  useEffect(() => {
    if (isOpen) setLocalZones(zones)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen])

  const atLimit = typeof maxZones === 'number' && localZones.length >= maxZones

  function handleDone() {
    onChange(localZones)
    success('Zones saved', `${localZones.length} zone${localZones.length === 1 ? '' : 's'} updated`)
    onClose()
  }

  function handleOpenChange(next: boolean) {
    if (!next) {
      setLocalZones(zones) // discard unsaved edits
      onClose()
    }
  }

  function handleZonesDrawn(next: Zone[]) {
    if (atLimit && next.length > localZones.length) return
    setLocalZones(next)
  }

  function updateZone(id: string, patch: Partial<Zone>) {
    setLocalZones((prev) => prev.map((z) => (z.id === id ? { ...z, ...patch } : z)))
  }

  function updateSensitivity(id: string, sensitivity: ZoneSensitivity) {
    updateZone(id, { sensitivity })
    info('Sensitivity updated', `Zone sensitivity set to ${sensitivity}`)
  }

  function deleteZone(id: string) {
    setLocalZones((prev) => prev.filter((z) => z.id !== id))
    info('Zone removed')
  }

  function clearZones() {
    setLocalZones([])
    info('All zones cleared')
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="flex h-[min(88vh,860px)] w-[min(96vw,1180px)] max-w-none flex-col gap-0 p-0">
        <DialogHeader className="flex-row items-center justify-between gap-3 border-b border-border p-4 pr-12 sm:p-5">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex size-9 shrink-0 items-center justify-center rounded-md bg-accent-subtle text-accent">
              <Target className="size-4" />
            </div>
            <div className="min-w-0">
              <DialogTitle>Focus zones</DialogTitle>
              <DialogDescription>Draw regions, then give each one its own watch instruction.</DialogDescription>
            </div>
            {localZones.length > 0 && (
              <Badge tone="accent" className="shrink-0">
                {localZones.length} zone{localZones.length !== 1 ? 's' : ''}
                {typeof maxZones === 'number' ? ` / ${maxZones}` : ''}
              </Badge>
            )}
          </div>
        </DialogHeader>

        <div className="grid min-h-0 flex-1 grid-cols-1 overflow-hidden md:grid-cols-[1fr_320px]">
          {/* Canvas */}
          <div className="flex flex-col items-center overflow-auto bg-bg-subtle p-4 sm:p-6">
            <div className="mb-3 flex w-full max-w-3xl items-center gap-2 rounded-md border border-accent/30 bg-accent-subtle px-3 py-2 text-meta text-accent">
              <MousePointer2 className="size-3.5 shrink-0" />
              <span>
                {atLimit
                  ? `Zone limit reached (${maxZones}). Remove one to draw another.`
                  : 'Click and drag on the screenshot to draw a focus zone. Select a zone to rename it.'}
              </span>
            </div>
            <div className="w-full max-w-3xl overflow-hidden rounded-md border border-border shadow-card">
              <ZoneSelector imageUrl={imageUrl} zones={localZones} onChange={handleZonesDrawn} />
            </div>
          </div>

          {/* Zone list */}
          <div className="flex min-h-0 flex-col overflow-hidden border-t border-border bg-panel md:border-l md:border-t-0">
            <div className="flex h-10 shrink-0 items-center justify-between border-b border-border px-4">
              <span className="text-label uppercase text-text-faint">Zone instructions</span>
              {localZones.length > 0 && (
                <button
                  type="button"
                  onClick={clearZones}
                  className="rounded-sm px-1.5 py-0.5 text-meta font-medium text-critical transition-colors duration-120 hover:bg-critical/10"
                >
                  Clear all
                </button>
              )}
            </div>

            <div className="flex-1 overflow-y-auto p-3">
              {localZones.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center gap-3 px-4 py-8 text-center">
                  <div className="flex size-11 items-center justify-center rounded-md bg-bg-subtle text-text-faint">
                    <Target className="size-5" />
                  </div>
                  <div>
                    <p className="text-ui-medium text-text">No zones yet</p>
                    <p className="mt-1 text-meta text-text-muted">
                      Draw a rectangle on the screenshot to focus monitoring on specific regions.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col gap-2">
                  {localZones.map((zone, i) => {
                    const tone = zoneTone(i)
                    const sensitivity = zone.sensitivity ?? 'normal'
                    return (
                      <div key={zone.id} className="rounded-md border border-border bg-panel-raised p-2.5">
                        <div className="mb-2 flex items-center gap-2">
                          <span className={cn('size-3 shrink-0 rounded-sm', tone.dot)} />
                          <input
                            type="text"
                            value={zone.label ?? ''}
                            onChange={(e) => updateZone(zone.id, { label: e.target.value })}
                            placeholder={`Zone ${i + 1}`}
                            className="min-w-0 flex-1 bg-transparent text-ui-medium text-text outline-none placeholder:text-text-faint"
                          />
                          <IconButton
                            aria-label={`Delete ${zone.label || `zone ${i + 1}`}`}
                            variant="danger"
                            size="sm"
                            onClick={() => deleteZone(zone.id)}
                          >
                            <Trash2 className="size-3.5" />
                          </IconButton>
                        </div>

                        <label className="mb-1 block text-label uppercase text-text-faint">Watch instruction</label>
                        <Textarea
                          rows={3}
                          value={zone.instruction ?? ''}
                          onChange={(e) => updateZone(zone.id, { instruction: e.target.value })}
                          placeholder={`e.g. Alert me if ${zone.label || 'this zone'} changes.`}
                          className="text-meta"
                        />

                        <p className="mb-1.5 mt-2 text-label uppercase text-text-faint">Sensitivity</p>
                        <div className="flex gap-1.5">
                          {SENSITIVITIES.map((s) => (
                            <button
                              key={s}
                              type="button"
                              onClick={() => updateSensitivity(zone.id, s)}
                              className={cn(
                                'flex-1 rounded border px-0 py-1 text-label capitalize transition-colors duration-120',
                                sensitivity === s
                                  ? 'border-accent bg-accent-subtle text-accent'
                                  : 'border-border-strong text-text-faint hover:text-text'
                              )}
                            >
                              {s}
                            </button>
                          ))}
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>

            <div className="shrink-0 border-t border-border bg-bg-subtle px-4 py-3">
              <div className="mb-1.5 flex items-center gap-1.5 text-label uppercase text-text-faint">
                <Info className="size-3" />
                How zones work
              </div>
              {[
                'Only pixels inside zones are compared',
                'Each zone can have a separate watch instruction',
                'Zones save when you click Save zones',
              ].map((tip) => (
                <p key={tip} className="pl-4 text-meta text-text-muted">
                  · {tip}
                </p>
              ))}
            </div>
          </div>
        </div>

        <DialogFooter className="mt-0 border-t border-border p-3 sm:p-4">
          <DialogClose asChild>
            <Button variant="secondary">Cancel</Button>
          </DialogClose>
          <Button onClick={handleDone}>Save zones</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
