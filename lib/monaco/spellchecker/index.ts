import type { Dictionary, Language } from './dic'
import type {
  CodeAction,
  CodeActionProvider,
  IMarkerData,
  Monaco,
  MonacoEditor,
} from '../types'
import { debounce } from 'lodash'
import { initDictionary } from './dic'
import { processMarkdownWords } from './word'

const SPELLCHEK_ID = 'spellchecker'
const SPELLCHEK_ADD_TO_DIC_ID = 'spellchecker.addToDictionary'

function extractWordFromMessage(message: string) {
  return message.match(/^"(.*?)":/)![1]
}

export function setUpSpellchecker(
  editor: MonacoEditor,
  monaco: Monaco,
  options: { lang: Language },
) {
  let dictionary = {} as Dictionary

  const run = () => {
    const model = editor.getModel()
    if (!model) return

    const text = model.getValue()
    const markers: IMarkerData[] = []

    processMarkdownWords(text, ({ word, start, end }) => {
      if (word.length >= 4 && !dictionary.check(word)) {
        const startPos = model.getPositionAt(start)
        const endPos = model.getPositionAt(end)

        markers.push({
          message: `"${word}": Unknown word.`,
          startLineNumber: startPos.lineNumber,
          startColumn: startPos.column,
          endLineNumber: endPos.lineNumber,
          endColumn: endPos.column,
          severity: monaco.MarkerSeverity.Info,
          modelVersionId: model.getVersionId(),
          source: SPELLCHEK_ID,
        })
      }
    })

    monaco.editor.setModelMarkers(model, SPELLCHEK_ID, markers)
  }

  const codeActionProvider: CodeActionProvider = {
    provideCodeActions: (model, _, context, token) => {
      if (token.isCancellationRequested) {
        return
      }

      const actions: CodeAction[] = []

      for (const marker of context.markers) {
        if (!(marker.source === SPELLCHEK_ID)) return

        const word = extractWordFromMessage(marker.message)
        const suggestions = dictionary.suggest(word)

        suggestions.slice(0, 5).forEach((suggestion) => {
          actions.push({
            title: suggestion,
            ranges: [marker],
            kind: 'quickfix',
            edit: {
              edits: [
                {
                  versionId: undefined,
                  resource: model.uri,
                  textEdit: {
                    range: marker,
                    text: suggestion,
                  },
                },
              ],
            },
          })
        })

        actions.push({
          title: `Add to dictionary`,
          kind: 'quickfix',
          command: {
            title: `Add to dictionary`,
            id: SPELLCHEK_ADD_TO_DIC_ID,
            arguments: [word],
          },
        })
      }

      return {
        actions,
        dispose: () => {},
      }
    },
  }

  const addToDictionary = (_: unknown, word: string) => {
    const model = editor.getModel()
    if (!model) return

    dictionary.addWord(word)

    const markers = monaco.editor.getModelMarkers({
      resource: model.uri,
      owner: SPELLCHEK_ID,
    })
    const remainedMarkers = markers.filter(
      (marker) => extractWordFromMessage(marker.message) !== word,
    )

    monaco.editor.setModelMarkers(model, SPELLCHEK_ID, remainedMarkers)
  }

  const debouncedRun = debounce(run, 300)

  initDictionary(options.lang).then((dic) => {
    dictionary = dic

    const codeActionDisposable = monaco.languages.registerCodeActionProvider(
      'markdown',
      codeActionProvider,
    )
    const cmdDisposable = monaco.editor.registerCommand(
      SPELLCHEK_ADD_TO_DIC_ID,
      addToDictionary,
    )

    run()
    editor.onDidChangeModelContent(() => debouncedRun())

    editor.onDidDispose(() => {
      dictionary.dispose()
      cmdDisposable.dispose()
      codeActionDisposable.dispose()
    })
  })
}
