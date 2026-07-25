'use client'

import { useEffect, useState } from 'react'
import { Mic, Square } from 'lucide-react'
import { Screen } from '../app-window'
import { Chip, DotProgress, Meta, Pebble, PillButton, ScreenHeader } from '../primitives'
import { currentPractice } from '@/lib/offscript-data'

/* ------------------------------------------------------- Ready to record */

export function ReadyScreen({
  attempt,
  onRecord,
  onFinish,
}: {
  attempt: number
  onRecord: () => void
  onFinish: () => void
}) {
  const [showKeywords, setShowKeywords] = useState(true)

  return (
    <Screen>
      <ScreenHeader
        label="Ready to record"
        right={<Meta>Attempt {attempt} of {currentPractice.maxAttempts}</Meta>}
      />

      <div className="mt-10 flex h-[620px] gap-10">
        <Pebble className="rise flex flex-1 flex-col items-center justify-center px-16 text-center">
          <Meta className="text-[10px]">Your listener should remember</Meta>
          <p className="mt-6 max-w-[26ch] text-[30px] leading-[1.2] font-light tracking-[-0.015em] text-balance">
            {currentPractice.topicAnchor}
          </p>

          {showKeywords ? (
            <div className="mt-9 flex flex-wrap justify-center gap-2">
              {currentPractice.keywords.map((k) => (
                <Chip key={k}>{k}</Chip>
              ))}
            </div>
          ) : (
            <Meta className="mt-9 text-[10px]">Keywords hidden</Meta>
          )}

          <button
            type="button"
            onClick={onRecord}
            aria-label="Start recording"
            className="mt-14 grid size-28 place-items-center rounded-full bg-terracotta text-terracotta-foreground transition-transform duration-200 hover:scale-[1.03] active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-terracotta"
          >
            <Mic className="size-9" aria-hidden="true" />
          </button>
          <Meta className="mt-6 text-[10px]">Press Option-R or click to speak</Meta>

          <DotProgress className="mt-10" total={currentPractice.maxAttempts} current={attempt - 1} />
        </Pebble>

        <div className="flex w-[300px] flex-col gap-6">
          <Pebble tone="sunken" className="p-7">
            <Meta className="text-[10px]">This attempt</Meta>
            <p className="mt-4 text-[14px] leading-relaxed text-foreground/85">
              Speak for about 60 seconds. Nothing you say is shown as text until
              you stop.
            </p>
            <button
              type="button"
              onClick={() => setShowKeywords((v) => !v)}
              className="meta mt-6 text-muted-foreground underline decoration-hairline underline-offset-4 hover:text-foreground"
            >
              {showKeywords ? 'Hide keywords' : 'Show keywords'}
            </button>
          </Pebble>

          <Pebble className="p-7">
            <Meta className="text-[10px]">Session</Meta>
            <dl className="mt-4 flex flex-col gap-3">
              {[
                ['Length', '3–5 min'],
                ['Attempts', `${attempt} / ${currentPractice.maxAttempts}`],
                ['Assistance', 'none yet'],
              ].map(([k, v]) => (
                <div key={k} className="flex items-baseline justify-between">
                  <dt className="text-[13px] text-muted-foreground">{k}</dt>
                  <dd className="meta text-foreground">{v}</dd>
                </div>
              ))}
            </dl>
          </Pebble>

          <PillButton variant="quiet" className="mt-auto" onClick={onFinish}>
            Finish practice
          </PillButton>
        </div>
      </div>
    </Screen>
  )
}

/* -------------------------------------------------------------- Recording */

const LEVELS = [
  0.3, 0.55, 0.8, 0.45, 0.95, 0.6, 0.35, 0.75, 1, 0.5, 0.68, 0.4, 0.85, 0.55,
  0.3, 0.72, 0.9, 0.48, 0.62, 0.35, 0.8, 0.55, 0.42, 0.95, 0.6, 0.33, 0.78,
  0.52, 0.88, 0.45,
]

export function RecordingScreen({
  attempt,
  onStop,
}: {
  attempt: number
  onStop: () => void
}) {
  const [seconds, setSeconds] = useState(0)

  useEffect(() => {
    const id = setInterval(() => setSeconds((s) => s + 1), 1000)
    return () => clearInterval(id)
  }, [])

  const mm = String(Math.floor(seconds / 60)).padStart(2, '0')
  const ss = String(seconds % 60).padStart(2, '0')

  return (
    <Screen>
      <ScreenHeader
        label="Recording"
        right={
          <Meta className="flex items-center gap-2 text-terracotta">
            <span className="size-1.5 rounded-full bg-terracotta breathe" />
            Attempt {attempt} of {currentPractice.maxAttempts}
          </Meta>
        }
      />

      <Pebble className="rise mt-10 flex h-[620px] flex-col items-center justify-center px-20 text-center">
        <p className="max-w-[26ch] text-[28px] leading-[1.2] font-light tracking-[-0.015em] text-balance">
          {currentPractice.topicAnchor}
        </p>

        <div className="mt-8 flex flex-wrap justify-center gap-2">
          {currentPractice.keywords.map((k) => (
            <Chip key={k} active>
              {k}
            </Chip>
          ))}
        </div>

        <div
          className="mt-16 flex h-24 items-center gap-1.5"
          role="img"
          aria-label="Audio level"
        >
          {LEVELS.map((l, i) => (
            <span
              key={i}
              className="level-bar w-1.5 rounded-full bg-terracotta/70"
              style={{
                height: `${l * 96}px`,
                animationDelay: `${(i % 7) * 0.13}s`,
                animationDuration: `${0.9 + (i % 4) * 0.2}s`,
              }}
            />
          ))}
        </div>

        <p className="mt-14 font-mono text-[44px] leading-none font-normal tabular-nums tracking-[-0.02em] text-foreground">
          {mm}:{ss}
        </p>
        <Meta className="mt-4 text-[10px]">Listening only. No text on screen.</Meta>

        <button
          type="button"
          onClick={onStop}
          className="mt-14 inline-flex h-14 items-center gap-3 rounded-full bg-terracotta px-8 text-[15px] font-medium text-terracotta-foreground transition-transform hover:scale-[1.02] active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-terracotta"
        >
          <Square className="size-4 fill-current" aria-hidden="true" />
          Stop and review
        </button>
      </Pebble>
    </Screen>
  )
}

/* -------------------------------------------------------------- Processing */

export function ProcessingScreen({ onDone }: { onDone: () => void }) {
  useEffect(() => {
    const id = setTimeout(onDone, 2200)
    return () => clearTimeout(id)
  }, [onDone])

  return (
    <Screen>
      <ScreenHeader label="Processing" right={<Meta>Local · then transcribe</Meta>} />

      <Pebble className="mt-10 flex h-[620px] flex-col items-center justify-center px-20 text-center">
        <div className="h-px w-56 overflow-hidden bg-hairline/70">
          <span className="sweep block h-px w-16 bg-terracotta" />
        </div>
        <p className="mt-10 text-[20px] leading-relaxed font-light text-foreground/80">
          Listening back to what you said.
        </p>
        <Meta className="mt-4 text-[10px]">
          Transcribing · then finding one thing worth changing
        </Meta>
      </Pebble>
    </Screen>
  )
}
