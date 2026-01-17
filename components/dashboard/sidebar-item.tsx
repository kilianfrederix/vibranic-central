"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"
import { cn } from "@/lib/utils"

type SidebarItemProps = {
    href: string
    label: string
    external: boolean
}

export function SidebarItem({ href, label, external }: SidebarItemProps) {
    const pathname = usePathname()
    const isActive =
        pathname === href || pathname.startsWith(`${href}/`)

    return external ? (
        <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
                "flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors",
                "hover:bg-muted",
                isActive && "bg-muted font-medium"
            )}
        >
            {label}
        </a>
    ) : (
        <Link
            href={href}
            className={cn(
                "flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors",
                "hover:bg-muted",
                isActive && "bg-muted font-medium"
            )}
        >
            {label}
        </Link>
    )
}
