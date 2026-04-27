'use client'

import { Plus } from 'lucide-react'
import { useDashboard } from './DashboardShell'

export function AddMonitorButton() {
  const { openAddUrl } = useDashboard()
  return (
    <button
      onClick={openAddUrl}
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 6,
        padding: '7px 14px', background: '#2563EB', color: 'white',
        borderRadius: 7, fontSize: 12, fontWeight: 600, border: 'none',
        cursor: 'pointer', boxShadow: '0 1px 4px rgba(37,99,235,0.25)',
        letterSpacing: '-0.01em', fontFamily: 'inherit',
      }}
    >
      <Plus style={{ width: 14, height: 14 }} /> Add Monitor
    </button>
  )
}
