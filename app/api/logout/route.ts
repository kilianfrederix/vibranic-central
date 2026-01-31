import { NextRequest, NextResponse } from 'next/server'
import { getLogoutUrl, deleteSession, SESSION_COOKIE } from '@/lib/auth'
import { cookies } from 'next/headers'

export async function GET(request: NextRequest) {
    try {
        const cookieStore = await cookies()
        const sessionCookie = cookieStore.get(SESSION_COOKIE)
        
        if (sessionCookie?.value) {
            await deleteSession(sessionCookie.value)
        }
        
        cookieStore.delete(SESSION_COOKIE)
        
        const protocol = request.headers.get('x-forwarded-proto') || 'https'
        const host = request.headers.get('host') || ''
        const postLogoutRedirectUri = `${protocol}://${host}/`
        
        const logoutUrl = await getLogoutUrl(postLogoutRedirectUri)
        
        return NextResponse.redirect(logoutUrl)
    } catch (error) {
        console.error('Logout error:', error)
        const cookieStore = await cookies()
        cookieStore.delete(SESSION_COOKIE)
        return NextResponse.redirect(new URL('/', request.url))
    }
}
