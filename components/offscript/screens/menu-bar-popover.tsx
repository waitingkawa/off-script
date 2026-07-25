'use client'

import { Plus } from 'lucide-react'
import { Meta, Pebble, PillButton } from '../primitives'
import { sessions } from '@/lib/offscript-data'

export function MenuBarPopover({ onStart }: { onStart: () => void }) {
  const latest = sessions[sessions.length - 1]

  return (
    <div className="w-[1180px] shrink-0">
      {/* mock macOS menu bar */}
      <div className="flex h-7 items-center gap-6 rounded-t-[18px] bg-surface-raised/80 px-5 backdrop-blur">
        <span className="meta text-foreground">Offscript</span>
        <span className="meta text-muted-foreground/70">File</span>
        <span className="meta text-muted-foreground/70">Practice</span>
        <span className="meta text-muted-foreground/70">Window</span>
        <div className="ml-auto flex items-center gap-5">
          <span className="relative grid size-4 place-items-center">
            <span className="size-2 rounded-full bg-terracotta" />
          </span>
          <span className="meta text-muted-foreground">Tue 09:14</span>
        </div>
      </div>

      <div className="flex justify-end pr-16">
        {/* popover pointer */}
        <div className="w-[360px]">
          <div className="ml-auto mr-14 size-3 -translate-y-1.5 rotate-45 rounded-[3px] bg-surface" />
          <Pebble className="rise -mt-2 p-7 shadow-[0_24px_60px_-32px_oklch(0.29_0.008_65/0.45)]">
            <div className="flex items-baseline justify-between">
              <Meta className="text-foreground">Offscript</Meta>
              <Meta>{latest.date}</Meta>
            </div>

            <p className="mt-7 text-[26px] leading-tight font-light tracking-[-0.01em] text-balance">
              Say one clear thing.
            </p>

            <div className="mt-7 rounded-xl bg-surface-sunken/60 p-4">
              <Meta className="text-[10px]">Latest topic</Meta>
              <p className="mt-2 text-[14px] leading-relaxed text-foreground/90">
                {latest.topicAnchor}
              </p>
            </div>

            <PillButton
              className="mt-6 w-full justify-between"
              onClick={onStart}
              trailing={<Plus className="size-4" aria-hidden="true" />}
            >
              Start a 5-minute practice
            </PillButton>

            <Meta className="mt-5 text-[10px]">
              7 sessions · last {latest.duration}
            </Meta>
          </Pebble>
        </div>
      </div>
    </div>
  )
}
