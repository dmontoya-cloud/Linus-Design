import { useId, useState, type FormEvent } from 'react'
import { BrainIcon, ChatCircleIcon, UserIcon, XIcon } from '@/components/atoms/Icon'
import styles from './ChatWidget.module.css'

interface ChatMessage {
  id: string
  author: 'assistant' | 'visitor'
  text: string
  timestamp: string
}

const INITIAL_MESSAGE: ChatMessage = {
  id: 'greeting',
  author: 'assistant',
  text: 'Hi, how can I help you today?',
  timestamp: 'Just now',
}

/**
 * Global Help Assistant launcher — a circular toggle button, fixed in the same bottom-right
 * spot whether open or closed, styled after the reference screenshots (dark teal header, light
 * gray message bubbles, pill-shaped input). The button itself doubles as open/close control: a
 * chat bubble icon when closed, morphing into an X once the conversation panel is open, which
 * renders directly above the button rather than replacing it — the same pattern as Intercom/
 * Drift-style launchers, on request. Aesthetic only: the visitor can open/close it and type into
 * the input, but there's no real assistant behind it — submitting just echoes the visitor's own
 * message back into the thread rather than calling any backend. Mounted once at the app root
 * (see `App.tsx`'s `ChatWidgetGate`) and hidden on the assessment routes, on request, so it
 * never floats over an in-progress cognitive task.
 */
export function ChatWidget() {
  const [open, setOpen] = useState(false)
  const [teaserDismissed, setTeaserDismissed] = useState(false)
  const [draft, setDraft] = useState('')
  const [messages, setMessages] = useState<ChatMessage[]>([INITIAL_MESSAGE])
  const titleId = useId()

  function handleSubmit(event: FormEvent) {
    event.preventDefault()
    const text = draft.trim()
    if (!text) return
    setMessages((prev) => [
      ...prev,
      { id: `visitor-${prev.length}`, author: 'visitor', text, timestamp: 'Just now' },
    ])
    setDraft('')
  }

  return (
    <div className={styles.widget}>
      {open && (
        <section className={styles.panel} role="dialog" aria-labelledby={titleId}>
          <header className={styles.header}>
            <BrainIcon className={styles.headerIcon} />
            <h2 className={styles.headerTitle} id={titleId}>
              Help Assistant
            </h2>
          </header>

          <div className={styles.body}>
            <p className={styles.sessionTime}>11:35 AM</p>
            <ul className={styles.messageList}>
              {messages.map((message) => (
                <li
                  key={message.id}
                  className={[
                    styles.messageRow,
                    message.author === 'visitor' ? styles.fromVisitor : '',
                  ].join(' ')}
                >
                  {message.author === 'assistant' && (
                    <span className={styles.avatar}>
                      <UserIcon className={styles.avatarIcon} />
                    </span>
                  )}
                  <div className={styles.messageContent}>
                    <span className={styles.messageAuthor}>
                      {message.author === 'assistant' ? 'Help Assistant' : 'You'}
                    </span>
                    <p className={styles.messageBubble}>{message.text}</p>
                    <span className={styles.messageTimestamp}>{message.timestamp}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <form className={styles.inputBar} onSubmit={handleSubmit}>
            <input
              type="text"
              className={styles.input}
              placeholder="Type a message"
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              aria-label="Type a message"
            />
          </form>
        </section>
      )}

      {!open && !teaserDismissed && (
        <div className={styles.teaser} role="status">
          <button
            type="button"
            className={styles.teaserDismiss}
            aria-label="Dismiss message"
            onClick={() => setTeaserDismissed(true)}
          >
            <XIcon className={styles.teaserDismissIcon} />
          </button>
          <p className={styles.teaserText}>Hi. Need any help?</p>
        </div>
      )}

      <button
        type="button"
        className={styles.launcherButton}
        aria-label={open ? 'Close Help Assistant' : 'Open Help Assistant'}
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
      >
        {open ? (
          <XIcon className={styles.launcherIcon} />
        ) : (
          <ChatCircleIcon className={styles.launcherIcon} />
        )}
      </button>
    </div>
  )
}
