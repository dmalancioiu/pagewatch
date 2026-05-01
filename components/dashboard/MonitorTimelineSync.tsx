'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

type AlertItem = {
  id: string
  diff_pct: number | null
  severity: string | null
  status: string
  created_at: string
  ai_summary?: string | null
  metadata?: any
  beforeUrl: string | null
  afterUrl: string | null
  diffUrl: string | null
}

type SnapshotItem = {
  id: string
  storage_path: string
  taken_at: string
  file_size_bytes: number | null
  signedUrl: string | null
}

type Props = {
  snapshots: SnapshotItem[]
  alertBySnapshotId: Record<string, AlertItem>
}

function fmtDate(iso?: string | null) {
  if (!iso) return 'Never'
  return new Date(iso).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
}

function bytes(n: number | null) {
  if (!n) return '—'
  const kb = n / 1024
  return kb < 1024 ? `${kb.toFixed(0)} KB` : `${(kb / 1024).toFixed(1)} MB`
}

function setImageSrc(containerSelector: string, url: string | null | undefined) {
  const img = document.querySelector<HTMLImageElement>(`${containerSelector} img`)
  if (img && url) img.src = url
}

function clickViewerTab(kind: 'diff' | 'current') {
  const button = Array.from(document.querySelectorAll<HTMLButtonElement>('.md-viewer-header button')).find((item) => {
    const text = item.textContent?.toLowerCase() ?? ''
    return kind === 'diff' ? text.includes('diff') : text.includes('current')
  })
  button?.click()
}

function setTimelineInfo(snapshot: SnapshotItem, hasChange: boolean, alert?: AlertItem) {
  const info = document.querySelector<HTMLElement>('.md-tl-info > span')
  if (!info) return

  const diff = alert?.diff_pct != null ? ` (+${Number(alert.diff_pct).toFixed(1)}%)` : ''
  info.innerHTML = `Viewing <b>${fmtDate(snapshot.taken_at)}</b>, ${hasChange ? `<span style="color:#EF4444">change detected${diff}</span>` : '<span style="color:#16A34A">clean capture</span>'}`
}

function updateViewerFooter(snapshot: SnapshotItem, alert?: AlertItem) {
  const footers = Array.from(document.querySelectorAll<HTMLElement>('.md-viewer-foot'))
  const date = fmtDate(snapshot.taken_at)

  for (const footer of footers) {
    if (footer.textContent?.toLowerCase().includes('latest capture')) {
      const label = footer.querySelector('span')
      if (label) label.innerHTML = `Selected capture <b>${date}</b>`

      const meta = Array.from(footer.children).find((child) => child.tagName.toLowerCase() === 'em') as HTMLElement | undefined
      if (meta) meta.textContent = `${bytes(snapshot.file_size_bytes)} · normalized viewport`
    }

    if (footer.textContent?.toLowerCase().includes('changed region')) {
      const dateNode = Array.from(footer.children).find((child) => child.tagName.toLowerCase() === 'em') as HTMLElement | undefined
      if (dateNode) dateNode.textContent = date

      const changedRegion = footer.querySelector('span b')
      const zoneLabel = alert?.metadata?.zone_scores?.[0]?.label
      if (changedRegion) changedRegion.textContent = zoneLabel || 'Full page'

      const diffLabel = Array.from(footer.querySelectorAll('span')).find((node) => node.textContent?.toLowerCase().includes('pixel diff'))
      const diffValue = diffLabel?.querySelector('b')
      if (diffValue) diffValue.textContent = alert?.diff_pct != null ? `+${Number(alert.diff_pct).toFixed(1)}%` : '+0.0%'
    }
  }
}

function sectionByLabel(label: string) {
  return Array.from(document.querySelectorAll<HTMLElement>('.md-inspector section')).find((section) =>
    section.querySelector('label')?.textContent?.toLowerCase().includes(label.toLowerCase())
  )
}

function setRowValue(section: HTMLElement, key: string, value: string, options?: { pill?: 'red' | 'green'; red?: boolean }) {
  const row = Array.from(section.querySelectorAll<HTMLElement>('.md-row')).find((item) =>
    item.querySelector('span')?.textContent?.trim().toLowerCase() === key.toLowerCase()
  )
  if (!row) return

  const valueNode = row.querySelector<HTMLElement>('b')
  if (!valueNode) return

  valueNode.textContent = value

  if (options?.pill) {
    valueNode.className = `pill ${options.pill}`
  } else if (options?.red) {
    valueNode.className = 'red'
  }
}

