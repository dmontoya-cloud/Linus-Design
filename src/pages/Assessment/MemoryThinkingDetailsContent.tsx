import {
  CalendarIcon,
  HouseIcon,
  InfoIcon,
  PencilSlashIcon,
  SpeakerHighIcon,
} from '@/components/atoms/Icon'
import { Tooltip } from '@/components/atoms/Tooltip'
import styles from './ActivityDetailsPage.module.css'

const INSTRUCTIONS = [
  {
    Icon: HouseIcon,
    title: "Make sure you're in a quiet room.",
  },
  {
    Icon: SpeakerHighIcon,
    title: 'Turn up your volume or use headphones.',
  },
  {
    Icon: PencilSlashIcon,
    title: 'Please do not write anything down.',
    content: 'These tasks measure what you can remember on your own.',
  },
  {
    Icon: CalendarIcon,
    title: 'Only take this once every three months',
    content:
      'Repeating it sooner means you may learn the tasks. That makes your results less accurate.',
  },
]

const TASKS = [
  {
    name: 'Immediate Recall',
    description: 'You will hear 6 words and repeat as many as you can. This will happen 2 times.',
  },
  {
    name: 'Number Backwards Recall',
    description: 'You will hear numbers and repeat them in reverse. This will happen 3 times.',
  },
  {
    name: 'Category Fluency',
    description: 'You will name as many items as you can in a given category within 1 minute.',
  },
  {
    name: 'Delayed Recall',
    description: 'You will recall as many of the original 6 words as you can.',
  },
  {
    name: 'Delayed Recognition',
    description: 'You will pick the original words from a longer list.',
  },
]

/**
 * The instructions row and task list shown on `MemoryThinkingDetailsPage` (the details screen
 * reached from Dashboard's "Start") — split out into its own component since Dashboard's
 * `ActivityCard` briefly rendered this same content in a Details modal; that modal (and its
 * Details button) has since been removed, but the split stayed since it keeps
 * `MemoryThinkingDetailsPage` itself focused on layout. Reuses `ActivityDetailsPage.module.css`,
 * the styling shared with every other activity's details screen (see `LifestyleDetailsPage`),
 * rather than duplicating it.
 */
export function MemoryThinkingDetailsContent() {
  return (
    <>
      <div className={styles.instructions}>
        {INSTRUCTIONS.map(({ Icon, title, content }) => (
          <div key={title} className={styles.instructionItem}>
            <Icon className={styles.instructionIcon} />
            <p className={styles.instructionTitle}>
              {title}
              {content ? (
                <Tooltip content={content}>
                  <InfoIcon className={styles.instructionInfoIcon} />
                </Tooltip>
              ) : null}
            </p>
          </div>
        ))}
      </div>
      <hr className={styles.divider} />
      <p className={styles.taskIntro}>
        There are 5 tasks in this activity. Some tasks will ask you to listen and speak out loud.
      </p>
      <ol className={styles.taskList}>
        {TASKS.map((task, index) => (
          <li key={task.name} className={styles.taskItem}>
            <span className={styles.taskNumber} aria-hidden="true">
              {index + 1}
            </span>
            <div>
              <p className={styles.taskName}>{task.name}</p>
              <p className={styles.taskDescription}>{task.description}</p>
            </div>
          </li>
        ))}
      </ol>
    </>
  )
}
