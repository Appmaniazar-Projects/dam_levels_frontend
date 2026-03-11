import { SiteHeader } from "@/components/site-header"
import { DashboardContent } from "@/components/dashboard-content"

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteHeader />
      <main className="flex-1">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
          <div className="flex flex-col gap-1 mb-6">
            <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl text-balance">
              Dam Water Levels
            </h1>
            <p className="text-sm text-muted-foreground sm:text-base text-pretty">
              Real-time water level monitoring across South African dams.
            </p>
          </div>
          <DashboardContent />
        </div>
      </main>
      <footer className="border-t border-border bg-card/50 py-6">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="text-center text-xs text-muted-foreground">
            Data sourced from the Department of Water and Sanitation. Updated weekly.
          </p>
        </div>
      </footer>
    </div>
  )
}
