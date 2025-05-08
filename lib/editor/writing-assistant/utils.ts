import type { MonacoEditor } from '../types'
import { Selection } from 'monaco-editor'

export function pushEdit(
  editor: MonacoEditor,
  type: 'insert' | 'replace',
  text: string,
) {
  const selection = editor.getSelection()
  const model = editor.getModel()
  if (!selection || !model) return

  const isInsert = type === 'insert'
  let { startLineNumber, startColumn, endLineNumber, endColumn } = selection

  if (isInsert) {
    startLineNumber = endLineNumber
    startColumn = model.getLineMaxColumn(endLineNumber)
    endLineNumber = endLineNumber
    endColumn = model.getLineMaxColumn(endLineNumber)
    text = `\n${text}`
  } else {
    startColumn = model.getLineMinColumn(startLineNumber)
    endColumn = model.getLineMaxColumn(endLineNumber)
  }

  const selections = model.pushEditOperations(
    [selection],
    [
      {
        text,
        range: {
          startLineNumber,
          startColumn,
          endLineNumber,
          endColumn,
        },
        forceMoveMarkers: isInsert,
      },
    ],
    (inverseEditOperations) => {
      const { startLineNumber, startColumn, endLineNumber, endColumn } =
        inverseEditOperations[0].range
      const selection = new Selection(
        startLineNumber,
        startColumn,
        endLineNumber,
        endColumn,
      )
      return [selection]
    },
  )

  if (selections?.length === 1) {
    const position = selections[0].getEndPosition()
    editor.setPosition(position)
    editor.focus()
  }
}

export function getSelectedValue(
  editor: MonacoEditor,
  extent: boolean = false,
) {
  const model = editor.getModel()
  const selection = editor.getSelection()
  if (!model || !selection || selection.isEmpty()) return ''

  const { startLineNumber, endLineNumber, startColumn, endColumn } = selection

  const value = model.getValueInRange({
    startLineNumber,
    endLineNumber,
    startColumn: extent ? model.getLineMinColumn(startLineNumber) : startColumn,
    endColumn: extent ? model.getLineMaxColumn(endLineNumber) : endColumn,
  })

  return value
}

export function isValidSelect(editor: MonacoEditor, minWordCount = 5) {
  const selection = editor.getSelection()
  if (!selection || selection.isEmpty() || editor.getSelections()!.length > 1)
    return false

  const value = getSelectedValue(editor)
  return value.trim().split(/\s|\\n/).length > minWordCount
}
