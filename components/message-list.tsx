'use client'

import { UseChatHelpers } from '@ai-sdk/react'
import { UIMessage } from 'ai'
import { isEqual } from 'lodash'
import { ArrowDown } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import React, {
  useRef,
  useLayoutEffect,
  useCallback,
  memo,
  useState,
} from 'react'
import { Message, PendingMessage } from './message'
import { Button } from './ui/button'

const PADDING = 4 * 6

function PureMessageList({
  messages,
  status,
}: {
  messages: UIMessage[]
  status: UseChatHelpers['status']
}) {
  const mountedRef = useRef(false)
  const ref = useRef<HTMLDivElement>(null)
  const [isAtBottom, setIsAtBottom] = useState(true)

  useLayoutEffect(() => {
    // Scroll to the bottom when the messages are loaded for the first time
    if (messages.length && !mountedRef.current) {
      ref.current?.scrollTo({
        top: ref.current?.scrollHeight,
      })
      mountedRef.current = true
    }
  }, [messages])

  const computeScrollPadding = useCallback((role: UIMessage['role']) => {
    if (
      !mountedRef.current ||
      !ref.current ||
      ref.current.scrollHeight <= ref.current.clientHeight ||
      role !== 'assistant'
    ) {
      return 0
    }
    return ref.current.clientHeight - PADDING * 3
  }, [])

  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    if (!(e.target instanceof HTMLDivElement)) return
    const { scrollHeight, scrollTop, clientHeight } = e.target
    setIsAtBottom(scrollHeight - scrollTop - clientHeight < PADDING * 3)
  }, [])

  return (
    <div
      ref={ref}
      className="flex-1 overflow-y-auto scrollbar-gutter-stable scrollbar-primary will-change-scroll"
      onScroll={handleScroll}
    >
      <div className="max-w-3xl mx-auto box-content p-6 pb-12 space-y-2">
        {messages.map((message, index) => {
          const isLast = index === messages.length - 1
          return (
            <Message
              key={message.id}
              message={message}
              loading={status === 'streaming' && isLast}
              scrollPadding={isLast ? computeScrollPadding(message.role) : 0}
              shouldScrollToTop={
                isLast && message.role === 'user' && status === 'submitted'
              }
            />
          )
        })}

        {status === 'submitted' &&
          messages.length > 0 &&
          messages[messages.length - 1].role === 'user' && (
            <PendingMessage minHeight={computeScrollPadding('assistant')} />
          )}
      </div>

      <AnimatePresence>
        {!isAtBottom && (
          <ScrollToBottomButton
            onClick={() => {
              ref.current?.scrollTo({
                top: ref.current?.scrollHeight,
                behavior: 'smooth',
              })
            }}
          />
        )}
      </AnimatePresence>
    </div>
  )
}

function ScrollToBottomButton({ onClick }: { onClick: () => void }) {
  return (
    <motion.div
      className="absolute bottom-35 left-0 right-0 text-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2 }}
      exit={{ opacity: 0 }}
    >
      <Button
        variant="outline"
        className="rounded-full size-8 cursor-pointer dark:bg-background dark:hover:bg-accent"
        onClick={onClick}
      >
        <ArrowDown />
      </Button>
    </motion.div>
  )
}

export const MessageList = memo(PureMessageList, (prev, next) => {
  if (prev.status !== next.status) return false
  if (!isEqual(prev.messages, next.messages)) return false

  return true
})
