"use client"

import { useEffect, useState, useCallback } from "react"
import { StatsCards } from "@/components/dashboard/stats-cards"
import { EventsChart } from "@/components/dashboard/events-chart"
import { RecentEvents } from "@/components/dashboard/recent-events"
import { AppCard } from "@/components/dashboard/app-card"
import { TimeRangeSelect } from "@/components/time-range-select"
import { RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"

interface DashboardData {
  stats: {
    totalApps: number
    totalEvents: number
    eventsLast24h: number
    criticalEvents: number
  }
  recentEvents: Array<{
    id: string
    type: string
    severity: string
    message: string
    timestamp: Date
    app: { name: string }
  }>
  eventsOverTime: Array<{
    hour: string
    errors: number
    warnings: number
    info: number
  }>
  apps: Array<{
    id: string
    name: string
    description?: string
    externalUrl: string
    iconUrl?: string
    diagnostics: {
      status: "healthy" | "warning" | "down"
      metrics: Array<{ key: string; label: string; value: number }>
    }
  }>
}

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null)
  const [timeRange, setTimeRange] = useState("24h")
  const [isLoading, setIsLoading] = useState(true)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)

  const fetchDashboard = useCallback(async () => {
    try {
      const response = await fetch(`/api/dashboard?timeRange=${timeRange}`)
      if (response.ok) {
        const result = await response.json()
        setData(result)
        setLastUpdated(new Date())
      }
    } catch (error) {
      console.error("Failed to fetch dashboard:", error)
    } finally {
      setIsLoading(false)
    }
  }, [timeRange])

  useEffect(() => {
    fetchDashboard()
    const interval = setInterval(fetchDashboard, 30000)
    return () => clearInterval(interval)
  }, [fetchDashboard])

  if (isLoading || !data) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">
            Monitor all your applications from one place
            {lastUpdated && (
              <span className="ml-2 text-xs">
                (Updated {lastUpdated.toLocaleTimeString()})
              </span>
            )}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={fetchDashboard}>
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          </Button>
          <TimeRangeSelect value={timeRange} onChange={setTimeRange} />
        </div>
      </div>

      <StatsCards {...data.stats} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <EventsChart data={data.eventsOverTime} />
        <RecentEvents events={data.recentEvents} />
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-4">Your Apps</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {data.apps.map(app => (
            <AppCard key={app.id} app={app} />
          ))}
        </div>
      </div>
    </div>
  )
}
