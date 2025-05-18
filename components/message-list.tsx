'use client'

import { UIMessage } from 'ai'
import { useRef, useEffect } from 'react'
import { Message } from './message'

export function MessageList({ messages }: { messages: UIMessage[] }) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (ref.current) {
      ref.current.scrollTo({ top: ref.current.scrollHeight })
    }
  }, [messages])

  return (
    <div
      ref={ref}
      className="flex-1 overflow-y-auto scrollbar-primary will-change-scroll"
    >
      <div className="max-w-[65ch] mx-auto space-y-8 p-6">
        {messages.map((message) => (
          <Message key={message.id} message={message} />
        ))}
      </div>
    </div>
  )
}
