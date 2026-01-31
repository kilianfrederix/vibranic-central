'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'

type EventsChartProps = {
  data: {
    hour: string
    errors: number
    warnings: number
    info: number
  }[]
}

export function EventsChart({ data }: EventsChartProps) {
  const formattedData = data.map(d => {
    const date = new Date(d.hour + ':00:00Z')
    return {
      ...d,
      time: isNaN(date.getTime()) ? d.hour.slice(-5) : date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  })

  return (
    <Card>
      <CardHeader>
        <CardTitle>Events Over Time (24h)</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] min-h-[300px]">
          <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
            <AreaChart data={formattedData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis 
                dataKey="time" 
                tick={{ fontSize: 12 }}
                className="text-muted-foreground"
              />
              <YAxis 
                tick={{ fontSize: 12 }}
                className="text-muted-foreground"
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px'
                }}
              />
              <Legend />
              <Area 
                type="monotone" 
                dataKey="errors" 
                stackId="1"
                stroke="#ef4444" 
                fill="#ef444433"
                name="Errors"
              />
              <Area 
                type="monotone" 
                dataKey="warnings" 
                stackId="1"
                stroke="#f59e0b" 
                fill="#f59e0b33"
                name="Warnings"
              />
              <Area 
                type="monotone" 
                dataKey="info" 
                stackId="1"
                stroke="#22c55e" 
                fill="#22c55e33"
                name="Info"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
