'use client'

import type { EditorProps, OnMount } from '@monaco-editor/react'
import CodeEditor, { loader } from '@monaco-editor/react'
import { useTheme } from 'next-themes'
import { useCallback } from 'react'
import { setUpSelectionTools } from '@/lib/monaco/selection-tools'
import { setUpSpellchecker } from '@/lib/monaco/spellchecker'
import { useAppStore } from '@/providers/app'

// NOTE: I manually copied the monaco-editor/min/vs folder to the public folder as a workaround to not load from the default CDN
loader.config({ paths: { vs: `${window.origin}/monaco-editor` } })

export function Editor({
  defaultValue,
  onChange,
}: Pick<EditorProps, 'defaultValue' | 'onChange'>) {
  const { theme } = useTheme()
  const setEditor = useAppStore((state) => state.setEditor)

  const handleOnMount = useCallback<OnMount>(
    (editor, monaco) => {
      editor.focus()
      setEditor(editor)
      setUpSpellchecker(editor, monaco, { lang: 'en_us' })
      setUpSelectionTools(editor, monaco)
    },
    [setEditor],
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
