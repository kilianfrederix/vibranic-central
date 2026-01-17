
import { appRegistry } from "@/lib/hub/registry"
import { AppCard } from "@/components/dashboard/app-card"

export default function DashboardPage() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {appRegistry.map(app => (
                <AppCard key={app.id} app={app} />
            ))}
        </div>
    )
}
