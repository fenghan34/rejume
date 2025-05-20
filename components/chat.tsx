'use client'

import { useChat } from '@ai-sdk/react'
import { UIMessage } from 'ai'
import { toast } from 'sonner'
import { generateUUID } from '@/lib/utils'
import { MessageInput } from './message-input'
import { MessageList } from './message-list'

export function Chat({
  id,
  resumeId,
  initialMessages,
}: {
  id: string
  resumeId: string
  initialMessages?: UIMessage[]
}) {
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

  return (
    <div className="h-full flex flex-col @container/chat">
      <MessageList messages={messages} status={status} />
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
