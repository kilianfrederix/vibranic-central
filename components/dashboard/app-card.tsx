'use client'

import React from "react"
import Link from "next/link"
import { BadgeCheck, BadgeAlert, BadgeX } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

import type { ExternalApp } from "@/lib/hub/types"

export function AppCard({ app }: Readonly<{ app: ExternalApp }>) {
    return (
        <Link href={app.externalUrl} target="_blank" rel="noopener noreferrer">
            <Card className="hover:shadow-lg transition-shadow">
                <CardHeader className="flex justify-between">
                    <CardTitle>{app.name}</CardTitle>
                    <span>
                        {
                            app.diagnostics.status === "active" 
                            ? <BadgeCheck className="text-green-500" /> 
                            : app.diagnostics.status === "warning" 
                            ? <BadgeAlert className="text-orange-500" /> 
                            : <BadgeX className="text-red-500" />
                            
                        }
                    </span>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-muted-foreground">{app.description}</p>
                </CardContent>
            </Card>
        </Link>
    )
}