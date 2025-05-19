import type { Monaco, MonacoEditor } from '../types'
import { debounce } from 'lodash'
import { Sparkles } from 'lucide-react'
import { buildRewriteMessages, fetchRewrite } from './api'
import { ResponseBoxWidget } from './response-box'
import { ToolboxWidget } from './toolbox'
import { getSelectedValue, isValidSelection, pushEdit } from './utils'

export function setUpSelectionTools(editor: MonacoEditor, monaco: Monaco) {
  const responseBox = new ResponseBoxWidget(editor, monaco, [
    {
      id: 'insert',
      children: 'Insert below',
      variant: 'outline',
      onClick(this: ResponseBoxWidget) {
        pushEdit(editor, 'insert', this.getValue())
        this.setPosition(null)
      },
    },
    {
      id: 'replace',
      children: 'Replace',
      variant: 'outline',
      onClick(this: ResponseBoxWidget) {
        pushEdit(editor, 'replace', this.getValue())
        this.setPosition(null)
      },
    },
  ])

  const toolbox = new ToolboxWidget(editor, monaco, [
    {
      id: 'rewrite',
      variant: 'ghost',
      children: (
        <>
          <Sparkles />
          Rewrite
        </>
      ),
      async onClick(this: ToolboxWidget) {
        this.setPosition(null)
        const text = getSelectedValue(editor)
        const controller = new AbortController()

        responseBox.setPosition(editor.getSelection()!.getEndPosition())
        responseBox.beforeClose = () => controller.abort()

        try {
          for await (const chunk of fetchRewrite({
            messages: buildRewriteMessages(text),
            signal: controller.signal,
          })) {
            responseBox.setStatus('message')
            responseBox.updateValue(chunk)
          }
          responseBox.setStatus('completed')
        } catch (error) {
          console.error(error)
          responseBox.setStatus('error')
          responseBox.updateValue(
            'An error occurred while proposing a rewrite. Please try again.',
          )
        }
      },
    },
  ])

  const handleCursorChange = debounce(() => {
    if (isValidSelection(editor)) {
      toolbox.setPosition(editor.getSelection()!.getStartPosition())
    } else {
      toolbox.setPosition(null)
    }
  }, 100)

  handleCursorChange()
  editor.addContentWidget(toolbox)
  editor.addContentWidget(responseBox)
  editor.onDidChangeCursorSelection(handleCursorChange)
}
