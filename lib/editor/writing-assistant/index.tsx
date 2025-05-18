import type { Monaco, MonacoEditor } from '../types'
import { debounce } from 'lodash'
import { Sparkles } from 'lucide-react'
import { ActionBarWidget } from './action-bar'
import { buildRewriteMessages, fetchRewrite } from './suggestion'
import { SuggestionBoxWidget } from './suggestion-box'
import { getSelectedValue, isValidSelect, pushEdit } from './utils'

export function setUpAssistant(editor: MonacoEditor, monaco: Monaco) {
  const suggestionBox = new SuggestionBoxWidget(editor, monaco, [
    {
      id: 'insert',
      children: 'Insert below',
      variant: 'ghost',
      onClick: (_, suggestionBox) => {
        pushEdit(editor, 'insert', suggestionBox.getValue())
      },
    },
    {
      id: 'replace',
      children: 'Replace',
      variant: 'ghost',
      onClick: (_, suggestionBox) => {
        pushEdit(editor, 'replace', suggestionBox.getValue())
      },
    },
  ])

  const proposeRewrite = async () => {
    const text = getSelectedValue(editor)
    const controller = new AbortController()

    suggestionBox.setPosition(editor.getSelection()!.getEndPosition())
    suggestionBox.beforeReset = () => controller.abort()
    suggestionBox.setStatus('loading')

    const messages = buildRewriteMessages(text)

    try {
      for await (const chunk of fetchRewrite({
        messages,
        signal: controller.signal,
      })) {
        suggestionBox.setStatus('message')
        suggestionBox.updateValue(chunk)
      }
      suggestionBox.setStatus('completed')
    } catch (error) {
      console.error(error)
      suggestionBox.setStatus('error')
      suggestionBox.updateValue(
        'An error occurred while proposing a rewrite. Please try again.',
      )
    }
  }

  const actionBar = new ActionBarWidget(editor, monaco, [
    {
      id: 'rewrite',
      children: (
        <>
          <Sparkles />
          Improve writing
        </>
      ),
      onClick: () => {
        suggestionBox.reset()
        proposeRewrite()
      },
    },
  ])

  editor.addContentWidget(actionBar)
  editor.addContentWidget(suggestionBox)
  editor.onDidChangeCursorSelection(
    debounce((e) => {
      if (isValidSelect(editor)) {
        actionBar.setPosition(e.selection.getStartPosition())
      } else {
        actionBar.setPosition(null)
      }
    }, 100),
  )

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      suggestionBox.reset()
      const selection = editor.getSelection()
      if (selection) {
        const { lineNumber, column } = selection.getStartPosition()
        editor.setSelection({
          startLineNumber: lineNumber,
          startColumn: column,
          endLineNumber: lineNumber,
          endColumn: column,
        })
      }
      editor.focus()
    }
  }
  window.addEventListener('keydown', handleKeyDown)
  editor.onDidDispose(() => {
    window.removeEventListener('keydown', handleKeyDown)
  })
}
