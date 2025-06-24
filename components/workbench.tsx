'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { debounce } from 'lodash'
import dynamic from 'next/dynamic'
import { notFound } from 'next/navigation'
import React, {
  useEffect,
  useState,
  unstable_ViewTransition as ViewTransition,
  useRef,
  useMemo,
  useCallback,
} from 'react'
import { useHotkeys } from 'react-hotkeys-hook'
import { toast } from 'sonner'
import { updateResume, getResumeById } from '@/app/dashboard/actions'
import { ResumeModel } from '@/lib/db/schema'
import { MonacoEditor } from '@/lib/monaco/types'
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
    loading: () => (
      <div className="flex h-full w-full items-center justify-center">
        Loading...
      </div>
    ),
  },
)

export const PREVIEW_CLASS = 'preview-panel'

export function getResumeQueryKey(id: string) {
  return ['resumes', id]
}

export function Workbench({ id }: { id: string }) {
  const [editor, setEditor] = useState<MonacoEditor | null>(null)
  const sidebar = useAppStore((state) => state.sidebar)

  const queryKey = getResumeQueryKey(id)
  const queryClient = useQueryClient()

  const { data: resume } = useQuery({
    queryKey,
    queryFn: () => getResumeById(id),
  })

  const { mutateAsync } = useMutation({
    mutationFn: (content: string) => updateResume(id, { content }),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey })
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey })
      localStorage.removeItem(id)
    },
    onError: (error) => {
      console.error(error)
      toast.error('Failed to save resume')
    },
  })

  const debouncedMutateAsync = useMemo(
    () => debounce(mutateAsync, 3000),
    [mutateAsync],
  )

  const save = useCallback(
    (content: string) => {
      localStorage.setItem(
        id,
        JSON.stringify({
          content,
          timestamp: Date.now(),
        }),
      )
      queryClient.setQueryData(queryKey, (prev: ResumeModel) => ({
        ...prev,
        content,
      }))
      debouncedMutateAsync(content)
    },
    [id, queryClient, queryKey, debouncedMutateAsync],
  )

  const handleOnMountEditor = (editor: MonacoEditor) => {
    setEditor(editor)
    const onChange = editor.onDidChangeModelContent(() => {
      save(editor.getValue())
    })
    editor.onDidDispose(() => {
      setEditor(null)
      onChange.dispose()
    })
  }

  // Disable browser's save hotkey
  useHotkeys('meta+s, ctrl+s', () => {}, {
    preventDefault: true,
    enableOnFormTags: ['input', 'textarea', 'select'],
  })

  useEffect(() => {
    if (!editor || !resume?.updatedAt) return

    // Restore unsaved changes from local storage
    const unsaved = localStorage.getItem(id)
    if (unsaved) {
      try {
        const { content, timestamp } = JSON.parse(unsaved)
        if (timestamp > new Date(resume.updatedAt).getTime()) {
          editor.setValue(content)
        }
      } catch {
        localStorage.removeItem(id)
      }
    }
  }, [editor, id, resume?.updatedAt])

  useEffect(() => {
    return () => {
      debouncedMutateAsync.cancel()
    }
  }, [debouncedMutateAsync])

  if (!resume) return notFound()

  return (
    <div className="h-full px-6 pb-6 pt-px">
      <ResizablePanelGroup direction="horizontal" className="rounded outline">
        <ResizablePanel
          minSize={30}
          defaultSize={50}
          className="bg-secondary @container"
        >
          <PreviewWrapper editor={editor}>
            <PreviewWithViewTransition
              resumeId={resume.id}
              content={resume.content}
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
            <ChatContainer resumeId={resume.id} />
          ) : (
            <Editor
              defaultValue={resume.content}
              onMount={handleOnMountEditor}
            />
          )}
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  )
}

function PreviewWrapper({
  children,
  editor,
}: {
  children: React.ReactNode
  editor: MonacoEditor | null
}) {
  const ref = useRef<HTMLDivElement>(null)

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
