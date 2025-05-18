'use client'

import { throttle } from 'lodash'
import dynamic from 'next/dynamic'
import { useMemo, useCallback, useEffect } from 'react'
import { useHotkeys } from 'react-hotkeys-hook'
import { toast } from 'sonner'
import { updateResume } from '@/app/resume/actions'
import { ChatModel, ResumeModel } from '@/lib/db/schema'
import { useAppStore } from '@/providers/app'
import { ChatContainer } from './chat-container'
import { Preview } from './preview'
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from './ui/resizable'

const Editor = dynamic(
  () => import('@/components/editor').then((module) => module.Editor),
  {
    ssr: false,
  },
)

const AUTO_SAVE_DELAY = 3000
export const PREVIEW_CLASS = 'preview-panel'

export function Workbench({
  resume,
  chats,
}: {
  resume: ResumeModel
  chats: ChatModel[]
}) {
  const sidebar = useAppStore((state) => state.sidebar)
  const editorContent = useAppStore((state) => state.editorContent)
  const setEditorContent = useAppStore((state) => state.setEditorContent)
  const setSaveStatus = useAppStore((state) => state.setSaveStatus)

  const throttledSave = useMemo(
    () =>
      throttle(
        async (content) => {
          if (content !== resume.content) {
            try {
              setSaveStatus('saving')
              await updateResume(resume.id, { content })
              setSaveStatus('saved')
            } catch (error) {
              console.error(error)
              setSaveStatus('error')
              toast.error('Failed to save resume')
            }
          }
        },
        AUTO_SAVE_DELAY,
        { leading: false },
      ),
    [resume.content, resume.id, setSaveStatus],
  )

  const handleContentChange = useCallback(
    (value?: string) => {
      if (!value) return
      setEditorContent(value)
      throttledSave(value)
    },
    [setEditorContent, throttledSave],
  )

  useHotkeys('meta+s, ctrl+s', () => throttledSave(editorContent), {
    preventDefault: true,
    enableOnFormTags: ['input', 'textarea', 'select'],
  })

  useEffect(() => {
    setEditorContent(resume.content)
  }, [resume.content, setEditorContent])

  return (
    <ResizablePanelGroup direction="horizontal" className="rounded outline">
      <ResizablePanel minSize={30} defaultSize={50} className="@container ">
        <div className="bg-secondary h-full">
          <div className="h-full overflow-y-auto overflow-x-hidden scrollbar-primary">
            <div className="mx-auto max-w-xl @4xl:max-w-2xl">
              <Preview className={PREVIEW_CLASS} content={editorContent} />
            </div>
          </div>
        </div>
      </ResizablePanel>

      <ResizableHandle />

      <ResizablePanel
        minSize={30}
        defaultSize={50}
        collapsible
        collapsedSize={5}
        className="bg-sidebar"
      >
        {sidebar === 'chat' ? (
          <ChatContainer resumeId={resume.id} chats={chats} />
        ) : (
          <Editor value={editorContent} onChange={handleContentChange} />
        )}
      </ResizablePanel>
    </ResizablePanelGroup>
  )
}
