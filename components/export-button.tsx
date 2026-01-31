"use client"

import * as React from "react"
import { Download } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ExportButtonProps {
  type: 'events' | 'metrics'
  appId?: string
  timeRange?: string
  severity?: string
}

export function ExportButton({ type, appId, timeRange = '7d', severity }: ExportButtonProps) {
  const [isExporting, setIsExporting] = React.useState(false)

  const handleExport = async () => {
    setIsExporting(true)
    try {
      const params = new URLSearchParams()
      if (appId) params.set('appId', appId)
      if (timeRange) params.set('timeRange', timeRange)
      if (severity) params.set('severity', severity)
      
      const response = await fetch(`/api/export/${type}?${params.toString()}`)
      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `${type}-${timeRange}.csv`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        a.remove()
      }
    } catch (error) {
      console.error('Export failed:', error)
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <Button variant="outline" size="sm" onClick={handleExport} disabled={isExporting}>
      <Download className="h-4 w-4 mr-2" />
      {isExporting ? 'Exporting...' : 'Export CSV'}
    </Button>
  )
}
