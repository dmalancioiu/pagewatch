'use client'

import { createContext, useContext, useState } from 'react'
import { Sidebar } from './Sidebar'
import { AddUrlModal } from './AddUrlModal'
import { FirstScreenshotModal } from './FirstScreenshotModal'

interface DashboardCtxValue {
  openAddUrl: () => void
}

const DashboardCtx = createContext<DashboardCtxValue>({ openAddUrl: () => {} })
export const useDashboard = () => useContext(DashboardCtx)

interface DashboardShellProps {
  children: React.ReactNode
  workspaceId: string
  domain: string
  userEmail: string
  plan?: 'free' | 'pro' | 'agency'
}

export function DashboardShell({
  children,
  workspaceId,
  domain,
  userEmail,
  plan = 'free',
}: DashboardShellProps) {
  const [addOpen, setAddOpen] = useState(false)
  const [newUrlId, setNewUrlId] = useState<string | null>(null)
  const [newUrlName, setNewUrlName] = useState('')

  function handleUrlCreated(urlId: string, name?: string) {
    setAddOpen(false)
    setNewUrlId(urlId)
    setNewUrlName(name ?? '')
  }

  function handleAdjustSettings() {
    setNewUrlId(null)
    setAddOpen(true)
  }

  return (
    <DashboardCtx.Provider value={{ openAddUrl: () => setAddOpen(true) }}>
      <div style={{ minHeight: '100vh', background: '#F7F8FA' }}>
        <Sidebar domain={domain} userEmail={userEmail} plan={plan} />

        <main
          style={{
            marginLeft: 208,
            minHeight: '100vh',
            overflowX: 'hidden',
            background: '#F7F8FA',
          }}
        >
          {children}
        </main>
      </div>

      {addOpen && (
        <AddUrlModal
          workspaceId={workspaceId}
          onClose={() => setAddOpen(false)}
          onCreated={(urlId) => handleUrlCreated(urlId)}
        />
      )}

      {newUrlId && (
        <FirstScreenshotModal
          urlId={newUrlId}
          urlName={newUrlName}
          onClose={() => setNewUrlId(null)}
          onAdjust={handleAdjustSettings}
        />
      )}
    </DashboardCtx.Provider>
  )
}
