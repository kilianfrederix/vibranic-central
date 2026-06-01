"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { Play, Pause, SkipForward, RotateCcw, Volume2, VolumeX } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"

type Phase = "focus" | "short" | "long"

interface Settings {
  focus: number
  short: number
  long: number
  count: number
  sound: boolean
  autoStart: boolean
}

interface HistoryEntry {
  phase: Phase
  at: string
}

const CIRCUMFERENCE = 502.65
const STORAGE_KEY = "vibranic-pomodoro"

const DEFAULT_SETTINGS: Settings = {
  focus: 25,
  short: 5,
  long: 15,
  count: 4,
  sound: true,
  autoStart: false,
}

function pad(n: number) {
  return String(n).padStart(2, "0")
}

function fmt(s: number) {
  return `${pad(Math.floor(s / 60))}:${pad(s % 60)}`
}

function getPhaseColor(phase: Phase): string {
  if (phase === "focus") return "hsl(var(--primary))"
  if (phase === "short") return "hsl(var(--chart-4, 38 92% 50%))"
  return "hsl(var(--chart-3, 262 83% 58%))"
}

function getPhaseBadgeVariant(phase: Phase, running: boolean, atStart: boolean): "default" | "secondary" | "outline" {
  if (!running && atStart) return "outline"
  if (running && phase === "focus") return "default"
  if (!running) return "secondary"
  return "secondary"
}

function getPhaseLabel(phase: Phase) {
  if (phase === "focus") return "Focus"
  if (phase === "short") return "Short Break"
  return "Long Break"
}

function loadSaved(): Record<string, unknown> | null {
  if (typeof window === "undefined") return null
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

function beep(type: "start" | "end") {
  try {
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)()
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.frequency.value = type === "start" ? 440 : 660
    gain.gain.setValueAtTime(0.15, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4)
    osc.start()
    osc.stop(ctx.currentTime + 0.4)
  } catch (error) {
    console.error("Failed to play beep:", error)
  }
}

