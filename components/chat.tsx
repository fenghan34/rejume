'use client'

import { useChat } from '@ai-sdk/react'
import { UIMessage } from 'ai'
import React from 'react'
import { toast } from 'sonner'
import { useSWRConfig } from 'swr'
import { generateUUID } from '@/lib/utils'
import { getChatHistoryKey } from './chat-container'
import { ChatGreeting, QuickActions } from './chat-greeting'
import { MessageInput } from './message-input'
import { MessageList } from './message-list'

export function Chat({
  id,
  resumeId,
  initialMessages,
  showGreeting,
}: {
  id: string
  resumeId: string
  showGreeting: boolean
  initialMessages?: UIMessage[]
}) {
  const { mutate } = useSWRConfig()

  const {
    messages,
    input,
    status,
    append,
    stop,
    setInput,
    handleInputChange,
    handleSubmit,
  } = useChat({
    id,
    initialMessages,
    sendExtraMessageFields: true,
    generateId: generateUUID,
    experimental_prepareRequestBody: ({ messages }) => {
      return {
        id,
        resumeId,
        message: messages[messages.length - 1],
      }
    },
    onFinish: () => {
      if (messages.length === 0) {
        mutate(getChatHistoryKey(resumeId))
      }
    },
    onError(error) {
      console.log(error)
      toast.error(
        error.message || 'Something went wrong, please try again later.',
      )
    },
  })

  return (
    <div className="h-full flex flex-col @container/chat relative">
      {showGreeting && messages.length === 0 ? (
        <ChatGreeting>
          <QuickActions appendMessage={append} setInput={setInput} />
        </ChatGreeting>
      ) : (
        <MessageList messages={messages} status={status} />
      )}
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
