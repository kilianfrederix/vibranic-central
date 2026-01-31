'use client'

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { AlertCircle, AlertTriangle, Info, Filter } from "lucide-react"

type Event = {
  id: string
  type: string
  severity: string
  message: string
  timestamp: Date
  app: { name: string }
}

type App = {
  id: string
  name: string
}

type EventsTableProps = {
  events: Event[]
  apps: App[]
}

const severityConfig = {
  high: {
    icon: AlertCircle,
    className: "bg-red-500/10 text-red-500 border-red-500/20",
    label: "High"
  },
  medium: {
    icon: AlertTriangle,
    className: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
    label: "Medium"
  },
  low: {
    icon: Info,
    className: "bg-green-500/10 text-green-500 border-green-500/20",
    label: "Low"
  }
}

export function EventsTable({ events, apps }: EventsTableProps) {
  const [severityFilter, setSeverityFilter] = useState<string | null>(null)
  const [appFilter, setAppFilter] = useState<string | null>(null)

  const filteredEvents = events.filter(event => {
    if (severityFilter && event.severity !== severityFilter) return false
    if (appFilter && event.app.name !== appFilter) return false
    return true
  })

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Events ({filteredEvents.length})</CardTitle>
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <div className="flex gap-1">
              <Button
                variant={severityFilter === null ? "secondary" : "ghost"}
                size="sm"
                onClick={() => setSeverityFilter(null)}
              >
                All
              </Button>
              <Button
                variant={severityFilter === "high" ? "secondary" : "ghost"}
                size="sm"
                onClick={() => setSeverityFilter("high")}
              >
                High
              </Button>
              <Button
                variant={severityFilter === "medium" ? "secondary" : "ghost"}
                size="sm"
                onClick={() => setSeverityFilter("medium")}
              >
                Medium
              </Button>
              <Button
                variant={severityFilter === "low" ? "secondary" : "ghost"}
                size="sm"
                onClick={() => setSeverityFilter("low")}
              >
                Low
              </Button>
            </div>
            <select
              className="text-sm border rounded px-2 py-1 bg-background"
              value={appFilter || ""}
              onChange={(e) => setAppFilter(e.target.value || null)}
            >
              <option value="">All Apps</option>
              {apps.map(app => (
                <option key={app.id} value={app.name}>{app.name}</option>
              ))}
            </select>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {filteredEvents.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">No events match your filters</p>
          ) : (
            filteredEvents.map((event) => {
              const config = severityConfig[event.severity as keyof typeof severityConfig] || severityConfig.low
              const SeverityIcon = config.icon

              return (
                <div key={event.id} className="flex items-start gap-3 p-3 rounded-lg border bg-card hover:bg-muted/30 transition-colors">
                  <SeverityIcon className={`h-4 w-4 mt-0.5 ${event.severity === 'high' ? 'text-red-500' : event.severity === 'medium' ? 'text-yellow-500' : 'text-green-500'}`} />
                  <div className="flex-1 min-w-0 grid grid-cols-[100px_80px_1fr_150px] gap-4 items-center">
                    <span className="text-sm font-medium truncate">{event.app.name}</span>
                    <Badge variant="outline" className={config.className}>
                      {config.label}
                    </Badge>
                    <p className="text-sm truncate">{event.message}</p>
                    <p className="text-xs text-muted-foreground text-right">
                      {new Date(event.timestamp).toLocaleString()}
                    </p>
                  </div>
                </div>
              )
            })
          )}
        </div>
      </CardContent>
    </Card>
  )
}
