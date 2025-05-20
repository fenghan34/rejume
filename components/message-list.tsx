'use client'

import { UseChatHelpers } from '@ai-sdk/react'
import { UIMessage } from 'ai'
import { useRef, useLayoutEffect, useCallback } from 'react'
import { Message, PendingMessage } from './message'

const PADDING = 24

export function MessageList({
  messages,
  status,
}: {
  messages: UIMessage[]
  status: UseChatHelpers['status']
}) {
  const mountedRef = useRef(false)
  const ref = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    // Scroll to the bottom when the messages are loaded for the first time
    if (messages.length && !mountedRef.current) {
      ref.current?.scrollTo({
        top: ref.current?.scrollHeight,
      })
      mountedRef.current = true
    }
  }, [messages])

  const computeMinHeight = useCallback((role: UIMessage['role']) => {
    if (!mountedRef.current || !ref.current || role !== 'assistant') {
      return 0
    }

    return ref.current.clientHeight - PADDING * 2
  }, [])

  return (
    <div
      ref={ref}
      className="flex-1 overflow-y-auto scrollbar-gutter-stable scrollbar-primary will-change-scroll"
    >
      <div
        className="max-w-3xl mx-auto box-content space-y-6"
        style={{
          padding: `${PADDING}px ${PADDING}px 0 ${PADDING}px`,
        }}
      >
        {messages.map((message, index) => {
          const isLast = index === messages.length - 1
          return (
            <Message
              key={message.id}
              message={message}
              scrollPadding={isLast ? computeMinHeight(message.role) : 0}
              shouldScrollToTop={
                isLast && message.role === 'user' && status === 'submitted'
              }
            />
          )
        })}

        {status === 'submitted' &&
          messages.length > 0 &&
          messages[messages.length - 1].role === 'user' && (
            <PendingMessage minHeight={computeMinHeight('assistant')} />
          )}
      </div>
    </div>
  )
}
