
import { notFound } from "next/navigation"
import { appRegistry } from "@/lib/hub/registry"

export default function AppPage({
    params,
}: {
    params: { appId: string }
}) {
    const app = appRegistry.find(a => a.id === params.appId)

    if (!app) return notFound()

    return (
        <div className="space-y-6">
            <header>
                <h1 className="text-2xl font-semibold">
                    {app.name}
                </h1>
                <p className="text-muted-foreground">
                    {app.description}
                </p>
            </header>

            {/* diagnostics, charts, etc */}
        </div>
    )
}
