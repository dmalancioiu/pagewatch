'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

const STORAGE_KEY = 'pagewatch.monitorInspectorWidth'
const MIN_WIDTH = 280
const MAX_WIDTH = 440
const DEFAULT_WIDTH = 320
const MIN_MAIN_WIDTH = 760
const VIEWPORT_PADDING = 32

function maxInspectorWidth(viewportWidth?: number) {
  if (!viewportWidth) return MAX_WIDTH
  return Math.max(MIN_WIDTH, Math.min(MAX_WIDTH, viewportWidth - MIN_MAIN_WIDTH - VIEWPORT_PADDING))
}

function clamp(value: number, viewportWidth?: number) {
  const safeMax = maxInspectorWidth(viewportWidth)
  return Math.min(safeMax, Math.max(MIN_WIDTH, value))
}

export function ResizableInspectorLayout({ main, inspector }: { main: React.ReactNode; inspector: React.ReactNode }) {
  const [width, setWidth] = useState(DEFAULT_WIDTH)
  const [dragging, setDragging] = useState(false)
  const raf = useRef<number | null>(null)

  const applyWidth = useCallback((next: number, persist = true) => {
    const clamped = clamp(next, window.innerWidth)
    setWidth(clamped)
    if (persist) window.localStorage.setItem(STORAGE_KEY, String(clamped))
  }, [])

  useEffect(() => {
    function syncFromViewport() {
      const saved = window.localStorage.getItem(STORAGE_KEY)
      applyWidth(saved ? Number(saved) : DEFAULT_WIDTH, false)
    }

    syncFromViewport()
    window.addEventListener('resize', syncFromViewport)
    return () => window.removeEventListener('resize', syncFromViewport)
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
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: `minmax(0, 1fr) ${width}px`,
        alignItems: 'start',
        minHeight: 'calc(100vh - 52px)',
        position: 'relative',
        cursor: dragging ? 'col-resize' : undefined,
        overflowX: 'hidden',
      }}
    >
      <div className="canvas-dot-bg" style={{ padding: '20px 24px', minHeight: 'calc(100vh - 52px)', minWidth: 0, overflow: 'hidden' }}>
        {main}
      </div>

      <button
        type="button"
        aria-label="Resize inspector"
        onPointerDown={startDrag}
        style={{
          position: 'sticky',
          top: 52,
          alignSelf: 'start',
          zIndex: 20,
          width: 10,
          height: 'calc(100vh - 52px)',
          marginLeft: -5,
          marginRight: -5,
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
            boxShadow: dragging ? '0 0 0 4px rgba(37,99,235,0.08)' : 'none',
            transition: 'background 120ms ease, box-shadow 120ms ease',
          }}
        />
      </button>

      <aside
        className="inspector-panel"
        data-width={width}
        style={{
          position: 'sticky',
          top: 52,
          maxHeight: 'calc(100vh - 52px)',
          width,
          minWidth: MIN_WIDTH,
          overflowY: 'auto',
        }}
      >
        {inspector}
      </aside>
    </div>
  )
}
