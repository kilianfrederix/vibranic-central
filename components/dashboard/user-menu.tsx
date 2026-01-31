'use client'

import { useAuthContext } from '@/components/auth-provider'
import { Button } from '@/components/ui/button'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { User, LogOut, Loader2 } from 'lucide-react'
import Link from 'next/link'

export function UserMenu() {
    const { user, isLoading, isAuthenticated } = useAuthContext()
    
    if (isLoading) {
        return (
            <Button variant="outline" size="sm" className="h-8" disabled>
                <Loader2 className="w-4 h-4 animate-spin" />
            </Button>
        )
    }
    
    if (!isAuthenticated || !user) {
        return (
            <Button variant="outline" size="sm" className="h-8" asChild>
                <Link href="/api/login">Sign In</Link>
            </Button>
        )
    }
    
    const displayName = user.firstName 
        ? `${user.firstName}${user.lastName ? ` ${user.lastName}` : ''}`
        : user.email || 'User'
    
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="h-8 gap-2">
                    {user.profileImageUrl ? (
                        <img 
                            src={user.profileImageUrl} 
                            alt={displayName}
                            className="w-5 h-5 rounded-full"
                        />
                    ) : (
                        <User className="w-4 h-4" />
                    )}
                    <span className="max-w-24 truncate">{displayName}</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuLabel>
                    <div className="flex flex-col">
                        <span className="font-medium">{displayName}</span>
                        {user.email && (
                            <span className="text-xs text-muted-foreground truncate">
                                {user.email}
                            </span>
                        )}
                    </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                    <Link href="/api/logout" className="cursor-pointer text-red-500">
                        <LogOut className="w-4 h-4 mr-2" />
                        Sign Out
                    </Link>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
