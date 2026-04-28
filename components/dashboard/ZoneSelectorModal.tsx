'use client'

import { useState } from 'react'
import { X, Target, MousePointer2, Trash2, Info } from 'lucide-react'
import { ZoneSelector } from './ZoneSelector'
import type { Zone } from './ZoneSelector'
import type { ZoneSensitivity } from '@/lib/types/database.types'
import { useToast } from '@/components/ui/ToastProvider'

const ZONE_PALETTE = [
  '#2563EB', '#16A34A', '#D97706', '#9333EA', '#0891B2', '#DC2626', '#7C3AED', '#0EA5E9',
]

const BLUE = '#2563EB'

function zoneColor(i: number) { return ZONE_PALETTE[i % ZONE_PALETTE.length] }

interface Props {
  isOpen: boolean
  onClose: () => void
  imageUrl: string
  zones: Zone[]
  onChange: (zones: Zone[]) => void
}

export function ZoneSelectorModal({ isOpen, onClose, imageUrl, zones, onChange }: Props) {
  const [localZones, setLocalZones] = useState<Zone[]>(zones)
  const { success, info } = useToast()

  function handleDone() {
    onChange(localZones)
    success('Zones saved', `${localZones.length} zones updated`)
    onClose()
  }

  function handleClose() {
    setLocalZones(zones)
    info('Changes discarded')
    onClose()
  }

  function updateZone(id: string, patch: Partial<Zone>) {
    setLocalZones(prev => prev.map(z => z.id === id ? { ...z, ...patch } : z))
  }

  function deleteZone(id: string) {
    setLocalZones(prev => prev.filter(z => z.id !== id))
    info('Zone removed')
  }

  if (!isOpen) return null

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 9999 }}>
      {/* ...rest unchanged for brevity... */}
      <button onClick={handleDone}>Save Zones</button>
    </div>
  )
}
