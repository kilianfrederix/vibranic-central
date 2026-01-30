import { notFound } from "next/navigation"
import { appRegistry } from "@/lib/hub/registry"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CheckCircle2, AlertTriangle, XCircle, ExternalLink, Activity } from "lucide-react"
import { Button } from "@/components/ui/button"

const statusConfig = {
    healthy: {
        icon: CheckCircle2,
        label: "Healthy",
        className: "bg-green-500/10 text-green-500 border-green-500/20"
    },
    warning: {
        icon: AlertTriangle,
        label: "Warning",
        className: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
    },
    down: {
        icon: XCircle,
        label: "Down",
        className: "bg-red-500/10 text-red-500 border-red-500/20"
    }
}

export default async function AppPage({ params }: { params: Promise<{ appId: string }> }) {
    const { appId } = await params  // ← Await the params!
    const app = appRegistry.find(a => a.id === appId)

    if (!app) return notFound()

    const status = statusConfig[app.diagnostics.status]
    const StatusIcon = status.icon

    // Mock event data - will be replaced with real data from DB
    const mockEvents = [
        {
            id: 1,
            timestamp: new Date().toISOString(),
            type: "error",
            message: "Payment gateway timeout",
            severity: "high"
        },
        {
            id: 2,
            timestamp: new Date(Date.now() - 3600000).toISOString(),
            type: "info",
            message: "Scheduled backup completed",
            severity: "low"
        }
    ]

    return (
        <div className="space-y-6">
            {/* Header */}
            <header className="flex items-start justify-between">
                <div className="space-y-1">
                    <div className="flex items-center gap-3">
                        <h1 className="text-3xl font-bold tracking-tight">
                            {app.name}
                        </h1>
                        <Badge variant="outline" className={status.className}>
                            <StatusIcon className="w-4 h-4 mr-1" />
                            {status.label}
                        </Badge>
                    </div>
                    <p className="text-muted-foreground">
                        {app.description}
                    </p>
                </div>

                <Button variant="outline" asChild>
                    <a href={app.externalUrl} target="_blank" rel="noopener noreferrer">
                        Open App
                        <ExternalLink className="w-4 h-4 ml-2" />
                    </a>
                </Button>
            </header>

            {/* Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {app.diagnostics.metrics.map((metric) => (
                    <Card key={metric.key}>
                        <CardHeader className="pb-2">
                            <CardDescription>{metric.label}</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{metric.value}</div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Detailed View Tabs */}
            <Tabs defaultValue="overview" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="events">Events</TabsTrigger>
                    <TabsTrigger value="metrics">Metrics History</TabsTrigger>
                    <TabsTrigger value="settings">Settings</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Application Health</CardTitle>
                            <CardDescription>
                                Current status and key metrics
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center gap-2">
                                <Activity className="w-5 h-5 text-muted-foreground" />
                                <span className="text-sm">
                                    Last updated: {new Date().toLocaleString()}
                                </span>
                            </div>

                            <div className="space-y-2">
                                <h4 className="text-sm font-semibold">Quick Stats</h4>
                                <div className="grid grid-cols-2 gap-4">
                                    {app.diagnostics.metrics.map((metric) => (
                                        <div key={metric.key} className="space-y-1">
                                            <p className="text-xs text-muted-foreground">
                                                {metric.label}
                                            </p>
                                            <p className="text-lg font-semibold">
                                                {metric.value}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="events" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Recent Events</CardTitle>
                            <CardDescription>
                                Diagnostic events and logs from this application
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                {mockEvents.map((event) => (
                                    <div
                                        key={event.id}
                                        className="flex items-start gap-3 p-3 rounded-lg border"
                                    >
                                        <div className={`w-2 h-2 rounded-full mt-2 ${event.severity === 'high' ? 'bg-red-500' : 'bg-blue-500'
                                            }`} />
                                        <div className="flex-1 space-y-1">
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm font-medium capitalize">
                                                    {event.type}
                                                </span>
                                                <span className="text-xs text-muted-foreground">
                                                    {new Date(event.timestamp).toLocaleString()}
                                                </span>
                                            </div>
                                            <p className="text-sm text-muted-foreground">
                                                {event.message}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="metrics" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Metrics Over Time</CardTitle>
                            <CardDescription>
                                Historical performance data
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="h-64 flex items-center justify-center border rounded-lg bg-muted/20">
                                <p className="text-sm text-muted-foreground">
                                    Chart will appear here once we have historical data
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="settings" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>App Settings</CardTitle>
                            <CardDescription>
                                Configuration for {app.name}
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">External URL</label>
                                <p className="text-sm text-muted-foreground">{app.externalUrl}</p>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">App ID</label>
                                <p className="text-sm font-mono text-muted-foreground">{app.id}</p>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}
