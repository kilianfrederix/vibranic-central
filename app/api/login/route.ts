import { NextRequest, NextResponse } from 'next/server'
import { getLoginUrl, SESSION_COOKIE } from '@/lib/auth'
import { cookies } from 'next/headers'

export async function GET(request: NextRequest) {
    try {
        const protocol = request.headers.get('x-forwarded-proto') || 'https'
        const host = request.headers.get('host') || ''
        const callbackUrl = `${protocol}://${host}/api/callback`
        
        const { authUrl, codeVerifier, state } = await getLoginUrl(callbackUrl)
        
        const cookieStore = await cookies()
        cookieStore.set('oauth_code_verifier', codeVerifier, {
            httpOnly: true,
            secure: true,
            sameSite: 'lax',
            maxAge: 600,
            path: '/',
        })
        cookieStore.set('oauth_state', state, {
            httpOnly: true,
            secure: true,
            sameSite: 'lax',
            maxAge: 600,
            path: '/',
        })
        
        return NextResponse.redirect(authUrl)
    } catch (error) {
        console.error('Login error:', error)
        return NextResponse.redirect(new URL('/', request.url))
    }
}
