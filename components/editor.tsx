'use client'

import type { EditorProps, OnMount } from '@monaco-editor/react'
import CodeEditor, { loader } from '@monaco-editor/react'
import * as monaco from 'monaco-editor'
import { useTheme } from 'next-themes'
import { useCallback } from 'react'
import { setUpSelectionTools } from '@/lib/monaco/selection-tools'
import { setUpSpellchecker } from '@/lib/monaco/spellchecker'
import { useAppStore } from '@/providers/app'

loader.config({ monaco })

export function Editor({
  defaultValue,
  onChange,
}: Pick<EditorProps, 'defaultValue' | 'onChange'>) {
  const { theme } = useTheme()
  const setMonacoEditor = useAppStore((state) => state.setMonacoEditor)

  const handleOnMount = useCallback<OnMount>(
    (editor, monaco) => {
      editor.focus()
      setMonacoEditor(monaco, editor)
      setUpSpellchecker(editor, monaco, { lang: 'en_us' })
      setUpSelectionTools(editor, monaco)
    },
    [setMonacoEditor],
  )

  return (
    <CodeEditor
      language="markdown"
      theme={theme === 'light' ? 'vs' : 'vs-dark'}
      defaultValue={defaultValue}
      onChange={onChange}
      onMount={handleOnMount}
      options={{
        fontSize: 14,
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
