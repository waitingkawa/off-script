// All content is mocked. No AI calls, no recording APIs, no persistence.
// The production app will be implemented natively in SwiftUI.

export type AssistLevel = 'none' | 'hint' | 'partial' | 'full'

export type Attempt = {
  attempt: number
  duration: string
  transcript: string
  coachingPoint: {
    kind: 'focus' | 'phrasing' | 'grammar'
    title: string
    explanation: string
  }
  hint: string
  partialExample: string
  fullVersion: string
}

export type PracticeSession = {
  id: string
  date: string
  isoDate: string
  topicAnchor: string
  keywords: string[]
  attemptsUsed: number
  assistUsed: AssistLevel
  improvement: string
  duration: string
}

export const currentPractice = {
  topicAnchor: 'Our team should ship the smaller version first.',
  keywords: ['smaller version', 'ship earlier', 'real feedback', 'less risk'],
  maxAttempts: 3,
}

export const attempts: Attempt[] = [
  {
    attempt: 1,
    duration: '00:52',
    transcript:
      "So, um, I think that we have a lot of things in the plan, and the plan is very big, and maybe we should, uh, do the small one first because the big one takes a long time, and also the design is not finished, and I talked to Mei about the pricing page yesterday and she said something about the onboarding too, so there are many things, but yes, I think smaller is better for us right now.",
    coachingPoint: {
      kind: 'focus',
      title: 'You left your one idea halfway through.',
      explanation:
        'Your first two sentences carry the point: ship the smaller version first. Then pricing, onboarding, and Mei arrive and the listener loses the thread. Keep the side stories out until the main idea has landed once, clearly.',
    },
    hint: 'Say your conclusion in the first sentence, then give exactly one reason for it. Cut Mei, pricing, and onboarding entirely.',
    partialExample:
      'I think we should ship the smaller version first. The main reason is ______, and that means we ______ instead of waiting for the full release.',
    fullVersion:
      "I think we should ship the smaller version first. The main reason is that we'd get real feedback in weeks instead of months, and that lowers the risk of building the wrong thing. Everything else in the plan can follow once we know people actually want it.",
  },
  {
    attempt: 2,
    duration: '00:41',
    transcript:
      "I think we should ship the smaller version first. The reason is we can get the feedback from real users more early, and it is less risky for us. If we wait for all the features, we will spend many months and maybe we build a wrong thing.",
    coachingPoint: {
      kind: 'phrasing',
      title: '“More early” and “a wrong thing” sound translated.',
      explanation:
        'Your structure is now clear, so the next gain is in phrasing. Native speakers say “earlier” rather than “more early”, and “the wrong thing” rather than “a wrong thing”. Small swaps, and your idea stops sounding rehearsed.',
    },
    hint: 'Two fixes: replace “more early” with a single comparative word, and use “the wrong thing” for the concept everyone already has in mind.',
    partialExample:
      'The reason is that we get real feedback ______, and that means less risk of building ______ thing.',
    fullVersion:
      "I think we should ship the smaller version first. That way we get real feedback much earlier, and we take on far less risk of building the wrong thing. If we wait for every feature, we could spend months before we learn anything.",
  },
  {
    attempt: 3,
    duration: '00:36',
    transcript:
      "We should ship the smaller version first. That way we get real feedback much earlier, and we take on far less risk of building the wrong thing. Waiting for every feature would cost us months before we learn anything at all.",
    coachingPoint: {
      kind: 'focus',
      title: 'One idea, start to finish. Nothing to fix.',
      explanation:
        'You opened with the conclusion, gave one supporting reason, and closed on the cost of not doing it. This is what off-script sounds like: short, ordered, and finished on purpose rather than trailing off.',
    },
    hint: 'Nothing needed here. If you want a stretch, try delivering the same point in two sentences instead of three.',
    partialExample:
      'We should ship the smaller version first — ______ much earlier, ______ far less risk.',
    fullVersion:
      "We should ship the smaller version first: real feedback much earlier, and far less risk of building the wrong thing.",
  },
]

export const learningNote = {
  date: '06.26.23',
  duration: '4:38',
  attemptsUsed: 3,
  assistUsed: 'partial' as AssistLevel,
  coreTheme: 'Ship the smaller version first, because early feedback lowers risk.',
  outline: ['smaller version first', 'real feedback earlier', 'far less risk', 'waiting costs months'],
  improvement:
    'State the conclusion in the first sentence, then give exactly one reason. Side stories wait until the main idea has landed.',
  expressions: [
    { phrase: 'ship the smaller version first', note: 'Plain, decisive opener for a recommendation.' },
    { phrase: 'that way we get real feedback much earlier', note: 'Links a choice to its benefit in one breath.' },
    { phrase: 'we take on far less risk', note: 'Natural collocation — “take on risk”, not “have risk”.' },
    { phrase: 'building the wrong thing', note: 'Definite article: the wrong thing, not a wrong thing.' },
  ],
  finalTranscript: attempts[2].transcript,
  coachPrompt:
    'You are my spontaneous-speaking coach. I will speak for about 60 seconds on one idea. Transcribe what I said, then name exactly one highest-value issue — first whether I stayed on one core theme, then whether my phrasing sounds natural to a native speaker, and grammar only if it blocked understanding. Do not comment on pronunciation, accent, or speed. Offer help in stages: a short hint first, a partial example only if I ask, and a full rewrite only if I explicitly ask for it. Then tell me to say it again.',
}

