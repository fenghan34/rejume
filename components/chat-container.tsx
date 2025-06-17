'use client'

import type { ChatModel } from '@/lib/db/schema'
import type { UIMessage } from 'ai'
import { useState } from 'react'
import { toast } from 'sonner'
import useSWR, { useSWRConfig } from 'swr'
import { deleteChat } from '@/app/dashboard/actions'
import { generateUUID } from '@/lib/utils'
import { Chat } from './chat'
import { ChatHeader } from './chat-header'
import { ChatHistory } from './chat-history'

export function getChatHistoryKey(resumeId: string) {
  return `/api/chat-history?resumeId=${resumeId}`
}

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export function ChatContainer({ resumeId }: { resumeId: string }) {
  const key = getChatHistoryKey(resumeId)
  const [currentChat, setCurrentChat] = useState<ChatModel | null>(null)
  const { mutate } = useSWRConfig()
  const { data: chats, isLoading } = useSWR<ChatModel[]>(key, fetcher, {
    onSuccess: (data) => {
      if (data.length > 0) {
        setCurrentChat(data[0])
      } else {
        setCurrentChat(null)
      }
    },
  })

  const { data: initialMessages } = useSWR<UIMessage[]>(() => {
    if (!currentChat?.id) return null
    return `/api/chat?id=${currentChat.id}`
  }, fetcher)

  const handleDeleteChat = async (chat: ChatModel) => {
    try {
      mutate(key, () => deleteChat(chat.id), {
        optimisticData: chats?.filter(({ id }) => id !== chat.id),
        rollbackOnError: true,
      })
    } catch (error) {
      console.error(error)
      toast.error('Failed to delete chat, please try again.')
    }
  }

  return (
    <div className="h-full flex flex-col">
      <ChatHeader chat={currentChat} setChat={setCurrentChat}>
        <ChatHistory
          chats={chats}
          currentChat={currentChat}
          onSelectChat={setCurrentChat}
          onDeleteChat={handleDeleteChat}
        />
      </ChatHeader>

      <div className="flex-1 overflow-hidden">
        <Chat
          id={currentChat?.id || generateUUID()}
          showGreeting={!currentChat && !isLoading}
          resumeId={resumeId}
          initialMessages={initialMessages}
        />
      </div>
    </div>
  )
}
