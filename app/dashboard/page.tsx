import { Suspense } from "react"
import { DashboardOverview } from "@/components/dashboard-overview"

export default function DashboardPage() {
  return (
    <Suspense fallback={<div className="p-6">Chargement...</div>}>
      <DashboardOverview />
    </Suspense>
  )
}
