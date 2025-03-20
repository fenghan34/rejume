import type { EditorProps } from '@monaco-editor/react'
import type * as monaco from 'monaco-editor'
import type { Ref } from 'react'
import MonacoEditor from '@monaco-editor/react'
import {
  useCallback,
  useImperativeHandle,
  useRef,
} from 'react'
import { useTheme } from 'next-themes'
import { setUpAssistant } from './writing-assistant'
import { setUpSpellcheck } from './spellcheck'

export interface EditorRef {
  selectRange: (range: monaco.IRange) => void
  searchAndSelectFirstMatch: (target: string) => void
}

export function Editor({
  ref,
  ...props
}: Pick<EditorProps, 'value' | 'onChange' | 'className'> & { ref: Ref<EditorRef> }) {
  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor>(null)
  const monacoRef = useRef<typeof monaco>(null)
  const { theme } = useTheme()

  const selectRange = useCallback((range: monaco.IRange) => {
    editorRef.current?.setPosition({
      lineNumber: range.startLineNumber,
      column: range.startColumn,
    })
    editorRef.current?.revealRangeInCenter(range)
    editorRef.current?.setSelection(range)
  }, [])

  const searchAndSelectFirstMatch = useCallback((target: string) => {
    if (!editorRef.current)
      return

    const model = editorRef.current.getModel()
    const matches = model!.findMatches(
      target,
      true,
      false,
      true,
      '\\s',
      false,
      1,
    )

    if (matches.length > 0) {
      const firstMatch = matches[0].range
      selectRange(firstMatch)
    }
  }, [selectRange])

  useImperativeHandle(
    ref,
    () => {
      return {
        selectRange,
        searchAndSelectFirstMatch,
      }
    },
    [searchAndSelectFirstMatch, selectRange],
  )

  return (
    <MonacoEditor
      {...props}
      language="markdown"
      theme={theme === 'light' ? 'vs' : 'vs-dark'}
      onMount={(editor, monaco) => {
        editorRef.current = editor
        monacoRef.current = monaco
        setUpSpellcheck(editor, monaco, { lang: 'en_us' })
        setUpAssistant(editor, monaco)
      }}
      options={{
        fontSize: 16,
        wordWrap: 'on',
        padding: { top: 10 },
        lineNumbers: 'off',
        smoothScrolling: true,
        scrollbar: {
          verticalScrollbarSize: 0,
        },
        stickyScroll: {
          enabled: true,
        },
        minimap: {
          enabled: true,
          autohide: true,
        }
      }}
    />
  )
}
