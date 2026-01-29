
import { appRegistry } from "@/lib/hub/registry"
import { SidebarItem } from "./sidebar-item"

export function Sidebar() {
    return (
        <aside className="w-64 border-r bg-background flex flex-col">
            {/* Header */}
            <div className="h-14 px-4 flex items-center border-b">
                <span className="font-semibold tracking-tight">
                    <img src="./vibranic-central logo.png" alt="Vibranic Central Logo" className="h-8" />
                </span>
            </div>

            {/* Navigation */}
            <nav className="flex-1 overflow-auto p-2 space-y-1">
                <SidebarItem
                    href="/"
                    label="Dashboard"
                    external={false}
                />

                <div className="pt-2">
                    <p className="px-3 text-xs font-medium text-muted-foreground uppercase">
                        Apps
                    </p>

                    <div className="mt-1 space-y-1">
                        {appRegistry.map((app) => (
                            <SidebarItem
                                key={app.id}
                                href={app.externalUrl}
                                label={app.name}
                                external={true}
                            />
                        ))}
                    </div>
                </div>
            </nav>

            {/* Footer */}
            <div className="border-t p-3 text-xs text-muted-foreground">
                v0.1.0
            </div>
        </aside>
    )
}