function syncInspectorSnapshot(snapshot: SnapshotItem, latestSnapshotId: string | undefined, alert?: AlertItem) {
  const section = sectionByLabel('latest snapshot')
  if (!section) return

  const label = section.querySelector('label')
  if (label) {
    const isLatest = snapshot.id === latestSnapshotId
    label.innerHTML = label.innerHTML.replace(/Latest snapshot|Selected capture/g, isLatest ? 'Latest snapshot' : 'Selected capture')
  }

  setRowValue(section, 'Captured', fmtDate(snapshot.taken_at))
  setRowValue(section, 'Alert status', alert ? '1 open' : 'Clean', { pill: alert ? 'red' : 'green' })
  setRowValue(section, 'File size', bytes(snapshot.file_size_bytes))

  if (alert?.diff_pct != null) {
    setRowValue(section, 'Pixel diff', `+${Number(alert.diff_pct).toFixed(1)}%`, { red: true })
  } else {
    setRowValue(section, 'Pixel diff', '+0.0%')
  }
}

function setPlayButton(playing: boolean) {
  const button = Array.from(document.querySelectorAll<HTMLButtonElement>('.md-timeline-head button')).find((item) => {
    const text = item.textContent?.trim().toLowerCase() ?? ''
    return item.dataset.timelinePlay === 'true' || text.includes('play') || text.includes('stop')
  })

  if (!button) return

  button.dataset.timelinePlay = 'true'
  button.innerHTML = playing
    ? '<svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><rect x="5" y="5" width="14" height="14" rx="2"></rect></svg>Stop'
    : '<svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#16A34A" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>Play'
}

export function MonitorTimelineSync({ snapshots, alertBySnapshotId }: Props) {
  const [playing, setPlaying] = useState(false)
  const playIndexRef = useRef(0)
  const timerRef = useRef<number | null>(null)
  const timeline = snapshots.slice(0, 14)

  const selectSnapshot = useCallback((index: number, scroll = false) => {
    const snapshot = timeline[index]
    if (!snapshot) return

    playIndexRef.current = index

    const buttons = Array.from(document.querySelectorAll<HTMLButtonElement>('.md-tl-cap'))
    buttons.forEach((button) => button.classList.remove('selected'))
    const button = buttons[index]
    button?.classList.add('selected')
    if (scroll) button?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' })

    const alert = alertBySnapshotId[snapshot.id]
    setTimelineInfo(snapshot, Boolean(alert), alert)
    updateViewerFooter(snapshot, alert)
    syncInspectorSnapshot(snapshot, timeline[0]?.id, alert)

    if (alert) {
      clickViewerTab('diff')
      setImageSrc('.md-after', alert.afterUrl ?? snapshot.signedUrl)
      setImageSrc('.md-before', alert.beforeUrl ?? timeline[index + 1]?.signedUrl ?? snapshot.signedUrl)
    } else {
      clickViewerTab('current')
      setImageSrc('.md-current', snapshot.signedUrl)
    }
  }, [alertBySnapshotId, timeline])

  const stopPlayback = useCallback(() => {
    if (timerRef.current) window.clearTimeout(timerRef.current)
    timerRef.current = null
    setPlaying(false)
    setPlayButton(false)
  }, [])

  const scheduleNext = useCallback(() => {
    if (!timeline.length) return

    timerRef.current = window.setTimeout(() => {
      const next = (playIndexRef.current + 1) % timeline.length
      selectSnapshot(next, true)
      scheduleNext()
    }, 1200)
  }, [selectSnapshot, timeline.length])

  useEffect(() => {
    const buttons = Array.from(document.querySelectorAll<HTMLButtonElement>('.md-tl-cap'))
    const cleanups: Array<() => void> = []

    buttons.forEach((button, index) => {
      const handler = () => {
        stopPlayback()
        selectSnapshot(index)
      }
      button.addEventListener('click', handler)
      cleanups.push(() => button.removeEventListener('click', handler))
    })

    const playButton = Array.from(document.querySelectorAll<HTMLButtonElement>('.md-timeline-head button')).find((item) => {
      const text = item.textContent?.trim().toLowerCase() ?? ''
      return item.dataset.timelinePlay === 'true' || text.includes('play') || text.includes('stop')
    })

    if (playButton) {
      playButton.dataset.timelinePlay = 'true'
      setPlayButton(playing)
      const handler = (event: MouseEvent) => {
        event.preventDefault()
        event.stopPropagation()

        if (playing) {
          stopPlayback()
        } else {
          setPlaying(true)
          setPlayButton(true)
          scheduleNext()
        }
      }
      playButton.addEventListener('click', handler)
      cleanups.push(() => playButton.removeEventListener('click', handler))
    }

    return () => {
      cleanups.forEach((cleanup) => cleanup())
    }
  }, [playing, scheduleNext, selectSnapshot, stopPlayback])

  useEffect(() => {
    return () => {
      if (timerRef.current) window.clearTimeout(timerRef.current)
    }
  }, [])

  return null
}
