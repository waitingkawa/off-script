'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import {
  ChevronLeft,
  ChevronRight,
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
import { assistLabel, sessions, type PracticeSession } from '@/lib/offscript-data'
import { cn } from '@/lib/utils'

export type Theme = 'warm-sand' | 'cool-gray' | 'muted-blue' | 'terracotta'

export const THEME_CONFIG: Record<
  Theme,
  {
    id: Theme
    label: string
    cnLabel: string
    bgGradient: string
    glowColor: string
    dotDefault: string
    dotHover: string
    dotActive: string
    lineColor: string
    accentText: string
    badgeBg: string
    cardBg: string
    cardBorder: string
    activeRing: string
    halo: string
    themeDot: string
  }
> = {
  terracotta: {
    id: 'terracotta',
    label: 'Terracotta',
    cnLabel: '冷淡红',
    bgGradient: 'from-[#e9e7e2] via-[#ebe9e5] to-[#dfddd8]',
    glowColor: 'rgba(181, 109, 86, 0.25)',
    dotDefault: 'bg-[#c8c5c0] hover:bg-[#b56d56]',
    dotHover: 'bg-[#b56d56]',
    dotActive: 'bg-white shadow-[0_0_24px_rgba(255,255,255,0.9)]',
    lineColor: '#c8c5c0',
    accentText: 'text-[#b56d56]',
    badgeBg: 'bg-[#e9e7e2]/90 text-[#302f2d]',
    cardBg: 'bg-[#f4f3f0]/95',
    cardBorder: 'border-[#dfddd8]',
    activeRing: 'ring-4 ring-white/60',
    halo: 'bg-white/40 ring-1 ring-white/60',
    themeDot: '#b56d56',
  },
  'warm-sand': {
    id: 'warm-sand',
    label: 'Warm Sand',
    cnLabel: '暖沙色',
    bgGradient: 'from-[#f1efe9] via-[#f4f2ee] to-[#ebe8e2]',
    glowColor: 'rgba(215, 208, 195, 0.5)',
    dotDefault: 'bg-[#d0ccc5] hover:bg-[#9a948a]',
    dotHover: 'bg-[#9a948a]',
    dotActive: 'bg-white shadow-[0_0_24px_rgba(255,255,255,0.9)]',
    lineColor: '#d0ccc5',
    accentText: 'text-[#7d776f]',
    badgeBg: 'bg-[#ebe8e2]/90 text-[#3b3834]',
    cardBg: 'bg-[#f8f7f4]/95',
    cardBorder: 'border-[#e4dfd8]',
    activeRing: 'ring-4 ring-white/60',
    halo: 'bg-white/40 ring-1 ring-white/60',
    themeDot: '#d0ccc5',
  },
  'cool-gray': {
    id: 'cool-gray',
    label: 'Cool Gray',
    cnLabel: '冷淡灰',
    bgGradient: 'from-[#e4e5e7] via-[#e9ebed] to-[#dcdde1]',
    glowColor: 'rgba(180, 185, 195, 0.4)',
    dotDefault: 'bg-[#bfc1c7] hover:bg-[#7a7e8b]',
    dotHover: 'bg-[#7a7e8b]',
    dotActive: 'bg-white shadow-[0_0_24px_rgba(255,255,255,0.9)]',
    lineColor: '#bfc1c7',
    accentText: 'text-[#626673]',
    badgeBg: 'bg-[#e4e5e7]/90 text-[#2a2d35]',
    cardBg: 'bg-[#f0f1f3]/95',
    cardBorder: 'border-[#d4d6dc]',
    activeRing: 'ring-4 ring-white/60',
    halo: 'bg-white/40 ring-1 ring-white/60',
    themeDot: '#7a7e8b',
  },
  'muted-blue': {
    id: 'muted-blue',
    label: 'Muted Blue',
    cnLabel: '冷淡蓝',
    bgGradient: 'from-[#e2e7ec] via-[#e8edf2] to-[#d8dfe6]',
    glowColor: 'rgba(165, 184, 206, 0.4)',
    dotDefault: 'bg-[#b8c3d0] hover:bg-[#7d94b0]',
    dotHover: 'bg-[#7d94b0]',
    dotActive: 'bg-white shadow-[0_0_24px_rgba(255,255,255,0.9)]',
    lineColor: '#b8c3d0',
    accentText: 'text-[#67809e]',
    badgeBg: 'bg-[#d8dfe6]/90 text-[#1f2d3d]',
    cardBg: 'bg-[#f1f4f7]/95',
    cardBorder: 'border-[#cfd8e2]',
    activeRing: 'ring-4 ring-white/60',
    halo: 'bg-white/40 ring-1 ring-white/60',
    themeDot: '#7d94b0',
  },
}

