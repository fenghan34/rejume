'use client'

import { debounce } from 'lodash'
import dynamic from 'next/dynamic'
import React, {
  useMemo,
  useEffect,
  // @ts-expect-error ViewTransition is experimental
  unstable_ViewTransition as ViewTransition,
  useRef,
} from 'react'
import { useHotkeys } from 'react-hotkeys-hook'
import { toast } from 'sonner'
import { updateResume } from '@/app/dashboard/actions'
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
  const setResume = useAppStore((state) => state.setResume)

  const debouncedSave = useMemo(
    () =>
      debounce(
        async (content: string) => {
          try {
            setSaveStatus('saving')
            await updateResume(resume.id, { content })
            setSaveStatus('saved')
          } catch (error) {
            console.error(error)
            setSaveStatus('error')
            toast.error('Failed to save resume')
          }
        },
        AUTO_SAVE_DELAY,
        { leading: false },
      ),
    [resume.id, setSaveStatus],
  )

  const handleContentChange = (value = '') => {
    if (value !== editorContent) {
      setEditorContent(value)
      debouncedSave(value)
    }
  }

  useHotkeys('meta+s, ctrl+s', () => debouncedSave(editorContent), {
    preventDefault: true,
    enableOnFormTags: ['input', 'textarea', 'select'],
  })

  useEffect(() => {
    setEditorContent(resume.content)
  }, [resume.content, setEditorContent])

  useEffect(() => {
    setResume(resume)
  }, [resume, setResume])

  return (
    <ResizablePanelGroup direction="horizontal" className="rounded outline">
      <ResizablePanel
        minSize={30}
        defaultSize={50}
        className="bg-secondary @container"
      >
        <PreviewContainer resumeId={resume.id} content={editorContent} />
      </ResizablePanel>

      <ResizableHandle />

      <ResizablePanel
        minSize={30}
        defaultSize={50}
        collapsible
        collapsedSize={5}
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

function PreviewContainer({
  resumeId,
  content,
}: {
  resumeId: string
  content: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  const editor = useAppStore((state) => state.editor)

  useEffect(() => {
    const scrollPreview = () => {
      if (!ref.current || !editor) return
      const height = editor.getLayoutInfo().height
      const scrollTop = editor.getScrollTop()
      const scrollHeight = editor.getScrollHeight()
      const percentage = scrollTop / (scrollHeight - height)

      ref.current.scroll({
        top: percentage * (ref.current.scrollHeight - ref.current.clientHeight),
      })
    }

    editor?.onDidChangeCursorPosition(scrollPreview)
    editor?.onDidScrollChange(scrollPreview)
  }, [editor])

  return (
    <div
      ref={ref}
      className="h-full overflow-y-auto overflow-x-hidden scrollbar-primary scrollbar-gutter-stable"
    >
      <div className="mx-auto max-w-xl @2xl:max-w-2xl">
        <PreviewWithViewTransition resumeId={resumeId} content={content} />
      </div>
    </div>
  )
}

function PreviewWithViewTransition({
  resumeId,
  content,
}: {
  resumeId: string
  content: string
}) {
  return (
    <ViewTransition name={`resume-${resumeId}`}>
      <Preview className={PREVIEW_CLASS} content={content} />
    </ViewTransition>
  )
}
