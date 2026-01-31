import { getAllEvents, getAppsWithStatus } from "@/lib/db/queries"
import { EventsTable } from "@/components/dashboard/events-table"

export const dynamic = 'force-dynamic'

export default async function EventsPage() {
  const [events, apps] = await Promise.all([
    getAllEvents({ limit: 100 }),
    getAppsWithStatus()
  ])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Events Log</h1>
        <p className="text-muted-foreground">All diagnostic events from your applications</p>
      </div>

      <EventsTable events={events} apps={apps} />
    </div>
  )
}
