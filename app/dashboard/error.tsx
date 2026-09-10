'use client'

import { useEffect } from 'react'
import { AlertTriangle } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('[dashboard]', error)
  }, [error])

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-3 px-4 py-6 text-center">
      <div className="flex size-9 items-center justify-center rounded-md bg-critical-subtle text-critical">
        <AlertTriangle className="size-4" />
      </div>
      <div className="flex flex-col gap-1">
        <p className="text-ui-medium text-text">Something went wrong</p>
        <p className="max-w-sm text-meta text-text-muted">
          {error.message || 'The dashboard hit an unexpected error loading this page.'}
        </p>
      </div>
      <Button size="sm" onClick={() => reset()}>
        Try again
      </Button>
    </div>
  )
}
