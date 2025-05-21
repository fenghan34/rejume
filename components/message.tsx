import type { UIMessage } from 'ai'
import { isEqual } from 'lodash'
import { motion } from 'motion/react'
import React, { useEffect, useRef, memo } from 'react'
import { cn } from '@/lib/utils'
import { Markdown } from './markdown'
import { MessageActions } from './message-actions'

function PureMessage({
  message,
  loading,
  scrollPadding = 0,
  shouldScrollToTop = false,
}: {
  message: UIMessage
  loading: boolean
  scrollPadding?: number
  shouldScrollToTop?: boolean
}) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const element = ref.current
    if (!element || scrollPadding === 0) return

    const previousSibling = element.previousElementSibling
    if (previousSibling && !element.nextSibling) {
      const minHeight = `${scrollPadding - previousSibling.clientHeight}px`
      element.style.minHeight = minHeight
    }

    return () => {
      if (element) {
        element.style.minHeight = 'auto'
      }
    }
  }, [scrollPadding])

  useEffect(() => {
    if (shouldScrollToTop) {
      ref.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }, [shouldScrollToTop])

  return (
    <motion.div
      ref={ref}
      data-role={message.role}
      initial={{ y: 5, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="group/message space-y-1"
    >
      <div className="flex group-data-[role=user]/message:justify-end group-data-[role=assistant]/message:justify-start">
        {message.parts.map((part, i) => {
          switch (part.type) {
            case 'text':
              return (
                <div
                  key={`${message.id}-${part.type}-${i}`}
                  className={cn(
                    'h-fit prose prose-sm @4xl/chat:prose-base dark:prose-invert max-w-none break-words overflow-x-hidden',
                    message.role === 'user' &&
                      'bg-primary text-primary-foreground max-w-[80%] rounded-xl px-3 py-2',
                  )}
                >
                  <Markdown>{part.text}</Markdown>
                </div>
              )
          }
        })}
      </div>

      <MessageActions message={message} loading={loading} />
    </motion.div>
  )
}

export const Message = memo(PureMessage, (prev, next) => {
  if (prev.loading !== next.loading) return false
  if (prev.message.id !== next.message.id) return false
  if (prev.scrollPadding !== next.scrollPadding) return false
  if (prev.shouldScrollToTop !== next.shouldScrollToTop) return false
  if (!isEqual(prev.message.parts, next.message.parts)) return false

  return true
})

export function PendingMessage({ minHeight }: { minHeight: number }) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (ref.current) {
      const previousSibling = ref.current.previousElementSibling!
      ref.current.style.minHeight = `${minHeight - previousSibling.clientHeight}px`
    }
  }, [minHeight])

  return (
    <motion.div
      ref={ref}
      initial={{ y: 5, opacity: 0 }}
      animate={{ y: 0, opacity: 1, transition: { delay: 0.5 } }}
    >
      <motion.div
        className="w-3 h-3 rounded-full bg-primary"
        initial={{ scale: 0.9 }}
        animate={{
          scale: 1.1,
          transition: {
            repeat: Infinity,
            repeatType: 'reverse',
            duration: 0.7,
          },
        }}
      />
    </motion.div>
  )
}
