import { Sparkles } from 'lucide-react'
import { renderToString } from 'react-dom/server'
import { ContentWidget, Monaco, MonacoEditor } from '../types'
import { Selection } from 'monaco-editor'
import { ResponsePaneWidget } from './response-pane'
import { ActionButton, AssistantButton } from './assistant-button'
import { getSelectedValue } from './utils'
import ky from 'ky'
import { CoreMessage } from 'ai'

type AssistantOptions = {
  minSelectedWordCount?: number
}
export const WRITING_ASSISTANT_WIDGET_ID = 'writingAssistant'

export class WritingAssistantWidget implements ContentWidget {
  private editor: MonacoEditor
  private monaco: Monaco
  private options?: AssistantOptions
  private node: HTMLDivElement = document.createElement('div')
  private selection: Selection | null = null
  private responsePane: ResponsePaneWidget

  allowEditorOverflow: boolean

  constructor(editor: MonacoEditor, monaco: Monaco, options?: AssistantOptions) {
    this.editor = editor
    this.monaco = monaco
    this.options = options
    this.allowEditorOverflow = true

    this.responsePane = new ResponsePaneWidget(editor, monaco)
    editor.addContentWidget(this.responsePane)

    const buttons: AssistantButton[] = [
      {
        id: "rewrite",
        title: <><Sparkles /> Rewrite</>,
        onClick: () => {
          const controller = new AbortController()
          this.responsePane.onCancel = (reason?: string) => {
            controller.abort(reason)
          }
          this.responsePane.show(this.selection!, async () => {
            const messages: CoreMessage[] = [
              {
                role: 'system',
                content: 'You are an AI writing assistant specialized in resume writing. Your task is to improve clarity, conciseness, and impact while maintaining a professional and compelling tone. Ensure the output remains suitable for a resume, optimizing word choice and sentence structure. Preserve Markdown formatting and do not add unnecessary details.'
              },
              {
                role: 'user',
                content: `Rewrite the following resume text for better readability and impact while keeping the meaning unchanged. Maintain Markdown formatting.\nSelected Text:\n${getSelectedValue(this.editor, this.selection!, true)}`
              }
            ]

            const res = await ky.post('/api/assistant', {
              body: JSON.stringify({ messages }),
              signal: controller.signal
            })

            const reader = res.body?.getReader()

            if (!reader) {
              console.error('no data returned')
              return
            }
            const decoder = new TextDecoder("utf-8");

            let done = false;
            while (!done) {
              const { value, done: readerDone } = await reader.read();
              if (value) {
                const char = decoder.decode(value);
                if (char) {
                  this.responsePane.textarea.value += char
                }
              }
              done = readerDone;
            }
          })
          this.reset()
        }
      },
      {
        id: 'grammar-check',
        title: <><Sparkles /> Fix grammar</>,
        onClick: () => { }
      }
    ]

    this.node.innerHTML = renderToString(<AssistantBar buttons={buttons} />)

    buttons.forEach(({ id, onClick }) => {
      const button = this.node.querySelector(`#${id}`)
      button?.addEventListener('click', onClick)
      this.editor.onDidDispose(() => button?.removeEventListener('click', onClick))
    })
  }

  getId() {
    return WRITING_ASSISTANT_WIDGET_ID
  }

  getDomNode() {
    return this.node
  }

  getPosition() {
    const position = this.selection?.getStartPosition() || null
    return {
      position,
      preference: [this.monaco.editor.ContentWidgetPositionPreference.ABOVE]
    }
  }

  handleSelectionChange(selection: Selection) {
    this.responsePane.reset()

    if (selection.isEmpty() ||
      this.editor.getSelections()!.length > 1 ||
      !this.isValidSelect(getSelectedValue(this.editor, selection))
    ) {
      this.reset()
      return
    }

    this.selection = selection
    this.editor.layoutContentWidget(this)
  }

  private reset() {
    this.selection = null
    this.editor.layoutContentWidget(this)
  }

  private isValidSelect(value: string) {
    const minCount = this.options?.minSelectedWordCount || 5
    return value.trim().split(/\s|\\n/).length > minCount
  }
}

function AssistantBar({ buttons }: { buttons: AssistantButton[] }) {
  return (
    <div className="p-0.5 mb-1 select-none bg-background border shadow-sm rounded-md flex items-center">
      {
        buttons.map(({ id, title }) => (
          <ActionButton key={id} id={id}>
            {title}
          </ActionButton>
        ))
      }
    </div>
  )
}
