import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
    try {
        const alerts = await prisma.alert.findMany({
            include: {
                app: { select: { name: true } },
            },
            orderBy: { createdAt: 'desc' },
        })
        
        return NextResponse.json(alerts)
    } catch (error) {
        console.error('Alerts fetch error:', error)
        return NextResponse.json({ error: 'Failed to fetch alerts' }, { status: 500 })
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const { name, appId, condition, severity } = body
        
        if (!name || !condition || !severity) {
            return NextResponse.json(
                { error: 'Name, condition, and severity are required' },
                { status: 400 }
            )
        }
        
        const alert = await prisma.alert.create({
            data: {
                name,
                appId: appId || null,
                condition,
                severity,
            },
            include: {
                app: { select: { name: true } },
            },
        })
        
        return NextResponse.json(alert)
    } catch (error) {
        console.error('Alert creation error:', error)
        return NextResponse.json({ error: 'Failed to create alert' }, { status: 500 })
    }
}
