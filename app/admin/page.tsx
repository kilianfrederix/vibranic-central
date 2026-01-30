'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Activity, AlertTriangle, CheckCircle2, XCircle, TrendingUp, Users } from 'lucide-react'
import { appRegistry } from '@/lib/hub/registry'

interface DiagnosticEvent {
    id: string
    timestamp: string
    type: string
    severity: string
    message: string
    app: {
        id: string
        name: string
    }
}

const severityColors = {
    low: 'bg-blue-500/10 text-blue-500',
    medium: 'bg-yellow-500/10 text-yellow-500',
    high: 'bg-orange-500/10 text-orange-500',
    critical: 'bg-red-500/10 text-red-500'
}

const typeIcons = {
    error: XCircle,
    warning: AlertTriangle,
    info: CheckCircle2,
    debug: Activity
}

export default function AdminDashboard() {
    const [events, setEvents] = useState<DiagnosticEvent[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchEvents()

        // Poll for new events every 5 seconds
        const interval = setInterval(fetchEvents, 5000)
        return () => clearInterval(interval)
    }, [])

    const fetchEvents = async () => {
        try {
            const response = await fetch('/api/diagnostics/events?limit=50')
            const data = await response.json()
            setEvents(data.events || [])
        } catch (error) {
            console.error('Failed to fetch events:', error)
        } finally {
            setLoading(false)
        }
    }

    // Calculate stats
    const stats = {
        totalApps: appRegistry.length,
        healthyApps: appRegistry.filter(a => a.diagnostics.status === 'healthy').length,
        totalEvents: events.length,
        criticalEvents: events.filter(e => e.severity === 'critical').length,
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
                <p className="text-muted-foreground">
                    Monitor all applications and diagnostic data
                </p>
            </div>

            {/* Stats Grid */}
            <div className="grid gap-4 md:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Total Apps
                        </CardTitle>
                        <Activity className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.totalApps}</div>
                        <p className="text-xs text-muted-foreground">
                            {stats.healthyApps} healthy
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Events (24h)
                        </CardTitle>
                        <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.totalEvents}</div>
                        <p className="text-xs text-muted-foreground">
                            Real-time monitoring
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Critical Events
                        </CardTitle>
                        <AlertTriangle className="h-4 w-4 text-red-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-red-500">
                            {stats.criticalEvents}
                        </div>
                        <p className="text-xs text-muted-foreground">
                            Requires attention
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            System Health
                        </CardTitle>
                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-500">
                            {Math.round((stats.healthyApps / stats.totalApps) * 100)}%
                        </div>
                        <p className="text-xs text-muted-foreground">
                            All systems operational
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Main Content */}
            <Tabs defaultValue="events" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="events">Recent Events</TabsTrigger>
                    <TabsTrigger value="apps">App Status</TabsTrigger>
                    <TabsTrigger value="metrics">Metrics</TabsTrigger>
                </TabsList>

                <TabsContent value="events" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Event Stream</CardTitle>
                            <CardDescription>
                                Real-time diagnostic events from all applications
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {loading ? (
                                <p className="text-center text-muted-foreground py-8">
                                    Loading events...
                                </p>
                            ) : events.length === 0 ? (
                                <p className="text-center text-muted-foreground py-8">
                                    No events yet. Start using your apps to see data here.
                                </p>
                            ) : (
                                <div className="space-y-3">
                                    {events.map((event) => {
                                        const Icon = typeIcons[event.type as keyof typeof typeIcons] || Activity
                                        return (
                                            <div
                                                key={event.id}
                                                className="flex items-start gap-4 p-4 rounded-lg border hover:bg-muted/50 transition-colors"
                                            >
                                                <Icon className="w-5 h-5 mt-0.5 shrink-0" />

                                                <div className="flex-1 min-w-0 space-y-1">
                                                    <div className="flex items-center gap-2 flex-wrap">
                                                        <span className="font-medium">{event.app.name}</span>
                                                        <Badge variant="outline" className={severityColors[event.severity as keyof typeof severityColors]}>
                                                            {event.severity}
                                                        </Badge>
                                                        <Badge variant="outline" className="capitalize">
                                                            {event.type}
                                                        </Badge>
                                                    </div>
                                                    <p className="text-sm text-muted-foreground">
                                                        {event.message}
                                                    </p>
                                                    <p className="text-xs text-muted-foreground">
                                                        {new Date(event.timestamp).toLocaleString()}
                                                    </p>
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="apps" className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                        {appRegistry.map((app) => {
                            const statusConfig = {
                                healthy: { icon: CheckCircle2, color: 'text-green-500' },
                                warning: { icon: AlertTriangle, color: 'text-yellow-500' },
                                down: { icon: XCircle, color: 'text-red-500' }
                            }
                            const status = statusConfig[app.diagnostics.status as keyof typeof statusConfig] || statusConfig.healthy
                            const StatusIcon = status.icon

                            return (
                                <Card key={app.id}>
                                    <CardHeader>
                                        <div className="flex items-start justify-between">
                                            <CardTitle>{app.name}</CardTitle>
                                            <StatusIcon className={`w-5 h-5 ${status.color}`} />
                                        </div>
                                        <CardDescription>{app.description}</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-2">
                                            {app.diagnostics.metrics.map((metric) => (
                                                <div key={metric.key} className="flex justify-between text-sm">
                                                    <span className="text-muted-foreground">{metric.label}</span>
                                                    <span className="font-medium">{metric.value}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>
                            )
                        })}
                    </div>
                </TabsContent>

                <TabsContent value="metrics" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Metrics Dashboard</CardTitle>
                            <CardDescription>
                                Performance and usage metrics across all apps
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="h-80 flex items-center justify-center border rounded-lg bg-muted/20">
                                <div className="text-center space-y-2">
                                    <TrendingUp className="w-12 h-12 mx-auto text-muted-foreground" />
                                    <p className="text-sm text-muted-foreground">
                                        Metrics visualization coming soon
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                        Charts will appear here once metrics data is collected
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}
