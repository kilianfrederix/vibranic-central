"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { LucideIcon } from "lucide-react"

type SidebarItemProps = {
    href: string
    label: string
    icon?: LucideIcon
    external?: boolean
}

export function SidebarItem({ href, label, icon: Icon, external = false }: SidebarItemProps) {
    const pathname = usePathname()
    const isActive = pathname === href || (href !== "/" && pathname.startsWith(`${href}/`))

    const content = (
        <>
            {Icon && <Icon className="h-4 w-4" />}
            {label}
        </>
    )

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
            {content}
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
            {content}
        </Link>
    )
}
