import { getDashboardStats, getRecentEvents, getEventsOverTime, getAppsWithStatus } from "@/lib/db/queries"
import { StatsCards } from "@/components/dashboard/stats-cards"
import { EventsChart } from "@/components/dashboard/events-chart"
import { RecentEvents } from "@/components/dashboard/recent-events"
import { AppCard } from "@/components/dashboard/app-card"

export const dynamic = 'force-dynamic'

export default async function DashboardPage() {
  const [stats, recentEvents, eventsOverTime, apps] = await Promise.all([
    getDashboardStats(),
    getRecentEvents(5),
    getEventsOverTime(24),
    getAppsWithStatus()
  ])

  const appsForCards = apps.map(app => ({
    id: app.id,
    name: app.name,
    description: app.description || undefined,
    externalUrl: app.externalUrl,
    iconUrl: app.iconUrl || undefined,
    diagnostics: {
      status: app.status as "healthy" | "warning" | "down",
      metrics: [
        { key: "events", label: "Events", value: app.eventCount },
        { key: "metrics", label: "Metrics", value: app.metricCount }
      ]
    }
  }))

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Monitor all your applications from one place</p>
      </div>

      <StatsCards {...stats} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <EventsChart data={eventsOverTime} />
        <RecentEvents events={recentEvents} />
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-4">Your Apps</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {appsForCards.map(app => (
            <AppCard key={app.id} app={app} />
          ))}
        </div>
      </div>
    </div>
  )
}
