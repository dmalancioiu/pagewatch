'use client'

import { createContext, useContext, useState } from 'react'
import { Sidebar } from './Sidebar'
import { AddUrlModal } from './AddUrlModal'
import { FirstScreenshotModal } from './FirstScreenshotModal'

/* ─── Context ─── */
interface DashboardCtxValue {
  openAddUrl: () => void
}

const DashboardCtx = createContext<DashboardCtxValue>({ openAddUrl: () => { } })
export const useDashboard = () => useContext(DashboardCtx)

/* ─── Shell ─── */
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
  const [newUrlName, setNewUrlName] = useState<string>('')

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
      <div className="flex min-h-screen" style={{ background: '#F6F7F9' }}>
        <Sidebar domain={domain} userEmail={userEmail} plan={plan} />

        <main
          className="flex-1 min-h-screen overflow-x-hidden"
          style={{ marginLeft: '220px' }}
        >
          <div className="w-full">
            {children}
          </div>
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
