'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import {
  Bird,
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

// Practice History Trajectory Screen
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

  // Arch Trajectory Layout Dimensions (in 1100x620 canvas space)
  // Center is placed lower (y=520) so a grand wide arc sweeps across the canvas
  const centerX = 300
  const centerY = 600
  const arcRadius = 500
  const startAngle = -130
  const endAngle = -30 // Right-most base of the expanded arc

  // Calculate position along upward arch with wide node spacing
  const totalSessions = sessions.length
  const trajectoryPoints = useMemo(() => {
    return sessions.map((session, index) => {
      const angleDeg =
        totalSessions > 1
          ? startAngle + (index / (totalSessions - 1)) * (endAngle - startAngle)
          : (startAngle + endAngle) / 2
      const angleRad = (angleDeg * Math.PI) / 180
      const x = centerX + arcRadius * Math.cos(angleRad)
      const y = centerY + arcRadius * Math.sin(angleRad)
      return {
        session,
        index,
        angleDeg,
        x,
        y,
      }
    })
  }, [totalSessions, centerX, centerY, arcRadius, startAngle, endAngle])

  // Auto-play arc rotation timer
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
        {/* Soft Blue Radial Light Flare under the Arch (matching reference image) */}
        <div
          className="pointer-events-none absolute size-[500px] rounded-full bg-sky-400/12 dark:bg-sky-500/10 blur-3xl transition-all duration-700 ease-out"
          style={{
            left: `${centerX - 250 + panOffset.x}px`,
            top: `${centerY - 180 + panOffset.y}px`,
          }}
        />

        {/* Selected Node Accent Glow */}
        <div
          className="pointer-events-none absolute size-[280px] rounded-full bg-terracotta/20 blur-2xl transition-all duration-500 ease-out"
          style={{
            left: `${activePoint.x - 140 + panOffset.x}px`,
            top: `${activePoint.y - 140 + panOffset.y}px`,
          }}
        />

        {/* Top Floating Badge Pill (matching reference image pill header) */}
        <div className="absolute top-6 left-1/2 -translate-x-1/2 z-20 pointer-events-auto">
          <div className="flex items-center gap-2.5 rounded-full bg-surface-raised/90 px-4 py-1.5 text-[12px] font-medium text-foreground border border-hairline backdrop-blur-md shadow-xs">
            <Bird className="size-3.5 text-terracotta" />
            <span>Offscript</span>
            <span className="text-muted-foreground/40">•</span>
            <span className="text-muted-foreground font-normal">Trajectory</span>
          </div>
        </div>

        {/* Top-Right Play / Auto-Rotate Toggle */}
        <div className="absolute top-6 right-8 z-20 pointer-events-auto">
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
                <span>Pause</span>
              </>
            ) : (
              <>
                <Play className="size-3.5 fill-current" />
                <span>Auto Play</span>
              </>
            )}
          </button>
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
          aria-label="Practice history trajectory nodes. Drag to scroll, mouse wheel to zoom."
        >
          <div
            className="absolute inset-0 transition-transform duration-500 ease-out"
            style={{
              transform: `translate(${panOffset.x}px, ${panOffset.y}px) scale(${zoom}) rotate(${-30 - activePoint.angleDeg}deg)`,
              transformOrigin: `${centerX}px ${centerY}px`,
            }}
          >
            {/* Session Nodes matching reference image circular pellets (No connecting lines) */}
            {trajectoryPoints.map((pt) => {
              const isSelected = pt.index === selectedIndex
              const isHovered = pt.index === hoverIndex

              return (
                <div
                  key={pt.session.id}
                  className="absolute -translate-x-1/2 -translate-y-1/2 transition-transform duration-300"
                  style={{ left: `${pt.x}px`, top: `${pt.y}px`, transform: `translate(-50%, -50%) rotate(${30 + activePoint.angleDeg}deg)` }}
                >
                  {/* Circular Node Emblem */}
                  <div className="relative flex items-center">
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
                        'group relative flex items-center justify-center rounded-full transition-all duration-300 cursor-pointer focus:outline-hidden select-none',
                        isSelected
                          ? 'size-5 bg-slate-500 dark:bg-slate-400 shadow-md scale-125 z-30'
                          : isHovered
                            ? 'size-5 bg-slate-400 dark:bg-slate-300 shadow-md scale-125 z-20'
                            : 'size-5 bg-foreground/20 hover:bg-foreground/30 z-10',
                      )}
                    />

                    {/* Active Floating Side Label (like "Patagonian Desert" in reference image) */}
                    {isSelected && (
                      <div className="absolute top-1/2 left-full ml-3.5 -translate-y-1/2 z-40 whitespace-nowrap px-3.5 py-1.5 rounded-full bg-surface-raised/95 text-foreground border border-hairline backdrop-blur-md shadow-lg flex items-center gap-2.5 animate-in fade-in slide-in-from-left-2 duration-300">
                        <span className="text-[12px] font-semibold text-foreground">
                          {pt.session.topicAnchor}
                        </span>
                        <span className="text-[10px] font-mono text-muted-foreground border-l border-hairline pl-2">
                          {pt.session.duration}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Tooltip for Hovered Unselected Nodes */}
                  {isHovered && !isSelected && (
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-40 whitespace-nowrap rounded-md bg-surface-raised text-foreground border border-hairline px-2.5 py-1 text-[11px] font-medium shadow-md backdrop-blur-xs">
                      #{pt.index + 1} · {pt.session.date} · {pt.session.topicAnchor}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>



        {/* Bottom Navigation Control Bar with Slider */}
        <div className="absolute bottom-4 left-8 right-8 z-20 flex items-center justify-between pointer-events-none">
          {/* Clock/Trajectory Slider Control */}
          <div className="pointer-events-auto flex items-center gap-3.5 rounded-full bg-surface-raised/90 px-5 py-2 backdrop-blur-md shadow-md border border-hairline">
            <Clock className="size-4 text-terracotta shrink-0" />
            <span className="hidden sm:inline-block font-mono text-[11px] font-medium text-muted-foreground whitespace-nowrap">
              Trajectory Node
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

            {/* Slider to smoothly navigate nodes */}
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
                className="w-32 sm:w-44 accent-terracotta cursor-pointer h-1.5 rounded-lg bg-hairline"
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

          {/* Zoom and Details Toggle Controls */}
          <div className="pointer-events-auto flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowDetailCard(!showDetailCard)}
              className={cn(
                'grid size-8.5 place-items-center rounded-full backdrop-blur-md shadow-xs transition-all border border-hairline cursor-pointer',
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
              className="grid size-8.5 place-items-center rounded-full bg-surface-raised text-foreground backdrop-blur-md shadow-xs transition-all hover:bg-surface-raised/80 border border-hairline cursor-pointer"
              aria-label="Zoom in"
            >
              <Plus className="size-4" />
            </button>

            <button
              type="button"
              onClick={() => setZoom((z) => Math.max(0.7, z - 0.15))}
              className="grid size-8.5 place-items-center rounded-full bg-surface-raised text-foreground backdrop-blur-md shadow-xs transition-all hover:bg-surface-raised/80 border border-hairline cursor-pointer"
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
              className="grid size-8.5 place-items-center rounded-full bg-surface-raised text-foreground backdrop-blur-md shadow-xs transition-all hover:bg-surface-raised/80 border border-hairline cursor-pointer"
              aria-label="Reset view"
              title="Reset View"
            >
              <RotateCcw className="size-3.5" />
            </button>
          </div>
        </div>

        {/* Selected Session Detail Card Overlay */}
        {showDetailCard && activeSession && (
          <div className="absolute top-16 right-8 z-30 w-[310px] rounded-2xl p-4.5 shadow-xl bg-surface-raised/95 text-foreground border border-hairline backdrop-blur-md transition-all duration-300 animate-in fade-in slide-in-from-bottom-3">
            <div className="flex items-center justify-between border-b border-hairline pb-2.5">
              <div>
                <span className="font-mono text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                  {activeSession.date} · SESSION #{activeSession.id.toUpperCase()}
                </span>
                <h3 className="mt-0.5 text-[14px] font-semibold leading-snug">
                  {activeSession.topicAnchor}
                </h3>
              </div>
            </div>

            <div className="mt-3 space-y-2">
              <div className="flex items-center justify-between text-[12px]">
                <span className="text-muted-foreground">Duration:</span>
                <span className="font-mono font-medium bg-surface-sunken px-2 py-0.5 rounded-md border border-hairline">
                  {activeSession.duration}
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
                <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider">
                  Key Focus:
                </span>
                <p className="mt-0.5 text-[12.5px] font-medium leading-relaxed text-terracotta">
                  “{activeSession.improvement}”
                </p>
              </div>

              {activeSession.keywords && activeSession.keywords.length > 0 && (
                <div className="flex flex-wrap gap-1 pt-1.5">
                  {activeSession.keywords.map((kw) => (
                    <span
                      key={kw}
                      className="rounded-full bg-surface-sunken px-2 py-0.5 text-[9.5px] font-medium text-muted-foreground border border-hairline"
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
              className="mt-3.5 flex w-full items-center justify-center gap-2 rounded-xl bg-terracotta px-4 py-2 text-[12.5px] font-medium text-white transition-all hover:bg-terracotta/90 active:scale-[0.99] cursor-pointer shadow-xs"
            >
              <FileText className="size-3.5" />
              <span>Open Learning Note</span>
            </button>
          </div>
        )}
      </div>
    </Screen>
  )
}
