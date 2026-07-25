'use client'

import type * as React from 'react'
import { cn } from '@/lib/utils'

/* ------------------------------------------------------------------ Pebble */

export function Pebble({
  className,
  tone = 'surface',
  children,
  ...props
}: React.ComponentProps<'div'> & { tone?: 'surface' | 'raised' | 'sunken' }) {
  return (
    <div
      className={cn(
        'rounded-pebble',
        tone === 'surface' && 'bg-surface text-surface-foreground',
        tone === 'raised' && 'bg-surface-raised text-foreground',
        tone === 'sunken' && 'bg-surface-sunken text-foreground',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  )
}

/* ------------------------------------------------------------- Meta labels */

export function Meta({ className, children, ...props }: React.ComponentProps<'p'>) {
  return (
    <p className={cn('meta text-muted-foreground', className)} {...props}>
      {children}
    </p>
  )
}

/* -------------------------------------------------------------- PillButton */

type PillProps = React.ComponentProps<'button'> & {
  variant?: 'solid' | 'quiet' | 'accent' | 'bare'
  size?: 'sm' | 'md'
  trailing?: React.ReactNode
}

export function PillButton({
  className,
  variant = 'solid',
  size = 'md',
  trailing,
  children,
  ...props
}: PillProps) {
  return (
    <button
      type="button"
      className={cn(
        'group inline-flex items-center justify-center gap-3 rounded-full font-medium transition-colors duration-200',
        'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terracotta',
        'disabled:pointer-events-none disabled:opacity-45',
        size === 'md' ? 'h-12 px-6 text-[15px]' : 'h-9 px-4 text-[13px]',
        variant === 'solid' &&
          'bg-primary text-primary-foreground hover:bg-foreground active:bg-foreground/90',
        variant === 'quiet' &&
          'bg-secondary text-foreground hover:bg-surface-sunken active:bg-hairline',
        variant === 'accent' &&
          'bg-terracotta text-terracotta-foreground hover:brightness-[1.07] active:brightness-95',
        variant === 'bare' &&
          'px-0 text-muted-foreground underline decoration-hairline decoration-1 underline-offset-4 hover:text-foreground hover:decoration-foreground',
        className,
      )}
      {...props}
    >
      <span className="truncate">{children}</span>
      {trailing ? (
        <span
          className={cn(
            'grid shrink-0 place-items-center rounded-full',
            size === 'md' ? 'size-8' : 'size-6',
            variant === 'solid' && 'bg-primary-foreground/15',
            variant === 'quiet' && 'bg-foreground/8',
            variant === 'accent' && 'bg-terracotta-foreground/20',
          )}
        >
          {trailing}
        </span>
      ) : null}
    </button>
  )
}

/* --------------------------------------------------------------- Chip */

export function Chip({
  className,
  active,
  children,
  ...props
}: React.ComponentProps<'span'> & { active?: boolean }) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-3.5 py-1.5 text-[13px] leading-none',
        active
          ? 'bg-terracotta/12 text-terracotta'
          : 'bg-foreground/6 text-muted-foreground',
        className,
      )}
      {...props}
    >
      {children}
    </span>
  )
}

/* ------------------------------------------------------------ Dot progress */

export function DotProgress({
  total,
  current,
  className,
}: {
  total: number
  current: number
  className?: string
}) {
  return (
    <div className={cn('flex items-center gap-2', className)} aria-hidden="true">
      {Array.from({ length: total }).map((_, i) => (
        <span
          key={i}
          className={cn(
            'size-1.5 rounded-full transition-colors',
            i < current ? 'bg-terracotta' : 'bg-foreground/18',
          )}
        />
      ))}
    </div>
  )
}

/* ------------------------------------------------------------- ScreenTitle */

export function ScreenHeader({
  label,
  right,
  className,
}: {
  label: string
  right?: React.ReactNode
  className?: string
}) {
  return (
    <div className={cn('flex items-baseline justify-between', className)}>
      <Meta>{label}</Meta>
      {right}
    </div>
  )
}

/* ------------------------------------------------------------------ Hairline */

export function Hairline({ className }: { className?: string }) {
  return <div className={cn('h-px w-full bg-hairline/70', className)} />
}
