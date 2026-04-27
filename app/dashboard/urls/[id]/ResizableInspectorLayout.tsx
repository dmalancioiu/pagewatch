'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

const STORAGE_KEY = 'pagewatch.monitorInspectorWidth'
const MIN_WIDTH = 280
const MAX_WIDTH = 460
const DEFAULT_WIDTH = 320

function clamp(value: number) {
  return Math.min(MAX_WIDTH, Math.max(MIN_WIDTH, value))
}

export function ResizableInspectorLayout({ main, inspector }: { main: React.ReactNode; inspector: React.ReactNode }) {
  const [width, setWidth] = useState(DEFAULT_WIDTH)
  const [dragging, setDragging] = useState(false)
  const [hovered, setHovered] = useState(false)
  const raf = useRef<number | null>(null)

  const applyWidth = useCallback((next: number, persist = true) => {
    const clamped = clamp(next)
    setWidth(clamped)
    if (persist) window.localStorage.setItem(STORAGE_KEY, String(clamped))
  }, [])

  useEffect(() => {
    const saved = window.localStorage.getItem(STORAGE_KEY)
    applyWidth(saved ? Number(saved) : DEFAULT_WIDTH, false)
  }, [applyWidth])

  function startDrag(e: React.PointerEvent<HTMLButtonElement>) {
    e.preventDefault()
    setDragging(true)
    const startX = e.clientX
    const startWidth = width

    function onMove(ev: PointerEvent) {
      if (raf.current) cancelAnimationFrame(raf.current)
      raf.current = requestAnimationFrame(() => {
        const delta = startX - ev.clientX
        applyWidth(startWidth + delta)
      })
    }

    function onUp() {
      setDragging(false)
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerup', onUp)
      if (raf.current) cancelAnimationFrame(raf.current)
    }

    window.addEventListener('pointermove', onMove)
    window.addEventListener('pointerup', onUp)
  }

  const active = hovered || dragging

  return (
    <div style={{ minHeight: 'calc(100vh - 52px)', position: 'relative' }}>
      <div
        className="canvas-dot-bg"
        style={{
          minHeight: 'calc(100vh - 52px)',
          padding: '20px 24px',
          paddingRight: width + 24,
        }}
      >
        {main}
      </div>

      <button
        type="button"
        aria-label="Resize inspector"
        onPointerDown={startDrag}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          position: 'fixed',
          top: 52,
          right: width - 13,
          zIndex: 60,
          width: 24,
          height: 'calc(100vh - 52px)',
          border: 'none',
          background: 'transparent',
          cursor: 'col-resize',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <span
          style={{
            width: 18,
            height: 54,
            borderRadius: 999,
            background: active ? '#FFFFFF' : 'rgba(255,255,255,0.68)',
            border: `1px solid ${active ? 'rgba(37,99,235,0.22)' : 'rgba(148,163,184,0.22)'}`,
            boxShadow: active ? '0 10px 24px rgba(15,23,42,0.12)' : '0 4px 14px rgba(15,23,42,0.06)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'background 120ms ease, border-color 120ms ease, box-shadow 120ms ease, transform 120ms ease',
            transform: active ? 'scale(1.02)' : 'scale(1)',
          }}
        >
          <span style={{ display: 'grid', gridTemplateRows: 'repeat(3, 3px)', gap: 4 }}>
            {[0, 1, 2].map((dot) => (
              <span
                key={dot}
                style={{
                  width: 3,
                  height: 3,
                  borderRadius: '50%',
                  background: active ? '#2563EB' : '#94A3B8',
                  opacity: active ? 0.9 : 0.58,
                }}
              />
            ))}
          </span>
        </span>
      </button>

      <aside
        className="inspector-panel"
        style={{
          position: 'fixed',
          top: 52,
          right: 0,
          bottom: 0,
          width,
          minWidth: MIN_WIDTH,
          maxWidth: MAX_WIDTH,
          overflowY: 'auto',
          borderLeft: '1px solid #E6EAF0',
          background: '#FFFFFF',
          zIndex: 50,
        }}
      >
        {inspector}
      </aside>
    </div>
  )
}
