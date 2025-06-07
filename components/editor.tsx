'use client'

import type { EditorProps, OnMount } from '@monaco-editor/react'
import CodeEditor, { loader } from '@monaco-editor/react'
import { useTheme } from 'next-themes'
import { useCallback } from 'react'
import { setUpSelectionTools } from '@/lib/monaco/selection-tools'
import { useAppStore } from '@/providers/app'

// Load from public folder instead of the default CDN
loader.config({ paths: { vs: `${window.origin}/monaco-editor` } })

export function Editor({ defaultValue }: Pick<EditorProps, 'defaultValue'>) {
  const { theme } = useTheme()
  const setEditor = useAppStore((state) => state.setEditor)

  const handleOnMount = useCallback<OnMount>(
    (editor, monaco) => {
      setEditor(editor)
      setUpSelectionTools(editor, monaco)
    },
    [setEditor],
  )

  return (
    <CodeEditor
      language="markdown"
      theme={theme === 'light' ? 'vs' : 'vs-dark'}
      defaultValue={defaultValue}
      onMount={handleOnMount}
      options={{
        fontSize: 14,
        wordWrap: 'on',
        padding: { top: 15, bottom: 400 },
        lineNumbers: 'off',
        unicodeHighlight: { ambiguousCharacters: false },
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
