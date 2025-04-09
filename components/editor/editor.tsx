import type { Monaco, IMonacoEditor, IRange } from './types'
import type { OnMount } from '@monaco-editor/react'
import type { Ref } from 'react'
import MonacoEditor from '@monaco-editor/react'
import { useTheme } from 'next-themes'
import { useCallback, useImperativeHandle, useRef } from 'react'
import { useShallow } from 'zustand/react/shallow'
import { useAppStore } from '@/providers/app'
import { setUpSpellcheck } from './spellcheck'
import { setUpAssistant } from './writing-assistant'

export type EditorRef = {
  selectRange: (range: IRange) => void
}

export function Editor({ ref }: { ref: Ref<EditorRef> }) {
  const editorRef = useRef<IMonacoEditor>(null)
  const monacoRef = useRef<Monaco>(null)
  const { theme } = useTheme()
  const { content, updateResume } = useAppStore(
    useShallow((state) => ({
      content: state.resume.content,
      updateResume: state.updateResume,
    })),
  )

  useImperativeHandle(
    ref,
    () => ({
      selectRange: (range: IRange) => {
        editorRef.current?.revealRangeInCenter(range)
        editorRef.current?.setSelection(range)
      },
    }),
    [],
  )

  const handleOnMount = useCallback<OnMount>((editor, monaco) => {
    editorRef.current = editor
    monacoRef.current = monaco

    setUpSpellcheck(editor, monaco, { lang: 'en_us' })
    setUpAssistant(editor, monaco)
  }, [])

  return (
    <MonacoEditor
      value={content}
      language="markdown"
      theme={theme === 'light' ? 'vs' : 'vs-dark'}
      onMount={handleOnMount}
      onChange={(value) => updateResume({ content: value || '' })}
      options={{
        fontSize: 15,
        wordWrap: 'on',
        padding: { top: 20, bottom: 200 },
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
