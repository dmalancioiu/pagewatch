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
        padding: '8px 16px', background: '#16A34A', color: 'white',
        borderRadius: 9, fontSize: 13, fontWeight: 600, border: 'none',
        cursor: 'pointer', boxShadow: '0 2px 8px rgba(22,163,74,0.3)',
        letterSpacing: '-0.01em', fontFamily: 'inherit',
      }}
    >
      <Plus style={{ width: 14, height: 14 }} /> Add Monitor
    </button>
  )
}
