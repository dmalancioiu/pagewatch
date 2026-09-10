'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { AlertTriangle } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function MonitorDetailError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('[monitor-detail]', error)
  }, [error])

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-3 px-4 py-6 text-center">
      <div className="flex size-9 items-center justify-center rounded-md bg-critical-subtle text-critical">
        <AlertTriangle className="size-4" />
      </div>
      <div className="flex flex-col gap-1">
        <p className="text-ui-medium text-text">Could not load this monitor</p>
        <p className="max-w-sm text-meta text-text-muted">
          {error.message || 'Something went wrong loading this monitor. Try again, or go back to the list.'}
        </p>
      </div>
      <div className="flex items-center gap-2">
        <Button variant="secondary" size="sm" asChild>
          <Link href="/dashboard/urls">Back to monitors</Link>
        </Button>
        <Button size="sm" onClick={() => reset()}>
          Try again
        </Button>
      </div>
    </div>
  )
}