/** Cubic Bezier point computation */
function getCubicBezierPoint(
  t: number,
  p0: { x: number; y: number },
  p1: { x: number; y: number },
  p2: { x: number; y: number },
  p3: { x: number; y: number },
) {
  const u = 1 - t
  const tt = t * t
  const uu = u * u
  const uuu = uu * u
  const ttt = tt * t

  const x = uuu * p0.x + 3 * uu * t * p1.x + 3 * u * tt * p2.x + ttt * p3.x
  const y = uuu * p0.y + 3 * uu * t * p1.y + 3 * u * tt * p2.y + ttt * p3.y

  return { x, y }
}

export function HistoryScreen({
  empty = false,
  onOpenNote,
  onStart,
}: {
  empty?: boolean
  onOpenNote: () => void
  onStart: () => void
}) {
  const [theme, setTheme] = useState<Theme>('warm-sand')
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

  const currentTheme = THEME_CONFIG[theme]

  // Define trajectory control points inside 1100x600 space
  const controlPoints = useMemo(
    () => ({
      p0: { x: 70, y: 390 },
      p1: { x: 300, y: 150 },
      p2: { x: 780, y: 180 },
      p3: { x: 1030, y: 550 },
    }),
    [],
  )

  // Precompute trajectory coordinates for each practice session
  const trajectoryPoints = useMemo(() => {
    const total = sessions.length
    return sessions.map((session, index) => {
      const t = total > 1 ? index / (total - 1) : 0.5
      const pt = getCubicBezierPoint(
        t,
        controlPoints.p0,
        controlPoints.p1,
        controlPoints.p2,
        controlPoints.p3,
      )
      return {
        ...pt,
        session,
        index,
        t,
      }
    })
  }, [controlPoints])

  // SVG path definition for the curve
  const curvePathD = useMemo(() => {
    const { p0, p1, p2, p3 } = controlPoints
    return `M ${p0.x} ${p0.y} C ${p1.x} ${p1.y}, ${p2.x} ${p2.y}, ${p3.x} ${p3.y}`
  }, [controlPoints])

  // Auto-play timer for sliding along trajectory
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

      {/* Main Canvas Container with Theme Background */}
      <div
        className={cn(
          'relative mt-5 h-[620px] w-full overflow-hidden rounded-[2.25rem] bg-gradient-to-br transition-colors duration-700 ease-in-out select-none',
          currentTheme.bgGradient,
        )}
      >
        {/* Soft Ambient Radial Blur Glow matching reference image */}
        <div
          className="pointer-events-none absolute size-[500px] rounded-full blur-3xl transition-all duration-700 ease-out"
          style={{
            left: `${activePoint.x - 250 + panOffset.x}px`,
            top: `${activePoint.y - 250 + panOffset.y}px`,
            backgroundColor: currentTheme.glowColor,
          }}
        />

        {/* Top Floating Bar: Minimal Menu & Play Button */}
        <div className="absolute top-6 left-8 right-8 z-20 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <span className="text-[13px] font-medium tracking-wide text-slate-800">Offscript</span>
            <span className="text-[12px] font-medium text-slate-600/80">Practice Trajectory</span>
            <span className="text-[11px] font-mono tracking-wider text-slate-500 uppercase">
              1 Node = 1 Session (3–5 Min)
            </span>
          </div>

          <div className="flex items-center gap-3">
            {/* Auto-Slide / Play Button as in reference image */}
            <button
              type="button"
              onClick={() => setIsPlaying(!isPlaying)}
              className={cn(
                'flex items-center gap-2 rounded-full px-4 py-1.5 text-[12px] font-medium transition-all duration-200 shadow-xs',
                isPlaying
                  ? 'bg-slate-900 text-white'
                  : 'bg-white/80 text-slate-800 hover:bg-white',
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
                  <span>Play</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Interactive Trajectory Canvas (Pan/Zoomable) */}
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
          aria-label="Practice history trajectory. Drag to scroll, mouse wheel to zoom."
        >
          <div
            className="absolute inset-0 transition-transform duration-100 ease-out"
            style={{
              transform: `translate(${panOffset.x}px, ${panOffset.y}px) scale(${zoom})`,
              transformOrigin: '50% 50%',
            }}
          >
            {/* SVG Trajectory Path Curve */}
            <svg className="absolute inset-0 h-full w-full overflow-visible pointer-events-none">
              {/* Continuous subtle curve line */}
              <path
                d={curvePathD}
                fill="none"
                stroke={currentTheme.lineColor}
                strokeWidth={3}
                strokeOpacity={0.25}
                strokeLinecap="round"
              />
              {/* Dotted accents along the curve */}
              <path
                d={curvePathD}
                fill="none"
                stroke={currentTheme.lineColor}
                strokeWidth={2}
                strokeDasharray="2 8"
                strokeOpacity={0.5}
                strokeLinecap="round"
              />
            </svg>

            {/* Trajectory Session Dots */}
            {trajectoryPoints.map((pt) => {
              const isSelected = pt.index === selectedIndex
              const isHovered = pt.index === hoverIndex

              return (
                <div
                  key={pt.session.id}
                  className="absolute -translate-x-1/2 -translate-y-1/2 transition-transform duration-300"
                  style={{ left: `${pt.x}px`, top: `${pt.y}px` }}
                >
                  {/* Halo pulse ring for selected node */}
                  {isSelected && (
                    <div
                      className={cn(
                        'absolute inset-0 -m-3.5 rounded-full animate-ping opacity-30',
                        currentTheme.halo,
                      )}
                    />
                  )}

                  {/* Dot Node Button */}
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
                        ? cn('size-8 z-30', currentTheme.dotActive, currentTheme.activeRing)
                        : isHovered
                          ? cn('size-7 z-20 scale-110', currentTheme.dotHover)
                          : cn('size-5.5 z-10 opacity-80 hover:opacity-100', currentTheme.dotDefault),
                    )}
                  >
                    {/* Active inner dot accent */}
                    {isSelected && (
                      <span className="size-2.5 rounded-full bg-slate-900 shadow-xs" />
                    )}
                  </button>

                  {/* Active Floating Label Callout directly next to node (matching reference image style) */}
                  {isSelected && (
                    <div
                      className={cn(
                        'absolute top-1/2 left-10 -translate-y-1/2 z-40 whitespace-nowrap px-3.5 py-1.5 rounded-full backdrop-blur-md shadow-md flex items-center gap-2 animate-in fade-in slide-in-from-left-2 duration-300',
                        currentTheme.badgeBg,
                      )}
                    >
                      <span className="text-[13px] font-medium tracking-tight">
                        {pt.session.topicAnchor}
                      </span>
                      <span className="text-[10px] font-mono opacity-70 border-l border-current/20 pl-2">
                        {pt.session.duration}
                      </span>
                    </div>
                  )}

                  {/* Hover tooltip for unselected nodes */}
                  {isHovered && !isSelected && (
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-40 whitespace-nowrap rounded-md bg-slate-900/85 px-2.5 py-1 text-[11px] font-medium text-white shadow-md backdrop-blur-xs">
                      {pt.session.date} · {pt.session.duration}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* Bottom Bar Controls: Color Mode Selector (Left) & Zoom Controls (Right) */}
        <div className="absolute bottom-6 left-8 right-8 z-20 flex items-center justify-between pointer-events-none">
          {/* Bottom Left: Color Theme Switcher (冷灰, 冷淡蓝, 冷淡红, 冷淡绿) */}
          <div className="pointer-events-auto flex items-center gap-2 rounded-full bg-white/70 p-1.5 backdrop-blur-md shadow-xs border border-white/50">
            <span className="ml-2.5 mr-1 text-[11px] font-mono uppercase text-slate-500 font-medium">
              Theme:
            </span>
            {(Object.keys(THEME_CONFIG) as Theme[]).map((tKey) => {
              const t = THEME_CONFIG[tKey]
              const active = theme === tKey
              return (
                <button
                  key={tKey}
                  type="button"
                  onClick={() => setTheme(tKey)}
                  className={cn(
                    'flex items-center gap-1.5 rounded-full px-3 py-1 text-[12px] font-medium transition-all duration-200',
                    active
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'text-slate-700 hover:bg-black/5 hover:text-slate-900',
                  )}
                >
                  <span
                    className="size-2 rounded-full border border-black/10"
                    style={{ backgroundColor: t.themeDot }}
                  />
                  <span>{t.cnLabel}</span>
                </button>
              )
            })}
          </div>

          {/* Bottom Center: Interactive Sliding Track Control */}
          <div className="pointer-events-auto hidden md:flex items-center gap-3 rounded-full bg-white/70 px-4 py-2 backdrop-blur-md shadow-xs border border-white/50">
            <button
              type="button"
              onClick={() => {
                setSelectedIndex((i) => Math.max(0, i - 1))
                setIsPlaying(false)
              }}
              disabled={selectedIndex === 0}
              className="text-slate-700 hover:text-slate-950 disabled:opacity-30 transition-colors"
              aria-label="Previous session"
            >
              <ChevronLeft className="size-4" />
            </button>

            {/* Custom Range Slider */}
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
                className="w-36 accent-slate-800 cursor-pointer h-1.5 rounded-lg bg-slate-300"
              />
              <span className="font-mono text-[11px] font-medium text-slate-700 w-10 text-right">
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
              className="text-slate-700 hover:text-slate-950 disabled:opacity-30 transition-colors"
              aria-label="Next session"
            >
              <ChevronRight className="size-4" />
            </button>
          </div>

          {/* Bottom Right: Zoom buttons (+ and -) matching reference image */}
          <div className="pointer-events-auto flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowDetailCard(!showDetailCard)}
              className={cn(
                'grid size-9 place-items-center rounded-full backdrop-blur-md shadow-xs transition-all border border-white/50 text-slate-800',
                showDetailCard ? 'bg-slate-900 text-white' : 'bg-white/80 hover:bg-white',
              )}
              title="Toggle details panel"
            >
              <Info className="size-4" />
            </button>

            <button
              type="button"
              onClick={() => setZoom((z) => Math.min(1.5, z + 0.15))}
              className="grid size-9 place-items-center rounded-full bg-white/80 text-slate-800 backdrop-blur-md shadow-xs transition-all hover:bg-white border border-white/50"
              aria-label="Zoom in"
            >
              <Plus className="size-4" />
            </button>

            <button
              type="button"
              onClick={() => setZoom((z) => Math.max(0.7, z - 0.15))}
              className="grid size-9 place-items-center rounded-full bg-white/80 text-slate-800 backdrop-blur-md shadow-xs transition-all hover:bg-white border border-white/50"
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
              className="grid size-9 place-items-center rounded-full bg-white/80 text-slate-800 backdrop-blur-md shadow-xs transition-all hover:bg-white border border-white/50"
              aria-label="Reset view"
              title="Reset View"
            >
              <RotateCcw className="size-3.5" />
            </button>
          </div>
        </div>

        {/* Selected Session Detail Overlay Card */}
        {showDetailCard && activeSession && (
          <div
            className={cn(
              'absolute top-20 left-8 z-30 w-[320px] rounded-2xl p-5 shadow-xl backdrop-blur-md transition-all duration-300 border animate-in fade-in slide-in-from-bottom-3',
              currentTheme.cardBg,
              currentTheme.cardBorder,
            )}
          >
            <div className="flex items-center justify-between border-b border-black/10 pb-3">
              <div>
                <span className="font-mono text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                  {activeSession.date} · SESSION #{activeSession.id.toUpperCase()}
                </span>
                <h3 className="mt-1 text-[15px] font-semibold text-slate-900 leading-snug">
                  {activeSession.topicAnchor}
                </h3>
              </div>
            </div>

            <div className="mt-3.5 space-y-2.5">
              <div className="flex items-center justify-between text-[12px]">
                <span className="text-slate-500">Duration:</span>
                <span className="font-mono font-medium text-slate-800 bg-black/5 px-2 py-0.5 rounded-md">
                  {activeSession.duration} (3–5 min practice)
                </span>
              </div>

              <div className="flex items-center justify-between text-[12px]">
                <span className="text-slate-500">Attempts:</span>
                <span className="font-mono font-medium text-slate-800">
                  {activeSession.attemptsUsed} attempt{activeSession.attemptsUsed > 1 ? 's' : ''} ·{' '}
                  {assistLabel[activeSession.assistUsed]}
                </span>
              </div>

              <div className="pt-2 border-t border-black/5">
                <span className="text-[11px] font-mono text-slate-500 uppercase tracking-wider">
                  Key Improvement:
                </span>
                <p className={cn('mt-1 text-[13px] font-medium leading-relaxed', currentTheme.accentText)}>
                  “{activeSession.improvement}”
                </p>
              </div>

              {activeSession.keywords && activeSession.keywords.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pt-2">
                  {activeSession.keywords.map((kw) => (
                    <span
                      key={kw}
                      className="rounded-full bg-black/5 px-2.5 py-0.5 text-[10px] font-medium text-slate-600"
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
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-[13px] font-medium text-white transition-all hover:bg-slate-800 active:scale-[0.99]"
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
