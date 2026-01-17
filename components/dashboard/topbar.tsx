"use client"

import { usePathname } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

function getPageTitle(pathname: string) {
  if (pathname === "/") return "Overview"
  if (pathname.startsWith("/apps")) return "Apps"
  return "Dashboard"
}

export function Topbar() {
  const pathname = usePathname()

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

        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
        >
          ⌘
        </Button>

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
