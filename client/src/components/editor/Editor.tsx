import type { EditorProps } from '@monaco-editor/react'
import type * as monaco from 'monaco-editor'
import type {
  Ref,
} from 'react'

import MonacoEditor from '@monaco-editor/react'
import {
  useCallback,
  useImperativeHandle,
  useRef,
} from 'react'

export interface EditorRef {
  selectRange: (range: monaco.IRange) => void
  searchAndSelectFirstMatch: (target: string) => void
}

export function Editor({
  ref,
  ...props
}: Pick<EditorProps, 'value' | 'onChange' | 'className'> & { ref: Ref<EditorRef> }) {
  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor>(null)

  const selectRange = useCallback((range: monaco.IRange) => {
    editorRef.current?.setPosition({
      lineNumber: range.startLineNumber,
      column: range.startColumn,
    })
    editorRef.current?.revealRangeInCenter(range)
    editorRef.current?.setSelection(range)
  }, [])

  const searchAndSelectFirstMatch = useCallback((target: string) => {
    const editor = editorRef.current
    if (!editor)
      return

    const model = editor.getModel()
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
      theme="vs"
      path="resume.md"
      onMount={editor => (editorRef.current = editor)}
      options={{
        fontSize: 16,
        lineHeight: 1.5,
        wordWrap: 'on',
        padding: { top: 10, bottom: 10 },
        lineNumbers: 'off',
      }}
    />
  )
}
