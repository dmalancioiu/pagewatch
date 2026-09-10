import { Skeleton } from '@/components/ui/skeleton'

export default function AlertsLoading() {
  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-5 px-4 py-6 sm:px-6">
      <div className="flex items-center justify-between gap-3">
        <Skeleton className="h-6 w-24" />
        <Skeleton className="h-4 w-28" />
      </div>
      {Array.from({ length: 2 }).map((_, g) => (
        <div key={g} className="flex flex-col gap-2">
          <Skeleton className="h-3 w-16" />
          <div className="flex flex-col gap-px overflow-hidden rounded-md border border-border">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-16 w-full rounded-none" />
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
