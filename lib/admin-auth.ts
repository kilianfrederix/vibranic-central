import { NextRequest, NextResponse } from 'next/server'

export function validateAdminKey(request: NextRequest): NextResponse | null {
    const adminKey = request.headers.get('x-admin-key')
    const expectedKey = process.env.ADMIN_API_KEY

    if (!expectedKey) {
        console.error('ADMIN_API_KEY not configured')
        return NextResponse.json(
            { error: 'Server configuration error' },
            { status: 500 }
        )
    }

    if (!adminKey) {
        return NextResponse.json(
            { error: 'Missing admin API key' },
            { status: 401 }
        )
    }

    if (adminKey !== expectedKey) {
        return NextResponse.json(
            { error: 'Invalid admin API key' },
            { status: 403 }
        )
    }

    return null
}
