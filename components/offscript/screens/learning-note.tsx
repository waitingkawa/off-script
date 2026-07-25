'use client'

import { useState } from 'react'
import { ArrowUpRight, Check, Copy, Download } from 'lucide-react'
import { Screen } from '../app-window'
import { Chip, Hairline, Meta, Pebble, PillButton, ScreenHeader } from '../primitives'
import { assistLabel, learningNote } from '@/lib/offscript-data'

export function LearningNoteScreen({ onHistory }: { onHistory: () => void }) {
  const [copied, setCopied] = useState<'note' | 'prompt' | null>(null)

  function copy(which: 'note' | 'prompt') {
    // Prototype only — clipboard write is best-effort.
    const text = which === 'prompt' ? learningNote.coachPrompt : toMarkdown()
    void navigator.clipboard?.writeText(text)
    setCopied(which)
    setTimeout(() => setCopied(null), 1800)
  }

  return (
    <Screen>
      <ScreenHeader
        label="Practice complete"
        right={
          <Meta>
            {learningNote.date} · {learningNote.duration} ·{' '}
            {learningNote.attemptsUsed} attempts · {assistLabel[learningNote.assistUsed]}
          </Meta>
        }
      />

      <div className="no-scrollbar mt-8 h-[624px] overflow-y-auto pr-2">
        <div className="grid grid-cols-[1fr_360px] gap-8">
          <div className="flex flex-col gap-8">
            <Pebble className="rise p-10">
              <Meta className="text-[10px]">Core theme</Meta>
              <p className="mt-5 max-w-[30ch] text-[30px] leading-[1.18] font-light tracking-[-0.015em] text-balance">
                {learningNote.coreTheme}
              </p>

              <Hairline className="my-9" />

              <Meta className="text-[10px]">Off-script outline</Meta>
              <ol className="mt-5 flex flex-col gap-3">
                {learningNote.outline.map((step, i) => (
                  <li key={step} className="flex items-baseline gap-4">
                    <span className="meta text-[10px] text-terracotta">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <span className="text-[17px] leading-snug font-light text-foreground/90">
                      {step}
                    </span>
                  </li>
                ))}
              </ol>
            </Pebble>

            <Pebble tone="raised" className="p-10">
              <Meta className="text-[10px]">One durable improvement</Meta>
              <p className="mt-5 max-w-[58ch] text-[19px] leading-relaxed font-light text-foreground">
                {learningNote.improvement}
              </p>
            </Pebble>

            <Pebble className="p-10">
              <Meta className="text-[10px]">Final transcript</Meta>
              <p className="mt-5 max-w-[70ch] text-[15px] leading-relaxed text-foreground/80">
                {learningNote.finalTranscript}
              </p>
            </Pebble>
          </div>

          <div className="flex flex-col gap-8">
            <Pebble tone="sunken" className="p-8">
              <Meta className="text-[10px]">Reusable expressions</Meta>
              <ul className="mt-5 flex flex-col gap-5">
                {learningNote.expressions.map((e) => (
                  <li key={e.phrase}>
                    <Chip active>{e.phrase}</Chip>
                    <p className="mt-2 text-[13px] leading-relaxed text-muted-foreground">
                      {e.note}
                    </p>
                  </li>
                ))}
              </ul>
            </Pebble>

            <Pebble className="p-8">
              <div className="flex items-baseline justify-between">
                <Meta className="text-[10px]">Universal AI coach prompt</Meta>
                <button
                  type="button"
                  onClick={() => copy('prompt')}
                  className="meta text-[10px] text-foreground underline decoration-hairline underline-offset-4 hover:text-terracotta"
                >
                  {copied === 'prompt' ? 'Copied' : 'Copy'}
                </button>
              </div>
              <div className="no-scrollbar mt-4 max-h-52 overflow-y-auto rounded-xl bg-surface-raised p-5">
                <p className="font-mono text-[12px] leading-relaxed text-foreground/75">
                  {learningNote.coachPrompt}
                </p>
              </div>
            </Pebble>

            <div className="flex flex-col gap-3">
              <PillButton
                onClick={() => copy('note')}
                trailing={
                  copied === 'note' ? (
                    <Check className="size-4" aria-hidden="true" />
                  ) : (
                    <Copy className="size-4" aria-hidden="true" />
                  )
                }
                className="justify-between"
              >
                {copied === 'note' ? 'Note copied' : 'Copy note'}
              </PillButton>
              <PillButton
                variant="quiet"
                className="justify-between"
                trailing={<Download className="size-4" aria-hidden="true" />}
              >
                Export Markdown
              </PillButton>
              <PillButton
                variant="bare"
                size="sm"
                className="mt-2 self-start"
                onClick={onHistory}
              >
                See this in your history
                <ArrowUpRight className="ml-1 inline size-3.5" aria-hidden="true" />
              </PillButton>
            </div>
          </div>
        </div>
      </div>
    </Screen>
  )
}

function toMarkdown() {
  const n = learningNote
  return [
    `# Offscript — ${n.date}`,
    ``,
    `**Core theme:** ${n.coreTheme}`,
    ``,
    `## Off-script outline`,
    ...n.outline.map((o, i) => `${i + 1}. ${o}`),
    ``,
    `## One durable improvement`,
    n.improvement,
    ``,
    `## Reusable expressions`,
    ...n.expressions.map((e) => `- \`${e.phrase}\` — ${e.note}`),
    ``,
    `## Final transcript`,
    n.finalTranscript,
    ``,
    `## AI coach prompt`,
    n.coachPrompt,
  ].join('\n')
}