export function PomodoroTimer() {
  // All state starts at defaults — required for SSR to match client's first render
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS)
  const [phase, setPhase] = useState<Phase>("focus")
  const [totalSeconds, setTotalSeconds] = useState(DEFAULT_SETTINGS.focus * 60)
  const [secondsLeft, setSecondsLeft] = useState(DEFAULT_SETTINGS.focus * 60)
  const [running, setRunning] = useState(false)
  const [sessionsDone, setSessionsDone] = useState(0)
  const [focusMinutes, setFocusMinutes] = useState(0)
  const [history, setHistory] = useState<HistoryEntry[]>([])
  // hydrated = localStorage has been read and state restored
  const [hydrated, setHydrated] = useState(false)

  // After mount: read localStorage and restore state
  useEffect(() => {
    const s = loadSaved()
    if (s) {
      if (s.settings) setSettings({ ...DEFAULT_SETTINGS, ...(s.settings as Partial<Settings>) })
      if (s.phase) setPhase(s.phase as Phase)
      if (s.totalSeconds) setTotalSeconds(s.totalSeconds as number)

      let secs: number = (s.secondsLeft as number | undefined) ?? DEFAULT_SETTINGS.focus * 60
      let wasRunning: boolean = (s.running as boolean | undefined) ?? false
      if (s.running && s.savedAt) {
        const elapsed = Math.floor((Date.now() - (s.savedAt as number)) / 1000)
        secs = Math.max(0, secs - elapsed)
        if (elapsed >= ((s.secondsLeft as number | undefined) ?? 0)) wasRunning = false
      }
      setSecondsLeft(secs)
      setRunning(wasRunning)

      if (s.sessionsDone != null) setSessionsDone(s.sessionsDone as number)
      if (s.focusMinutes != null) setFocusMinutes(s.focusMinutes as number)
      if (s.history) setHistory(s.history as HistoryEntry[])
    }
    setHydrated(true)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Persist to localStorage — only after hydration to avoid overwriting saved state
  useEffect(() => {
    if (!hydrated) return
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        phase,
        settings,
        secondsLeft,
        totalSeconds,
        running,
        sessionsDone,
        focusMinutes,
        history,
        savedAt: Date.now(),
      }))
    } catch {}
  }, [hydrated, phase, settings, secondsLeft, totalSeconds, running, sessionsDone, focusMinutes, history])

  const stateRef = useRef({ phase, settings, secondsLeft, sessionsDone })
  useEffect(() => {
    stateRef.current = { phase, settings, secondsLeft, sessionsDone }
  })

  const goToNextPhase = useCallback(
    (currentPhase: Phase, currentSessionsDone: number, cfg: Settings) => {
      const now = new Date()
      const timeStr = `${pad(now.getHours())}:${pad(now.getMinutes())}`
      setHistory((h) => [...h, { phase: currentPhase, at: timeStr }])

      if (currentPhase === "focus") {
        const newDone = currentSessionsDone + 1
        setSessionsDone(newDone)
        setFocusMinutes((m) => m + cfg.focus)
        const isLong = newDone % cfg.count === 0
        const next: Phase = isLong ? "long" : "short"
        const nextSecs = (isLong ? cfg.long : cfg.short) * 60
        setPhase(next)
        setTotalSeconds(nextSecs)
        setSecondsLeft(nextSecs)
        if (!cfg.autoStart) setRunning(false)
      } else {
        setPhase("focus")
        const nextSecs = cfg.focus * 60
        setTotalSeconds(nextSecs)
        setSecondsLeft(nextSecs)
        setRunning(false)
      }
    },
    []
  )

  useEffect(() => {
    if (!running) return
    const interval = setInterval(() => {
      const { phase: p, settings: cfg, secondsLeft: sl, sessionsDone: sd } = stateRef.current
      if (sl <= 1) {
        if (cfg.sound) beep("end")
        goToNextPhase(p, sd, cfg)
        return
      }
      setSecondsLeft((s) => s - 1)
      if (p === "focus") setFocusMinutes((m) => m + 1 / 60)
    }, 1000)
    return () => clearInterval(interval)
  }, [running, goToNextPhase])

  const toggleTimer = () => {
    if (!running && settings.sound) beep("start")
    setRunning((r) => !r)
  }

  const skipPhase = () => {
    setRunning(false)
    setTimeout(
      () => goToNextPhase(stateRef.current.phase, stateRef.current.sessionsDone, settings),
      0
    )
  }

  const resetTimer = () => {
    setRunning(false)
    setPhase("focus")
    const secs = settings.focus * 60
    setTotalSeconds(secs)
    setSecondsLeft(secs)
  }

  const updateSetting = (key: keyof Settings, value: number | boolean) => {
    setSettings((prev) => {
      const next = { ...prev, [key]: value }
      if (!running && typeof value === "number") {
        const secs = next.focus * 60
        setTotalSeconds(secs)
        setSecondsLeft(secs)
        setPhase("focus")
      }
      return next
    })
  }

  const progress = secondsLeft / totalSeconds
  const ringOffset = CIRCUMFERENCE * (1 - progress)
  const cyclePos = sessionsDone % settings.count
  const atStart = secondsLeft === totalSeconds

  const statusLabel =
    !running && atStart
      ? "Idle"
      : running && phase === "focus"
      ? "Focusing"
      : !running
      ? "Paused"
      : "On break"

  return (
    <div className="space-y-6">
      {/* Header — same structure as DashboardPage */}
      <div className="flex items-center justify-between">
        <div></div>
        <div className="flex items-center gap-2">
          <Badge variant={getPhaseBadgeVariant(phase, running, atStart)}>
            {statusLabel}
          </Badge>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => updateSetting("sound", !settings.sound)}
            title={settings.sound ? "Mute sounds" : "Enable sounds"}
          >
            {settings.sound ? (
              <Volume2 className="h-4 w-4" />
            ) : (
              <VolumeX className="h-4 w-4 text-muted-foreground" />
            )}
          </Button>
        </div>
      </div>

      {/* Stats row — mirrors StatsCards layout */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Sessions today", value: String(sessionsDone) },
          { label: "Focus time", value: `${Math.round(focusMinutes)}m` },
          { label: "Current phase", value: getPhaseLabel(phase) },
          { label: "Until long break", value: `${settings.count - cyclePos} left` },
        ].map((s) => (
          <Card key={s.label}>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold">{s.value}</div>
              <p className="text-xs text-muted-foreground mt-1">{s.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main 2-col grid — mirrors EventsChart + RecentEvents grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Timer */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-semibold">
              {getPhaseLabel(phase)}
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center gap-6 pb-8">
            {/* Ring */}
            <div className="relative w-48 h-48">
              <svg
                width="192"
                height="192"
                viewBox="0 0 180 180"
                className="absolute inset-0 -rotate-90"
              >
                <circle
                  cx="90"
                  cy="90"
                  r="80"
                  fill="none"
                  className="stroke-muted"
                  strokeWidth="6"
                />
                <circle
                  cx="90"
                  cy="90"
                  r="80"
                  fill="none"
                  stroke={getPhaseColor(phase)}
                  strokeWidth="6"
                  strokeLinecap="round"
                  strokeDasharray={CIRCUMFERENCE}
                  strokeDashoffset={ringOffset}
                  style={{ transition: "stroke-dashoffset 1s linear, stroke 0.3s" }}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-1">
                <span className="text-4xl font-bold tabular-nums tracking-tight">
                  {fmt(secondsLeft)}
                </span>
                <span className="text-xs text-muted-foreground uppercase tracking-widest">
                  {getPhaseLabel(phase)}
                </span>
              </div>
            </div>

            {/* Cycle dots */}
            <div className="flex gap-2">
              {Array.from({ length: settings.count }).map((_, i) => (
                <div
                  key={i}
                  className="w-2 h-2 rounded-full transition-colors duration-300"
                  style={{
                    background:
                      i < cyclePos
                        ? "hsl(var(--primary))"
                        : i === cyclePos && phase === "focus"
                        ? "hsl(var(--chart-4, 38 92% 50%))"
                        : "hsl(var(--muted-foreground) / 0.3)",
                  }}
                />
              ))}
            </div>

            {/* Controls */}
            <div className="flex items-center gap-2">
              <Button onClick={toggleTimer} className="gap-2 min-w-28">
                {running ? (
                  <Pause className="h-4 w-4" />
                ) : (
                  <Play className="h-4 w-4" />
                )}
                {running ? "Pause" : "Start"}
              </Button>
              <Button variant="outline" size="icon" onClick={skipPhase} title="Skip phase">
                <SkipForward className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" onClick={resetTimer} title="Reset timer">
                <RotateCcw className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Settings + History stacked in right col */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base font-semibold">Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                {([
                  { label: "Focus (min)", key: "focus", min: 1, max: 90 },
                  { label: "Short break", key: "short", min: 1, max: 30 },
                  { label: "Long break", key: "long", min: 5, max: 60 },
                  { label: "Sessions / cycle", key: "count", min: 2, max: 8 },
                ] as const).map((row) => (
                  <div key={row.key} className="space-y-1.5">
                    <Label className="text-xs text-muted-foreground">{row.label}</Label>
                    <Input
                      type="number"
                      min={row.min}
                      max={row.max}
                      value={settings[row.key] as number}
                      onChange={(e) =>
                        updateSetting(
                          row.key,
                          Math.max(row.min, parseInt(e.target.value) || row.min)
                        )
                      }
                      className="h-8 text-sm"
                    />
                  </div>
                ))}
              </div>

              <Separator />

              <div className="space-y-3">
                {([
                  { label: "Sound alerts", key: "sound" },
                  { label: "Auto-start breaks", key: "autoStart" },
                ] as const).map((row) => (
                  <div key={row.key} className="flex items-center justify-between">
                    <Label htmlFor={`toggle-${row.key}`} className="text-sm cursor-pointer">
                      {row.label}
                    </Label>
                    <Switch
                      id={`toggle-${row.key}`}
                      checked={settings[row.key] as boolean}
                      onCheckedChange={(checked) => updateSetting(row.key, checked)}
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base font-semibold">Session History</CardTitle>
            </CardHeader>
            <CardContent>
              {history.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-6">
                  No sessions yet — hit Start to begin
                </p>
              ) : (
                <ScrollArea className="h-40">
                  <div className="space-y-0.5">
                    {[...history]
                      .reverse()
                      .slice(0, 20)
                      .map((h, i) => (
                        <div
                          key={i}
                          className="flex items-center gap-3 py-1.5 border-b border-border/40 last:border-0"
                        >
                          <div
                            className="w-1.5 h-1.5 rounded-full shrink-0"
                            style={{ background: getPhaseColor(h.phase) }}
                          />
                          <span className="text-sm flex-1">{getPhaseLabel(h.phase)}</span>
                          <span className="text-xs text-muted-foreground tabular-nums">
                            {h.at}
                          </span>
                        </div>
                      ))}
                  </div>
                </ScrollArea>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}