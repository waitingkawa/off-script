'use client'

import type * as React from 'react'
import { cn } from '@/lib/utils'
import { Meta } from './primitives'

/**
 * Mock macOS window chrome. 1180 x 780 primary window,
 * with safe spacing below the title bar.
 */
export function AppWindow({
  title = 'Offscript',
  status,
  children,
}: {
  title?: string
  status?: React.ReactNode
  children: React.ReactNode
}) {
  return (
    <div className="w-[1180px] shrink-0 overflow-hidden rounded-[26px] bg-background shadow-[0_1px_0_oklch(1_0_0/0.5)_inset,0_28px_70px_-30px_oklch(0.29_0.008_65/0.35)] ring-1 ring-hairline/60">
      <div className="flex h-11 items-center gap-4 px-5">
        <div className="flex items-center gap-2" aria-hidden="true">
          <span className="size-3 rounded-full bg-hairline" />
          <span className="size-3 rounded-full bg-hairline" />
          <span className="size-3 rounded-full bg-hairline" />
        </div>
        <p className="meta text-muted-foreground">{title}</p>
        <div className="ml-auto">{status}</div>
      </div>
      <div className="h-[736px] overflow-hidden">{children}</div>
    </div>
  )
}

export function WindowStatus({ children }: { children: React.ReactNode }) {
  return <Meta className="tabular-nums">{children}</Meta>
}

/** Consistent screen padding + vertical rhythm for every screen. */
export function Screen({
  className,
  children,
}: {
  className?: string
  children: React.ReactNode
}) {
  return (
    <div className={cn('h-full px-12 pt-6 pb-12', className)}>{children}</div>
  )
}