// Practice session history: each entry represents a 3-5 minute spontaneous speaking practice.
export const sessions: PracticeSession[] = [
  {
    id: 's-001',
    date: '04.10.23',
    isoDate: '2023-04-10',
    topicAnchor: 'Introducing myself in under 30 seconds.',
    keywords: ['concise', 'role', 'core focus'],
    attemptsUsed: 2,
    assistUsed: 'hint',
    improvement: 'State your main role before describing past titles.',
    duration: '3:15',
  },
  {
    id: 's-002',
    date: '04.14.23',
    isoDate: '2023-04-14',
    topicAnchor: 'Answering why I chose design engineering.',
    keywords: ['craft', 'problem solving', 'user empathy'],
    attemptsUsed: 3,
    assistUsed: 'partial',
    improvement: 'Connect personal motivation directly to the outcome.',
    duration: '4:10',
  },
  {
    id: 's-003',
    date: '04.18.23',
    isoDate: '2023-04-18',
    topicAnchor: 'Explaining our architecture to a non-technical manager.',
    keywords: ['metaphor', 'simple terms', 'no jargon'],
    attemptsUsed: 1,
    assistUsed: 'none',
    improvement: 'Use one analogy instead of three nested examples.',
    duration: '3:45',
  },
  {
    id: 's-004',
    date: '04.22.23',
    isoDate: '2023-04-22',
    topicAnchor: 'Why we need to pause new features for bug fixing.',
    keywords: ['stability', 'user trust', 'technical debt'],
    attemptsUsed: 2,
    assistUsed: 'hint',
    improvement: 'Lead with user impact rather than developer pain.',
    duration: '4:25',
  },
  {
    id: 's-005',
    date: '04.27.23',
    isoDate: '2023-04-27',
    topicAnchor: 'Summarizing last quarter’s key metric win.',
    keywords: ['retention', 'activation rate', 'team effort'],
    attemptsUsed: 2,
    assistUsed: 'none',
    improvement: 'Highlight the single highest metric before giving context.',
    duration: '3:50',
  },
  {
    id: 's-006',
    date: '05.02.23',
    isoDate: '2023-05-02',
    topicAnchor: 'Proposing a daily sync instead of long weekly status meetings.',
    keywords: ['15 minutes', 'async updates', 'faster velocity'],
    attemptsUsed: 3,
    assistUsed: 'partial',
    improvement: 'State the time saved for the team in sentence one.',
    duration: '4:05',
  },
  {
    id: 's-007',
    date: '05.06.23',
    isoDate: '2023-05-06',
    topicAnchor: 'Pitching our internal design system upgrade.',
    keywords: ['consistency', 'reusability', 'speed'],
    attemptsUsed: 1,
    assistUsed: 'none',
    improvement: 'Focus on developer velocity rather than aesthetic preferences.',
    duration: '3:30',
  },
  {
    id: 's-008',
    date: '05.10.23',
    isoDate: '2023-05-10',
    topicAnchor: 'Declining a feature request from an external partner.',
    keywords: ['polite refusal', 'alignment', 'current focus'],
    attemptsUsed: 2,
    assistUsed: 'hint',
    improvement: 'Reiterate shared goals before setting the boundary.',
    duration: '4:15',
  },
  {
    id: 's-009',
    date: '05.15.23',
    isoDate: '2023-05-15',
    topicAnchor: 'How I handle unexpected production outages.',
    keywords: ['calm communication', 'triage', 'post-mortem'],
    attemptsUsed: 2,
    assistUsed: 'none',
    improvement: 'Specify the first action item in under 10 seconds.',
    duration: '3:55',
  },
  {
    id: 's-010',
    date: '05.19.23',
    isoDate: '2023-05-19',
    topicAnchor: 'Recommending a pivot on the onboarding flow.',
    keywords: ['friction points', 'drop-off', 'simplified steps'],
    attemptsUsed: 3,
    assistUsed: 'full',
    improvement: 'Replace passive verbs with active decision statements.',
    duration: '4:40',
  },
  {
    id: 's-011',
    date: '05.22.23',
    isoDate: '2023-05-22',
    topicAnchor: 'Asking for clarification during a high-stakes call.',
    keywords: ['pause', 'confirm understanding', 'next steps'],
    attemptsUsed: 1,
    assistUsed: 'none',
    improvement: 'Ask directly without framing with multiple disclaimers.',
    duration: '3:05',
  },
  {
    id: 's-012',
    date: '05.25.23',
    isoDate: '2023-05-25',
    topicAnchor: 'Sharing a critical lesson from a failed experiment.',
    keywords: ['hypothesis', 'unexpected result', 'pivot point'],
    attemptsUsed: 2,
    assistUsed: 'hint',
    improvement: 'Frame failure as data collection rather than a misstep.',
    duration: '4:00',
  },
  {
    id: 's-013',
    date: '05.29.23',
    isoDate: '2023-05-29',
    topicAnchor: 'Why I turned down the freelance project.',
    keywords: ['wrong timing', 'protect focus', 'no hard feelings'],
    attemptsUsed: 2,
    assistUsed: 'hint',
    improvement: 'Give the reason before the apology.',
    duration: '3:41',
  },
  {
    id: 's-014',
    date: '06.02.23',
    isoDate: '2023-06-02',
    topicAnchor: 'What our product actually does, in one breath.',
    keywords: ['one sentence', 'for whom', 'instead of'],
    attemptsUsed: 3,
    assistUsed: 'partial',
    improvement: 'Name the listener’s problem before the feature.',
    duration: '4:55',
  },
  {
    id: 's-015',
    date: '06.05.23',
    isoDate: '2023-06-05',
    topicAnchor: 'Explaining a complex trade-off between speed and scope.',
    keywords: ['trade-off', 'deadline', 'quality control'],
    attemptsUsed: 2,
    assistUsed: 'hint',
    improvement: 'State the compromise clearly in one sentence.',
    duration: '3:50',
  },
  {
    id: 's-016',
    date: '06.08.23',
    isoDate: '2023-06-08',
    topicAnchor: 'How I want feedback in reviews.',
    keywords: ['specific', 'early', 'written first'],
    attemptsUsed: 1,
    assistUsed: 'none',
    improvement: 'Stop adding a second request at the end.',
    duration: '3:12',
  },
  {
    id: 's-017',
    date: '06.11.23',
    isoDate: '2023-06-11',
    topicAnchor: 'Updating leadership on Q3 resource allocation.',
    keywords: ['headcount', 'priority projects', 'budget caps'],
    attemptsUsed: 2,
    assistUsed: 'partial',
    improvement: 'Lead with the primary bottleneck.',
    duration: '4:15',
  },
  {
    id: 's-018',
    date: '06.13.23',
    isoDate: '2023-06-13',
    topicAnchor: 'The part of the roadmap I disagree with.',
    keywords: ['agree first', 'one concern', 'what I’d change'],
    attemptsUsed: 3,
    assistUsed: 'hint',
    improvement: 'Say the disagreement out loud in sentence one.',
    duration: '4:20',
  },
  {
    id: 's-019',
    date: '06.17.23',
    isoDate: '2023-06-17',
    topicAnchor: 'Explaining a delay without over-explaining.',
    keywords: ['new date', 'one cause', 'next check-in'],
    attemptsUsed: 2,
    assistUsed: 'none',
    improvement: 'One cause is enough. Three sounds like an excuse.',
    duration: '3:48',
  },
  {
    id: 's-020',
    date: '06.21.23',
    isoDate: '2023-06-21',
    topicAnchor: 'What I learned from the launch week.',
    keywords: ['one surprise', 'what changed', 'keep doing'],
    attemptsUsed: 2,
    assistUsed: 'partial',
    improvement: 'Replace “many things happened” with one concrete thing.',
    duration: '4:02',
  },
  {
    id: 's-021',
    date: '06.24.23',
    isoDate: '2023-06-24',
    topicAnchor: 'Defining success criteria for our new mobile app.',
    keywords: ['daily active users', 'session duration', 'crash rate'],
    attemptsUsed: 1,
    assistUsed: 'none',
    improvement: 'Name the single primary KPI first.',
    duration: '3:25',
  },
  {
    id: 's-022',
    date: '06.26.23',
    isoDate: '2023-06-26',
    topicAnchor: 'Our team should ship the smaller version first.',
    keywords: ['smaller version', 'ship earlier', 'real feedback', 'less risk'],
    attemptsUsed: 3,
    assistUsed: 'partial',
    improvement: 'Conclusion first, then exactly one reason.',
    duration: '4:38',
  },
]

export const assistLabel: Record<AssistLevel, string> = {
  none: 'unassisted',
  hint: 'hint used',
  partial: 'partial example',
  full: 'full version',
}
