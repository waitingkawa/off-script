'use client'

import { useState } from 'react'
import { ArrowRight } from 'lucide-react'
import { Screen } from '../app-window'
import { Chip, Meta, Pebble, PillButton, ScreenHeader } from '../primitives'
import { currentPractice, sessions } from '@/lib/offscript-data'

export function TopicAnchorScreen({ onStart }: { onStart: () => void }) {
  const [value, setValue] = useState(currentPractice.topicAnchor)
  const recent = sessions.slice(-3).reverse()

  return (
    <Screen>
      <ScreenHeader label="Topic anchor" right={<Meta>Session 021</Meta>} />

      <div className="mt-14 grid grid-cols-[1fr_320px] gap-10">
        <Pebble className="rise p-11">
          <Meta className="text-[10px]">Before you speak</Meta>
          <h1 className="mt-6 max-w-[24ch] text-[38px] leading-[1.12] font-light tracking-[-0.02em] text-balance">
            What do you want your listener to remember?
          </h1>

          <div className="mt-10">
            <label htmlFor="anchor" className="meta text-muted-foreground">
              One sentence
            </label>
            <textarea
              id="anchor"
              rows={2}
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="Type the single idea you want to land…"
              className="mt-3 w-full resize-none rounded-xl bg-surface-raised px-5 py-4 text-[19px] leading-relaxed font-light text-foreground placeholder:text-muted-foreground/60 focus:outline-2 focus:outline-offset-2 focus:outline-terracotta"
            />
            <div className="mt-3 flex items-center justify-between">
              <Meta className="text-[10px]">
                {value.trim() ? `${value.trim().split(/\s+/).length} words` : 'Empty'}
              </Meta>
              <Meta className="text-[10px]">3–5 min · up to 3 attempts</Meta>
            </div>
          </div>

          <div className="mt-11 flex items-center gap-6">
            <PillButton
              onClick={onStart}
              disabled={!value.trim()}
              trailing={<ArrowRight className="size-4" aria-hidden="true" />}
            >
              Start practice
            </PillButton>
            <PillButton variant="bare" size="sm" onClick={() => setValue('')}>
              Clear
            </PillButton>
          </div>
        </Pebble>

        <div className="flex flex-col gap-6">
          <Pebble className="p-7">
            <Meta className="text-[10px]">Reuse a recent anchor</Meta>
            <ul className="mt-5 flex flex-col gap-4">
              {recent.map((s) => (
                <li key={s.id}>
                  <button
                    type="button"
                    onClick={() => setValue(s.topicAnchor)}
                    className="w-full text-left transition-opacity hover:opacity-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terracotta"
                  >
                    <Meta className="text-[10px]">{s.date}</Meta>
                    <p className="mt-1.5 text-[14px] leading-snug text-foreground/85">
                      {s.topicAnchor}
                    </p>
                  </button>
                </li>
              ))}
            </ul>
          </Pebble>

          <Pebble tone="sunken" className="p-7">
            <Meta className="text-[10px]">Optional keywords</Meta>
            <p className="mt-3 text-[13px] leading-relaxed text-muted-foreground">
              Two to four words only. They stay visible while you speak — a full
              script never will.
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              {currentPractice.keywords.map((k) => (
                <Chip key={k}>{k}</Chip>
              ))}
            </div>
          </Pebble>
        </div>
      </div>
    </Screen>
  )
}
