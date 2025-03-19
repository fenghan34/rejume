import { MonacoEditor, Monaco, ContentWidget } from "../types";
import { renderToString } from "react-dom/server";
import { Textarea } from "@/components/ui/textarea";
import { ActionButton, AssistantButton } from "./assistant-button";
import { Selection, Range } from "monaco-editor";

export const RESPONSE_PANE_WIDGET_ID = 'responsePane'

export class ResponsePaneWidget implements ContentWidget {
  private editor: MonacoEditor
  private monaco: Monaco
  private node: HTMLDivElement = document.createElement('div')
  private selection: Selection | null = null

  private buttons: AssistantButton[]
  readonly textarea: HTMLTextAreaElement
  onCancel: (() => void) | null = null

  constructor(editor: MonacoEditor, monaco: Monaco) {
    this.editor = editor
    this.monaco = monaco

    this.buttons = [
      {
        id: "discard",
        title: "Discard",
        onClick: () => {
          this.reset()
        }
      },
      {
        id: 'insert',
        title: "Insert",
        disabled: true,
        onClick: () => {
          const model = this.editor.getModel()
          if (!model || !this.selection) {
            return this.reset()
          }

          const range = new Range(this.selection.endLineNumber + 1, 0, this.selection.endLineNumber + 1, 0)

          model.pushEditOperations([this.selection], [
            {
              forceMoveMarkers: true,
              text: `${this.textarea.value}\n`,
              range
            }
          ],
            () => null
          )
        }
      },
      {
        id: 'replace',
        title: "Replace",
        disabled: true,
        onClick: () => {
          const model = this.editor.getModel()
          if (!model || !this.selection) {
            return this.reset()
          }

          const { startLineNumber, endLineNumber, endColumn } = this.selection
          const range = new Range(startLineNumber, 0, endLineNumber, endColumn)

          model.pushEditOperations([this.selection], [
            {
              forceMoveMarkers: true,
              text: `${this.textarea.value}`,
              range
            }
          ],
            () => [this.selection!]
          )

          this.reset()
        }
      }
    ]

    this.node.innerHTML = renderToString(<ResponsePane buttons={this.buttons} />)
    this.textarea = this.node.querySelector('textarea')!

    this.buttons.forEach(({ id, onClick }) => {
      const button = this.node.querySelector(`#${id}`)
      button?.addEventListener('click', onClick)
      this.editor.onDidDispose(() => button?.removeEventListener('click', onClick))
    })
  }

  getId() {
    return RESPONSE_PANE_WIDGET_ID
  }

  getDomNode() {
    return this.node
  }

  getPosition() {
    const model = this.editor.getModel()
    const defaultSetting = { position: null, preference: [] }
    if (!model) return defaultSetting

    let position = this.selection?.getEndPosition() || null
    if (!position) return defaultSetting

    const { lineNumber } = position
    const isLastLine = lineNumber === model.getLineCount()
    const { EXACT, BELOW } = this.monaco.editor.ContentWidgetPositionPreference

    return {
      position: { lineNumber: isLastLine ? lineNumber : lineNumber + 1, column: 1 },
      preference: [isLastLine ? BELOW : EXACT]
    }
  }

  reset() {
    this.selection = null
    this.toggleButtons(true)
    this.textarea.value = ''
    this.editor.layoutContentWidget(this)
    this.onCancel?.()
  }

  async show(selection: Selection, callback: () => Promise<void>) {
    this.selection = selection
    this.editor.layoutContentWidget(this)

    await callback()
    this.toggleButtons(false)
  }

  toggleButtons(disabled: boolean) {
    this.buttons.filter(({ disabled }) => disabled).forEach(({ id }) => {
      const button = this.node.querySelector(`#${id}`) as HTMLButtonElement
      button.disabled = disabled
    })
  }
}

function ResponsePane({ buttons }: { buttons: AssistantButton[] }) {
  return (
    <div className="mt-1 bg-card border shadow-sm rounded-md">
      <Textarea className="min-w-lg w-auto max-h-44 m-0 border-0 outline-0 shadow-none focus:border-0 focus:outline-0 focus:shadow-none  focus-visible:ring-0 overflow-auto resize-none" />
      <div className="p-1 flex items-center flex-row-reverse text-xs">
        {
          buttons.map(({ id, title, disabled }) => (
            <ActionButton key={id} id={id} disabled={disabled}>
              {title}
            </ActionButton>
          ))
        }
      </div>
    </div>
  )
}
