'use client'

import type { OnMount } from '@monaco-editor/react'
import CodeEditor from '@monaco-editor/react'
import { throttle } from 'lodash'
import { useTheme } from 'next-themes'
import { useCallback, useEffect, useMemo } from 'react'
import { useHotkeys } from 'react-hotkeys-hook'
import { useShallow } from 'zustand/react/shallow'
import { updateResume } from '@/app/resume/actions'
import { setUpSpellcheck } from '@/lib/editor/spellcheck'
import { setUpAssistant } from '@/lib/editor/writing-assistant'
import { useAppStore } from '@/providers/app'
import { useResume } from '@/providers/resume'

const AUTO_SAVE_DELAY = 3000

export function Editor() {
  const { theme } = useTheme()
  const resume = useResume()
  const [setMonacoEditor, editorContent, setEditorContent, setSaveStatus] =
    useAppStore(
      useShallow((state) => [
        state.setMonacoEditor,
        state.editorContent,
        state.setEditorContent,
        state.setSaveStatus,
      ]),
    )

  const throttledSave = useMemo(
    () =>
      throttle(
        async (content: string) => {
          if (content !== resume.content) {
            try {
              setSaveStatus('saving')
              await updateResume(resume.id, { content })
              setSaveStatus('saved')
            } catch (error) {
              console.error(error)
              setSaveStatus('error')
            }
          }
        },
        AUTO_SAVE_DELAY,
        { leading: false },
      ),
    [resume.content, resume.id, setSaveStatus],
  )

  const handleOnMount = useCallback<OnMount>(
    (editor, monaco) => {
      setMonacoEditor(monaco, editor)
      setUpSpellcheck(editor, monaco, { lang: 'en_us' })
      setUpAssistant(editor, monaco)
    },
    [setMonacoEditor],
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

  useEffect(() => {
    return () => {
      throttledSave.cancel()
    }
  }, [throttledSave])

  return (
    <CodeEditor
      key={resume.id}
      value={editorContent}
      language="markdown"
      theme={theme === 'light' ? 'vs' : 'vs-dark'}
      onMount={handleOnMount}
      onChange={handleContentChange}
      options={{
        fontSize: 15,
        wordWrap: 'on',
        padding: { top: 15, bottom: 200 },
        lineNumbers: 'off',
        automaticLayout: true,
        smoothScrolling: true,
        scrollBeyondLastLine: false,
        scrollbar: {
          useShadows: false,
          verticalScrollbarSize: 8,
          horizontalScrollbarSize: 8,
        },
        minimap: {
          enabled: true,
          autohide: true,
        },
      }}
    />
  )
}
