import { Skeleton } from "@/components/ui/skeleton"

export function SkeletonHeader() {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="flex h-16 items-center justify-between px-6">
        <div className="flex items-center gap-4">
          <Skeleton className="h-6 w-48" />
        </div>
        <div className="flex items-center gap-3">
          <Skeleton className="h-9 w-32 rounded-lg" />
          <Skeleton className="h-9 w-9 rounded-full" />
          <Skeleton className="h-9 w-32 rounded-lg" />
        </div>
      </div>
    </header>
  )
}

