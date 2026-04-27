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
        style={{
          position: 'fixed',
          top: 52,
          right: width - 5,
          zIndex: 60,
          width: 10,
          height: 'calc(100vh - 52px)',
          border: 'none',
          background: 'transparent',
          cursor: 'col-resize',
        }}
      >
        <span
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 3,
            height: 42,
            borderRadius: 999,
            background: dragging ? '#2563EB' : '#D8DEE8',
          }}
        />
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
