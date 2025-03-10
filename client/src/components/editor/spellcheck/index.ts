import type * as Monaco from 'monaco-editor'
import type { Dictionary, Language } from './dic'
import _ from 'lodash'
import { initDictionary } from './dic'

const SPELLCHEK_ID = 'spellcheck'
const SPELLCHEK_ADD_TO_DIC_ID = 'spellcheck.addToDictionary'

function extractWordFromMessage(message: string) {
  return message.match(/^"(.*?)":/)![1]
}

export function setUpSpellcheck(editor: Monaco.editor.IStandaloneCodeEditor, monaco: typeof Monaco, options: { lang: Language }) {
  let dictionary = {} as Dictionary

  const run = () => {
    const model = editor.getModel()
    if (!model)
      return

    const text = model.getValue()
    const words = text.split(/\b/)
    const markers: Monaco.editor.IMarkerData[] = []

    let offset = 0
    for (const word of words) {
      if (!/^\w+$/.test(word)) {
        offset += word.length
        continue
      }

      const startPos = model.getPositionAt(offset)
      const endPos = model.getPositionAt(offset + word.length)

      if (!dictionary.check(word)) {
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

      offset += word.length
    }

    monaco.editor.setModelMarkers(model, SPELLCHEK_ID, markers)
  }

  const codeActionProvider: Monaco.languages.CodeActionProvider = {
    provideCodeActions: (model, _, context, token) => {
      if (token.isCancellationRequested) {
        return
      }

      const actions: Monaco.languages.CodeAction[] = []

      for (const marker of context.markers) {
        if (!(marker.source === SPELLCHEK_ID))
          return

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
                    range: new monaco.Range(
                      marker.startLineNumber,
                      marker.startColumn,
                      marker.endLineNumber,
                      marker.endColumn,
                    ),
                    text: suggestion,
                  },
                },
              ],
            },
          })
        })

        actions.push({
          title: `Add "${word}" to dictionary`,
          kind: 'quickfix',
          command: {
            title: `Add "${word}" to dictionary`,
            id: SPELLCHEK_ADD_TO_DIC_ID,
            arguments: [word],
          },
        })
      }

      return { actions, dispose: () => {} }
    },
  }

  const addToDictionary = (_: unknown, word: string) => {
    const model = editor.getModel()
    if (!model)
      return

    dictionary.addWord(word)

    const markers = monaco.editor.getModelMarkers({ resource: model.uri, owner: SPELLCHEK_ID })
    const remainedMarkers = markers.filter(marker => extractWordFromMessage(marker.message) !== word)

    monaco.editor.setModelMarkers(model, SPELLCHEK_ID, remainedMarkers)
  }

  const { lang } = options
  const debouncedRun = _.debounce(run, 500)

  initDictionary(lang).then((dic) => {
    dictionary = dic

    debouncedRun()
    editor.onDidChangeModelContent(() => {
      debouncedRun()
    })

    monaco.languages.registerCodeActionProvider('markdown', codeActionProvider)
    monaco.editor.registerCommand(SPELLCHEK_ADD_TO_DIC_ID, addToDictionary)
  })
}
