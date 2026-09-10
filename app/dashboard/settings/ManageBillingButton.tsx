'use client'

import { useState } from 'react'
import { ExternalLink } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/ToastProvider'

/**
 * Opens the Stripe billing portal.
 *
 * Only rendered for a workspace that already has a Stripe customer — a
 * workspace that never checked out has nothing to manage, and offering a
 * button that always errors is worse than not offering one.
 */
export function ManageBillingButton() {
  const [pending, setPending] = useState(false)
  const toast = useToast()

  async function open() {
    setPending(true)
    try {
      const res = await fetch('/api/stripe/portal', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ returnPath: '/dashboard/settings' }),
      })
      const body = await res.json().catch(() => null)

      if (!res.ok || !body?.url) {
        toast.error('Could not open billing', body?.error ?? 'Please try again.')
        return
      }

      window.location.href = body.url
    } catch {
      toast.error('Could not open billing', 'Check your connection and try again.')
    } finally {
      setPending(false)
    }
  }

  return (
    <Button variant="secondary" size="sm" onClick={open} disabled={pending}>
      {pending ? 'Opening…' : 'Manage billing'}
      <ExternalLink className="size-3.5" aria-hidden />
    </Button>
  )
}
