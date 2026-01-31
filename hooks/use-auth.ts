'use client'

import { useUser, useAuth as useClerkAuth } from '@clerk/nextjs'

interface AuthState {
    user: {
        id: string
        email: string | null
        firstName: string | null
        lastName: string | null
        profileImageUrl: string | null
    } | null
    isLoading: boolean
    isAuthenticated: boolean
    signOut: () => Promise<void>
}

export function useAuth(): AuthState {
    const { user, isLoaded, isSignedIn } = useUser()
    const { signOut } = useClerkAuth()
    
    return {
        user: user ? {
            id: user.id,
            email: user.primaryEmailAddress?.emailAddress || null,
            firstName: user.firstName,
            lastName: user.lastName,
            profileImageUrl: user.imageUrl,
        } : null,
        isLoading: !isLoaded,
        isAuthenticated: !!isSignedIn,
        signOut: async () => { await signOut() },
    }
}
