"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Bell, Plus, Trash2, Power, PowerOff } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface Alert {
  id: string
  name: string
  appId: string | null
  condition: string
  severity: string
  enabled: boolean
  app: { name: string } | null
}

interface App {
  id: string
  name: string
}

export default function AlertsPage() {
  const [alerts, setAlerts] = useState<Alert[]>([])
  const [apps, setApps] = useState<App[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [newAlert, setNewAlert] = useState({
    name: "",
    appId: "",
    condition: "high_severity",
    severity: "high",
  })

  const fetchAlerts = async () => {
    try {
      const [alertsRes, appsRes] = await Promise.all([
        fetch("/api/alerts"),
        fetch("/api/admin/apps"),
      ])
      if (alertsRes.ok) {
        const data = await alertsRes.json()
        setAlerts(Array.isArray(data) ? data : [])
      }
      if (appsRes.ok) {
        const data = await appsRes.json()
        setApps(Array.isArray(data) ? data : [])
      }
    } catch (error) {
      console.error("Failed to fetch alerts:", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchAlerts()
  }, [])

  const handleCreateAlert = async () => {
    try {
      const response = await fetch("/api/alerts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newAlert.name,
          appId: newAlert.appId || null,
          condition: newAlert.condition,
          severity: newAlert.severity,
        }),
      })
      if (response.ok) {
        setIsDialogOpen(false)
        setNewAlert({ name: "", appId: "", condition: "high_severity", severity: "high" })
        fetchAlerts()
      }
    } catch (error) {
      console.error("Failed to create alert:", error)
    }
  }

  const handleToggleAlert = async (id: string, enabled: boolean) => {
    try {
      await fetch(`/api/alerts/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ enabled: !enabled }),
      })
      fetchAlerts()
    } catch (error) {
      console.error("Failed to toggle alert:", error)
    }
  }

  const handleDeleteAlert = async (id: string) => {
    try {
      await fetch(`/api/alerts/${id}`, { method: "DELETE" })
      fetchAlerts()
    } catch (error) {
      console.error("Failed to delete alert:", error)
    }
  }

  const conditionLabels: Record<string, string> = {
    high_severity: "High severity event occurs",
    any_error: "Any error event occurs",
    app_down: "App goes down",
    metric_threshold: "Metric exceeds threshold",
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Alerts</h1>
          <p className="text-muted-foreground">
            Configure notifications for critical events
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              New Alert
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Alert</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div>
                <label className="text-sm font-medium">Alert Name</label>
                <Input
                  value={newAlert.name}
                  onChange={(e) => setNewAlert({ ...newAlert, name: e.target.value })}
                  placeholder="e.g., Critical Error Alert"
                />
              </div>
              <div>
                <label className="text-sm font-medium">App (optional)</label>
                <Select
                  value={newAlert.appId}
                  onValueChange={(value) => setNewAlert({ ...newAlert, appId: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All apps" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All apps</SelectItem>
                    {apps.map((app) => (
                      <SelectItem key={app.id} value={app.id}>
                        {app.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium">Condition</label>
                <Select
                  value={newAlert.condition}
                  onValueChange={(value) => setNewAlert({ ...newAlert, condition: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="high_severity">High severity event</SelectItem>
                    <SelectItem value="any_error">Any error event</SelectItem>
                    <SelectItem value="app_down">App goes down</SelectItem>
                    <SelectItem value="metric_threshold">Metric threshold</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium">Alert Severity</label>
                <Select
                  value={newAlert.severity}
                  onValueChange={(value) => setNewAlert({ ...newAlert, severity: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={handleCreateAlert} className="w-full">
                Create Alert
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin h-6 w-6 border-2 border-primary border-t-transparent rounded-full" />
        </div>
      ) : alerts.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Bell className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium">No alerts configured</h3>
            <p className="text-muted-foreground text-sm">
              Create an alert to get notified when something goes wrong
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {alerts.map((alert) => (
            <Card key={alert.id}>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Bell className={`h-5 w-5 ${alert.enabled ? 'text-primary' : 'text-muted-foreground'}`} />
                    <div>
                      <CardTitle className="text-base">{alert.name}</CardTitle>
                      <p className="text-sm text-muted-foreground">
                        {alert.app ? alert.app.name : "All apps"} - {conditionLabels[alert.condition] || alert.condition}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={alert.severity === 'high' ? 'destructive' : alert.severity === 'medium' ? 'default' : 'secondary'}>
                      {alert.severity}
                    </Badge>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleToggleAlert(alert.id, alert.enabled)}
                    >
                      {alert.enabled ? (
                        <Power className="h-4 w-4 text-green-500" />
                      ) : (
                        <PowerOff className="h-4 w-4 text-muted-foreground" />
                      )}
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteAlert(alert.id)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
