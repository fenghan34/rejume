'use client'

import dynamic from 'next/dynamic'
import { useHotkeys } from 'react-hotkeys-hook'
import { useShallow } from 'zustand/react/shallow'
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from '@/components/ui/resizable'
import { useAppStore } from '@/providers/app'
import { Chatbot } from './chatbot'
import { Toolbar } from './toolbar'

const Editor = dynamic(
  () => import('@/components/editor').then(({ Editor }) => Editor),
  { ssr: false },
)

export function WorkBenchPanel() {
  const [chatbotPanel, toggleChatbotPanel] = useAppStore(
    useShallow((state) => [state.chatbotPanel, state.toggleChatbotPanel]),
  )

  useHotkeys('meta+l', () => toggleChatbotPanel(), {
    preventDefault: true,
    enableOnFormTags: ['input', 'textarea', 'select'],
  })

  return (
    <ResizablePanel minSize={30} className="flex flex-col">
      <Toolbar />

      <ResizablePanelGroup className="flex-1" direction="horizontal">
        <ResizablePanel id="editor" order={1}>
          <Editor />
        </ResizablePanel>

        {chatbotPanel && (
          <>
            <ResizableHandle />
            <ResizablePanel
              id="chatbot"
              order={2}
              minSize={30}
              maxSize={70}
              defaultSize={70}
              onResize={(size) => {
                if (size === 0 && chatbotPanel) {
                  toggleChatbotPanel()
                }
              }}
            >
              <Chatbot resourceId="weather-chat" threadId="default" />
            </ResizablePanel>
          </>
        )}
      </ResizablePanelGroup>
    </ResizablePanel>
  )
}
