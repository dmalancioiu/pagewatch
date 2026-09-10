import { Skeleton } from '@/components/ui/skeleton'

export default function SchedulesLoading() {
  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-4 px-4 py-6 sm:px-6">
      <Skeleton className="h-6 w-28" />
      <div className="flex flex-col gap-px overflow-hidden rounded-md border border-border">
        {Array.from({ length: 2 }).map((_, i) => (
          <Skeleton key={i} className="h-20 w-full rounded-none" />
        ))}
      </div>
    </div>
  )
}
