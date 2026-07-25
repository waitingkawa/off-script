'use client'

import { useState } from 'react'
import { ChevronDown, Mic, Plus } from 'lucide-react'
import { Screen } from '../app-window'
import { Hairline, Meta, Pebble, PillButton, ScreenHeader } from '../primitives'
import { assistLabel, currentPractice, type AssistLevel, type Attempt } from '@/lib/offscript-data'
import { cn } from '@/lib/utils'

const KIND_LABEL: Record<Attempt['coachingPoint']['kind'], string> = {
  focus: 'One theme',
  phrasing: 'Natural phrasing',
  grammar: 'Grammar — blocks meaning',
}

export function FeedbackScreen({
  attempt,
  assist,
  onAssist,
  onTryAgain,
  onFinish,
}: {
  attempt: Attempt
  assist: AssistLevel
  onAssist: (level: AssistLevel) => void
  onTryAgain: () => void
  onFinish: () => void
}) {
  const [openTranscript, setOpenTranscript] = useState(false)
  const isLast = attempt.attempt >= currentPractice.maxAttempts

  return (
    <Screen>
      <ScreenHeader
        label="Feedback"
        right={
          <Meta>
            Attempt {attempt.attempt} of {currentPractice.maxAttempts} ·{' '}
            {attempt.duration} · {assistLabel[assist]}
          </Meta>
        }
      />

      <div className="mt-8 grid h-[624px] grid-cols-[1fr_360px] gap-8">
        {/* one highest-value coaching point */}
        <Pebble className="rise flex flex-col overflow-hidden p-10">
          <Meta className="text-[10px] text-terracotta">
            {KIND_LABEL[attempt.coachingPoint.kind]}
          </Meta>
          <h2 className="mt-5 max-w-[30ch] text-[29px] leading-[1.18] font-light tracking-[-0.015em] text-balance">
            {attempt.coachingPoint.title}
          </h2>
          <p className="mt-6 max-w-[62ch] text-[15px] leading-relaxed text-foreground/80">
            {attempt.coachingPoint.explanation}
          </p>

          <Hairline className="my-8" />

          {/* collapsible transcript */}
          <button
            type="button"
            onClick={() => setOpenTranscript((v) => !v)}
            aria-expanded={openTranscript}
            className="flex w-full items-center justify-between text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terracotta"
          >
            <Meta className="text-[10px]">
              {openTranscript ? 'Hide transcript' : 'Full transcript'}
            </Meta>
            <ChevronDown
              className={cn(
                'size-4 text-muted-foreground transition-transform duration-200',
                openTranscript && 'rotate-180',
              )}
              aria-hidden="true"
            />
          </button>

          {openTranscript ? (
            <div className="no-scrollbar mt-5 max-h-44 overflow-y-auto rounded-xl bg-surface-sunken/60 p-6">
              <p className="text-[14px] leading-relaxed text-foreground/75">
                {attempt.transcript}
              </p>
            </div>
          ) : null}

          <div className="mt-auto flex items-center gap-4 pt-8">
            <PillButton
              variant="accent"
              onClick={onTryAgain}
              disabled={isLast}
              trailing={<Mic className="size-4" aria-hidden="true" />}
            >
              {isLast ? 'No attempts left' : 'Try again'}
            </PillButton>
            <PillButton variant="quiet" onClick={onFinish} trailing={<Plus className="size-4" aria-hidden="true" />}>
              Finish practice
            </PillButton>
          </div>
        </Pebble>

        {/* progressive assistance */}
        <Pebble tone="sunken" className="flex flex-col overflow-hidden p-8">
          <Meta className="text-[10px]">Help, one step at a time</Meta>
          <p className="mt-3 text-[13px] leading-relaxed text-muted-foreground">
            Each step is recorded in your note, so you can see how much you
            leaned on it.
          </p>

          <div className="no-scrollbar mt-7 flex flex-1 flex-col gap-4 overflow-y-auto pr-1">
            <AssistStep
              index="01"
              label="Give me a hint"
              revealed={assist === 'hint' || assist === 'partial' || assist === 'full'}
              body={attempt.hint}
              onReveal={() => onAssist('hint')}
            />
            <AssistStep
              index="02"
              label="Show a partial example"
              revealed={assist === 'partial' || assist === 'full'}
              body={attempt.partialExample}
              onReveal={() => onAssist('partial')}
              mono
            />
            <AssistStep
              index="03"
              label="Show the full version"
              revealed={assist === 'full'}
              body={attempt.fullVersion}
              onReveal={() => onAssist('full')}
              caution="Revealing this ends the guessing for this attempt."
            />
          </div>

          <Meta className="mt-6 text-[10px]">
            Recorded level · {assistLabel[assist]}
          </Meta>
        </Pebble>
      </div>
    </Screen>
  )
}

function AssistStep({
  index,
  label,
  body,
  revealed,
  onReveal,
  mono,
  caution,
}: {
  index: string
  label: string
  body: string
  revealed: boolean
  onReveal: () => void
  mono?: boolean
  caution?: string
}) {
  return (
    <div className="rounded-xl bg-surface-raised p-5">
      <div className="flex items-baseline justify-between gap-3">
        <Meta className={cn('text-[10px]', revealed && 'text-terracotta')}>
          {index} · {label}
        </Meta>
        {!revealed ? (
          <button
            type="button"
            onClick={onReveal}
            className="meta text-[10px] text-foreground underline decoration-hairline underline-offset-4 hover:text-terracotta focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terracotta"
          >
            Reveal
          </button>
        ) : null}
      </div>

      {revealed ? (
        <p
          className={cn(
            'rise mt-4 leading-relaxed text-foreground/85',
            mono ? 'font-mono text-[13px]' : 'text-[14px]',
          )}
        >
          {body}
        </p>
      ) : (
        <p className="mt-4 text-[13px] leading-relaxed text-muted-foreground/70">
          {caution ?? 'Hidden until you ask.'}
        </p>
      )}
    </div>
  )
}
