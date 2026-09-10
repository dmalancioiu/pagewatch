import { Skeleton } from '@/components/ui/skeleton'

export default function UrlsLoading() {
  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-4 px-4 py-6 sm:px-6">
      <div className="flex items-center justify-between gap-3">
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-8 w-28" />
      </div>
      <Skeleton className="h-8 w-64" />
      <div className="flex flex-col gap-px overflow-hidden rounded-md border border-border">
        {Array.from({ length: 8 }).map((_, i) => (
          <Skeleton key={i} className="h-10 w-full rounded-none" />
        ))}
      </div>
    </div>
  )
}
