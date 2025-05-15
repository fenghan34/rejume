'use client'

import { UIMessage } from 'ai'
import { useEffect, useState } from 'react'
import { useHotkeys } from 'react-hotkeys-hook'
import { PanelProps } from 'react-resizable-panels'
import { useShallow } from 'zustand/react/shallow'
import { ResizablePanel, ResizableHandle } from '@/components/ui/resizable'
import { ChatSchema } from '@/lib/db/schema'
import { generateUUID } from '@/lib/utils'
import { useAppStore } from '@/providers/app'
import { Chat } from './chat'

export function ChatPanel({
  id,
  order,
  resumeId,
  chats,
}: Pick<PanelProps, 'id' | 'order'> & {
  resumeId: string
  chats: ChatSchema[]
}) {
  const [initialMessages, setInitialMessages] = useState<UIMessage[]>([])
  const [chatPanel, toggleChatPanel] = useAppStore(
    useShallow((state) => [state.chatPanel, state.toggleChatPanel]),
  )

  useHotkeys('meta+l', () => toggleChatPanel(), {
    preventDefault: true,
    enableOnFormTags: ['input', 'textarea', 'select'],
  })

  const chatId = chats[0]?.id || generateUUID()

  useEffect(() => {
    const fetchMessages = async () => {
      const response = await fetch(`/api/chat?id=${chatId}`)
      const data = await response.json()
      setInitialMessages(data)
    }
    fetchMessages()
  }, [chatId])

  if (!chatPanel) return null

  return (
    <>
      <ResizableHandle />
      <ResizablePanel
        className="relative"
        id={id}
        order={order}
        minSize={30}
        maxSize={70}
        defaultSize={50}
        onResize={(size) => {
          if (size === 0 && chatPanel) {
            toggleChatPanel()
          }
        }}
      >
        <Chat
          id={chatId}
          resumeId={resumeId}
          initialMessages={initialMessages}
        />
      </ResizablePanel>
    </>
  )
}
