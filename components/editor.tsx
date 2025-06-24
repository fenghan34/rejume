'use client'

import type { EditorProps } from '@monaco-editor/react'
import CodeEditor, { loader } from '@monaco-editor/react'
import { useTheme } from 'next-themes'
import { setUpSelectionTools } from '@/lib/monaco/selection-tools'

// Load from public folder instead of the default CDN
loader.config({ paths: { vs: `${window.origin}/monaco-editor` } })

export function Editor({
  defaultValue,
  onMount,
}: Pick<EditorProps, 'defaultValue' | 'onMount'>) {
  const { theme } = useTheme()

  return (
    <CodeEditor
      language="markdown"
      theme={theme === 'light' ? 'vs' : 'vs-dark'}
      defaultValue={defaultValue}
      onMount={(editor, monaco) => {
        onMount?.(editor, monaco)
        setUpSelectionTools(editor, monaco)
      }}
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
