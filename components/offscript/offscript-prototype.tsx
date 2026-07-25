'use client'

import { useCallback, useState } from 'react'
import { AppWindow, WindowStatus } from './app-window'
import { Meta } from './primitives'
import { MenuBarPopover } from './screens/menu-bar-popover'
import { TopicAnchorScreen } from './screens/topic-anchor'
import { ProcessingScreen, ReadyScreen, RecordingScreen } from './screens/record'
import { FeedbackScreen } from './screens/feedback'
import { LearningNoteScreen } from './screens/learning-note'
import { HistoryScreen } from './screens/history'
import { SettingsScreen } from './screens/settings'
import { SpecSheetScreen } from './screens/spec-sheet'
import { attempts, currentPractice, type AssistLevel } from '@/lib/offscript-data'
import { cn } from '@/lib/utils'

type ScreenId =
  | 'popover'
  | 'anchor'
  | 'ready'
  | 'recording'
  | 'processing'
  | 'feedback'
  | 'note'
  | 'history'
  | 'history-empty'
  | 'settings'
  | 'spec'

const NAV: Array<{ id: ScreenId; index: string; label: string }> = [
  { id: 'popover', index: '01', label: 'Menu bar popover' },
  { id: 'anchor', index: '02', label: 'Topic anchor' },
  { id: 'ready', index: '03', label: 'Ready to record' },
  { id: 'recording', index: '04', label: 'Recording' },
  { id: 'processing', index: '05', label: 'Processing' },
  { id: 'feedback', index: '06', label: 'Feedback' },
  { id: 'note', index: '07', label: 'Learning note' },
  { id: 'history', index: '08', label: 'Practice history' },
  { id: 'history-empty', index: '08b', label: 'History — empty' },
  { id: 'settings', index: '09', label: 'Settings' },
  { id: 'spec', index: '10', label: 'Design spec' },
]

const STATUS: Partial<Record<ScreenId, string>> = {
  popover: 'Menu bar item',
  anchor: 'Step 1 of 3',
  ready: 'Voice first',
  recording: 'Recording',
  processing: 'Working',
  feedback: 'One thing to change',
  note: 'Saved locally',
  history: '7 sessions',
  'history-empty': 'No sessions yet',
  settings: 'Keychain',
  spec: 'Reference',
}

export function OffscriptPrototype() {
  const [screen, setScreen] = useState<ScreenId>('popover')
  const [attemptIndex, setAttemptIndex] = useState(0)
  const [assist, setAssist] = useState<AssistLevel>('none')

  const attempt = attempts[Math.min(attemptIndex, attempts.length - 1)]

  const goto = useCallback((id: ScreenId) => setScreen(id), [])

  const startPractice = useCallback(() => {
    setAttemptIndex(0)
    setAssist('none')
    setScreen('anchor')
  }, [])

  const tryAgain = useCallback(() => {
    setAttemptIndex((i) => Math.min(i + 1, currentPractice.maxAttempts - 1))
    setAssist('none')
    setScreen('ready')
  }, [])

  return (
    <main className="min-h-svh w-full overflow-auto bg-background">
      <div className="flex min-w-max items-start gap-10 px-12 py-14">
        {/* prototype index — not part of the macOS app */}
        <aside className="sticky top-14 w-[190px] shrink-0">
          <Meta className="text-foreground">Offscript</Meta>
          <p className="mt-3 text-[13px] leading-relaxed text-muted-foreground">
            Visual prototype. Screens and states only — no recording, no AI, no
            backend.
          </p>

          <nav className="mt-8 flex flex-col gap-1">
            {NAV.map((item) => {
              const active = screen === item.id
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => goto(item.id)}
                  className={cn(
                    'flex items-baseline gap-3 rounded-full px-3 py-2 text-left transition-colors',
                    active ? 'bg-surface text-foreground' : 'text-muted-foreground hover:text-foreground',
                  )}
                >
                  <span className={cn('meta text-[9px]', active && 'text-terracotta')}>
                    {item.index}
                  </span>
                  <span className="text-[13px] leading-snug">{item.label}</span>
                </button>
              )
            })}
          </nav>

          <div className="mt-8 border-t border-hairline/60 pt-5">
            <Meta className="text-[9px]">Session state</Meta>
            <p className="mt-2 font-mono text-[11px] text-muted-foreground">
              attempt {attempt.attempt}/{currentPractice.maxAttempts} · assist {assist}
            </p>
          </div>
        </aside>

        {screen === 'popover' ? (
          <MenuBarPopover onStart={startPractice} />
        ) : (
          <AppWindow status={<WindowStatus>{STATUS[screen]}</WindowStatus>}>
            {screen === 'anchor' ? <TopicAnchorScreen onStart={() => goto('ready')} /> : null}
            {screen === 'ready' ? (
              <ReadyScreen
                attempt={attempt.attempt}
                onRecord={() => goto('recording')}
                onFinish={() => goto('note')}
              />
            ) : null}
            {screen === 'recording' ? (
              <RecordingScreen attempt={attempt.attempt} onStop={() => goto('processing')} />
            ) : null}
            {screen === 'processing' ? (
              <ProcessingScreen onDone={() => goto('feedback')} />
            ) : null}
            {screen === 'feedback' ? (
              <FeedbackScreen
                attempt={attempt}
                assist={assist}
                onAssist={setAssist}
                onTryAgain={tryAgain}
                onFinish={() => goto('note')}
              />
            ) : null}
            {screen === 'note' ? <LearningNoteScreen onHistory={() => goto('history')} /> : null}
            {screen === 'history' ? (
              <HistoryScreen onOpenNote={() => goto('note')} onStart={startPractice} />
            ) : null}
            {screen === 'history-empty' ? (
              <HistoryScreen empty onOpenNote={() => goto('note')} onStart={startPractice} />
            ) : null}
            {screen === 'settings' ? <SettingsScreen /> : null}
            {screen === 'spec' ? <SpecSheetScreen /> : null}
          </AppWindow>
        )}
      </div>
    </main>
  )
}
