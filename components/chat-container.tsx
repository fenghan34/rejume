'use client'

import { useQuery, useQueryClient } from '@tanstack/react-query'
import { UIMessage } from 'ai'
import { useState } from 'react'
import { getChatById } from '@/app/dashboard/actions'
import { generateUUID } from '@/lib/utils'
import { Chat } from './chat'
import { ChatHeader } from './chat-header'
import { getChatsQueryKey } from './chat-history'

export function ChatContainer({ resumeId }: { resumeId: string }) {
  const queryClient = useQueryClient()
  const [chatId, setChatId] = useState<string>()

  const { data: chat } = useQuery({
    queryKey: ['chat', chatId],
    queryFn: () => getChatById(chatId!),
    enabled: !!chatId,
  })

  const id = chatId || generateUUID()

  return (
    <div className="h-full flex flex-col">
      <ChatHeader
        resumeId={resumeId}
        currentChat={chat}
        setChatId={setChatId}
      />

      <div className="flex-1 overflow-hidden">
        <Chat
          id={id}
          showGreeting
          resumeId={resumeId}
          initialMessages={chat?.messages as UIMessage[]}
          onFinish={() => {
            if (!chatId) {
              setChatId(id)
              queryClient.invalidateQueries({
                queryKey: getChatsQueryKey(resumeId),
              })
            }
          }}
        />
      </div>
    </div>
  )
}
