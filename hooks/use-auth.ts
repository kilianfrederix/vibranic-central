'use client'

import { useState, useEffect } from 'react'

interface User {
    id: string
    email: string | null
    firstName: string | null
    lastName: string | null
    profileImageUrl: string | null
    createdAt: string
    updatedAt: string
}

interface AuthState {
    user: User | null
    isLoading: boolean
    isAuthenticated: boolean
}

export function useAuth(): AuthState {
    const [user, setUser] = useState<User | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    
    useEffect(() => {
        async function fetchUser() {
            try {
                const response = await fetch('/api/auth/user', {
                    credentials: 'include',
                })
                
                if (response.ok) {
                    const userData = await response.json()
                    setUser(userData)
                } else {
                    setUser(null)
                }
            } catch (error) {
                console.error('Failed to fetch user:', error)
                setUser(null)
            } finally {
                setIsLoading(false)
            }
        }
        
        fetchUser()
    }, [])
    
    return {
        user,
        isLoading,
        isAuthenticated: !!user,
    }
}
