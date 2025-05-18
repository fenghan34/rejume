'use client'

import { UIMessage } from 'ai'
import { useEffect, useState } from 'react'
import { ChatModel } from '@/lib/db/schema'
import { generateUUID } from '@/lib/utils'
import { Chat } from './chat'

export function ChatContainer({
  resumeId,
  chats,
}: {
  resumeId: string
  chats: ChatModel[]
}) {
  const [initialMessages, setInitialMessages] = useState<UIMessage[]>([])

  // Not support multiple chats yet
  const chatId = chats[0]?.id || generateUUID()

  useEffect(() => {
    const fetchMessages = async () => {
      const response = await fetch(`/api/chat?id=${chatId}`)
      const data = await response.json()
      setInitialMessages(data)
    }
    fetchMessages()
  }, [chatId])

  return (
    <div className="h-full">
      <Chat id={chatId} resumeId={resumeId} initialMessages={initialMessages} />
    </div>
  )
}
