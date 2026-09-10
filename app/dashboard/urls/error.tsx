'use client'

import { useEffect } from 'react'
import { AlertTriangle } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function UrlsError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error('[dashboard/urls]', error)
  }, [error])

  return (
    <div className="mx-auto flex max-w-5xl flex-col items-center gap-3 px-4 py-16 text-center sm:px-6">
      <div className="flex size-9 items-center justify-center rounded-md bg-critical-subtle text-critical">
        <AlertTriangle className="size-4" />
      </div>
      <p className="text-ui-medium text-text">Couldn&rsquo;t load your monitors</p>
      <p className="max-w-sm text-meta text-text-muted">{error.message || 'Something went wrong.'}</p>
      <Button size="sm" onClick={() => reset()}>
        Try again
      </Button>
    </div>
  )
}
