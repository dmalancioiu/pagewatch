'use client'

import { useState } from 'react'
import { X, Target, MousePointer2, Trash2, Info } from 'lucide-react'
import { ZoneSelector } from './ZoneSelector'
import type { Zone } from './ZoneSelector'

const ZONE_PALETTE = [
  '#16A34A', '#30D158', '#FF9500', '#AF52DE', '#32ADE6', '#FF3B30', '#FFD60A', '#FF6B6B',
]

function zoneColor(i: number) { return ZONE_PALETTE[i % ZONE_PALETTE.length] }

interface Props {
  isOpen: boolean
  onClose: () => void
  imageUrl: string
  zones: Zone[]
  onChange: (zones: Zone[]) => void
}

export function ZoneSelectorModal({ isOpen, onClose, imageUrl, zones, onChange }: Props) {
  const [localZones, setLocalZones] = useState<Zone[]>(zones)

  function handleDone() {
    onChange(localZones)
    onClose()
  }

  function handleClose() {
    setLocalZones(zones) // discard
    onClose()
  }

  function updateLabel(id: string, label: string) {
    setLocalZones(prev => prev.map(z => z.id === id ? { ...z, label } : z))
  }

  function deleteZone(id: string) {
    setLocalZones(prev => prev.filter(z => z.id !== id))
  }

  if (!isOpen) return null

  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 9999,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: 'rgba(0,0,0,0.48)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        padding: 20,
        fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Helvetica Neue", Arial, sans-serif',
      }}
      onClick={(e) => { if (e.target === e.currentTarget) handleClose() }}
    >
      <div style={{
        background: '#FFFFFF',
        borderRadius: 18,
        width: '100%',
        maxWidth: 1160,
        height: 'min(88vh, 840px)',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        boxShadow: '0 40px 100px rgba(0,0,0,0.35), 0 0 0 0.5px rgba(0,0,0,0.08)',
      }}>

        {/* ── Header ── */}
        <div style={{
          padding: '16px 22px',
          borderBottom: '0.5px solid rgba(0,0,0,0.1)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          flexShrink: 0,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{
              width: 36, height: 36, borderRadius: 10,
              background: 'rgba(22,163,74,0.1)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Target style={{ width: 17, height: 17, color: '#16A34A' }} />
            </div>
            <div>
              <h2 style={{ fontSize: 16, fontWeight: 700, color: '#1D1D1F', letterSpacing: '-0.02em', lineHeight: 1 }}>
                Focus Zones
              </h2>
              <p style={{ fontSize: 12, color: '#6E6E73', marginTop: 3 }}>
                Drag to draw regions — AI focuses diff analysis within these areas only.
              </p>
            </div>
            {localZones.length > 0 && (
              <span style={{
                fontSize: 11, fontWeight: 700, color: '#16A34A',
                background: 'rgba(22,163,74,0.08)',
                padding: '3px 9px', borderRadius: 99,
                letterSpacing: '-0.01em',
              }}>
                {localZones.length} zone{localZones.length !== 1 ? 's' : ''}
              </span>
            )}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <button
              onClick={handleClose}
              style={{
                width: 30, height: 30, borderRadius: '50%',
                background: 'rgba(0,0,0,0.06)', border: 'none',
                display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
              }}
            >
              <X style={{ width: 15, height: 15, color: '#6E6E73' }} />
            </button>
          </div>
        </div>

        {/* ── Body ── */}
        <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 300px', overflow: 'hidden', minHeight: 0 }}>

          {/* Screenshot canvas */}
          <div style={{
            overflow: 'auto',
            background: '#F5F5F7',
            padding: 28,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}>
            {/* Instruction banner */}
            <div style={{
              width: '100%', maxWidth: 900, marginBottom: 14,
              display: 'flex', alignItems: 'center', gap: 8,
              padding: '9px 14px',
              background: 'rgba(22,163,74,0.06)',
              borderRadius: 10,
              border: '0.5px solid rgba(22,163,74,0.15)',
            }}>
              <MousePointer2 style={{ width: 13, height: 13, color: '#16A34A', flexShrink: 0 }} />
              <span style={{ fontSize: 12, color: '#16A34A', fontWeight: 500 }}>
                Click and drag on the screenshot below to draw a focus zone. Click a zone to select it.
              </span>
            </div>

            <div style={{
              width: '100%', maxWidth: 900,
              borderRadius: 10, overflow: 'hidden',
              boxShadow: '0 2px 20px rgba(0,0,0,0.12), 0 0 0 0.5px rgba(0,0,0,0.1)',
            }}>
              <ZoneSelector imageUrl={imageUrl} zones={localZones} onChange={setLocalZones} />
            </div>
          </div>

          {/* Right panel — zone list */}
          <div style={{
            borderLeft: '0.5px solid rgba(0,0,0,0.08)',
            background: '#FAFAFA',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
          }}>

            {/* Panel header */}
            <div style={{
              padding: '14px 18px',
              borderBottom: '0.5px solid rgba(0,0,0,0.06)',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            }}>
              <span style={{ fontSize: 11, fontWeight: 700, color: '#AEAEB2', textTransform: 'uppercase', letterSpacing: '0.07em' }}>
                Defined Zones
              </span>
              {localZones.length > 0 && (
                <button
                  onClick={() => setLocalZones([])}
                  style={{
                    padding: '3px 9px',
                    background: 'rgba(255,59,48,0.07)',
                    color: '#FF3B30',
                    border: 'none', borderRadius: 6,
                    fontSize: 11, fontWeight: 600, cursor: 'pointer',
                  }}
                >
                  Clear all
                </button>
              )}
            </div>

            {/* Zone list */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '10px 12px', minHeight: 0 }}>
              {localZones.length === 0 ? (
                <div style={{
                  display: 'flex', flexDirection: 'column', alignItems: 'center',
                  justifyContent: 'center', height: '100%', padding: '32px 20px', textAlign: 'center',
                }}>
                  <div style={{
                    width: 52, height: 52, borderRadius: 14,
                    background: 'rgba(0,0,0,0.04)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 14,
                  }}>
                    <Target style={{ width: 22, height: 22, color: '#AEAEB2' }} />
                  </div>
                  <p style={{ fontSize: 13, fontWeight: 600, color: '#6E6E73', marginBottom: 6 }}>No zones yet</p>
                  <p style={{ fontSize: 12, color: '#AEAEB2', lineHeight: 1.6 }}>
                    Draw a rectangle on the screenshot to focus monitoring on specific regions.
                  </p>
                </div>
              ) : (
                localZones.map((zone, i) => {
                  const color = zoneColor(i)
                  return (
                    <div
                      key={zone.id}
                      style={{
                        display: 'flex', alignItems: 'center', gap: 10,
                        padding: '10px 12px', marginBottom: 6,
                        background: 'white', borderRadius: 10,
                        border: '0.5px solid rgba(0,0,0,0.08)',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
                      }}
                    >
                      {/* Color chip */}
                      <div style={{
                        width: 14, height: 14, borderRadius: 4,
                        background: color, flexShrink: 0,
                        boxShadow: `0 0 0 2px ${color}22`,
                      }} />

                      {/* Label input */}
                      <input
                        type="text"
                        value={zone.label ?? ''}
                        onChange={(e) => updateLabel(zone.id, e.target.value)}
                        placeholder={`Zone ${i + 1}`}
                        style={{
                          flex: 1, background: 'transparent', border: 'none', outline: 'none',
                          fontSize: 13, fontWeight: 500, color: '#1D1D1F',
                          fontFamily: 'inherit',
                        }}
                      />

                      {/* Delete */}
                      <button
                        onClick={() => deleteZone(zone.id)}
                        style={{
                          width: 26, height: 26, borderRadius: 7,
                          background: 'transparent', border: 'none', cursor: 'pointer',
                          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                          color: '#AEAEB2',
                          transition: 'background 0.15s, color 0.15s',
                        }}
                        onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,59,48,0.08)'; (e.currentTarget as HTMLButtonElement).style.color = '#FF3B30' }}
                        onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'transparent'; (e.currentTarget as HTMLButtonElement).style.color = '#AEAEB2' }}
                      >
                        <Trash2 style={{ width: 13, height: 13 }} />
                      </button>
                    </div>
                  )
                })
              )}
            </div>

            {/* How it works */}
            <div style={{
              padding: '14px 18px',
              borderTop: '0.5px solid rgba(0,0,0,0.06)',
              background: 'rgba(0,0,0,0.02)',
            }}>
              <div style={{ display: 'flex', gap: 6, marginBottom: 8 }}>
                <Info style={{ width: 11, height: 11, color: '#AEAEB2', marginTop: 1, flexShrink: 0 }} />
                <span style={{ fontSize: 10, fontWeight: 700, color: '#AEAEB2', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  How zones work
                </span>
              </div>
              {[
                'Only pixels inside zones are compared',
                'Click a zone on the canvas to rename it',
                'Zones save when you click Done',
              ].map(tip => (
                <p key={tip} style={{ fontSize: 11, color: '#AEAEB2', lineHeight: 1.6, paddingLeft: 17 }}>
                  · {tip}
                </p>
              ))}
            </div>

            {/* Action footer */}
            <div style={{
              padding: '14px 18px',
              borderTop: '0.5px solid rgba(0,0,0,0.08)',
              display: 'flex', gap: 8,
            }}>
              <button
                onClick={handleClose}
                style={{
                  flex: 1, padding: '10px',
                  background: 'rgba(0,0,0,0.04)', color: '#1D1D1F',
                  border: 'none', borderRadius: 10,
                  fontSize: 13, fontWeight: 600, cursor: 'pointer',
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleDone}
                style={{
                  flex: 2, padding: '10px',
                  background: '#16A34A', color: 'white',
                  border: 'none', borderRadius: 10,
                  fontSize: 13, fontWeight: 600, cursor: 'pointer',
                  boxShadow: '0 2px 8px rgba(22,163,74,0.35)',
                }}
              >
                Save Zones
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
