import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { validateAdminKey } from '@/lib/admin-auth'

type Props = {
    params: Promise<{ id: string }>
}

// GET /api/apps/[id] - Get app details (requires admin key)
export async function GET(request: NextRequest, { params }: Props) {
    const authError = validateAdminKey(request)
    if (authError) return authError

    try {
        const { id } = await params

        const app = await prisma.app.findUnique({
            where: { id },
            include: {
                _count: {
                    select: {
                        events: true,
                        metrics: true
                    }
                }
            }
        })

        if (!app) {
            return NextResponse.json(
                { error: 'App not found' },
                { status: 404 }
            )
        }

        return NextResponse.json({ app })

    } catch (error) {
        console.error('Error fetching app:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}

// DELETE /api/apps/[id] - Delete an app (requires admin key)
export async function DELETE(request: NextRequest, { params }: Props) {
    const authError = validateAdminKey(request)
    if (authError) return authError

    try {
        const { id } = await params

        const app = await prisma.app.findUnique({
            where: { id }
        })

        if (!app) {
            return NextResponse.json(
                { error: 'App not found' },
                { status: 404 }
            )
        }

        await prisma.app.delete({
            where: { id }
        })

        return NextResponse.json({ success: true })

    } catch (error) {
        console.error('Error deleting app:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}

// PATCH /api/apps/[id] - Update an app (requires admin key)
export async function PATCH(request: NextRequest, { params }: Props) {
    const authError = validateAdminKey(request)
    if (authError) return authError

    try {
        const { id } = await params
        const body = await request.json()
        const { name, description, externalUrl, iconUrl } = body

        const app = await prisma.app.findUnique({
            where: { id }
        })

        if (!app) {
            return NextResponse.json(
                { error: 'App not found' },
                { status: 404 }
            )
        }

        const updatedApp = await prisma.app.update({
            where: { id },
            data: {
                ...(name && { name }),
                ...(description !== undefined && { description }),
                ...(externalUrl && { externalUrl }),
                ...(iconUrl !== undefined && { iconUrl }),
            }
        })

        return NextResponse.json({ app: updatedApp })

    } catch (error) {
        console.error('Error updating app:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}
