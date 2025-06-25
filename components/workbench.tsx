'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { debounce } from 'lodash'
import { ArrowLeft } from 'lucide-react'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import React, {
  useEffect,
  useState,
  unstable_ViewTransition as ViewTransition,
  useRef,
  useMemo,
  useCallback,
  useOptimistic,
  startTransition,
} from 'react'
import { useHotkeys } from 'react-hotkeys-hook'
import { toast } from 'sonner'
import { updateResume, getResumeById } from '@/app/dashboard/actions'
import { ResumeModel } from '@/lib/db/schema'
import { MonacoEditor } from '@/lib/monaco/types'
import { WorkbenchProvider } from '@/providers/workbench'
import { ChatContainer } from './chat-container'
import { ModeToggle } from './mode-toggle'
import { Preview } from './preview'
import { CurrentResumeTitle } from './resume-title'
import { Toolbar } from './toolbar'
import { Button } from './ui/button'
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from './ui/resizable'
import { UserAvatar } from './user-avatar'

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

export function Workbench({
  id,
  defaultMode,
  setCookie,
}: {
  id: string
  defaultMode?: string
  setCookie: (name: string, value: string) => Promise<void>
}) {
  const [editor, setEditor] = useState<MonacoEditor | null>(null)
  const [mode, setMode] = useOptimistic(
    defaultMode || 'editor',
    (_, optimistic: string) => optimistic,
  )

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

  const handleModeChange = (mode: string) => {
    startTransition(async () => {
      setMode(mode)
      await setCookie('mode', mode)
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
    <WorkbenchProvider
      value={{
        mode,
        editor,
        resume,
        updateResumeContent: (content: string) => {
          if (editor) {
            editor.setValue(content)
          } else {
            save(content)
          }
        },
      }}
    >
      <div className="flex flex-col h-screen">
        <header className="flex items-center justify-between px-6 h-14">
          <div className="flex items-center gap-1">
            <Button variant="ghost" className="size-8" asChild>
              <Link href="/dashboard">
                <ArrowLeft className="size-6" />
              </Link>
            </Button>

            <CurrentResumeTitle />
          </div>

          <div className="flex items-center gap-2">
            <Toolbar
              editor={editor}
              mode={mode}
              handleModeChange={handleModeChange}
            />

            <ModeToggle />

            <UserAvatar />
          </div>
        </header>
        <main className="flex-1 overflow-hidden">
          <div className="h-full px-6 pb-6 pt-px">
            <ResizablePanelGroup
              direction="horizontal"
              className="rounded outline"
            >
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
                {mode === 'chat' ? (
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
        </main>
      </div>
    </WorkbenchProvider>
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
