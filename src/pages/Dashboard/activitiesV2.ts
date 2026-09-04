import { BrainIcon, ListNumbersIcon, PersonSimpleRunIcon } from '@/components/atoms/Icon'
import type { ActivityV2 } from './ActivityCardV2'

/** Same three activities/ids/startPaths `DashboardPage`'s own `PENDING_ACTIVITIES` and
 * `FullCheckInCard`'s own `CATEGORIES` use, merged into one list — `FullCheckInCardV2` renders
 * both the hero header and the per-activity row itself (the Figma mock nests them in one shared
 * card), so it needs each activity's icon, duration, and description together rather than split
 * across two components. Kept in its own module (rather than alongside `FullCheckInCardV2`
 * itself) purely so both it and `DashboardPageV2` can import `TOTAL_ACTIVITY_COUNT` from a
 * file that only exports plain values, not components. */
export const ACTIVITIES_META: ReadonlyArray<Omit<ActivityV2, 'status'>> = [
  {
    id: 'memory-recall',
    title: 'Memory & Thinking',
    Icon: BrainIcon,
    duration: 'About 7–10 minutes',
    requirement: 'Needs quiet room',
    description:
      'Tasks that look at your brain abilities: memory, attention, language and thinking.',
    startPath: '/assessment/start',
    completedActionLabel: 'Details',
    completedActionVariant: 'tertiary',
  },
  {
    id: 'speech-pattern',
    title: 'Lifestyle',
    Icon: PersonSimpleRunIcon,
    duration: 'About 5 minutes',
    description: 'Tell us about your lifestyle, health, and everyday habits.',
    startPath: '/assessment/lifestyle',
    completedActionLabel: 'Restart',
    completedActionVariant: 'secondary',
  },
  {
    id: 'visual-attention',
    title: 'Priorities',
    Icon: ListNumbersIcon,
    duration: 'About 7 minutes',
    description: 'Share what matters most to you and what you want to keep doing in daily life.',
    startPath: '/assessment/priorities',
    completedActionLabel: 'Restart',
    completedActionVariant: 'secondary',
  },
]

/** `ReportCTACard` needs this same total to know when "every activity is done". */
export const TOTAL_ACTIVITY_COUNT = ACTIVITIES_META.length
