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

function setTimelineInfo(snapshot: SnapshotItem, hasChange: boolean) {
  const info = document.querySelector<HTMLElement>('.md-tl-info > span')
  if (!info) return
<<<<<<< react-selected-capture-state

  info.innerHTML = `Viewing <b>${fmtDate(snapshot.taken_at)}</b>, ${hasChange ? '<span style="color:#EF4444">change detected</span>' : '<span style="color:#16A34A">clean capture</span>'}`
=======
  // Only update existing child nodes — never replace innerHTML (breaks React reconciliation)
  const bold = info.querySelector('b')
  if (bold) bold.textContent = fmtDate(snapshot.taken_at)
  const colored = info.querySelector('span')
  if (colored) {
    colored.textContent = hasChange ? 'change detected' : 'clean capture'
    colored.style.color = hasChange ? '#EF4444' : '#16A34A'
  }
>>>>>>> main
}

function updateViewerFooter(snapshot: SnapshotItem, alert?: AlertItem) {
  const footers = Array.from(document.querySelectorAll<HTMLElement>('.md-viewer-foot'))
  const date = fmtDate(snapshot.taken_at)

  for (const footer of footers) {
    if (footer.textContent?.toLowerCase().includes('latest capture')) {
      // Update the <b> inside the label span only
      const labelBold = footer.querySelector('span b')
      if (labelBold) labelBold.textContent = date

      const meta = Array.from(footer.children).find((child) => child.tagName.toLowerCase() === 'em') as HTMLElement | undefined
      if (meta) meta.textContent = `${bytes(snapshot.file_size_bytes)} · normalized viewport`
    }

    if (footer.textContent?.toLowerCase().includes('changed region')) {
      const dateNode = Array.from(footer.children).find((child) => child.tagName.toLowerCase() === 'em') as HTMLElement | undefined
      if (dateNode) dateNode.textContent = date

      const changedRegion = footer.querySelector('span b')
      const zoneLabel = alert?.metadata?.zone_scores?.[0]?.label
      if (changedRegion && zoneLabel) changedRegion.textContent = zoneLabel
    }
  }
}

function setPlayButton(playing: boolean) {
  const button = Array.from(document.querySelectorAll<HTMLButtonElement>('.md-timeline-head button')).find((item) => {
    const text = item.textContent?.trim().toLowerCase() ?? ''
    return item.dataset.timelinePlay === 'true' || text.includes('play') || text.includes('stop')
  })
  if (!button) return
  button.dataset.timelinePlay = 'true'
  // Use a data attribute for play state — never replace innerHTML on a React-managed node
  button.dataset.playing = playing ? 'true' : ''
  // Update only the existing text node (last child) for Play/Stop label
  const lastChild = button.lastChild
  if (lastChild?.nodeType === Node.TEXT_NODE) {
    lastChild.textContent = playing ? 'Stop' : 'Play'
  }
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
    setTimelineInfo(snapshot, Boolean(alert))
    updateViewerFooter(snapshot, alert)

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
