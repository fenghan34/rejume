import type * as Monaco from 'monaco-editor'
import { debounce } from 'lodash'
import { renderToString } from 'react-dom/server'
import { ActionMenu } from './action-menu'

const ASSISTANT_WIDGET = 'writing-assistant-widget'

export function setUpAssistant(editor: Monaco.editor.IStandaloneCodeEditor, monaco: typeof Monaco) {
  function getSelectionData() {
    const selection = editor.getSelection()
    const model = editor.getModel()
    if (!model || !selection || selection.isEmpty()) {
      return
    }

    const text = model.getValueInRange(selection)
    if (text.split(' ').length < 5) {
      return
    }

    return { selection, text }
  }

  const contentWidget: Monaco.editor.IContentWidget = {
    getId() {
      return ASSISTANT_WIDGET
    },
    getDomNode() {
      const node = document.createElement('div')
      const html = renderToString(<ActionMenu />)
      node.innerHTML = html

      node.querySelector('#improve-writing')?.addEventListener('click', () => {
        const data = getSelectionData()

        console.log(data)
      })

      return node
    },
    getPosition() {
      const data = getSelectionData()
      if (!data)
        return null

      const pos = data.selection.getStartPosition()

      return {
        position: {
          lineNumber: pos.lineNumber,
          column: pos.column,
        },
        preference: [monaco.editor.ContentWidgetPositionPreference.ABOVE],
      }
    },
  }

  const handleSelection = debounce(() => {
    editor.layoutContentWidget(contentWidget)
  }, 200)

  editor.addContentWidget(contentWidget)
  editor.getDomNode()?.addEventListener('mouseup', handleSelection)
  editor.onDidDispose(() => editor.getDomNode()?.removeEventListener('mouseup', handleSelection))
}
