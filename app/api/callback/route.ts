import { NextRequest, NextResponse } from 'next/server'
import { handleCallback, SESSION_COOKIE } from '@/lib/auth'
import { cookies } from 'next/headers'

export async function GET(request: NextRequest) {
    try {
        const cookieStore = await cookies()
        const codeVerifier = cookieStore.get('oauth_code_verifier')?.value
        const storedState = cookieStore.get('oauth_state')?.value
        const returnedState = request.nextUrl.searchParams.get('state')
        
        if (!codeVerifier) {
            console.error('No code verifier found')
            return NextResponse.redirect(new URL('/api/login', request.url))
        }
        
        if (!storedState || !returnedState || storedState !== returnedState) {
            console.error('State mismatch - potential CSRF attack')
            cookieStore.delete('oauth_code_verifier')
            cookieStore.delete('oauth_state')
            return NextResponse.redirect(new URL('/api/login', request.url))
        }
        
        const protocol = request.headers.get('x-forwarded-proto') || 'https'
        const host = request.headers.get('host') || ''
        const callbackUrl = `${protocol}://${host}/api/callback`
        
        const { sessionId, expire } = await handleCallback(
            callbackUrl,
            request.nextUrl.searchParams,
            codeVerifier
        )
        
        cookieStore.delete('oauth_code_verifier')
        cookieStore.delete('oauth_state')
        
        cookieStore.set(SESSION_COOKIE, sessionId, {
            httpOnly: true,
            secure: true,
            sameSite: 'lax',
            expires: expire,
            path: '/',
        })
        
        return NextResponse.redirect(new URL('/', request.url))
    } catch (error) {
        console.error('Callback error:', error)
        return NextResponse.redirect(new URL('/', request.url))
    }
}
