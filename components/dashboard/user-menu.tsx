'use client'

import { SignInButton, SignedIn, SignedOut, UserButton } from '@clerk/nextjs'
import { Button } from '@/components/ui/button'

export function UserMenu() {
    return (
        <>
            <SignedOut>
                <SignInButton mode="modal">
                    <Button variant="outline" size="sm" className="h-8">
                        Sign In
                    </Button>
                </SignInButton>
            </SignedOut>
            <SignedIn>
                <UserButton 
                    appearance={{
                        elements: {
                            avatarBox: "w-8 h-8"
                        }
                    }}
                />
            </SignedIn>
        </>
    )
}
