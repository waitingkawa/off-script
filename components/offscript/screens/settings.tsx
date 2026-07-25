'use client'

import { useState } from 'react'
import { AlertCircle, Check, Eye, EyeOff, KeyRound, Palette } from 'lucide-react'
import { Screen } from '../app-window'
import { Hairline, Meta, Pebble, PillButton, ScreenHeader } from '../primitives'
import { GLOBAL_THEMES, useTheme } from '../theme-context'
import { cn } from '@/lib/utils'

type KeyState = 'idle' | 'saved' | 'error'

export function SettingsScreen() {
  const [key, setKey] = useState('sk-proj-2f7c····································9ab1')
  const [reveal, setReveal] = useState(false)
  const [state, setState] = useState<KeyState>('saved')
  const { theme, setTheme } = useTheme()

  return (
    <Screen>
      <ScreenHeader label="Settings" right={<Meta>Offscript 1.0 (build 24)</Meta>} />

      <div className="no-scrollbar mt-8 h-[624px] overflow-y-auto pr-2">
        <div className="grid grid-cols-[1fr_340px] gap-8">
          <div className="flex flex-col gap-8">
            <Pebble className="p-8">
              <div className="flex items-center gap-3">
                <span className="grid size-8 place-items-center rounded-full bg-surface-sunken">
                  <Palette className="size-4 text-terracotta" aria-hidden="true" />
                </span>
                <div>
                  <Meta className="text-[10px]">Global Color Theme</Meta>
                  <p className="mt-0.5 text-[13px] text-muted-foreground">
                    Customize Offscript&apos;s interface palette across all views.
                  </p>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-3 gap-3">
                {GLOBAL_THEMES.map((t) => {
                  const active = theme === t.id
                  return (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => setTheme(t.id)}
                      className={cn(
                        'flex flex-col items-start rounded-2xl p-3.5 text-left transition-all border cursor-pointer',
                        active
                          ? 'border-terracotta bg-surface-raised shadow-xs ring-2 ring-terracotta/30'
                          : 'border-hairline bg-surface-sunken/40 hover:bg-surface-raised hover:border-hairline/80',
                      )}
                    >
                      <div className="flex w-full items-center justify-between">
                        <span
                          className="size-3.5 rounded-full border border-black/15 shadow-2xs"
                          style={{ backgroundColor: t.colorDot }}
                        />
                        {active && <Check className="size-3.5 text-terracotta" />}
                      </div>
                      <span className="mt-3 text-[13px] font-medium text-foreground">
                        {t.cnLabel}
                      </span>
                      <span className="text-[11px] text-muted-foreground font-mono">
                        {t.label}
                      </span>
                    </button>
                  )
                })}
              </div>
            </Pebble>

            <Pebble className="rise p-10">
              <div className="flex items-start gap-4">
                <span className="mt-1 grid size-9 shrink-0 place-items-center rounded-full bg-surface-sunken">
                  <KeyRound className="size-4 text-muted-foreground" aria-hidden="true" />
                </span>
                <div>
                  <Meta className="text-[10px]">OpenAI API key</Meta>
                  <p className="mt-3 max-w-[52ch] text-[15px] leading-relaxed text-foreground/80">
                    Your key is stored in the macOS Keychain, not in Offscript&apos;s
                    own files, and never leaves your Mac except in requests you
                    trigger. Delete it here and the Keychain entry is removed with it.
                  </p>
                </div>
              </div>

              <div className="mt-8 flex items-center gap-3">
                <div className="relative flex-1">
                  <input
                    id="api-key"
                    type={reveal ? 'text' : 'password'}
                    value={key}
                    onChange={(e) => {
                      setKey(e.target.value)
                      setState(e.target.value.startsWith('sk-') ? 'idle' : 'error')
                    }}
                    aria-invalid={state === 'error'}
                    className={cn(
                      'h-12 w-full rounded-full bg-surface-raised pr-12 pl-6 font-mono text-[13px] text-foreground',
                      'focus:outline-2 focus:outline-offset-2 focus:outline-terracotta',
                      state === 'error' && 'outline-2 outline-offset-2 outline-destructive',
                    )}
                  />
                  <button
                    type="button"
                    onClick={() => setReveal((v) => !v)}
                    aria-label={reveal ? 'Hide key' : 'Reveal key'}
                    className="absolute top-1/2 right-4 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {reveal ? (
                      <EyeOff className="size-4" aria-hidden="true" />
                    ) : (
                      <Eye className="size-4" aria-hidden="true" />
                    )}
                  </button>
                </div>
                <PillButton
                  variant="quiet"
                  onClick={() => setState(key.startsWith('sk-') ? 'saved' : 'error')}
                >
                  Save to Keychain
                </PillButton>
              </div>

              <div className="mt-4 flex h-5 items-center gap-2">
                {state === 'saved' ? (
                  <>
                    <Check className="size-3.5 text-terracotta" aria-hidden="true" />
                    <Meta className="text-[10px] text-terracotta">
                      Stored in Keychain · verified 09:12
                    </Meta>
                  </>
                ) : null}
                {state === 'error' ? (
                  <>
                    <AlertCircle className="size-3.5 text-destructive" aria-hidden="true" />
                    <Meta className="text-[10px] text-destructive">
                      That key was rejected. Practice runs without transcription until it&apos;s fixed.
                    </Meta>
                  </>
                ) : null}
                {state === 'idle' ? <Meta className="text-[10px]">Unsaved changes</Meta> : null}
              </div>
            </Pebble>

            <Pebble tone="raised" className="p-10">
              <Meta className="text-[10px]">Models</Meta>
              <dl className="mt-6 flex flex-col gap-5">
                <Row
                  term="Transcription"
                  value="whisper-1"
                  note="Audio is sent for transcription only. Nothing is stored remotely."
                />
                <Hairline />
                <Row
                  term="Coaching"
                  value="gpt-4o-mini"
                  note="Returns exactly one issue per attempt, plus staged hints."
                />
                <Hairline />
                <Row
                  term="Not evaluated"
                  value="pronunciation · accent · intonation · speed"
                  note="Offscript never scores how you sound."
                />
              </dl>
            </Pebble>
          </div>

          <div className="flex flex-col gap-8">
            <Pebble tone="sunken" className="p-8">
              <Meta className="text-[10px]">Local data</Meta>
              <ul className="mt-5 flex flex-col gap-4">
                {[
                  ['Notes & transcripts', '~/Library/Offscript'],
                  ['Audio', 'discarded after coaching'],
                  ['History', '7 sessions · 1.2 MB'],
                ].map(([k, v]) => (
                  <li key={k}>
                    <p className="text-[14px] text-foreground/85">{k}</p>
                    <Meta className="mt-1 text-[10px]">{v}</Meta>
                  </li>
                ))}
              </ul>
              <div className="mt-7 flex flex-col gap-3">
                <PillButton variant="quiet" size="sm">
                  Export all notes as Markdown
                </PillButton>
                <PillButton variant="bare" size="sm" className="self-start">
                  Delete all local data
                </PillButton>
              </div>
            </Pebble>

            <Pebble className="p-8">
              <Meta className="text-[10px]">Practice defaults</Meta>
              <div className="mt-5 flex flex-col gap-4">
                <Toggle label="Show keywords while recording" defaultOn />
                <Toggle label="Keep transcript collapsed by default" defaultOn />
                <Toggle label="Open popover with Option-Space" />
              </div>
            </Pebble>
          </div>
        </div>
      </div>
    </Screen>
  )
}

function Row({ term, value, note }: { term: string; value: string; note: string }) {
  return (
    <div>
      <div className="flex items-baseline justify-between gap-6">
        <dt className="text-[15px] text-foreground">{term}</dt>
        <dd className="meta text-[10px] text-foreground">{value}</dd>
      </div>
      <p className="mt-2 text-[13px] leading-relaxed text-muted-foreground">{note}</p>
    </div>
  )
}

function Toggle({ label, defaultOn }: { label: string; defaultOn?: boolean }) {
  const [on, setOn] = useState(Boolean(defaultOn))
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      onClick={() => setOn((v) => !v)}
      className="flex items-center justify-between gap-4 text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terracotta"
    >
      <span className="text-[14px] leading-snug text-foreground/85">{label}</span>
      <span
        className={cn(
          'relative h-6 w-10 shrink-0 rounded-full transition-colors',
          on ? 'bg-terracotta' : 'bg-hairline',
        )}
      >
        <span
          className={cn(
            'absolute top-1 size-4 rounded-full bg-surface-raised transition-all',
            on ? 'left-5' : 'left-1',
          )}
        />
      </span>
    </button>
  )
}
