import { Suspense } from "react"
import  MainDashboard  from "@/components/MainDashboard"
import { LoadingSpinner } from "@/components/ui/LoadingSpinner"
export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Suspense fallback={<LoadingSpinner />}>
        <MainDashboard />
      </Suspense>
    </main>
  )
}
