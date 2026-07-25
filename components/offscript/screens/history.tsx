'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import {
  ChevronLeft,
  ChevronRight,
  Clock,
  FileText,
  Info,
  Minus,
  Pause,
  Play,
  Plus,
  RotateCcw,
  Sparkle,
} from 'lucide-react'
import { Screen } from '../app-window'
import { Meta, Pebble, PillButton, ScreenHeader } from '../primitives'
import { assistLabel, sessions } from '@/lib/offscript-data'
import { cn } from '@/lib/utils'

export function HistoryScreen({
  empty = false,
  onOpenNote,
  onStart,
}: {
  empty?: boolean
  onOpenNote: () => void
  onStart: () => void
}) {
  const [selectedIndex, setSelectedIndex] = useState<number>(sessions.length - 1)
  const [hoverIndex, setHoverIndex] = useState<number | null>(null)
  const [zoom, setZoom] = useState<number>(1.0)
  const [isPlaying, setIsPlaying] = useState<boolean>(false)
  const [showDetailCard, setShowDetailCard] = useState<boolean>(true)
  const [panOffset, setPanOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 })

  const isDraggingRef = useRef<boolean>(false)
  const dragStartRef = useRef<{ x: number; y: number; px: number; py: number }>({
    x: 0,
    y: 0,
    px: 0,
    py: 0,
  })

  // Clock Layout Dimensions (in 1100x600 space)
  const centerX = 550
  const centerY = 280
  const clockRadius = 195

  // Compute position & angle for each session along the Clock Arc (300deg sweep starting from 12 o'clock -90deg)
  const totalSessions = sessions.length
  const trajectoryPoints = useMemo(() => {
    return sessions.map((session, index) => {
      const startAngle = -90 // 12 o'clock position
      const endAngle = 210 // 10 o'clock position (300 deg sweep clockwise)
      const angleDeg =
        totalSessions > 1
          ? startAngle + (index / (totalSessions - 1)) * (endAngle - startAngle)
          : startAngle
      const angleRad = (angleDeg * Math.PI) / 180
      const x = centerX + clockRadius * Math.cos(angleRad)
      const y = centerY + clockRadius * Math.sin(angleRad)
      return {
        session,
        index,
        angleDeg,
        x,
        y,
      }
    })
  }, [totalSessions, centerX, centerY, clockRadius])

  // Clock tick marks generation (60 fine ticks around clock ring)
  const clockTicks = useMemo(() => {
    const ticks = []
    for (let i = 0; i < 60; i++) {
      const angleDeg = -90 + (i / 60) * 360
      const angleRad = (angleDeg * Math.PI) / 180
      const isMajor = i % 5 === 0
      const innerR = clockRadius - (isMajor ? 14 : 7)
      const outerR = clockRadius - 3
      const x1 = centerX + innerR * Math.cos(angleRad)
      const y1 = centerY + innerR * Math.sin(angleRad)
      const x2 = centerX + outerR * Math.cos(angleRad)
      const y2 = centerY + outerR * Math.sin(angleRad)
      ticks.push({ index: i, x1, y1, x2, y2, isMajor, angleDeg })
    }
    return ticks
  }, [centerX, centerY, clockRadius])

  // Auto-play clock rotation timer
  useEffect(() => {
    if (!isPlaying) return
    const timer = setInterval(() => {
      setSelectedIndex((prev) => (prev + 1) % sessions.length)
    }, 1800)
    return () => clearInterval(timer)
  }, [isPlaying])

  const activeSession = sessions[selectedIndex] || sessions[0]
  const activePoint = trajectoryPoints[selectedIndex] || trajectoryPoints[0]

  // Pointer event handlers for panning canvas
  const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      isDraggingRef.current = true
      dragStartRef.current = {
        x: e.clientX,
        y: e.clientY,
        px: panOffset.x,
        py: panOffset.y,
      }
      ;(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId)
    },
    [panOffset],
  )

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (!isDraggingRef.current) return
    const dx = e.clientX - dragStartRef.current.x
    const dy = e.clientY - dragStartRef.current.y
    setPanOffset({
      x: dragStartRef.current.px + dx,
      y: dragStartRef.current.py + dy,
    })
  }, [])

  const handlePointerUp = useCallback(() => {
    isDraggingRef.current = false
  }, [])

  if (empty) {
    return (
      <Screen>
        <ScreenHeader label="Practice history" right={<Meta>0 sessions</Meta>} />
        <Pebble className="mt-10 flex h-[620px] flex-col items-center justify-center px-20 text-center">
          <div className="grid size-16 place-items-center rounded-full border border-dashed border-hairline">
            <Sparkle className="size-5 text-muted-foreground" aria-hidden="true" />
          </div>
          <p className="mt-8 max-w-[28ch] text-[24px] font-light text-balance leading-snug">
            Your trail starts with one 3–5 minute practice.
          </p>
          <Meta className="mt-4 text-[10px]">
            Each completed practice session becomes a single node on your journey trajectory
          </Meta>
          <PillButton
            className="mt-10"
            onClick={onStart}
            trailing={<Plus className="size-4" aria-hidden="true" />}
          >
            Start a 3–5 minute practice
          </PillButton>
        </Pebble>
      </Screen>
    )
  }

  return (
    <Screen className="flex flex-col">
      {/* Top Header Bar */}
      <ScreenHeader
        label="Practice history"
        right={
          <div className="flex items-center gap-4">
            <Meta>
              {sessions.length} sessions · {sessions[0].date}—{sessions[sessions.length - 1].date}
            </Meta>
          </div>
        }
      />

      {/* Main Canvas Container */}
      <div className="relative mt-5 h-[620px] w-full overflow-hidden rounded-[2.25rem] bg-surface-sunken border border-hairline transition-colors duration-300 ease-in-out select-none">
        {/* Ambient Radial Blur Glow around selected clock position */}
        <div
          className="pointer-events-none absolute size-[450px] rounded-full bg-terracotta/15 blur-3xl transition-all duration-700 ease-out"
          style={{
            left: `${activePoint.x - 225 + panOffset.x}px`,
            top: `${activePoint.y - 225 + panOffset.y}px`,
          }}
        />

        {/* Top Floating Bar: Minimal Title & Play Button */}
        <div className="absolute top-6 left-8 right-8 z-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="text-[13px] font-medium tracking-wide text-foreground">Offscript</span>
            <span className="text-[12px] font-medium text-muted-foreground">Practice Chronometer</span>
            <span className="hidden sm:inline-block font-mono text-[10px] tracking-wider text-muted-foreground/70 uppercase">
              1 Clock Node = 1 Session
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setIsPlaying(!isPlaying)}
              className={cn(
                'flex items-center gap-2 rounded-full px-4 py-1.5 text-[12px] font-medium transition-all duration-200 border cursor-pointer',
                isPlaying
                  ? 'bg-terracotta text-white border-terracotta shadow-xs'
                  : 'bg-surface-raised text-foreground hover:bg-surface-raised/80 border-hairline',
              )}
            >
              {isPlaying ? (
                <>
                  <Pause className="size-3.5 fill-current" />
                  <span>Pause Rotation</span>
                </>
              ) : (
                <>
                  <Play className="size-3.5 fill-current" />
                  <span>Auto Rotate</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Interactive Canvas */}
        <div
          className="absolute inset-0 cursor-grab touch-none active:cursor-grabbing"
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          onWheel={(e) => {
            e.preventDefault()
            setZoom((z) => Math.min(1.5, Math.max(0.7, z - e.deltaY * 0.001)))
          }}
          role="application"
          aria-label="Practice history clock chronometer. Drag to scroll, mouse wheel to zoom."
        >
          <div
            className="absolute inset-0 transition-transform duration-100 ease-out"
            style={{
              transform: `translate(${panOffset.x}px, ${panOffset.y}px) scale(${zoom})`,
              transformOrigin: '50% 50%',
            }}
          >
            {/* SVG Clock Face, Orbit Arc & Rotating Clock Pointer */}
            <svg className="absolute inset-0 h-full w-full overflow-visible pointer-events-none">
              {/* Outer Clock Dial Circle */}
              <circle
                cx={centerX}
                cy={centerY}
                r={clockRadius}
                fill="none"
                className="stroke-foreground/15"
                strokeWidth={1.5}
              />

              {/* Inner Accent Ring */}
              <circle
                cx={centerX}
                cy={centerY}
                r={clockRadius - 20}
                fill="none"
                className="stroke-foreground/10"
                strokeWidth={1}
                strokeDasharray="3 6"
              />

              {/* Clock Tick Marks */}
              {clockTicks.map((tick) => (
                <line
                  key={tick.index}
                  x1={tick.x1}
                  y1={tick.y1}
                  x2={tick.x2}
                  y2={tick.y2}
                  className={tick.isMajor ? 'stroke-foreground/40' : 'stroke-foreground/15'}
                  strokeWidth={tick.isMajor ? 1.5 : 1}
                  strokeLinecap="round"
                />
              ))}

              {/* Clock Center Hub */}
              <circle
                cx={centerX}
                cy={centerY}
                r={16}
                className="fill-surface-raised stroke-hairline"
                strokeWidth={1.5}
              />

              {/* Rotating Clock Needle / Hand Arm */}
              <g
                style={{
                  transformOrigin: `${centerX}px ${centerY}px`,
                  transform: `rotate(${activePoint.angleDeg + 90}deg)`,
                  transition: 'transform 0.45s cubic-bezier(0.16, 1, 0.3, 1)',
                }}
              >
                {/* Pointer stem */}
                <line
                  x1={centerX}
                  y1={centerY}
                  x2={centerX}
                  y2={centerY - clockRadius + 10}
                  className="stroke-terracotta"
                  strokeWidth={2.5}
                  strokeLinecap="round"
                />
                {/* Arrowhead Indicator */}
                <polygon
                  points={`${centerX - 5},${centerY - clockRadius + 20} ${centerX + 5},${centerY - clockRadius + 20} ${centerX},${centerY - clockRadius + 4}`}
                  className="fill-terracotta"
                />
              </g>

              {/* Inner Center Dot */}
              <circle cx={centerX} cy={centerY} r={5} className="fill-terracotta" />
            </svg>

            {/* Session Nodes along the Clock Arc */}
            {trajectoryPoints.map((pt) => {
              const isSelected = pt.index === selectedIndex
              const isHovered = pt.index === hoverIndex

              return (
                <div
                  key={pt.session.id}
                  className="absolute -translate-x-1/2 -translate-y-1/2 transition-transform duration-300"
                  style={{ left: `${pt.x}px`, top: `${pt.y}px` }}
                >
                  {/* Halo pulse ring for selected active node */}
                  {isSelected && (
                    <div className="absolute inset-0 -m-3 rounded-full animate-ping opacity-35 bg-terracotta" />
                  )}

                  {/* Node Button with Monochromatic Base & Single Accent Highlight on Hover/Active */}
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedIndex(pt.index)
                      setIsPlaying(false)
                    }}
                    onMouseEnter={() => setHoverIndex(pt.index)}
                    onMouseLeave={() => setHoverIndex(null)}
                    aria-label={`Session on ${pt.session.date}: ${pt.session.topicAnchor}`}
                    className={cn(
                      'relative grid place-items-center rounded-full transition-all duration-300 cursor-pointer focus:outline-hidden',
                      isSelected
                        ? 'size-7.5 bg-terracotta text-white border-2 border-surface-raised shadow-md shadow-terracotta/30 scale-125 z-30 ring-4 ring-terracotta/25'
                        : isHovered
                          ? 'size-7 bg-terracotta text-white border-2 border-surface-raised shadow-xs scale-125 z-20'
                          : 'size-5 bg-foreground/20 hover:bg-terracotta border border-foreground/30 z-10',
                    )}
                  >
                    {/* Active inner indicator dot */}
                    {isSelected && <span className="size-2 rounded-full bg-white shadow-xs" />}
                  </button>

                  {/* Active Floating Label Callout */}
                  {isSelected && (
                    <div className="absolute top-1/2 left-9 -translate-y-1/2 z-40 whitespace-nowrap px-3.5 py-1.5 rounded-full bg-surface-raised/95 text-foreground border border-hairline backdrop-blur-md shadow-lg flex items-center gap-2 animate-in fade-in slide-in-from-left-2 duration-300">
                      <span className="text-[12px] font-medium tracking-tight">
                        {pt.session.topicAnchor}
                      </span>
                      <span className="text-[10px] font-mono text-muted-foreground border-l border-hairline pl-2">
                        {pt.session.duration}
                      </span>
                    </div>
                  )}

                  {/* Hover Tooltip for unselected nodes */}
                  {isHovered && !isSelected && (
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-40 whitespace-nowrap rounded-md bg-surface-raised text-foreground border border-hairline px-2.5 py-1 text-[11px] font-medium shadow-md backdrop-blur-xs">
                      {pt.session.date} · {pt.session.duration}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* Bottom Control Bar with Clock Rotation Slider */}
        <div className="absolute bottom-6 left-8 right-8 z-20 flex items-center justify-between pointer-events-none">
          {/* Clock Rotation Slider Control */}
          <div className="pointer-events-auto flex items-center gap-3.5 rounded-full bg-surface-raised/90 px-5 py-2.5 backdrop-blur-md shadow-md border border-hairline">
            <Clock className="size-4 text-terracotta shrink-0" />
            <span className="hidden sm:inline-block font-mono text-[11px] font-medium text-muted-foreground whitespace-nowrap">
              Clock Angle: {Math.round(activePoint.angleDeg + 90)}°
            </span>

            <button
              type="button"
              onClick={() => {
                setSelectedIndex((i) => Math.max(0, i - 1))
                setIsPlaying(false)
              }}
              disabled={selectedIndex === 0}
              className="text-foreground/70 hover:text-foreground disabled:opacity-30 transition-colors p-0.5 cursor-pointer"
              aria-label="Previous session"
            >
              <ChevronLeft className="size-4" />
            </button>

            {/* Slider to smoothly rotate clock pointer */}
            <div className="flex items-center gap-2">
              <input
                type="range"
                min={0}
                max={sessions.length - 1}
                value={selectedIndex}
                onChange={(e) => {
                  setSelectedIndex(Number(e.target.value))
                  setIsPlaying(false)
                }}
                className="w-36 sm:w-48 accent-terracotta cursor-pointer h-1.5 rounded-lg bg-hairline"
              />
              <span className="font-mono text-[11px] font-medium text-foreground w-10 text-right">
                {selectedIndex + 1}/{sessions.length}
              </span>
            </div>

            <button
              type="button"
              onClick={() => {
                setSelectedIndex((i) => Math.min(sessions.length - 1, i + 1))
                setIsPlaying(false)
              }}
              disabled={selectedIndex === sessions.length - 1}
              className="text-foreground/70 hover:text-foreground disabled:opacity-30 transition-colors p-0.5 cursor-pointer"
              aria-label="Next session"
            >
              <ChevronRight className="size-4" />
            </button>
          </div>

          {/* Zoom and Canvas Controls */}
          <div className="pointer-events-auto flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowDetailCard(!showDetailCard)}
              className={cn(
                'grid size-9 place-items-center rounded-full backdrop-blur-md shadow-xs transition-all border border-hairline cursor-pointer',
                showDetailCard
                  ? 'bg-terracotta text-white border-terracotta'
                  : 'bg-surface-raised text-foreground hover:bg-surface-raised/80',
              )}
              title="Toggle details panel"
            >
              <Info className="size-4" />
            </button>

            <button
              type="button"
              onClick={() => setZoom((z) => Math.min(1.5, z + 0.15))}
              className="grid size-9 place-items-center rounded-full bg-surface-raised text-foreground backdrop-blur-md shadow-xs transition-all hover:bg-surface-raised/80 border border-hairline cursor-pointer"
              aria-label="Zoom in"
            >
              <Plus className="size-4" />
            </button>

            <button
              type="button"
              onClick={() => setZoom((z) => Math.max(0.7, z - 0.15))}
              className="grid size-9 place-items-center rounded-full bg-surface-raised text-foreground backdrop-blur-md shadow-xs transition-all hover:bg-surface-raised/80 border border-hairline cursor-pointer"
              aria-label="Zoom out"
            >
              <Minus className="size-4" />
            </button>

            <button
              type="button"
              onClick={() => {
                setZoom(1.0)
                setPanOffset({ x: 0, y: 0 })
              }}
              className="grid size-9 place-items-center rounded-full bg-surface-raised text-foreground backdrop-blur-md shadow-xs transition-all hover:bg-surface-raised/80 border border-hairline cursor-pointer"
              aria-label="Reset view"
              title="Reset View"
            >
              <RotateCcw className="size-3.5" />
            </button>
          </div>
        </div>

        {/* Selected Session Detail Overlay Card */}
        {showDetailCard && activeSession && (
          <div className="absolute top-20 left-8 z-30 w-[320px] rounded-2xl p-5 shadow-xl bg-surface-raised/95 text-foreground border border-hairline backdrop-blur-md transition-all duration-300 animate-in fade-in slide-in-from-bottom-3">
            <div className="flex items-center justify-between border-b border-hairline pb-3">
              <div>
                <span className="font-mono text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                  {activeSession.date} · SESSION #{activeSession.id.toUpperCase()}
                </span>
                <h3 className="mt-1 text-[15px] font-semibold leading-snug">
                  {activeSession.topicAnchor}
                </h3>
              </div>
            </div>

            <div className="mt-3.5 space-y-2.5">
              <div className="flex items-center justify-between text-[12px]">
                <span className="text-muted-foreground">Duration:</span>
                <span className="font-mono font-medium bg-surface-sunken px-2 py-0.5 rounded-md border border-hairline">
                  {activeSession.duration} (3–5 min practice)
                </span>
              </div>

              <div className="flex items-center justify-between text-[12px]">
                <span className="text-muted-foreground">Attempts:</span>
                <span className="font-mono font-medium">
                  {activeSession.attemptsUsed} attempt{activeSession.attemptsUsed > 1 ? 's' : ''} ·{' '}
                  {assistLabel[activeSession.assistUsed]}
                </span>
              </div>

              <div className="pt-2 border-t border-hairline">
                <span className="text-[11px] font-mono text-muted-foreground uppercase tracking-wider">
                  Key Improvement:
                </span>
                <p className="mt-1 text-[13px] font-medium leading-relaxed text-terracotta">
                  “{activeSession.improvement}”
                </p>
              </div>

              {activeSession.keywords && activeSession.keywords.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pt-2">
                  {activeSession.keywords.map((kw) => (
                    <span
                      key={kw}
                      className="rounded-full bg-surface-sunken px-2.5 py-0.5 text-[10px] font-medium text-muted-foreground border border-hairline"
                    >
                      #{kw}
                    </span>
                  ))}
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={onOpenNote}
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-terracotta px-4 py-2.5 text-[13px] font-medium text-white transition-all hover:bg-terracotta/90 active:scale-[0.99] cursor-pointer shadow-sm"
            >
              <FileText className="size-4" />
              <span>Open Learning Note</span>
            </button>
          </div>
        )}
      </div>
    </Screen>
  )
}
