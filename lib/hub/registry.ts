
import { ExternalApp } from "./types"

export const appRegistry: ExternalApp[] = [
    {
        id: "crm",
        name: "CRM",
        description: "Customer management",
        externalUrl: "https://crm.example.com",
        diagnostics: {
            status: "active",
            metrics: [
                { key: "users", label: "Active Users", value: "3.2k" },
                { key: "uptime", label: "Uptime", value: "99.99%" }
            ]
        }
    },
    {
        id: "billing",
        name: "Billing",
        description: "Payments & subscriptions",
        externalUrl: "https://billing.example.com",
        diagnostics: {
            status: "warning",
            metrics: [
                { key: "failures", label: "Failed Charges", value: 12 }
            ]
        }
    },
    {
        id: "billing-2",
        name: "Billing-2",
        description: "Payments & subscriptions",
        externalUrl: "https://billing.example2.com",
        diagnostics: {
            status: "error",
            metrics: [
                { key: "failures", label: "Failed Charges", value: 12 }
            ]
        }
    }
]
