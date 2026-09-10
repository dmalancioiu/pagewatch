'use client'

import { createContext, useCallback, useContext, useMemo, useState } from 'react'
import Link from 'next/link'
import { AlertTriangle, CheckCircle2, Info, X } from 'lucide-react'
import { cn } from '@/lib/utils'

/**
 * `type` is the original API (`success | error | info`) — kept working so
 * existing `useToast().error(...)` etc. callers don't break. `tone` is the
 * preferred alias going forward; when both are given, `tone` wins.
 */
type ToastType = 'success' | 'error' | 'info'

type ToastAction = {
  label: string
  href: string
}

type ToastInput = {
  title: string
  description?: string
  type?: ToastType
  tone?: ToastType
  /**
   * An inline link-button — e.g. an `EntitlementError`'s `upgradeTo` turned
   * into "Pro raises this to 15 monitors — Upgrade" instead of a dead end.
   */
  action?: ToastAction
}

type Toast = ToastInput & {
  id: string
  resolvedTone: ToastType
}

type ToastContextValue = {
  toast: (input: ToastInput) => void
  success: (title: string, description?: string) => void
  error: (title: string, description?: string) => void
  info: (title: string, description?: string) => void
}

const ToastContext = createContext<ToastContextValue | null>(null)

const TONE_ICON: Record<ToastType, typeof CheckCircle2> = {
  success: CheckCircle2,
  error: AlertTriangle,
  info: Info,
}

const TONE_CLASSES: Record<ToastType, { icon: string; bar: string }> = {
  success: { icon: 'bg-ok-subtle text-ok', bar: 'bg-ok' },
  error: { icon: 'bg-critical-subtle text-critical', bar: 'bg-critical' },
  info: { icon: 'bg-accent-subtle text-accent', bar: 'bg-accent' },
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const dismiss = useCallback((id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id))
  }, [])

  const toast = useCallback((input: ToastInput) => {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2)}`
    const resolvedTone = input.tone ?? input.type ?? 'info'
    const next: Toast = { ...input, id, resolvedTone }
    setToasts(prev => [next, ...prev].slice(0, 4))
    window.setTimeout(() => dismiss(id), 5200)
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
        @media (prefers-reduced-motion: reduce) {
          .pw-toast { animation-duration: 0.01ms !important; }
          .pw-toast-bar { animation-duration: 0.01ms !important; }
        }
      ` }} />
      <div className="pointer-events-none fixed bottom-4 right-4 z-[10000] flex w-[min(380px,calc(100vw-32px))] flex-col gap-2.5">
        {toasts.map(item => {
          const Icon = TONE_ICON[item.resolvedTone]
          const tone = TONE_CLASSES[item.resolvedTone]
          return (
            <div
              key={item.id}
              className="pw-toast pointer-events-auto relative flex items-start gap-3 overflow-hidden rounded-md border border-border bg-panel-raised p-3.5 shadow-popover"
              style={{ animation: 'pw-toast-in 220ms cubic-bezier(0.16, 1, 0.3, 1)' }}
              role="status"
            >
              <div className={cn('flex size-7 shrink-0 items-center justify-center rounded', tone.icon)}>
                <Icon className="size-4" />
              </div>
              <div className="min-w-0 flex-1 pt-0.5">
                <p className="text-ui-medium text-text">{item.title}</p>
                {item.description && (
                  <p className="mt-0.5 text-meta text-text-muted">{item.description}</p>
                )}
                {item.action && (
                  <Link
                    href={item.action.href}
                    className="mt-1.5 inline-block text-meta font-medium text-accent hover:underline"
                    onClick={() => dismiss(item.id)}
                  >
                    {item.action.label}
                  </Link>
                )}
              </div>
              <button
                onClick={() => dismiss(item.id)}
                aria-label="Dismiss notification"
                className="flex size-6 shrink-0 items-center justify-center rounded-sm text-text-faint transition-colors hover:bg-bg-subtle hover:text-text"
              >
                <X className="size-3.5" />
              </button>
              <span
                className={cn('pw-toast-bar absolute inset-x-0 bottom-0 h-0.5 origin-left', tone.bar)}
                style={{ animation: 'pw-toast-bar 5200ms linear forwards' }}
              />
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
