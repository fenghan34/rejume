import { renderToString } from "react-dom/server";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import type { MonacoEditor, ContentWidget, Monaco } from "../types";
import type { Position } from "monaco-editor";
import type { ReactNode } from "react";

export type SuggestionBoxButton = {
  id: string,
  title: ReactNode,
  disabled?: boolean,
  onClick?: (e: Event, suggestionBox: SuggestionBoxWidget) => void
}

export class SuggestionBoxWidget implements ContentWidget {
  private editor: MonacoEditor
  private monaco: Monaco
  private node: HTMLDivElement = document.createElement('div')
  private position: Position | null = null
  private buttons: SuggestionBoxButton[]
  private textarea: HTMLTextAreaElement
  allowEditorOverflow: boolean = true
  beforeReset: (() => void) | null = null

  constructor(editor: MonacoEditor, monaco: Monaco, buttons: SuggestionBoxButton[]) {
    this.editor = editor
    this.monaco = monaco
    this.buttons = buttons
    this.node.innerHTML = renderToString(
      <div className="mt-1 bg-card border shadow-sm rounded-md">
        <Textarea disabled className="min-w-lg w-auto max-w-2xl max-h-44 m-0 border-0 outline-0 shadow-none focus:border-0 focus:outline-0 focus:shadow-none  focus-visible:ring-0 overflow-auto resize-none" />
        <div className="p-1 text-xs text-right">
          {
            buttons.map(({ id, title, disabled }) => (
              <Button
                key={id}
                id={id}
                disabled={disabled}
                size="sm"
                variant="ghost"
                className="cursor-pointer"
              >
                {title}
              </Button>
            ))
          }
        </div>
      </div>
    )
    this.textarea = this.node.querySelector('textarea')!

    buttons.forEach(({ id, onClick }) => {
      const button = this.node.querySelector(`#${id}`)
      const handleClick = (e: Event) => {
        onClick?.(e, this)
        this.reset()
      }
      button?.addEventListener('click', handleClick)
      this.editor.onDidDispose(() => button?.removeEventListener('click', handleClick))
    })
  }

  getId() {
    return 'suggestion.box.widget'
  }

  getDomNode() {
    return this.node
  }

  getPosition() {
    const model = this.editor.getModel()
    if (!model || !this.position) return { position: null, preference: [] }

    let { lineNumber } = this.position
    const isLastLine = lineNumber === model.getLineCount()

    if (!isLastLine) {
      lineNumber += 1
    }

    const { EXACT, BELOW } = this.monaco.editor.ContentWidgetPositionPreference

    return {
      position: { lineNumber, column: 1 },
      preference: [isLastLine ? BELOW : EXACT]
    }
  }

  setPosition(position: Position | null) {
    this.position = position
    this.editor.layoutContentWidget(this)
  }

  getValue() {
    return this.textarea.value
  }

  updateValue(text: string) {
    this.textarea.value += text
  }

  ready() {
    this.textarea.disabled = false
    this.textarea.focus()
    this.buttons.filter((({ disabled }) => disabled)).forEach(({ id }) => {
      const button = this.node.querySelector(`#${id}`) as HTMLButtonElement
      button.disabled = false
    })
  }

  reset() {
    this.beforeReset?.()
    this.beforeReset = null
    this.textarea.value = ''
    this.textarea.disabled = true
    this.buttons.forEach(({ id, disabled = false }) => {
      const button = this.node.querySelector(`#${id}`) as HTMLButtonElement
      button.disabled = disabled
    })
    this.setPosition(null)
  }
}
