import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AlertCircle, AlertTriangle, Info } from "lucide-react"

type Event = {
  id: string
  type: string
  severity: string
  message: string
  timestamp: Date
  app: { name: string }
}

type RecentEventsProps = {
  events: Event[]
}

const severityConfig = {
  high: {
    icon: AlertCircle,
    className: "bg-red-500/10 text-red-500 border-red-500/20"
  },
  medium: {
    icon: AlertTriangle,
    className: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
  },
  low: {
    icon: Info,
    className: "bg-green-500/10 text-green-500 border-green-500/20"
  }
}

export function RecentEvents({ events }: RecentEventsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Events</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {events.length === 0 ? (
            <p className="text-muted-foreground text-sm">No events yet</p>
          ) : (
            events.map((event) => {
              const config = severityConfig[event.severity as keyof typeof severityConfig] || severityConfig.low
              const SeverityIcon = config.icon
              
              return (
                <div key={event.id} className="flex items-start gap-3 p-3 rounded-lg border bg-card hover:bg-muted/50 transition-colors">
                  <SeverityIcon className={`h-4 w-4 mt-0.5 ${event.severity === 'high' ? 'text-red-500' : event.severity === 'medium' ? 'text-yellow-500' : 'text-green-500'}`} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant="outline" className={config.className}>
                        {event.severity}
                      </Badge>
                      <span className="text-xs text-muted-foreground">{event.app.name}</span>
                    </div>
                    <p className="text-sm truncate">{event.message}</p>
                    <p className="text-xs text-muted-foreground mt-1">
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
