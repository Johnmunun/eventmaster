import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

export function SkeletonCard() {
  return (
    <Card className="border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 rounded-2xl overflow-hidden">
      <CardContent className="p-4 md:p-5">
        <div className="flex flex-col md:flex-row md:items-center gap-4">
          {/* Section gauche : Checkbox + Miniature */}
          <div className="flex items-start gap-3 md:gap-4">
            <Skeleton className="h-5 w-5 rounded mt-1 flex-shrink-0" />
            <Skeleton className="w-20 h-20 md:w-24 md:h-24 rounded-xl flex-shrink-0" />
          </div>

          {/* Section centrale : Informations */}
          <div className="flex-1 min-w-0 space-y-2">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 flex-wrap">
              <Skeleton className="h-5 w-32 md:w-40" />
              <div className="flex items-center gap-2 flex-wrap">
                <Skeleton className="h-5 w-20 rounded-full" />
                <Skeleton className="h-4 w-24" />
              </div>
            </div>
            <Skeleton className="h-4 w-48" />
          </div>

          {/* Section droite : Actions */}
          <div className="flex items-start justify-end gap-2 md:gap-3 flex-shrink-0 md:items-center">
            <Skeleton className="h-9 w-24 md:w-32 rounded-lg" />
            <Skeleton className="h-9 w-9 rounded-lg" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export function SkeletonStatCard() {
  return (
    <Card className="group relative overflow-hidden border-2 border-transparent bg-gradient-to-br from-white to-gray-50/50 dark:from-gray-900 dark:to-gray-800/50">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <Skeleton className="h-12 w-12 rounded-xl" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-8 w-16" />
          <Skeleton className="h-3 w-32" />
        </div>
      </CardContent>
    </Card>
  )
}

export function SkeletonFolderCard() {
  return (
    <Card className="border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 rounded-2xl overflow-hidden">
      <CardContent className="p-4 sm:p-5">
        <div className="flex flex-col items-center text-center gap-2 sm:gap-3">
          {/* Icône de dossier avec fond coloré */}
          <div className="p-3 sm:p-4 rounded-xl bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 shadow-md">
            <Skeleton className="h-6 w-6 sm:h-7 sm:w-7 rounded" />
          </div>
          {/* Nom et compteur */}
          <div className="w-full px-1 min-w-0">
            <Skeleton className="h-4 w-20 mx-auto mb-2 rounded" />
            <Skeleton className="h-3 w-16 mx-auto rounded" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

