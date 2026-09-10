'use client'

import { useEffect, useId, useMemo, useRef, useState } from 'react'
import { LineChart } from 'lucide-react'
import { EmptyState } from '@/components/ui/empty-state'
import type { PriceSeries } from '@/lib/history'

interface Props {
  series: PriceSeries[]
}

/**
 * Fixed categorical order for price series — accent first (the series a lone
 * tracked price gets), then the three semantic tokens this design system
 * otherwise reserves for status. There is no dedicated categorical ramp in
 * `app/globals.css` (out of bounds for this pass), so a monitor tracking more
 * than 4 prices at once folds the rest away rather than reusing a colour —
 * see the note in the component below.
 */
const SERIES_COLOR_VARS = ['--accent', '--info', '--ok', '--warn'] as const
/** Same order as `SERIES_COLOR_VARS`, for the plain-HTML legend/tooltip swatches (no inline style needed there). */
const SERIES_BG_CLASS = ['bg-accent', 'bg-info', 'bg-ok', 'bg-warn'] as const
const MAX_SERIES = SERIES_COLOR_VARS.length

const PAD_LEFT = 50
const PAD_RIGHT = 56
const PAD_TOP = 16
const PAD_BOTTOM = 26
const VIEW_W = 640
const VIEW_H = 220
const INNER_W = VIEW_W - PAD_LEFT - PAD_RIGHT
const INNER_H = VIEW_H - PAD_TOP - PAD_BOTTOM

function fmtMoney(amount: number, currency: string): string {
  try {
    return new Intl.NumberFormat(undefined, {
      style: 'currency',
      currency: currency || 'USD',
      maximumFractionDigits: Number.isInteger(amount) ? 0 : 2,
    }).format(amount)
  } catch {
    return `${amount}`
  }
}

function fmtAxisDate(ms: number, spanMs: number): string {
  const d = new Date(ms)
  if (spanMs < 36 * 60 * 60 * 1000) {
    return d.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' })
  }
  if (spanMs < 2 * 365 * 24 * 60 * 60 * 1000) {
    return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
  }
  return d.toLocaleDateString(undefined, { month: 'short', year: 'numeric' })
}

function fmtFullDate(iso: string): string {
  return new Date(iso).toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  })
}

/** Rounds a rough step to a "nice" 1/2/5×10^n number, the way every sane axis does. */
function niceStep(rough: number): number {
  if (rough <= 0) return 1
  const exp = Math.floor(Math.log10(rough))
  const base = rough / 10 ** exp
  const niceBase = base < 1.5 ? 1 : base < 3 ? 2 : base < 7 ? 5 : 10
  return niceBase * 10 ** exp
}

/** Nice tick values that fully contain [min, max] — every one of these is a value the y scale actually reaches. */
function niceTicks(min: number, max: number, targetCount: number): number[] {
  if (min === max) {
    min -= Math.max(1, Math.abs(min) * 0.1)
    max += Math.max(1, Math.abs(max) * 0.1)
  }
  const step = niceStep((max - min) / Math.max(1, targetCount))
  const niceMin = Math.floor(min / step) * step
  const niceMax = Math.ceil(max / step) * step
  const ticks: number[] = []
  for (let v = niceMin; v <= niceMax + step / 2; v += step) ticks.push(Math.round(v * 1000) / 1000)
  return ticks
}

function useContainerWidth<T extends HTMLElement>() {
  const ref = useRef<T>(null)
  const [width, setWidth] = useState(560)
  useEffect(() => {
    const el = ref.current
    if (!el || typeof ResizeObserver === 'undefined') return
    const ro = new ResizeObserver((entries) => {
      const w = entries[0]?.contentRect.width
      if (w) setWidth(w)
    })
    ro.observe(el)
    return () => ro.disconnect()
  }, [])
  return [ref, width] as const
}

