import { MonacoEditor } from "../types"
import { Selection } from 'monaco-editor'

export function getSelectedValue(editor: MonacoEditor, selection: Selection, extent: boolean = false) {
  const model = editor.getModel()
  if (!model || selection.isEmpty()) return ''

  const { startLineNumber, endLineNumber, startColumn, endColumn } = selection

  const value = model.getValueInRange({
    startLineNumber,
    endLineNumber,
    startColumn: extent ? model.getLineMinColumn(startLineNumber) : startColumn,
    endColumn: extent ? model.getLineMaxColumn(endLineNumber) : endColumn
  })

  return value
}
