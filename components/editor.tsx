'use client'

import type { EditorProps, OnMount } from '@monaco-editor/react'
import CodeEditor from '@monaco-editor/react'
import { useTheme } from 'next-themes'
import { useCallback } from 'react'
import { setUpSpellcheck } from '@/lib/editor/spellcheck'
import { setUpAssistant } from '@/lib/editor/writing-assistant'
import { useAppStore } from '@/providers/app'

export function Editor({
  value,
  onChange,
}: Pick<EditorProps, 'value' | 'onChange'>) {
  const { theme } = useTheme()
  const setMonacoEditor = useAppStore((state) => state.setMonacoEditor)

  const handleOnMount = useCallback<OnMount>(
    (editor, monaco) => {
      editor.focus()
      setMonacoEditor(monaco, editor)
      setUpSpellcheck(editor, monaco, { lang: 'en_us' })
      setUpAssistant(editor, monaco)
    },
    [setMonacoEditor],
  )

  return (
    <CodeEditor
      language="markdown"
      theme={theme === 'light' ? 'vs' : 'vs-dark'}
      value={value}
      onChange={onChange}
      onMount={handleOnMount}
      options={{
        fontSize: 15,
        wordWrap: 'on',
        padding: { top: 15, bottom: 400 },
        lineNumbers: 'off',
        automaticLayout: true,
        smoothScrolling: true,
        scrollBeyondLastLine: false,
        scrollbar: {
          useShadows: false,
          verticalScrollbarSize: 8,
          horizontalScrollbarSize: 8,
        },
        minimap: { enabled: false },
      }}
    />
  )
}