export function ChangeChart({ series }: Props) {
  const shown = useMemo(() => series.slice(0, MAX_SERIES), [series])
  const [containerRef, containerWidth] = useContainerWidth<HTMLDivElement>()
  const compact = containerWidth < 600
  const titleId = useId()
  const descId = useId()

  const [hoverIndex, setHoverIndex] = useState<number | null>(null)
  const [focusIndex, setFocusIndex] = useState<number | null>(null)
  const svgRef = useRef<SVGSVGElement>(null)

  const captureCount = shown[0]?.points.length ?? 0

  const timestamps = useMemo(
    () => shown[0]?.points.map((p) => new Date(p.takenAt).getTime()) ?? [],
    [shown]
  )
  const tMin = timestamps[0] ?? 0
  const tMax = timestamps[timestamps.length - 1] ?? 1
  const tSpan = Math.max(1, tMax - tMin)

  const allAmounts = useMemo(
    () => shown.flatMap((s) => s.points.map((p) => p.amount).filter((a): a is number => a != null)),
    [shown]
  )
  const rawMin = allAmounts.length ? Math.min(...allAmounts) : 0
  const rawMax = allAmounts.length ? Math.max(...allAmounts) : 1
  const yTicks = useMemo(() => niceTicks(rawMin, rawMax, compact ? 3 : 4), [rawMin, rawMax, compact])
  const yMin = yTicks[0]
  const yMax = yTicks[yTicks.length - 1]
  const yRange = Math.max(1e-9, yMax - yMin)

  const xScale = useMemo(
    () => (i: number) => (timestamps.length < 2 ? PAD_LEFT + INNER_W / 2 : PAD_LEFT + ((timestamps[i] - tMin) / tSpan) * INNER_W),
    [timestamps, tMin, tSpan]
  )
  const yScale = useMemo(
    () => (v: number) => PAD_TOP + INNER_H - ((v - yMin) / yRange) * INNER_H,
    [yMin, yRange]
  )
  const baselineY = useMemo(() => yScale(yMin), [yScale, yMin])

  // X-axis ticks: real capture indices, evenly spaced — every label names a
  // timestamp the chart actually has a capture at. Fewer ticks when narrow,
  // per the "stay legible below ~600px" rule — never shrink the text instead.
  const xTickCount = compact ? 3 : 5
  const xTickIndices = useMemo(() => {
    if (captureCount === 0) return []
    if (captureCount === 1) return [0]
    const n = Math.min(xTickCount, captureCount)
    const idxs = Array.from({ length: n }, (_, i) => Math.round((i * (captureCount - 1)) / (n - 1)))
    return Array.from(new Set(idxs))
  }, [captureCount, xTickCount])

  const colorOf = (i: number) => `rgb(var(${SERIES_COLOR_VARS[i % SERIES_COLOR_VARS.length]}))`

  // One path (with gap-breaking subpaths) and one area per series.
  const seriesGeometry = useMemo(() => {
    return shown.map((s) => {
      const runs: { i: number; x: number; y: number }[][] = []
      let current: { i: number; x: number; y: number }[] = []
      s.points.forEach((p, i) => {
        if (p.amount == null) {
          if (current.length) runs.push(current)
          current = []
          return
        }
        current.push({ i, x: xScale(i), y: yScale(p.amount) })
      })
      if (current.length) runs.push(current)

      const linePath = runs
        .map((run) => run.map((pt, idx) => `${idx === 0 ? 'M' : 'L'}${pt.x.toFixed(2)},${pt.y.toFixed(2)}`).join(' '))
        .join(' ')

      const areaPath = runs
        .map((run) => {
          if (run.length === 0) return ''
          const first = run[0]
          const last = run[run.length - 1]
          const mid = run.map((pt) => `L${pt.x.toFixed(2)},${pt.y.toFixed(2)}`).join(' ')
          return `M${first.x.toFixed(2)},${baselineY.toFixed(2)} L${first.x.toFixed(2)},${first.y.toFixed(2)} ${mid} L${last.x.toFixed(2)},${baselineY.toFixed(2)} Z`
        })
        .join(' ')

      let lastRealIndex = -1
      for (let i = s.points.length - 1; i >= 0; i--) {
        if (s.points[i].amount != null) {
          lastRealIndex = i
          break
        }
      }
      const lastReal = lastRealIndex >= 0 ? s.points[lastRealIndex] : null
      const alertPoints = s.points
        .map((p, i) => ({ p, i }))
        .filter(({ p }) => p.hasAlert && p.amount != null)

      return { key: s.key, label: s.label, currency: s.currency, linePath, areaPath, lastReal, lastRealIndex, alertPoints }
    })
  }, [shown, xScale, yScale, baselineY])

  // Simple vertical de-collision for the end-value labels (rare beyond 2-3 series).
  const endLabelYs = useMemo(() => {
    const entries = seriesGeometry
      .map((g, idx) => (g.lastReal ? { idx, y: yScale(g.lastReal.amount as number) } : null))
      .filter((e): e is { idx: number; y: number } => e !== null)
      .sort((a, b) => a.y - b.y)
    const MIN_GAP = 13
    for (let i = 1; i < entries.length; i++) {
      if (entries[i].y - entries[i - 1].y < MIN_GAP) entries[i].y = entries[i - 1].y + MIN_GAP
    }
    const byIdx = new Map(entries.map((e) => [e.idx, e.y]))
    return byIdx
  }, [seriesGeometry, yScale])

  const displayIndex = hoverIndex ?? focusIndex

  function indexFromClientX(clientX: number): number {
    const svg = svgRef.current
    if (!svg || captureCount === 0) return 0
    const rect = svg.getBoundingClientRect()
    const px = ((clientX - rect.left) / rect.width) * VIEW_W
    // Nearest timestamp by position — binary search over the shared x domain.
    let lo = 0
    let hi = captureCount - 1
    while (lo < hi) {
      const mid = (lo + hi) >> 1
      if (xScale(mid) < px) lo = mid + 1
      else hi = mid
    }
    if (lo > 0 && Math.abs(xScale(lo - 1) - px) < Math.abs(xScale(lo) - px)) return lo - 1
    return lo
  }

  function onPointerMove(e: React.PointerEvent) {
    setHoverIndex(indexFromClientX(e.clientX))
  }
  function onPointerLeave() {
    setHoverIndex(null)
  }
  function onKeyDown(e: React.KeyboardEvent) {
    if (captureCount === 0) return
    const base = focusIndex ?? captureCount - 1
    if (e.key === 'ArrowLeft') {
      e.preventDefault()
      setFocusIndex(Math.max(0, base - 1))
    } else if (e.key === 'ArrowRight') {
      e.preventDefault()
      setFocusIndex(Math.min(captureCount - 1, base + 1))
    } else if (e.key === 'Home') {
      e.preventDefault()
      setFocusIndex(0)
    } else if (e.key === 'End') {
      e.preventDefault()
      setFocusIndex(captureCount - 1)
    } else if (e.key === 'PageUp') {
      e.preventDefault()
      setFocusIndex(Math.max(0, base - Math.max(1, Math.round(captureCount / 10))))
    } else if (e.key === 'PageDown') {
      e.preventDefault()
      setFocusIndex(Math.min(captureCount - 1, base + Math.max(1, Math.round(captureCount / 10))))
    }
  }

  if (shown.length === 0) {
    return (
      <EmptyState
        icon={<LineChart className="size-4" aria-hidden />}
        title="No price history yet"
        description="Price tracking starts once two captures both detect a price on this page — check back after the next couple of runs."
      />
    )
  }

  const activeValueText =
    displayIndex != null
      ? `${fmtFullDate(shown[0].points[displayIndex].takenAt)}: ` +
        seriesGeometry
          .map((g) => {
            const p = shown.find((s) => s.key === g.key)!.points[displayIndex]
            return `${g.label} ${p.amount != null ? fmtMoney(p.amount, g.currency) : 'no data'}`
          })
          .join(', ')
      : ''

  return (
    <div ref={containerRef} className="flex flex-col gap-2">
      {shown.length > 1 && (
        <ul className="flex flex-wrap gap-x-4 gap-y-1.5" aria-hidden={false}>
          {seriesGeometry.map((g, i) => (
            <li key={g.key} className="flex items-center gap-1.5 text-meta text-text-muted">
              <span
                className={`inline-block size-2 rounded-full ${SERIES_BG_CLASS[i % SERIES_BG_CLASS.length]}`}
                aria-hidden
              />
              {g.label}
              {g.lastReal && (
                <span className="font-mono tabular-nums text-text-faint">
                  {fmtMoney(g.lastReal.amount as number, g.currency)}
                </span>
              )}
            </li>
          ))}
        </ul>
      )}

      <div className="relative">
        <svg
          ref={svgRef}
          viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
          className="block w-full overflow-visible"
          role="img"
          aria-labelledby={titleId}
          aria-describedby={descId}
        >
          <title id={titleId}>
            {shown.length === 1 ? `${shown[0].label} price history` : 'Price history'}
          </title>
          <desc id={descId}>
            {shown
              .map((s) => {
                const first = s.points.find((p) => p.amount != null)
                const last = [...s.points].reverse().find((p) => p.amount != null)
                return first && last
                  ? `${s.label}: ${fmtMoney(first.amount as number, s.currency)} to ${fmtMoney(last.amount as number, s.currency)}`
                  : s.label
              })
              .join('. ')}
          </desc>

          {/* Grid — recessive, one step off the surface. */}
          {yTicks.map((t) => (
            <line
              key={t}
              x1={PAD_LEFT}
              x2={VIEW_W - PAD_RIGHT}
              y1={yScale(t)}
              y2={yScale(t)}
              stroke="rgb(var(--border))"
              strokeWidth={1}
              fill="none"
            />
          ))}

          {/* Y axis labels — every one names a value this scale reaches. */}
          {yTicks.map((t) => (
            <text
              key={t}
              x={PAD_LEFT - 8}
              y={yScale(t)}
              textAnchor="end"
              dominantBaseline="middle"
              fontSize={10.5}
              fill="rgb(var(--text-faint))"
              className="tabular-nums"
            >
              {fmtMoney(t, shown[0].currency)}
            </text>
          ))}

          {/* X axis labels — real capture timestamps, never a synthetic date. */}
          {xTickIndices.map((i) => (
            <text
              key={i}
              x={xScale(i)}
              y={VIEW_H - PAD_BOTTOM + 16}
              textAnchor={i === 0 ? 'start' : i === captureCount - 1 ? 'end' : 'middle'}
              fontSize={10.5}
              fill="rgb(var(--text-faint))"
              className="tabular-nums"
            >
              {fmtAxisDate(timestamps[i], tSpan)}
            </text>
          ))}

          {/* Area fills, under everything else. */}
          {seriesGeometry.map((g, i) => (
            <path
              key={`area-${g.key}`}
              d={g.areaPath}
              fill={`rgb(var(${SERIES_COLOR_VARS[i % SERIES_COLOR_VARS.length]}) / 0.1)`}
              stroke="none"
            />
          ))}

          {/* Lines. */}
          {seriesGeometry.map((g, i) => (
            <path
              key={`line-${g.key}`}
              d={g.linePath}
              fill="none"
              stroke={colorOf(i)}
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          ))}

          {/* Alert markers — the ONLY use of --diff here, exactly where a
              capture's alert named this series' price. */}
          {seriesGeometry.map((g) =>
            g.alertPoints.map(({ p, i }) => (
              <circle
                key={`${g.key}-alert-${i}`}
                cx={xScale(i)}
                cy={yScale(p.amount as number)}
                r={4}
                fill="rgb(var(--diff))"
                stroke="rgb(var(--panel))"
                strokeWidth={2}
              />
            ))
          )}

          {/* Emphasised endpoint (current value) per series. */}
          {seriesGeometry.map((g, i) =>
            g.lastReal && g.lastRealIndex >= 0 ? (
              <g key={`end-${g.key}`}>
                <circle
                  cx={xScale(g.lastRealIndex)}
                  cy={yScale(g.lastReal.amount as number)}
                  r={4.5}
                  fill={colorOf(i)}
                  stroke="rgb(var(--panel))"
                  strokeWidth={2}
                />
                <text
                  x={VIEW_W - PAD_RIGHT + 8}
                  y={endLabelYs.get(i) ?? yScale(g.lastReal.amount as number)}
                  dominantBaseline="middle"
                  fontSize={11}
                  fontWeight={600}
                  fill="rgb(var(--text))"
                  className="tabular-nums"
                >
                  {fmtMoney(g.lastReal.amount as number, g.currency)}
                </text>
              </g>
            ) : null
          )}

          {/* Crosshair + focused/hovered point. */}
          {displayIndex != null && (
            <>
              <line
                x1={xScale(displayIndex)}
                x2={xScale(displayIndex)}
                y1={PAD_TOP}
                y2={VIEW_H - PAD_BOTTOM}
                stroke="rgb(var(--border-strong))"
                strokeWidth={1}
                fill="none"
              />
              {seriesGeometry.map((g, i) => {
                const p = shown[i].points[displayIndex]
                if (p.amount == null) return null
                return (
                  <circle
                    key={`cross-${g.key}`}
                    cx={xScale(displayIndex)}
                    cy={yScale(p.amount)}
                    r={3.5}
                    fill={colorOf(i)}
                    stroke="rgb(var(--panel))"
                    strokeWidth={1.5}
                  />
                )
              })}
            </>
          )}

          {/* Keyboard + pointer hit target — a scrubber over the whole plot area. */}
          <rect
            x={PAD_LEFT}
            y={PAD_TOP}
            width={Math.max(0, INNER_W)}
            height={Math.max(0, INNER_H)}
            fill="transparent"
            tabIndex={0}
            role="slider"
            aria-label={shown.length === 1 ? `${shown[0].label} price history scrubber` : 'Price history scrubber'}
            aria-valuemin={0}
            aria-valuemax={Math.max(0, captureCount - 1)}
            aria-valuenow={focusIndex ?? captureCount - 1}
            aria-valuetext={activeValueText || undefined}
            className="cursor-crosshair outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
            onPointerMove={onPointerMove}
            onPointerLeave={onPointerLeave}
            onFocus={() => setFocusIndex((v) => v ?? captureCount - 1)}
            onBlur={() => setFocusIndex(null)}
            onKeyDown={onKeyDown}
          />
        </svg>

        {/* Tooltip — same content on hover and keyboard focus. */}
        {displayIndex != null && (
          <div
            role="status"
            aria-live="polite"
            className="pointer-events-none absolute z-10 max-w-[220px] rounded-md border border-border bg-panel-raised px-2.5 py-2 text-meta shadow-popover"
            style={{
              left: `${Math.min(88, Math.max(0, (xScale(displayIndex) / VIEW_W) * 100))}%`,
              top: 4,
              transform: xScale(displayIndex) / VIEW_W > 0.6 ? 'translateX(-100%)' : 'none',
            }}
          >
            <p className="mb-1 text-text-faint">{fmtFullDate(shown[0].points[displayIndex].takenAt)}</p>
            {seriesGeometry.map((g, i) => {
              const p = shown[i].points[displayIndex]
              return (
                <p key={g.key} className="flex items-center gap-1.5 text-text">
                  <span
                    className={`inline-block h-0.5 w-2.5 rounded-full ${SERIES_BG_CLASS[i % SERIES_BG_CLASS.length]}`}
                    aria-hidden
                  />
                  <span className="text-text-muted">{g.label}</span>
                  <span className="ml-auto font-mono tabular-nums">
                    {p.amount != null ? fmtMoney(p.amount, g.currency) : '—'}
                  </span>
                </p>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
