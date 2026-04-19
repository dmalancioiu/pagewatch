'use client'

import { createContext, useContext, useState, useEffect } from 'react'
import { Sidebar } from './Sidebar'
import { AddUrlModal } from './AddUrlModal'
import { FirstScreenshotModal } from './FirstScreenshotModal'

/* ─── Context ─── */
interface DashboardCtxValue {
  openAddUrl:   () => void
  theme:        'dark' | 'light'
  toggleTheme:  () => void
}

const DashboardCtx = createContext<DashboardCtxValue>({
  openAddUrl:  () => {},
  theme:       'dark',
  toggleTheme: () => {},
})
export const useDashboard = () => useContext(DashboardCtx)

/* ─── Shell ─── */
interface DashboardShellProps {
  children:    React.ReactNode
  workspaceId: string
  domain:      string
  userEmail:   string
  plan?:       'free' | 'pro' | 'agency'
}

export function DashboardShell({
  children,
  workspaceId,
  domain,
  userEmail,
  plan = 'free',
}: DashboardShellProps) {
  const [addOpen,    setAddOpen]    = useState(false)
  const [newUrlId,   setNewUrlId]   = useState<string | null>(null)
  const [newUrlName, setNewUrlName] = useState<string>('')
  const [theme,      setTheme]      = useState<'dark' | 'light'>('dark')

  // Persist theme choice
  useEffect(() => {
    const saved = localStorage.getItem('dashboard-theme') as 'dark' | 'light' | null
    if (saved) setTheme(saved)
  }, [])

  function toggleTheme() {
    setTheme((prev) => {
      const next = prev === 'dark' ? 'light' : 'dark'
      localStorage.setItem('dashboard-theme', next)
      return next
    })
  }

  function handleUrlCreated(urlId: string, name?: string) {
    setAddOpen(false)
    setNewUrlId(urlId)
    setNewUrlName(name ?? '')
  }

  function handleAdjustSettings() {
    setNewUrlId(null)
    setAddOpen(true)
  }

  const isLight = theme === 'light'

  return (
    <DashboardCtx.Provider value={{ openAddUrl: () => setAddOpen(true), theme, toggleTheme }}>
      <div
        className="flex min-h-screen"
        data-theme={theme}
        style={{ background: isLight ? '#f5f7fa' : '#0a0a0a' }}
      >
        <Sidebar domain={domain} userEmail={userEmail} plan={plan} />

        <main
          className="flex-1 min-h-screen overflow-x-hidden"
          style={{ marginLeft: '224px' }}
        >
          <div className="max-w-6xl mx-auto px-6 py-7">
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
