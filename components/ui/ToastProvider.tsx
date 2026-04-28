'use client'

import { createContext, useCallback, useContext, useMemo, useState } from 'react'
import { CheckCircle2, X } from 'lucide-react'

type ToastType = 'success' | 'error' | 'info'

type ToastInput = {
  title: string
  description?: string
  type?: ToastType
}

type Toast = ToastInput & {
  id: string
  type: ToastType
}

type ToastContextValue = {
  toast: (input: ToastInput) => void
  success: (title: string, description?: string) => void
  error: (title: string, description?: string) => void
  info: (title: string, description?: string) => void
}

const ToastContext = createContext<ToastContextValue | null>(null)
const BLUE = '#2563EB'

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const dismiss = useCallback((id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id))
  }, [])

  const toast = useCallback((input: ToastInput) => {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2)}`
    const next: Toast = { ...input, id, type: input.type ?? 'info' }
    setToasts(prev => [next, ...prev].slice(0, 4))
    window.setTimeout(() => dismiss(id), 3800)
  }, [dismiss])

  const value = useMemo<ToastContextValue>(() => ({
    toast,
    success: (title, description) => toast({ title, description, type: 'success' }),
    error: (title, description) => toast({ title, description, type: 'error' }),
    info: (title, description) => toast({ title, description, type: 'info' }),
  }), [toast])

  return (
    <ToastContext.Provider value={value}>
      {children}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes pw-toast-in {
          from { opacity: 0; transform: translate3d(18px, 10px, 0) scale(0.98); filter: blur(3px); }
          to { opacity: 1; transform: translate3d(0, 0, 0) scale(1); filter: blur(0); }
        }
        @keyframes pw-toast-bar {
          from { transform: scaleX(1); }
          to { transform: scaleX(0); }
        }
      ` }} />
      <div style={{ position: 'fixed', right: 18, bottom: 18, zIndex: 10000, display: 'flex', flexDirection: 'column', gap: 10, width: 'min(390px, calc(100vw - 36px))', pointerEvents: 'none' }}>
        {toasts.map(item => (
          <div key={item.id} style={{ pointerEvents: 'auto', position: 'relative', overflow: 'hidden', display: 'flex', gap: 12, alignItems: 'flex-start', padding: '14px 15px', borderRadius: 16, background: 'rgba(255,255,255,0.96)', border: '1px solid rgba(37,99,235,0.16)', boxShadow: '0 22px 60px rgba(15,23,42,0.16), 0 1px 2px rgba(15,23,42,0.04)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)', animation: 'pw-toast-in 260ms cubic-bezier(0.16, 1, 0.3, 1)' }}>
            <div style={{ width: 31, height: 31, borderRadius: 11, background: 'rgba(37,99,235,0.08)', color: BLUE, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, boxShadow: 'inset 0 0 0 1px rgba(37,99,235,0.10)' }}>
              <CheckCircle2 size={16} />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ margin: 0, fontSize: 13, lineHeight: 1.25, fontWeight: 760, color: '#0F172A', letterSpacing: '-0.015em' }}>{item.title}</p>
              {item.description && <p style={{ margin: '4px 0 0', fontSize: 12, lineHeight: 1.45, fontWeight: 450, color: '#64748B' }}>{item.description}</p>}
            </div>
            <button onClick={() => dismiss(item.id)} aria-label="Dismiss notification" style={{ width: 24, height: 24, borderRadius: 8, border: 'none', background: 'rgba(15,23,42,0.04)', color: '#94A3B8', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><X size={13} /></button>
            <span style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: 2, background: 'linear-gradient(90deg, rgba(37,99,235,0.85), rgba(59,130,246,0.24))', transformOrigin: 'left center', animation: 'pw-toast-bar 3800ms linear forwards' }} />
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used inside ToastProvider')
  return ctx
}
