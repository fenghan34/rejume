import type { Monaco, IMonacoEditor } from '../types'
import { debounce } from 'lodash'
import { Check, Sparkles } from 'lucide-react'
import { ActionBarWidget } from './action-bar'
import {
  buildGrammarCheckMessages,
  buildRewriteMessages,
  fetchSuggestion,
} from './suggestion'
import { SuggestionBoxWidget } from './suggestion-box'
import { getSelectedValue, isValidSelect, pushEdit } from './utils'

export function setUpAssistant(editor: IMonacoEditor, monaco: Monaco) {
  const suggestionBox = new SuggestionBoxWidget(editor, monaco, [
    {
      id: 'insert',
      title: 'Insert',
      onClick: (_, suggestionBox) => {
        pushEdit(editor, 'insert', suggestionBox.getValue())
      },
    },
    {
      id: 'replace',
      title: 'Replace',
      onClick: (_, suggestionBox) => {
        pushEdit(editor, 'replace', suggestionBox.getValue())
      },
    },
    {
      id: 'discard',
      title: 'Discard',
    },
  ])

  const proposeSuggestion = async (type: 'rewrite' | 'grammar-check') => {
    const text = getSelectedValue(editor)
    const controller = new AbortController()

    suggestionBox.setPosition(editor.getSelection()!.getEndPosition())
    suggestionBox.beforeReset = () => controller.abort()

    const messages =
      type === 'rewrite'
        ? buildRewriteMessages(text)
        : buildGrammarCheckMessages(text)

    try {
      for await (const chunk of fetchSuggestion({
        messages,
        signal: controller.signal,
      })) {
        suggestionBox.updateValue(chunk)
      }
      suggestionBox.ready()
    } catch (error) {
      console.error(error)
      suggestionBox.updateValue(String(error))
    }
  }

  const actionBar = new ActionBarWidget(editor, monaco, [
    {
      id: 'rewrite',
      title: (
        <>
          <Sparkles />
          Improve writing
        </>
      ),
      onClick: () => proposeSuggestion('rewrite'),
    },
    {
      id: 'grammar-check',
      title: (
        <>
          <Check />
          Grammar check
        </>
      ),
      onClick: () => proposeSuggestion('grammar-check'),
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
        suggestionBox.reset()
      }
    }, 100),
  )
}
