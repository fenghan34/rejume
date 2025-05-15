'use client'

import { useChat } from '@ai-sdk/react'
import { UIMessage } from 'ai'
import { useEffect, useRef } from 'react'
import { toast } from 'sonner'
import { generateUUID } from '@/lib/utils'
import { Message } from './message'
import { MessageInput } from './message-input'

export function Chat({
  id,
  resumeId,
  initialMessages,
}: {
  id: string
  resumeId: string
  initialMessages?: UIMessage[]
}) {
  const ref = useRef<HTMLDivElement>(null)
  const { messages, input, status, stop, handleInputChange, handleSubmit } =
    useChat({
      id,
      initialMessages,
      // maxSteps: 10,
      sendExtraMessageFields: true,
      generateId: generateUUID,
      experimental_prepareRequestBody: ({ messages }) => {
        return {
          id,
          resumeId,
          message: messages[messages.length - 1],
        }
      },
      onError(error) {
        toast.error(error.message)
      },
    })

  useEffect(() => {
    if (ref.current) {
      ref.current.scrollTo({
        top: ref.current.scrollHeight,
      })
    }
  }, [messages])

  return (
    <div className="bg-background text-primary flex flex-col h-full">
      <div className="flex-1 p-4 space-y-4 overflow-auto" ref={ref}>
        {messages.map((message) => (
          <Message key={message.id} message={message} />
        ))}
      </div>

      <MessageInput
        input={input}
        status={status}
        stop={stop}
        handleInputChange={handleInputChange}
        handleSubmit={handleSubmit}
      />
    </div>
  )
}
