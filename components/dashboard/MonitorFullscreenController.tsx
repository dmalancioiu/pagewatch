'use client'

import { useEffect, useState } from 'react'
import { FullscreenMonitorViewer } from '@/components/dashboard/FullscreenMonitorViewer'
import type { Zone } from '@/components/dashboard/ZoneSelector'

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

type ViewerTab = 'diff' | 'current' | 'zones'

type Props = {
  monitorName: string
  snapshots: SnapshotItem[]
  alerts: AlertItem[]
  openAlert: AlertItem | null
  zones: Zone[]
}

export function MonitorFullscreenController({ monitorName, snapshots, alerts, openAlert, zones }: Props) {
  const [open, setOpen] = useState(false)
  const [initialTab, setInitialTab] = useState<ViewerTab>('diff')
  const [localZones, setLocalZones] = useState<Zone[]>(zones)

  useEffect(() => setLocalZones(zones), [zones])

  useEffect(() => {
    function onOpen(event: Event) {
      const tab = (event as CustomEvent<{ tab: string }>).detail?.tab
      setInitialTab(tab === 'zones' ? 'zones' : tab === 'current' ? 'current' : 'diff')
      setOpen(true)
    }

    window.addEventListener('pagewatch:open-fullscreen', onOpen)
    return () => window.removeEventListener('pagewatch:open-fullscreen', onOpen)
  }, [])

  function updateZones(nextZones: Zone[]) {
    setLocalZones(nextZones)
    window.dispatchEvent(new CustomEvent('pagewatch:zones-updated', {
      detail: { zones: nextZones, source: 'fullscreen-controller' },
    }))
  }

  return (
    <FullscreenMonitorViewer
      open={open}
      onOpenChange={setOpen}
      initialTab={initialTab}
      monitorName={monitorName}
      snapshots={snapshots}
      alerts={alerts}
      openAlert={openAlert}
      zones={localZones}
      onZonesChange={updateZones}
    />
  )
}
