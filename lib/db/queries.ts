import { prisma } from '@/lib/prisma'

export async function getDashboardStats() {
  const [totalApps, totalEvents, recentEvents, criticalEvents] = await Promise.all([
    prisma.app.count(),
    prisma.diagnosticEvent.count(),
    prisma.diagnosticEvent.count({
      where: {
        timestamp: {
          gte: new Date(Date.now() - 24 * 60 * 60 * 1000)
        }
      }
    }),
    prisma.diagnosticEvent.count({
      where: {
        severity: 'high'
      }
    })
  ])

  return {
    totalApps,
    totalEvents,
    recentEvents,
    criticalEvents
  }
}

export async function getAppsWithStatus() {
  const apps = await prisma.app.findMany({
    include: {
      events: {
        orderBy: { timestamp: 'desc' },
        take: 5
      },
      metrics: {
        orderBy: { timestamp: 'desc' },
        take: 10
      },
      _count: {
        select: {
          events: true,
          metrics: true
        }
      }
    }
  })

  return apps.map(app => {
    const recentErrors = app.events.filter(e => e.severity === 'high').length
    const recentWarnings = app.events.filter(e => e.severity === 'medium').length
    
    let status: 'healthy' | 'warning' | 'down' = 'healthy'
    if (recentErrors > 0) status = 'down'
    else if (recentWarnings > 0) status = 'warning'

    return {
      ...app,
      status,
      eventCount: app._count.events,
      metricCount: app._count.metrics
    }
  })
}

export async function getRecentEvents(limit = 10) {
  return prisma.diagnosticEvent.findMany({
    orderBy: { timestamp: 'desc' },
    take: limit,
    include: {
      app: {
        select: { name: true }
      }
    }
  })
}

export async function getEventsOverTime(hours = 24) {
  const since = new Date(Date.now() - hours * 60 * 60 * 1000)
  
  const events = await prisma.diagnosticEvent.findMany({
    where: {
      timestamp: { gte: since }
    },
    select: {
      severity: true,
      timestamp: true
    }
  })

  const hourlyData: Record<string, { hour: string, errors: number, warnings: number, info: number }> = {}
  
  for (let i = 0; i < hours; i++) {
    const hour = new Date(Date.now() - i * 60 * 60 * 1000)
    const key = hour.toISOString().slice(0, 13)
    hourlyData[key] = { hour: key, errors: 0, warnings: 0, info: 0 }
  }

  events.forEach(event => {
    const key = event.timestamp.toISOString().slice(0, 13)
    if (hourlyData[key]) {
      if (event.severity === 'high') hourlyData[key].errors++
      else if (event.severity === 'medium') hourlyData[key].warnings++
      else hourlyData[key].info++
    }
  })

  return Object.values(hourlyData).reverse()
}

export async function getAppById(id: string) {
  return prisma.app.findUnique({
    where: { id },
    include: {
      events: {
        orderBy: { timestamp: 'desc' },
        take: 50
      },
      metrics: {
        orderBy: { timestamp: 'desc' },
        take: 100
      }
    }
  })
}

export async function getAllEvents(options?: {
  appId?: string
  severity?: string
  limit?: number
  offset?: number
}) {
  const where: Record<string, unknown> = {}
  
  if (options?.appId) where.appId = options.appId
  if (options?.severity) where.severity = options.severity

  return prisma.diagnosticEvent.findMany({
    where,
    orderBy: { timestamp: 'desc' },
    take: options?.limit ?? 50,
    skip: options?.offset ?? 0,
    include: {
      app: {
        select: { name: true }
      }
    }
  })
}
