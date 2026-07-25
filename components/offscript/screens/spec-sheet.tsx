'use client'

import { AlertCircle } from 'lucide-react'
import { Screen } from '../app-window'
import { Chip, Hairline, Meta, Pebble, PillButton, ScreenHeader } from '../primitives'

const COLOR_TOKENS = [
  ['--background', 'oklch(0.945 0.005 75)', 'Warm gray canvas'],
  ['--surface', 'oklch(0.898 0.005 75)', 'Pebble card'],
  ['--surface-raised', 'oklch(0.968 0.004 80)', 'Inset panels, inputs'],
  ['--surface-sunken', 'oklch(0.858 0.006 75)', 'Secondary pebble, nodes'],
  ['--foreground', 'oklch(0.29 0.008 65)', 'Body text'],
  ['--muted-foreground', 'oklch(0.505 0.009 65)', 'Metadata'],
  ['--hairline', 'oklch(0.82 0.006 75)', 'Dividers, trail line'],
  ['--terracotta', 'oklch(0.575 0.086 42)', 'Recording, active attempt, selected node, key expressions'],
]

const TYPE_TOKENS = [
  ['Display', 'IBM Plex Sans · 300 · 38/1.12 · -0.02em', 'Topic anchor question'],
  ['Title', 'IBM Plex Sans · 300 · 29/1.18', 'Coaching point, core theme'],
  ['Body', 'IBM Plex Sans · 400 · 15/1.6', 'Explanations, transcripts'],
  ['Body S', 'IBM Plex Sans · 400 · 13/1.6', 'Supporting copy'],
  ['Meta', 'IBM Plex Mono · 400 · 11 · 0.14em · uppercase', 'Dates, attempts, model info'],
  ['Timer', 'IBM Plex Mono · 400 · 44 · tabular', 'Recording elapsed time'],
]

const SPACE_TOKENS = [
  ['Screen padding', '48px x · 24px top · 48px bottom'],
  ['Pebble padding', '28px small · 40px primary'],
  ['Grid gap', '32px columns · 24–32px stacks'],
  ['Radius', 'pebble 36px · pebble-lg 48px · inset 20px · pill full'],
  ['Window', '1180 × 780 · content 1180 × 736'],
]

const COMPONENTS = [
  ['Pebble', 'surface / raised / sunken', 'Every content container'],
  ['PillButton', 'solid / quiet / accent / bare · sm, md · optional trailing badge', 'All actions'],
  ['Chip', 'default / active', 'Keywords, expressions'],
  ['DotProgress', 'total + current', 'Attempts remaining'],
  ['ScreenHeader', 'label + right meta', 'Top of every screen'],
  ['Meta / Hairline', '—', 'Mono metadata, dividers'],
  ['AssistStep', 'hidden / revealed', 'Progressive help'],
  ['TrailNode', 'default / hover / selected', 'History map'],
  ['AppWindow', 'title + status', 'macOS chrome'],
]

const INTERACTIONS = [
  ['Start a 5-minute practice', 'Popover → Topic anchor. Prefills last anchor for reuse.'],
  ['Start practice', 'Disabled while the anchor is empty. → Ready to record.'],
  ['Record (⌥R)', 'Terracotta fill, scales to 1.03 on hover. → Recording, hides all text.'],
  ['Hide / show keywords', 'Toggles the 2–4 chips only. Never reveals a script.'],
  ['Stop and review', '→ Processing (quiet sweep, no sparkles) → Feedback.'],
  ['Full transcript', 'Collapsed by default. Chevron rotates 180°, panel scrolls at 176px.'],
  ['Give me a hint', 'Reveals step 01 and records assistance level = hint.'],
  ['Show a partial example', 'Reveals 02 in mono, implies 01. Level = partial.'],
  ['Show the full version', 'Explicit reveal only. Level = full, logged in the note.'],
  ['Try again', 'Increments attempt. Disabled at attempt 3 of 3.'],
  ['Finish practice', 'Always available, even on attempt 1. → Learning note.'],
  ['Copy note / Export Markdown', 'Copy swaps to a check for 1.8s. Export writes one .md file.'],
  ['History node', 'Hover shows date, anchor, improvement. Click selects and opens the note.'],
  ['Map drag / scroll / reset', 'Pan by pointer, zoom 50–160%, reset returns to 86%.'],
  ['Save to Keychain', 'Validates prefix, then shows stored + verified, or an error line.'],
]

