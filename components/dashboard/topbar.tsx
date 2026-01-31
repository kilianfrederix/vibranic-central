"use client"

import * as React from "react"
import { usePathname } from "next/navigation"
import { UserMenu } from "@/components/dashboard/user-menu"
import { SearchCommand } from "@/components/dashboard/search-command"
import { ThemeToggle } from "@/components/theme-toggle"

function getPageTitle(pathname: string) {
  if (pathname === "/") return "Dashboard"
  if (pathname.startsWith("/apps")) return "Apps"
  if (pathname.startsWith("/events")) return "Events Log"
  if (pathname.startsWith("/admin")) return "Admin"
  return "Dashboard"
}

export function Topbar() {
  const pathname = usePathname()

  return (
    <header className="h-14 border-b bg-background flex items-center px-6">
      <div className="flex items-center gap-4 flex-1">
        <h1 className="text-sm font-medium">
          {getPageTitle(pathname)}
        </h1>
      </div>

      <div className="flex items-center gap-2">
        <SearchCommand />
        <ThemeToggle />
        <UserMenu />
      </div>
    </header>
  )
}
