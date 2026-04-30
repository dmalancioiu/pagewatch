'use client'

import { useEffect, useState, useTransition } from 'react'
import { updateMonitoredUrl } from '@/lib/actions/websites'

type Props = {
  monitorId: string
  initialIsActive: boolean
  hasOpenAlert: boolean
}

export function MonitorPauseResumeSync({ monitorId, initialIsActive, hasOpenAlert }: Props) {
  const [isActive, setIsActive] = useState(initialIsActive)
  const [isPending, startTransition] = useTransition()

  useEffect(() => {
    const topbar = document.querySelector('.md-topbar')
    if (!topbar) return

    const buttons = Array.from(topbar.querySelectorAll<HTMLButtonElement>('button'))
    const pauseButton = buttons.find((button) => {
      const text = button.textContent?.trim().toLowerCase() ?? ''
      return text.includes('pause') || text.includes('resume')
    })

    if (!pauseButton) return

    const label = isPending ? 'Saving...' : isActive ? 'Pause' : 'Resume'
    pauseButton.innerHTML = isActive
      ? '<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="14" y="4" width="4" height="16" rx="1"></rect><rect x="6" y="4" width="4" height="16" rx="1"></rect></svg>' + label
      : '<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>' + label
    pauseButton.disabled = isPending
    pauseButton.style.opacity = isPending ? '0.65' : '1'

    const statusChip = topbar.querySelector<HTMLElement>('.md-crumbs em')
    if (statusChip) {
      const nextStatus = !isActive ? 'Paused' : hasOpenAlert ? 'Alert' : 'Healthy'
      statusChip.className = nextStatus.toLowerCase()
      statusChip.innerHTML = `<i></i>${nextStatus}`
    }

    const onClick = (event: MouseEvent) => {
      event.preventDefault()
      event.stopPropagation()
      const nextIsActive = !isActive
      startTransition(async () => {
        await updateMonitoredUrl(monitorId, { is_active: nextIsActive } as any)
        setIsActive(nextIsActive)
      })
    }

    pauseButton.addEventListener('click', onClick)
    return () => pauseButton.removeEventListener('click', onClick)
  }, [monitorId, isActive, isPending, hasOpenAlert])

  return null
}
