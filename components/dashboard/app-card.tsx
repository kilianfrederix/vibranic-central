'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Activity, AlertTriangle, CheckCircle2, XCircle } from "lucide-react"
import Link from "next/link"
import type { ExternalApp } from "@/lib/hub/types"

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

export function AppCard({ app }: Readonly<{ app: ExternalApp }>) {
    // Default to 'healthy' if status is undefined or invalid
    const statusKey = app.diagnostics?.status || 'healthy'
    const status = statusConfig[statusKey as keyof typeof statusConfig] || statusConfig.healthy
    const StatusIcon = status.icon

    // Ensure metrics is an array
    const metrics = app.diagnostics?.metrics || []

    return (
        <Link href={`/apps/${app.id}`}>
            <Card className="hover:shadow-lg transition-all hover:border-primary/50 cursor-pointer h-full">
                <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                        <CardTitle className="text-lg">{app.name}</CardTitle>
                        <Badge variant="outline" className={status.className}>
                            <StatusIcon className="w-3 h-3 mr-1" />
                            {status.label}
                        </Badge>
                    </div>
                </CardHeader>
                <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                        {app.description || 'No description'}
                    </p>

                    {metrics.length > 0 && (
                        <div className="grid grid-cols-2 gap-3 pt-2 border-t">
                            {metrics.slice(0, 2).map((metric) => (
                                <div key={metric.key} className="space-y-1">
                                    <p className="text-xs text-muted-foreground">
                                        {metric.label}
                                    </p>
                                    <p className="text-sm font-semibold">
                                        {metric.value}
                                    </p>
                                </div>
                            ))}
                        </div>
                    )}

                    <div className="flex items-center gap-2 text-xs text-muted-foreground pt-2">
                        <Activity className="w-3 h-3" />
                        <span>View details</span>
                    </div>
                </CardContent>
            </Card>
        </Link>
    )
}