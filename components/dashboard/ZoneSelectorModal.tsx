'use client'

import { useState } from 'react'
import { X, Target, MousePointer2, Trash2, Info } from 'lucide-react'
import { ZoneSelector } from './ZoneSelector'
import type { Zone } from './ZoneSelector'
import type { ZoneSensitivity } from '@/lib/types/database.types'

const ZONE_PALETTE = [
  '#2563EB', '#16A34A', '#D97706', '#9333EA', '#0891B2', '#DC2626', '#7C3AED', '#0EA5E9',
]

const BLUE = '#2563EB'

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

  function updateZone(id: string, patch: Partial<Zone>) {
    setLocalZones(prev => prev.map(z => z.id === id ? { ...z, ...patch } : z))
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
        background: 'rgba(15,23,42,0.52)',
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
        maxWidth: 1180,
        height: 'min(88vh, 860px)',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        boxShadow: '0 40px 100px rgba(15,23,42,0.35), 0 0 0 0.5px rgba(15,23,42,0.08)',
      }}>

        {/* ── Header ── */}
        <div style={{
          padding: '16px 22px',
          borderBottom: '0.5px solid rgba(15,23,42,0.1)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          flexShrink: 0,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{
              width: 36, height: 36, borderRadius: 10,
              background: 'rgba(37,99,235,0.1)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Target style={{ width: 17, height: 17, color: BLUE }} />
            </div>
            <div>
              <h2 style={{ fontSize: 16, fontWeight: 700, color: '#0F172A', letterSpacing: '-0.02em', lineHeight: 1 }}>
                Focus Zones
              </h2>
              <p style={{ fontSize: 12, color: '#64748B', marginTop: 3 }}>
                Draw regions, then give each zone its own watch instruction.
              </p>
            </div>
            {localZones.length > 0 && (
              <span style={{
                fontSize: 11, fontWeight: 700, color: BLUE,
                background: 'rgba(37,99,235,0.08)',
                padding: '3px 9px', borderRadius: 99,
                letterSpacing: '-0.01em',
              }}>
                {localZones.length} zone{localZones.length !== 1 ? 's' : ''}
              </span>
            )}
          </div>
          <button
            onClick={handleClose}
            style={{
              width: 30, height: 30, borderRadius: '50%',
              background: 'rgba(15,23,42,0.06)', border: 'none',
              display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
            }}
          >
            <X style={{ width: 15, height: 15, color: '#64748B' }} />
          </button>
        </div>

        {/* ── Body ── */}
        <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 340px', overflow: 'hidden', minHeight: 0 }}>

          {/* Screenshot canvas */}
          <div style={{
            overflow: 'auto',
            background: '#F8FAFC',
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
              background: 'rgba(37,99,235,0.06)',
              borderRadius: 10,
              border: '0.5px solid rgba(37,99,235,0.16)',
            }}>
              <MousePointer2 style={{ width: 13, height: 13, color: BLUE, flexShrink: 0 }} />
              <span style={{ fontSize: 12, color: BLUE, fontWeight: 500 }}>
                Click and drag on the screenshot below to draw a focus zone. Select a zone to rename it.
              </span>
            </div>

            <div style={{
              width: '100%', maxWidth: 900,
              borderRadius: 10, overflow: 'hidden',
              boxShadow: '0 2px 20px rgba(15,23,42,0.12), 0 0 0 0.5px rgba(15,23,42,0.1)',
            }}>
              <ZoneSelector imageUrl={imageUrl} zones={localZones} onChange={setLocalZones} />
            </div>
          </div>

          {/* Right panel — zone list */}
          <div style={{
            borderLeft: '0.5px solid rgba(15,23,42,0.08)',
            background: '#FAFAFA',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
          }}>

            {/* Panel header */}
            <div style={{
              padding: '14px 18px',
              borderBottom: '0.5px solid rgba(15,23,42,0.06)',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            }}>
              <span style={{ fontSize: 11, fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.07em' }}>
                Zone instructions
              </span>
              {localZones.length > 0 && (
                <button
                  onClick={() => setLocalZones([])}
                  style={{
                    padding: '3px 9px',
                    background: 'rgba(239,68,68,0.07)',
                    color: '#EF4444',
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
                    background: 'rgba(15,23,42,0.04)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 14,
                  }}>
                    <Target style={{ width: 22, height: 22, color: '#94A3B8' }} />
                  </div>
                  <p style={{ fontSize: 13, fontWeight: 600, color: '#64748B', marginBottom: 6 }}>No zones yet</p>
                  <p style={{ fontSize: 12, color: '#94A3B8', lineHeight: 1.6 }}>
                    Draw a rectangle on the screenshot to focus monitoring on specific regions.
                  </p>
                </div>
              ) : (
                localZones.map((zone, i) => {
                  const color = zoneColor(i)
                  const sensitivity = zone.sensitivity ?? 'normal'
                  return (
                    <div
                      key={zone.id}
                      style={{
                        padding: '11px 12px', marginBottom: 8,
                        background: 'white', borderRadius: 12,
                        border: `0.5px solid ${color}33`,
                        boxShadow: '0 1px 3px rgba(15,23,42,0.04)',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 9 }}>
                        <div style={{
                          width: 14, height: 14, borderRadius: 4,
                          background: color, flexShrink: 0,
                          boxShadow: `0 0 0 2px ${color}22`,
                        }} />
                        <input
                          type="text"
                          value={zone.label ?? ''}
                          onChange={(e) => updateZone(zone.id, { label: e.target.value })}
                          placeholder={`Zone ${i + 1}`}
                          style={{
                            flex: 1, background: 'transparent', border: 'none', outline: 'none',
                            fontSize: 13, fontWeight: 650, color: '#0F172A',
                            fontFamily: 'inherit', minWidth: 0,
                          }}
                        />
                        <button
                          onClick={() => deleteZone(zone.id)}
                          style={{
                            width: 26, height: 26, borderRadius: 7,
                            background: 'transparent', border: 'none', cursor: 'pointer',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                            color: '#94A3B8',
                            transition: 'background 0.15s, color 0.15s',
                          }}
                          onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(239,68,68,0.08)'; (e.currentTarget as HTMLButtonElement).style.color = '#EF4444' }}
                          onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'transparent'; (e.currentTarget as HTMLButtonElement).style.color = '#94A3B8' }}
                        >
                          <Trash2 style={{ width: 13, height: 13 }} />
                        </button>
                      </div>

                      <label style={{ display: 'block', fontSize: 10, fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 5 }}>
                        Watch instruction
                      </label>
                      <textarea
                        rows={3}
                        value={zone.instruction ?? ''}
                        onChange={(e) => updateZone(zone.id, { instruction: e.target.value })}
                        placeholder={`e.g. Alert me if ${zone.label || 'this zone'} changes.`}
                        style={{
                          width: '100%', resize: 'vertical', minHeight: 64,
                          padding: '8px 9px', borderRadius: 8,
                          border: '1px solid #E5E7EB', outline: 'none',
                          fontSize: 12, lineHeight: 1.45, color: '#0F172A',
                          fontFamily: 'inherit', background: '#F8FAFC',
                        }}
                      />

                      <div style={{ marginTop: 9 }}>
                        <p style={{ fontSize: 10, fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 5 }}>
                          Sensitivity
                        </p>
                        <div style={{ display: 'flex', gap: 5 }}>
                          {(['low', 'normal', 'high'] as ZoneSensitivity[]).map(s => (
                            <button
                              key={s}
                              onClick={() => updateZone(zone.id, { sensitivity: s })}
                              style={{
                                flex: 1, padding: '5px 0', borderRadius: 7,
                                border: `1px solid ${sensitivity === s ? color : '#E5E7EB'}`,
                                background: sensitivity === s ? `${color}12` : '#FFFFFF',
                                color: sensitivity === s ? color : '#94A3B8',
                                cursor: 'pointer', fontSize: 10, fontWeight: 700,
                                textTransform: 'capitalize',
                              }}
                            >
                              {s}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  )
                })
              )}
            </div>

            {/* How it works */}
            <div style={{
              padding: '14px 18px',
              borderTop: '0.5px solid rgba(15,23,42,0.06)',
              background: 'rgba(15,23,42,0.02)',
            }}>
              <div style={{ display: 'flex', gap: 6, marginBottom: 8 }}>
                <Info style={{ width: 11, height: 11, color: '#94A3B8', marginTop: 1, flexShrink: 0 }} />
                <span style={{ fontSize: 10, fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  How zones work
                </span>
              </div>
              {[
                'Only pixels inside zones are compared',
                'Each zone can have a separate watch instruction',
                'Zones save when you click Save Zones',
              ].map(tip => (
                <p key={tip} style={{ fontSize: 11, color: '#94A3B8', lineHeight: 1.6, paddingLeft: 17 }}>
                  · {tip}
                </p>
              ))}
            </div>

            {/* Action footer */}
            <div style={{
              padding: '14px 18px',
              borderTop: '0.5px solid rgba(15,23,42,0.08)',
              display: 'flex', gap: 8,
            }}>
              <button
                onClick={handleClose}
                style={{
                  flex: 1, padding: '10px',
                  background: 'rgba(15,23,42,0.05)', color: '#0F172A',
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
                  background: BLUE, color: 'white',
                  border: 'none', borderRadius: 10,
                  fontSize: 13, fontWeight: 600, cursor: 'pointer',
                  boxShadow: '0 2px 8px rgba(37,99,235,0.35)',
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
