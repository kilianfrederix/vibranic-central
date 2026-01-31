import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { validateAdminKey } from '@/lib/admin-auth'

// POST /api/apps - Register a new app (requires admin key)
export async function POST(request: NextRequest) {
    const authError = validateAdminKey(request)
    if (authError) return authError

    try {
        const body = await request.json()
        const { name, description, externalUrl, iconUrl } = body

        if (!name || !externalUrl) {
            return NextResponse.json(
                { error: 'Missing required fields: name, externalUrl' },
                { status: 400 }
            )
        }

        const app = await prisma.app.create({
            data: {
                name,
                description: description || null,
                externalUrl,
                iconUrl: iconUrl || null,
            }
        })

        return NextResponse.json({
            success: true,
            app: {
                id: app.id,
                name: app.name,
                apiKey: app.apiKey,
                externalUrl: app.externalUrl
            }
        }, { status: 201 })

    } catch (error) {
        console.error('Error registering app:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}

// GET /api/apps - List all apps (requires admin key)
export async function GET(request: NextRequest) {
    const authError = validateAdminKey(request)
    if (authError) return authError

    try {
        const apps = await prisma.app.findMany({
            select: {
                id: true,
                name: true,
                description: true,
                externalUrl: true,
                iconUrl: true,
                createdAt: true,
                _count: {
                    select: {
                        events: true,
                        metrics: true
                    }
                }
            },
            orderBy: { createdAt: 'desc' }
        })

        return NextResponse.json({ apps })

    } catch (error) {
        console.error('Error fetching apps:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}
