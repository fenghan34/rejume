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
import { useResume } from '@/providers/resume'
import { Chat } from './chat'
import { Toolbar } from './toolbar'

const Editor = dynamic(
  () => import('@/components/editor').then(({ Editor }) => Editor),
  { ssr: false },
)

export function WorkBenchPanel() {
  const [chatPanel, toggleChatPanel] = useAppStore(
    useShallow((state) => [state.chatPanel, state.toggleChatPanel]),
  )

  useHotkeys('meta+l', () => toggleChatPanel(), {
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

        {chatPanel && (
          <>
            <ResizableHandle />
            <ResizablePanel
              id="chatbot"
              order={2}
              minSize={30}
              maxSize={70}
              defaultSize={50}
              onResize={(size) => {
                if (size === 0 && chatPanel) {
                  toggleChatPanel()
                }
              }}
            >
              <ResumeChat />
            </ResizablePanel>
          </>
        )}
      </ResizablePanelGroup>
    </ResizablePanel>
  )
}

const ResumeChat = () => {
  const resumeId = useResume().id
  return <Chat resourceId={resumeId} threadId={resumeId} />
}
