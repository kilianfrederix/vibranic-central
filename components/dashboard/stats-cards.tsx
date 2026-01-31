import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Activity, AlertTriangle, AppWindow, Bell } from "lucide-react"

type StatsCardsProps = {
  totalApps: number
  totalEvents: number
  recentEvents: number
  criticalEvents: number
}

export function StatsCards({ totalApps, totalEvents, recentEvents, criticalEvents }: StatsCardsProps) {
  const stats = [
    {
      title: "Total Apps",
      value: totalApps,
      icon: AppWindow,
      description: "Registered applications"
    },
    {
      title: "Total Events",
      value: totalEvents,
      icon: Activity,
      description: "All-time events logged"
    },
    {
      title: "Last 24h",
      value: recentEvents,
      icon: Bell,
      description: "Events in the last day"
    },
    {
      title: "Critical",
      value: criticalEvents,
      icon: AlertTriangle,
      description: "High severity events",
      variant: criticalEvents > 0 ? "destructive" : "default"
    }
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => (
        <Card key={stat.title} className={stat.variant === "destructive" ? "border-red-500/50" : ""}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            <stat.icon className={`h-4 w-4 ${stat.variant === "destructive" ? "text-red-500" : "text-muted-foreground"}`} />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${stat.variant === "destructive" ? "text-red-500" : ""}`}>
              {stat.value}
            </div>
            <p className="text-xs text-muted-foreground">{stat.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
