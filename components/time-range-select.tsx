"use client"

import * as React from "react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface TimeRangeSelectProps {
  value: string
  onChange: (value: string) => void
}

export function TimeRangeSelect({ value, onChange }: TimeRangeSelectProps) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-[140px]">
        <SelectValue placeholder="Time range" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="1h">Last hour</SelectItem>
        <SelectItem value="24h">Last 24 hours</SelectItem>
        <SelectItem value="7d">Last 7 days</SelectItem>
        <SelectItem value="30d">Last 30 days</SelectItem>
      </SelectContent>
    </Select>
  )
}
