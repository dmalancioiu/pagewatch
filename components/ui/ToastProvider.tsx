'use client'

import { createContext, useCallback, useContext, useMemo, useState } from 'react'
import { AlertCircle, CheckCircle2, Info, X } from 'lucide-react'

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

const palette = {
  success: { color: '#16A34A', bg: 'rgba(22,163,74,0.08)', border: 'rgba(22,163,74,0.18)', Icon: CheckCircle2 },
  error: { color: '#DC2626', bg: 'rgba(220,38,38,0.08)', border: 'rgba(220,38,38,0.18)', Icon: AlertCircle },
  info: { color: '#2563EB', bg: 'rgba(37,99,235,0.08)', border: 'rgba(37,99,235,0.18)', Icon: Info },
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const dismiss = useCallback((id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id))
  }, [])

  const toast = useCallback((input: ToastInput) => {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2)}`
    const next: Toast = { ...input, id, type: input.type ?? 'info' }
    setToasts(prev => [next, ...prev].slice(0, 4))
    window.setTimeout(() => dismiss(id), 4200)
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
      <div style={{ position: 'fixed', right: 18, bottom: 18, zIndex: 10000, display: 'flex', flexDirection: 'column', gap: 10, width: 'min(380px, calc(100vw - 36px))', pointerEvents: 'none' }}>
        {toasts.map(item => {
          const style = palette[item.type]
          const Icon = style.Icon
          return (
            <div key={item.id} style={{ pointerEvents: 'auto', display: 'flex', gap: 11, alignItems: 'flex-start', padding: '13px 14px', borderRadius: 15, background: 'rgba(255,255,255,0.96)', border: `1px solid ${style.border}`, boxShadow: '0 20px 55px rgba(15,23,42,0.16), 0 1px 2px rgba(15,23,42,0.04)', backdropFilter: 'blur(18px)', WebkitBackdropFilter: 'blur(18px)' }}>
              <div style={{ width: 30, height: 30, borderRadius: 10, background: style.bg, color: style.color, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><Icon size={16} /></div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ margin: 0, fontSize: 13, fontWeight: 850, color: '#0F172A', letterSpacing: '-0.02em' }}>{item.title}</p>
                {item.description && <p style={{ margin: '4px 0 0', fontSize: 12, lineHeight: 1.45, color: '#64748B' }}>{item.description}</p>}
              </div>
              <button onClick={() => dismiss(item.id)} aria-label="Dismiss notification" style={{ width: 24, height: 24, borderRadius: 8, border: 'none', background: 'rgba(15,23,42,0.04)', color: '#94A3B8', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><X size={13} /></button>
            </div>
          )
        })}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used inside ToastProvider')
  return ctx
}