export function SpecSheetScreen() {
  return (
    <Screen>
      <ScreenHeader label="Design spec" right={<Meta>Prototype reference</Meta>} />

      <div className="no-scrollbar mt-8 h-[624px] overflow-y-auto pr-2">
        <div className="grid grid-cols-2 gap-8">
          <Pebble className="p-9">
            <Meta className="text-[10px]">Color tokens</Meta>
            <ul className="mt-6 flex flex-col gap-4">
              {COLOR_TOKENS.map(([name, value, use]) => (
                <li key={name} className="flex items-start gap-4">
                  <span
                    className="mt-0.5 size-7 shrink-0 rounded-lg ring-1 ring-hairline/60"
                    style={{ background: value }}
                  />
                  <div>
                    <p className="font-mono text-[12px] text-foreground">{name}</p>
                    <p className="mt-1 text-[13px] leading-snug text-muted-foreground">{use}</p>
                  </div>
                </li>
              ))}
            </ul>
          </Pebble>

          <Pebble className="p-9">
            <Meta className="text-[10px]">Typography</Meta>
            <ul className="mt-6 flex flex-col gap-4">
              {TYPE_TOKENS.map(([name, spec, use]) => (
                <li key={name}>
                  <div className="flex items-baseline justify-between gap-4">
                    <p className="text-[14px] text-foreground">{name}</p>
                    <p className="meta text-[9px]">{use}</p>
                  </div>
                  <p className="mt-1 font-mono text-[12px] text-muted-foreground">{spec}</p>
                </li>
              ))}
            </ul>

            <Hairline className="my-7" />

            <Meta className="text-[10px]">Spacing & radius</Meta>
            <ul className="mt-5 flex flex-col gap-3">
              {SPACE_TOKENS.map(([name, spec]) => (
                <li key={name} className="flex items-baseline justify-between gap-6">
                  <span className="text-[13px] text-foreground/85">{name}</span>
                  <span className="font-mono text-[11px] text-muted-foreground">{spec}</span>
                </li>
              ))}
            </ul>
          </Pebble>

          <Pebble tone="sunken" className="p-9">
            <Meta className="text-[10px]">Component inventory</Meta>
            <ul className="mt-6 flex flex-col gap-4">
              {COMPONENTS.map(([name, variants, use]) => (
                <li key={name}>
                  <div className="flex items-baseline justify-between gap-4">
                    <p className="text-[14px] font-medium text-foreground">{name}</p>
                    <p className="text-[12px] text-muted-foreground">{use}</p>
                  </div>
                  <p className="mt-1 font-mono text-[11px] text-muted-foreground/85">{variants}</p>
                </li>
              ))}
            </ul>
          </Pebble>

          <div className="flex flex-col gap-8">
            <Pebble tone="raised" className="p-9">
              <Meta className="text-[10px]">States</Meta>
              <div className="mt-6 flex flex-col gap-5">
                <StateRow label="Empty">
                  <p className="text-[13px] text-muted-foreground">
                    History shows a dashed node and one action, never a table.
                  </p>
                </StateRow>
                <StateRow label="Loading">
                  <div className="h-px w-40 overflow-hidden bg-hairline/70">
                    <span className="sweep block h-px w-12 bg-terracotta" />
                  </div>
                </StateRow>
                <StateRow label="Recording">
                  <div className="flex items-center gap-2">
                    <span className="breathe size-1.5 rounded-full bg-terracotta" />
                    <span className="meta text-[10px] text-terracotta">Attempt 2 of 3 · 00:41</span>
                  </div>
                </StateRow>
                <StateRow label="Error">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="size-3.5 text-destructive" aria-hidden="true" />
                    <span className="meta text-[10px] text-destructive">
                      Transcription failed — retry or finish
                    </span>
                  </div>
                </StateRow>
                <StateRow label="Completed">
                  <Chip active>ship the smaller version first</Chip>
                </StateRow>
              </div>
            </Pebble>

            <Pebble className="p-9">
              <Meta className="text-[10px]">Buttons</Meta>
              <div className="mt-6 flex flex-wrap items-center gap-3">
                <PillButton size="sm">Solid</PillButton>
                <PillButton size="sm" variant="quiet">
                  Quiet
                </PillButton>
                <PillButton size="sm" variant="accent">
                  Accent
                </PillButton>
                <PillButton size="sm" variant="bare">
                  Bare
                </PillButton>
                <PillButton size="sm" disabled>
                  Disabled
                </PillButton>
              </div>
            </Pebble>
          </div>

          <Pebble className="col-span-2 p-9">
            <Meta className="text-[10px]">Interaction notes</Meta>
            <ul className="mt-6 grid grid-cols-2 gap-x-10 gap-y-4">
              {INTERACTIONS.map(([name, note]) => (
                <li key={name} className="flex gap-4">
                  <span className="mt-2 size-1 shrink-0 rounded-full bg-terracotta" />
                  <div>
                    <p className="text-[14px] text-foreground">{name}</p>
                    <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">{note}</p>
                  </div>
                </li>
              ))}
            </ul>
          </Pebble>
        </div>
      </div>
    </Screen>
  )
}

function StateRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-6">
      <Meta className="w-20 shrink-0 text-[10px]">{label}</Meta>
      {children}
    </div>
  )
}
