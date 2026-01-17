'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

import type { ExternalApp } from "@/lib/hub/types"

export function AppCard({ app }: Readonly<{ app: ExternalApp }>) {
    return (
        <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
                <CardTitle>{app.name}</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-sm text-muted-foreground">{app.description}</p>
            </CardContent>
        </Card>
    )
}