"use client"

import { useEffect, useCallback, useState } from 'react'

interface UseAutoRefreshOptions {
  interval?: number
  enabled?: boolean
}

export function useAutoRefresh<T>(
  fetchFn: () => Promise<T>,
  options: UseAutoRefreshOptions = {}
) {
  const { interval = 30000, enabled = true } = options
  const [data, setData] = useState<T | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)

  const refresh = useCallback(async () => {
    try {
      const result = await fetchFn()
      setData(result)
      setLastUpdated(new Date())
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch'))
    } finally {
      setIsLoading(false)
    }
  }, [fetchFn])

  useEffect(() => {
    refresh()

    if (!enabled) return

    const intervalId = setInterval(refresh, interval)
    return () => clearInterval(intervalId)
  }, [refresh, interval, enabled])

  return { data, isLoading, error, lastUpdated, refresh }
}
