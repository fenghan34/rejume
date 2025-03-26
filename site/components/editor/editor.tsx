import type { EditorProps, OnMount } from '@monaco-editor/react'
import type { Ref } from 'react'
import type { Monaco, IMonacoEditor, IRange } from './types'
import MonacoEditor from '@monaco-editor/react'
import { useCallback, useImperativeHandle, useRef } from 'react'
import { useTheme } from 'next-themes'
import { setUpAssistant } from './writing-assistant'
import { setUpSpellcheck } from './spellcheck'

export interface EditorRef {
  selectRange: (range: IRange) => void
}

export function Editor({
  ref,
  ...props
}: Pick<EditorProps, 'value' | 'onChange' | 'className'> & { ref: Ref<EditorRef> }) {
  const editorRef = useRef<IMonacoEditor>(null)
  const monacoRef = useRef<Monaco>(null)
  const { theme } = useTheme()

  useImperativeHandle(
    ref,
    () => ({
      selectRange: (range: IRange) => {
        editorRef.current?.revealRangeInCenter(range)
        editorRef.current?.setSelection(range)
      }
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
      {...props}
      language="markdown"
      theme={theme === 'light' ? 'vs' : 'vs-dark'}
      onMount={handleOnMount}
      options={{
        fontSize: 16,
        wordWrap: 'on',
        padding: { top: 20, bottom: 200 },
        lineNumbers: 'off',
        automaticLayout: true,
        smoothScrolling: true,
        scrollBeyondLastLine: false,
        scrollbar: {
          useShadows: false,
          verticalScrollbarSize: 8,
          horizontalScrollbarSize: 8
        },
        minimap: {
          enabled: true,
          autohide: true,
        }
      }}
    />
  )
}
