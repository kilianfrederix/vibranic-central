'use client'

import { useEffect } from 'react'
import { useAuthContext } from '@/components/auth-provider'
import { Loader2 } from 'lucide-react'

interface ProtectedRouteProps {
    children: React.ReactNode
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
    const { isLoading, isAuthenticated } = useAuthContext()
    
    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            window.location.href = '/api/login'
        }
    }, [isLoading, isAuthenticated])
    
    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">Loading...</p>
                </div>
            </div>
        )
    }
    
    if (!isAuthenticated) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">Redirecting to login...</p>
                </div>
            </div>
        )
    }
    
    return <>{children}</>
}
