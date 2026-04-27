'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

const STORAGE_KEY = 'pagewatch.monitorInspectorWidth'
const MIN_WIDTH = 280
const MAX_WIDTH = 520
const DEFAULT_WIDTH = 320

function clamp(value: number) {
  return Math.min(MAX_WIDTH, Math.max(MIN_WIDTH, value))
}

export function ResizableInspectorLayout({ main, inspector }: { main: React.ReactNode; inspector: React.ReactNode }) {
  const [width, setWidth] = useState(DEFAULT_WIDTH)
  const [dragging, setDragging] = useState(false)
  const raf = useRef<number | null>(null)

  useEffect(() => {
    const saved = window.localStorage.getItem(STORAGE_KEY)
    if (saved) setWidth(clamp(Number(saved)))
  }, [])

  const commitWidth = useCallback((next: number) => {
    const clamped = clamp(next)
    setWidth(clamped)
    window.localStorage.setItem(STORAGE_KEY, String(clamped))
  }, [])

  function startDrag(e: React.PointerEvent<HTMLButtonElement>) {
    e.preventDefault()
    setDragging(true)
    const startX = e.clientX
    const startWidth = width

    function onMove(ev: PointerEvent) {
      if (raf.current) cancelAnimationFrame(raf.current)
      raf.current = requestAnimationFrame(() => {
        const delta = startX - ev.clientX
        commitWidth(startWidth + delta)
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
      }}
    >
      <div className="canvas-dot-bg" style={{ padding: '20px 24px', minHeight: 'calc(100vh - 52px)', minWidth: 0 }}>
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
