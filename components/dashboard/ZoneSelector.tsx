'use client'

import { useState, useRef } from 'react'
import { X } from 'lucide-react'
import type { Zone } from '@/lib/types/database.types'

export type { Zone }

interface Props {
  imageUrl:  string
  zones:     Zone[]
  onChange?: (zones: Zone[]) => void
  readonly?: boolean
}

// Cycle through these for zone borders / labels
const ZONE_COLORS = [
  '#00ff88', '#4d8dff', '#ff884d', '#cc44ff', '#44e5ff', '#ffd644',
]

function zoneColor(i: number) {
  return ZONE_COLORS[i % ZONE_COLORS.length]
}

interface DrawState {
  startX: number
  startY: number
  endX:   number
  endY:   number
}

export function ZoneSelector({ imageUrl, zones, onChange, readonly = false }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [drawing,    setDrawing]    = useState<DrawState | null>(null)
  const [selectedId, setSelectedId] = useState<string | null>(null)

  /* ── Coordinate helpers ── */

  function getRelCoords(e: React.MouseEvent): { x: number; y: number } {
    const rect = containerRef.current!.getBoundingClientRect()
    return {
      x: Math.max(0, Math.min(1, (e.clientX - rect.left)  / rect.width)),
      y: Math.max(0, Math.min(1, (e.clientY - rect.top)   / rect.height)),
    }
  }

  /* ── Drawing handlers ── */

  function onMouseDown(e: React.MouseEvent) {
    if (readonly || !onChange) return
    // If clicking on a zone element, select it — don't start a new draw
    if ((e.target as HTMLElement).closest('[data-zone-id]')) return
    e.preventDefault()
    setSelectedId(null)
    const { x, y } = getRelCoords(e)
    setDrawing({ startX: x, startY: y, endX: x, endY: y })
  }

  function onMouseMove(e: React.MouseEvent) {
    if (!drawing) return
    const { x, y } = getRelCoords(e)
    setDrawing((d) => d ? { ...d, endX: x, endY: y } : null)
  }

  function onMouseUp() {
    if (!drawing || !onChange) return
    const minX = Math.min(drawing.startX, drawing.endX)
    const minY = Math.min(drawing.startY, drawing.endY)
    const w    = Math.abs(drawing.endX - drawing.startX)
    const h    = Math.abs(drawing.endY - drawing.startY)

    // Require at least 2% in each dimension to avoid accidental single-clicks
    if (w > 0.02 && h > 0.02) {
      const next: Zone = {
        id:     `zone-${Date.now()}`,
        x:      minX,
        y:      minY,
        width:  w,
        height: h,
      }
      onChange([...zones, next])
    }
    setDrawing(null)
  }

  /* ── Zone actions ── */

  function deleteZone(id: string) {
    onChange?.(zones.filter((z) => z.id !== id))
    setSelectedId(null)
  }

  function updateLabel(id: string, label: string) {
    onChange?.(zones.map((z) => (z.id === id ? { ...z, label } : z)))
  }

  /* ── Preview rect from current draw ── */

  const previewStyle = drawing
    ? {
        left:   `${Math.min(drawing.startX, drawing.endX) * 100}%`,
        top:    `${Math.min(drawing.startY, drawing.endY) * 100}%`,
        width:  `${Math.abs(drawing.endX - drawing.startX) * 100}%`,
        height: `${Math.abs(drawing.endY - drawing.startY) * 100}%`,
      }
    : null

  return (
    <div
      ref={containerRef}
      className="relative select-none w-full"
      style={{ cursor: readonly ? 'default' : 'crosshair' }}
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
      onMouseLeave={() => setDrawing(null)}
    >
      {/* Screenshot */}
      <img
        src={imageUrl}
        alt="Screenshot"
        className="w-full block"
        draggable={false}
        style={{ pointerEvents: 'none', userSelect: 'none' }}
      />

      {/* Existing zones */}
      {zones.map((zone, i) => {
        const color      = zoneColor(i)
        const isSelected = selectedId === zone.id
        return (
          <div
            key={zone.id}
            data-zone-id={zone.id}
            className="absolute"
            style={{
              left:       `${zone.x      * 100}%`,
              top:        `${zone.y      * 100}%`,
              width:      `${zone.width  * 100}%`,
              height:     `${zone.height * 100}%`,
              border:     `2px solid ${color}`,
              background: isSelected ? `${color}28` : `${color}14`,
              cursor:     readonly ? 'default' : 'pointer',
              boxSizing:  'border-box',
            }}
            onClick={(e) => {
              if (readonly) return
              e.stopPropagation()
              setSelectedId(isSelected ? null : zone.id)
            }}
          >
            {/* Label badge — always visible at top-left */}
            <div
              className="absolute text-[10px] font-bold px-1.5 py-0.5 leading-none whitespace-nowrap pointer-events-none"
              style={{
                top:             0,
                left:            0,
                transform:       'translateY(-100%)',
                background:      color,
                color:           '#000',
                borderRadius:    '3px 3px 0 0',
                maxWidth:        '100%',
                overflow:        'hidden',
                textOverflow:    'ellipsis',
              }}
            >
              {zone.label?.trim() || `Zone ${i + 1}`}
            </div>

            {/* Controls when selected */}
            {isSelected && !readonly && (
              <div
                className="absolute flex items-center gap-1 px-1.5 py-1"
                style={{
                  bottom:          0,
                  left:            0,
                  right:           0,
                  background:      'rgba(0,0,0,0.82)',
                  borderTop:       `1px solid ${color}55`,
                }}
                onClick={(e) => e.stopPropagation()}
              >
                <input
                  type="text"
                  placeholder="Label this zone…"
                  value={zone.label ?? ''}
                  onChange={(e) => updateLabel(zone.id, e.target.value)}
                  className="flex-1 text-[11px] bg-transparent text-white outline-none min-w-0"
                  style={{ caretColor: color }}
                  autoFocus
                />
                <button
                  type="button"
                  title="Delete zone"
                  onClick={() => deleteZone(zone.id)}
                  className="flex-shrink-0 p-0.5 rounded hover:bg-red-500/20 transition-colors"
                  style={{ color: '#ff7070' }}
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            )}
          </div>
        )
      })}

      {/* Drawing preview */}
      {previewStyle && (
        <div
          className="absolute pointer-events-none"
          style={{
            ...previewStyle,
            border:     '2px dashed #00ff88',
            background: 'rgba(0,255,136,0.08)',
            boxSizing:  'border-box',
          }}
        />
      )}

      {/* "Draw zones" hint when empty and not readonly */}
      {zones.length === 0 && !drawing && !readonly && (
        <div
          className="absolute inset-0 flex items-center justify-center pointer-events-none"
        >
          <div
            className="px-4 py-2.5 rounded-xl text-sm font-medium"
            style={{
              background: 'rgba(0,0,0,0.65)',
              border:     '1px dashed rgba(0,255,136,0.4)',
              color:      'rgba(0,255,136,0.8)',
              backdropFilter: 'blur(4px)',
            }}
          >
            Click and drag to define a tracking zone
          </div>
        </div>
      )}
    </div>
  )
}
