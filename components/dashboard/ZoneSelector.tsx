'use client'

import { useRef, useState } from 'react'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Zone } from '@/lib/types/database.types'

export type { Zone }

interface Props {
  imageUrl: string
  zones: Zone[]
  onChange?: (zones: Zone[]) => void
  readonly?: boolean
}

/**
 * Zones are user data, not status — there's no single semantic token for
 * "zone 3". This cycles through the design system's five categorical tokens
 * (never `--diff`, which is reserved for change overlays) so each zone reads
 * as a distinct colour without introducing a raw hex.
 */
const ZONE_TONES = [
  { border: 'border-accent', bg: 'bg-accent/15', chip: 'bg-accent text-accent-fg', dot: 'bg-accent' },
  { border: 'border-ok', bg: 'bg-ok/15', chip: 'bg-ok text-accent-fg', dot: 'bg-ok' },
  { border: 'border-warn', bg: 'bg-warn/15', chip: 'bg-warn text-accent-fg', dot: 'bg-warn' },
  { border: 'border-info', bg: 'bg-info/15', chip: 'bg-info text-accent-fg', dot: 'bg-info' },
  { border: 'border-critical', bg: 'bg-critical/15', chip: 'bg-critical text-accent-fg', dot: 'bg-critical' },
] as const

export function zoneTone(i: number) {
  return ZONE_TONES[i % ZONE_TONES.length]
}

interface DrawState {
  startX: number
  startY: number
  endX: number
  endY: number
}

export function ZoneSelector({ imageUrl, zones, onChange, readonly = false }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [drawing, setDrawing] = useState<DrawState | null>(null)
  const [selectedId, setSelectedId] = useState<string | null>(null)

  function getRelCoords(e: React.MouseEvent): { x: number; y: number } {
    const rect = containerRef.current!.getBoundingClientRect()
    return {
      x: Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width)),
      y: Math.max(0, Math.min(1, (e.clientY - rect.top) / rect.height)),
    }
  }

  function onMouseDown(e: React.MouseEvent) {
    if (readonly || !onChange) return
    if ((e.target as HTMLElement).closest('[data-zone-id]')) return
    e.preventDefault()
    setSelectedId(null)
    const { x, y } = getRelCoords(e)
    setDrawing({ startX: x, startY: y, endX: x, endY: y })
  }

  function onMouseMove(e: React.MouseEvent) {
    if (!drawing) return
    const { x, y } = getRelCoords(e)
    setDrawing((d) => (d ? { ...d, endX: x, endY: y } : null))
  }

  function onMouseUp() {
    if (!drawing || !onChange) return
    const minX = Math.min(drawing.startX, drawing.endX)
    const minY = Math.min(drawing.startY, drawing.endY)
    const w = Math.abs(drawing.endX - drawing.startX)
    const h = Math.abs(drawing.endY - drawing.startY)
    setDrawing(null)
    if (w > 0.02 && h > 0.02) {
      onChange([
        ...zones,
        {
          id: `zone-${Date.now()}`,
          x: minX,
          y: minY,
          width: w,
          height: h,
        },
      ])
    }
  }

  function deleteZone(id: string) {
    setSelectedId(null)
    onChange?.(zones.filter((z) => z.id !== id))
  }

  function updateLabel(id: string, label: string) {
    onChange?.(zones.map((z) => (z.id === id ? { ...z, label } : z)))
  }

  const previewStyle = drawing
    ? {
        left: `${Math.min(drawing.startX, drawing.endX) * 100}%`,
        top: `${Math.min(drawing.startY, drawing.endY) * 100}%`,
        width: `${Math.abs(drawing.endX - drawing.startX) * 100}%`,
        height: `${Math.abs(drawing.endY - drawing.startY) * 100}%`,
      }
    : null

  return (
    <div
      ref={containerRef}
      className={cn('relative w-full select-none', readonly ? 'cursor-default' : 'cursor-crosshair')}
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
      onMouseLeave={() => setDrawing(null)}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={imageUrl}
        alt="Screenshot"
        className="block w-full select-none"
        draggable={false}
        style={{ pointerEvents: 'none' }}
      />

      {zones.map((zone, i) => {
        if (!zone.id) return null
        const tone = zoneTone(i)
        const isSelected = selectedId === zone.id
        return (
          <div
            key={zone.id}
            data-zone-id={zone.id}
            className={cn(
              'absolute box-border border-2',
              tone.border,
              isSelected ? tone.bg : 'bg-transparent',
              readonly ? 'cursor-default' : 'cursor-pointer'
            )}
            style={{
              left: `${zone.x * 100}%`,
              top: `${zone.y * 100}%`,
              width: `${zone.width * 100}%`,
              height: `${zone.height * 100}%`,
            }}
            onClick={(e) => {
              if (readonly) return
              e.stopPropagation()
              setSelectedId(isSelected ? null : zone.id!)
            }}
          >
            <div
              className={cn(
                'pointer-events-none absolute left-0 top-0 -translate-y-full whitespace-nowrap px-1.5 py-0.5 text-label leading-none',
                tone.chip
              )}
            >
              {zone.label?.trim() || `Zone ${i + 1}`}
            </div>

            {isSelected && !readonly && (
              <div
                className="absolute inset-x-0 bottom-0 flex items-center gap-1 border-t border-border-strong bg-panel-raised/95 px-1.5 py-1"
                onClick={(e) => e.stopPropagation()}
              >
                <input
                  type="text"
                  placeholder="Label this zone…"
                  value={zone.label ?? ''}
                  onChange={(e) => updateLabel(zone.id!, e.target.value)}
                  className="min-w-0 flex-1 bg-transparent text-meta text-text outline-none"
                  autoFocus
                />
                <button
                  type="button"
                  title="Delete zone"
                  aria-label="Delete zone"
                  onMouseDown={(e) => e.stopPropagation()}
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    deleteZone(zone.id!)
                  }}
                  className="shrink-0 rounded-sm p-0.5 text-critical transition-colors duration-120 hover:bg-critical/10"
                >
                  <X className="size-3" />
                </button>
              </div>
            )}
          </div>
        )
      })}

      {previewStyle && (
        <div
          key="__preview__"
          className="pointer-events-none absolute box-border border-2 border-dashed border-accent bg-accent/10"
          style={previewStyle}
        />
      )}

      {zones.length === 0 && !drawing && !readonly && (
        <div key="__hint__" className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="rounded-md border border-dashed border-border-strong bg-panel/85 px-4 py-2.5 text-ui-medium text-text">
            Click and drag to define a focus zone
          </div>
        </div>
      )}
    </div>
  )
}
