'use client'

import type { ChatModel, ResumeModel } from '@/lib/db/schema'
import { debounce } from 'lodash'
import dynamic from 'next/dynamic'
import React, {
  useEffect,
  useState,
  // @ts-expect-error ViewTransition is experimental
  unstable_ViewTransition as ViewTransition,
  useRef,
} from 'react'
import { useHotkeys } from 'react-hotkeys-hook'
import { toast } from 'sonner'
import { updateResume } from '@/app/dashboard/actions'
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

export const PREVIEW_CLASS = 'preview-panel'

export function Workbench({
  resume,
  chats,
}: {
  resume: ResumeModel
  chats: ChatModel[]
}) {
  const editor = useAppStore((state) => state.editor)
  const sidebar = useAppStore((state) => state.sidebar)
  const setResume = useAppStore((state) => state.setResume)

  // Disable browser's save hotkey
  useHotkeys('meta+s, ctrl+s', () => {}, {
    preventDefault: true,
    enableOnFormTags: ['input', 'textarea', 'select'],
  })

  useEffect(() => {
    setResume(resume)
  }, [resume, setResume])

  useEffect(() => {
    if (!editor) return

    const save = async (content: string, beforeUnload = false) => {
      try {
        localStorage.setItem(resume.id, content)
        await updateResume(resume.id, { content })

        if (!beforeUnload) {
          localStorage.removeItem(resume.id)
        }
      } catch (error) {
        console.error(error)
        toast.error('Failed to save resume')
      }
    }

    const cache = localStorage.getItem(resume.id)
    if (cache) {
      editor?.setValue(cache)
      save(cache)
    }

    const debouncedSave = debounce(save, 3000)
    const onEditorChange = editor?.onDidChangeModelContent(() => {
      debouncedSave(editor.getValue())
    })

    const beforeUnloadHandler = () => save(editor.getValue(), true)
    window.addEventListener('beforeunload', beforeUnloadHandler)

    return () => {
      onEditorChange?.dispose()
      window.removeEventListener('beforeunload', beforeUnloadHandler)
    }
  }, [editor, resume.id])

  return (
    <ResizablePanelGroup direction="horizontal" className="rounded outline">
      <ResizablePanel
        minSize={30}
        defaultSize={50}
        className="bg-secondary @container"
      >
        <PreviewWrapper>
          <PreviewWithViewTransition
            resumeId={resume.id}
            defaultContent={resume.content}
          />
        </PreviewWrapper>
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
          <Editor defaultValue={resume.content} />
        )}
      </ResizablePanel>
    </ResizablePanelGroup>
  )
}

function PreviewWrapper({ children }: { children: React.ReactNode }) {
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
      className="h-full overflow-y-auto overflow-x-hidden scrollbar-primary scrollbar-gutter-stable will-change-scroll"
    >
      <div className="mx-auto max-w-xl @2xl:max-w-2xl">{children}</div>
    </div>
  )
}

function PreviewWithViewTransition({
  resumeId,
  defaultContent,
}: {
  resumeId: string
  defaultContent: string
}) {
  const [content, setContent] = useState(defaultContent)
  const editor = useAppStore((state) => state.editor)

  useEffect(() => {
    const onEditorChange = editor?.onDidChangeModelContent(() => {
      setContent(editor?.getValue() || '')
    })

    return () => {
      onEditorChange?.dispose()
    }
  }, [editor])

  return (
    <ViewTransition name={`resume-${resumeId}`}>
      <Preview className={PREVIEW_CLASS} content={content} />
    </ViewTransition>
  )
}
