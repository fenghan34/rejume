import type { UIMessage } from 'ai'
import { motion } from 'motion/react'
import React, { useEffect, useRef } from 'react'
import { cn } from '@/lib/utils'
import { Markdown } from './markdown'

export function Message({
  message,
  scrollPadding = 0,
  shouldScrollToTop,
}: {
  message: UIMessage
  scrollPadding?: number
  shouldScrollToTop?: boolean
}) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const element = ref.current

    if (element) {
      const previousSibling = element.previousElementSibling
      if (previousSibling && !element.nextSibling) {
        const minHeight = `${scrollPadding - previousSibling.clientHeight}px`
        element.style.minHeight = minHeight
      }
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
      className={cn(
        'flex',
        message.role === 'user' ? 'justify-end' : 'justify-start',
      )}
    >
      {message.parts.map((part, i) => {
        switch (part.type) {
          case 'text':
            return (
              <div
                key={`${message.id}-${part.type}-${i}`}
                className={cn(
                  'h-fit prose prose-sm @4xl/chat:prose-base dark:prose-invert max-w-none break-words overflow-x-hidden',
                  message.role === 'user' &&
                    'bg-black/10 dark:bg-white/10 max-w-[80%] rounded-xl px-3 py-2',
                )}
              >
                <Markdown>{part.text}</Markdown>
              </div>
            )
        }
      })}
    </motion.div>
  )
}

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
      ></motion.div>
    </motion.div>
  )
}
