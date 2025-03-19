import { WritingAssistantWidget } from './writing-assistant'
import { Monaco, MonacoEditor } from '../types'
import { debounce } from 'lodash'

export const ADD_ACTION_BAR_COMMAND_ID = 9999

export function setUpAssistant(editor: MonacoEditor, monaco: Monaco) {
  const writingAssistant = new WritingAssistantWidget(editor, monaco)

  // editor.addContentWidget(writingAssistant)
  editor.onDidChangeCursorSelection(debounce((e) => {
    writingAssistant.handleSelectionChange(e.selection)
  }, 100))
}
