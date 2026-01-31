'use client'

import { createContext, useContext, ReactNode } from 'react'
import { useAuth } from '@/hooks/use-auth'

interface User {
    id: string
    email: string | null
    firstName: string | null
    lastName: string | null
    profileImageUrl: string | null
}

interface AuthContextType {
    user: User | null
    isLoading: boolean
    isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    isLoading: true,
    isAuthenticated: false,
})

export function AuthProvider({ children }: { children: ReactNode }) {
    const auth = useAuth()
    
    return (
        <AuthContext.Provider value={auth}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuthContext() {
    return useContext(AuthContext)
}
