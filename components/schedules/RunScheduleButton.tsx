'use client'

import { useTransition, useState } from 'react'
import { triggerTaskNow } from '@/lib/actions/schedules'

export function RunScheduleButton({ taskId, label }: { taskId: string; label: string }) {
  const [isPending, startTransition] = useTransition()
  const [result, setResult] = useState<{ ok: boolean; message: string } | null>(null)

  const handleRun = () => {
    setResult(null)
    startTransition(async () => {
      try {
        const res = await triggerTaskNow(taskId)
        setResult(res)
      } catch (err: any) {
        setResult({ ok: false, message: err.message ?? 'Something went wrong.' })
      }
    })
  }

  return (
    <div className="flex flex-col items-end gap-2">
      <button
        onClick={handleRun}
        disabled={isPending}
        className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-900 text-white text-sm font-medium hover:bg-slate-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isPending ? (
          <>
            {/* spinner */}
            <svg
              className="animate-spin h-4 w-4 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
            </svg>
            Running…
          </>
        ) : (
          <>
            {/* play icon */}
            <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                clipRule="evenodd"
              />
            </svg>
            Run now
          </>
        )}
      </button>

      {result && (
        <p
          className={`text-xs px-3 py-1.5 rounded-lg max-w-xs text-right ${
            result.ok
              ? 'bg-emerald-50 text-emerald-700'
              : 'bg-red-50 text-red-700'
          }`}
        >
          {result.message}
        </p>
      )}
    </div>
  )
}
