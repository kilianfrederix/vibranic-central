'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AlertCircle, AlertTriangle, Info, ExternalLink, Copy, Check } from "lucide-react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { useState } from "react"

type App = {
  id: string
  name: string
  description: string | null
  externalUrl: string
  apiKey: string
  iconUrl: string | null
  createdAt: Date
  updatedAt: Date
  events: {
    id: string
    type: string
    severity: string
    message: string
    details: unknown
    timestamp: Date
  }[]
  metrics: {
    id: string
    metricKey: string
    value: number
    unit: string | null
    timestamp: Date
  }[]
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

export function AppDetailView({ app }: { app: App }) {
  const [copied, setCopied] = useState(false)
  const [showApiKey, setShowApiKey] = useState(false)

  const copyApiKey = () => {
    navigator.clipboard.writeText(app.apiKey)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const maskedApiKey = app.apiKey.slice(0, 4) + '•'.repeat(Math.max(0, app.apiKey.length - 8)) + app.apiKey.slice(-4)

  const metricsData = app.metrics
    .reduce((acc, m) => {
      const time = new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      const existing = acc.find(a => a.time === time)
      if (existing) {
        existing[m.metricKey] = m.value
      } else {
        acc.push({ time, [m.metricKey]: m.value })
      }
      return acc
    }, [] as Record<string, unknown>[])
    .reverse()

  const metricKeys = [...new Set(app.metrics.map(m => m.metricKey))]
  const colors = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300']

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold">{app.name}</h1>
          <p className="text-muted-foreground">{app.description || 'No description'}</p>
        </div>
        <Button variant="outline" asChild>
          <a href={app.externalUrl} target="_blank" rel="noopener noreferrer">
            <ExternalLink className="h-4 w-4 mr-2" />
            Open App
          </a>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm">API Key</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2">
            <code className="flex-1 p-2 bg-muted rounded text-sm font-mono">
              {showApiKey ? app.apiKey : maskedApiKey}
            </code>
            <Button variant="outline" size="sm" onClick={() => setShowApiKey(!showApiKey)}>
              {showApiKey ? 'Hide' : 'Show'}
            </Button>
            <Button variant="outline" size="sm" onClick={copyApiKey}>
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="events">
        <TabsList>
          <TabsTrigger value="events">Events ({app.events.length})</TabsTrigger>
          <TabsTrigger value="metrics">Metrics ({app.metrics.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="events" className="mt-4">
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-3">
                {app.events.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">No events recorded yet</p>
                ) : (
                  app.events.map((event) => {
                    const config = severityConfig[event.severity as keyof typeof severityConfig] || severityConfig.low
                    const SeverityIcon = config.icon

                    return (
                      <div key={event.id} className="flex items-start gap-3 p-3 rounded-lg border bg-card">
                        <SeverityIcon className={`h-4 w-4 mt-0.5 ${event.severity === 'high' ? 'text-red-500' : event.severity === 'medium' ? 'text-yellow-500' : 'text-green-500'}`} />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <Badge variant="outline" className={config.className}>
                              {event.severity}
                            </Badge>
                            <Badge variant="secondary">{event.type}</Badge>
                          </div>
                          <p className="text-sm">{event.message}</p>
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
        </TabsContent>

        <TabsContent value="metrics" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Metrics Over Time</CardTitle>
            </CardHeader>
            <CardContent>
              {metricsData.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">No metrics recorded yet</p>
              ) : (
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={metricsData}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                      <XAxis dataKey="time" tick={{ fontSize: 12 }} />
                      <YAxis tick={{ fontSize: 12 }} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'hsl(var(--card))',
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '8px'
                        }}
                      />
                      <Legend />
                      {metricKeys.map((key, i) => (
                        <Line
                          key={key}
                          type="monotone"
                          dataKey={key}
                          stroke={colors[i % colors.length]}
                          strokeWidth={2}
                          dot={false}
                        />
                      ))}
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
