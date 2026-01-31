import * as client from 'openid-client'
import { cookies } from 'next/headers'
import { prisma } from './prisma'

const ISSUER_URL = process.env.ISSUER_URL ?? 'https://replit.com/oidc'
const SESSION_COOKIE = 'vibranic_session'
const SESSION_TTL = 7 * 24 * 60 * 60 * 1000 // 1 week

let oidcConfig: client.Configuration | null = null

async function getOidcConfig() {
    if (!oidcConfig) {
        oidcConfig = await client.discovery(
            new URL(ISSUER_URL),
            process.env.REPL_ID!
        )
    }
    return oidcConfig
}

export async function getLoginUrl(callbackUrl: string) {
    const config = await getOidcConfig()
    
    const codeVerifier = client.randomPKCECodeVerifier()
    const codeChallenge = await client.calculatePKCECodeChallenge(codeVerifier)
    const state = client.randomState()
    
    const authUrl = client.buildAuthorizationUrl(config, {
        redirect_uri: callbackUrl,
        scope: 'openid email profile',
        code_challenge: codeChallenge,
        code_challenge_method: 'S256',
        state,
    })
    
    return { authUrl: authUrl.href, codeVerifier, state }
}

export async function handleCallback(callbackUrl: string, searchParams: URLSearchParams, codeVerifier: string, expectedState: string) {
    const config = await getOidcConfig()
    
    const tokens = await client.authorizationCodeGrant(config, new URL(`${callbackUrl}?${searchParams.toString()}`), {
        pkceCodeVerifier: codeVerifier,
        expectedState,
    })
    
    const claims = tokens.claims()
    if (!claims) throw new Error('No claims in token')
    
    const user = await prisma.user.upsert({
        where: { id: claims.sub },
        update: {
            email: claims.email as string | null,
            firstName: claims.first_name as string | null,
            lastName: claims.last_name as string | null,
            profileImageUrl: claims.profile_image_url as string | null,
            updatedAt: new Date(),
        },
        create: {
            id: claims.sub,
            email: claims.email as string | null,
            firstName: claims.first_name as string | null,
            lastName: claims.last_name as string | null,
            profileImageUrl: claims.profile_image_url as string | null,
        },
    })
    
    const sessionId = crypto.randomUUID()
    const expire = new Date(Date.now() + SESSION_TTL)
    
    await prisma.session.create({
        data: {
            sid: sessionId,
            sess: { userId: user.id },
            expire,
        },
    })
    
    return { sessionId, user, expire }
}

export async function getLogoutUrl(postLogoutRedirectUri: string) {
    const config = await getOidcConfig()
    
    const logoutUrl = client.buildEndSessionUrl(config, {
        client_id: process.env.REPL_ID!,
        post_logout_redirect_uri: postLogoutRedirectUri,
    })
    
    return logoutUrl.href
}

export async function getCurrentUser() {
    const cookieStore = await cookies()
    const sessionCookie = cookieStore.get(SESSION_COOKIE)
    
    if (!sessionCookie?.value) {
        return null
    }
    
    const session = await prisma.session.findUnique({
        where: { sid: sessionCookie.value },
    })
    
    if (!session || session.expire < new Date()) {
        if (session) {
            await prisma.session.delete({ where: { sid: session.sid } })
        }
        return null
    }
    
    const sess = session.sess as { userId: string }
    const user = await prisma.user.findUnique({
        where: { id: sess.userId },
    })
    
    return user
}

export async function deleteSession(sessionId: string) {
    await prisma.session.delete({
        where: { sid: sessionId },
    }).catch(() => {})
}

export { SESSION_COOKIE }
