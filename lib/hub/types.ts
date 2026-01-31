export type AppStatus = "healthy" | "warning" | "down"

export type DiagnosticMetric = {
    key: string
    label: string
    value: string | number
}

export type ExternalApp = {
    id: string
    name: string
    description?: string

    externalUrl: string
    iconUrl?: string

    diagnostics: {
        status: AppStatus
        metrics: {
            key: string
            label: string
            value: string | number
        }[]
    }
}
