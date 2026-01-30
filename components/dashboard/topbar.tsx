"use client"

import * as React from "react"
import { Sun, Moon } from 'lucide-react';
// import { useTheme } from "next-themes"

import { usePathname } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

function getPageTitle(pathname: string) {
  if (pathname === "/") return "Dashboard"
  if (pathname.startsWith("/apps")) return "Apps"
  return "Dashboard"
}

export function Topbar() {
  const pathname = usePathname()
  // const { theme, setTheme } = useTheme()

  return (
    <header className="h-14 border-b bg-background flex items-center px-6">
      {/* Left: page context */}
      <div className="flex items-center gap-4 flex-1">
        <h1 className="text-sm font-medium">
          {getPageTitle(pathname)}
        </h1>
      </div>

      {/* Right: actions */}
      <div className="flex items-center gap-2">
        <Input
          placeholder="Search apps..."
          className="w-48 h-8"
        />

        {/* <Button 
          variant="outline" 
          size="sm" 
          className="h-8"
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          suppressHydrationWarning
        >
          {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </Button> */}

        <Button
          variant="outline"
          size="sm"
          className="h-8"
        >
          Account
        </Button>
      </div>
    </header>
  )
}
