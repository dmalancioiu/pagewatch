'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { PanelRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'

const STORAGE_KEY = 'pagewatch.monitorInspectorWidth'
const MIN_WIDTH = 280
const MAX_WIDTH = 440
const DEFAULT_WIDTH = 320
const BREAKPOINT = '(min-width: 1100px)'

function clamp(value: number) {
  return Math.min(MAX_WIDTH, Math.max(MIN_WIDTH, value))
}

/** True once we know the viewport is at least 1100px wide. Defaults to true
 *  (desktop) for the first paint so nothing flashes on a fast connection —
 *  the mobile trigger button appears the instant `matchMedia` says otherwise. */
function useIsWideViewport() {
  const [isWide, setIsWide] = useState(true)

  useEffect(() => {
    const mql = window.matchMedia(BREAKPOINT)
    setIsWide(mql.matches)
    const onChange = (e: MediaQueryListEvent) => setIsWide(e.matches)
    mql.addEventListener('change', onChange)
    return () => mql.removeEventListener('change', onChange)
  }, [])

  return isWide
}

interface Props {
  main: React.ReactNode
  inspector: React.ReactNode
}

/**
 * Main content plus a settings rail. At 1100px and above the rail is a
 * resizable, always-visible aside; below that it moves into a `Sheet` opened
 * from a "Monitor settings" trigger, so the settings panel mounts exactly
 * once regardless of viewport.
 */
export function ResizableInspectorLayout({ main, inspector }: Props) {
  const isWide = useIsWideViewport()
  const [width, setWidth] = useState(DEFAULT_WIDTH)
  const [sheetOpen, setSheetOpen] = useState(false)
  const raf = useRef<number | null>(null)

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY)
      if (saved) setWidth(clamp(Number(saved)))
    } catch {
      // localStorage unavailable — keep the default width.
    }
  }, [])

  const applyWidth = useCallback((next: number) => {
    const clamped = clamp(next)
    setWidth(clamped)
    try {
      window.localStorage.setItem(STORAGE_KEY, String(clamped))
    } catch {
      // best-effort persistence only
    }
  }, [])

  function startDrag(e: React.PointerEvent<HTMLButtonElement>) {
    e.preventDefault()
    const startX = e.clientX
    const startWidth = width

    function onMove(ev: PointerEvent) {
      if (raf.current) cancelAnimationFrame(raf.current)
      raf.current = requestAnimationFrame(() => applyWidth(startWidth + (startX - ev.clientX)))
    }
    function onUp() {
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerup', onUp)
      if (raf.current) cancelAnimationFrame(raf.current)
    }
    window.addEventListener('pointermove', onMove)
    window.addEventListener('pointerup', onUp)
  }

  if (!isWide) {
    return (
      <div className="flex flex-col gap-3">
        <div className="min-w-0">{main}</div>
        <Button
          variant="secondary"
          className="justify-center"
          iconLeft={<PanelRight className="size-3.5" />}
          onClick={() => setSheetOpen(true)}
        >
          Monitor settings
        </Button>
        <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
          <SheetContent side="right" className="w-full max-w-sm gap-0 p-0">
            <SheetHeader className="sr-only">
              <SheetTitle>Monitor settings</SheetTitle>
            </SheetHeader>
            {inspector}
          </SheetContent>
        </Sheet>
      </div>
    )
  }

  return (
    <div className="flex items-start gap-0">
      <div className="min-w-0 flex-1">{main}</div>

      <button
        type="button"
        aria-label="Resize settings panel"
        onPointerDown={startDrag}
        className="flex w-2 shrink-0 cursor-col-resize items-center justify-center self-stretch"
      >
        <span className="h-10 w-1 rounded-full bg-border transition-colors duration-120 hover:bg-border-strong" />
      </button>

      {/* Width is a genuinely computed drag value. */}
      <aside className="shrink-0 overflow-hidden rounded-md border border-border bg-panel" style={{ width }}>
        {inspector}
      </aside>
    </div>
  )
}
