import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent } from "@/components/ui/card"

interface SkeletonListProps {
  items?: number
  showAvatar?: boolean
  showActions?: boolean
}

export function SkeletonList({ items = 5, showAvatar = false, showActions = false }: SkeletonListProps) {
  return (
    <div className="space-y-3">
      {Array.from({ length: items }).map((_, i) => (
        <Card key={i} className="border-2 border-transparent">
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              {showAvatar && (
                <Skeleton className="h-10 w-10 rounded-full" />
              )}
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
              </div>
              {showActions && (
                <div className="flex gap-2">
                  <Skeleton className="h-8 w-8 rounded" />
                  <Skeleton className="h-8 w-8 rounded" />
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

