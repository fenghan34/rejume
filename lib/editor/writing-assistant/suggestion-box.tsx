import type { MonacoEditor, ContentWidget, Monaco, Position } from '../types'
import type { ReactNode } from 'react'
import { renderToString } from 'react-dom/server'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { cn } from '@/lib/utils'

function SuggestionBox({ buttons }: { buttons: SuggestionBoxButton[] }) {
  return (
    <div className="min-w-sm mt-1 bg-card outline shadow-sm rounded max-w-4/5 min-h-8">
      <div className="p-4 space-y-1 animate-pulse hidden group-data-[status=loading]:block">
        <div className="py-1 bg-accent rounded" />
        <div className="py-1 bg-accent rounded w-2/3" />
        <div className="py-1 bg-accent rounded w-1/3" />
      </div>

      <Textarea className="w-auto max-w-xl min-h-6 max-h-64 m-0 p-4 border-0 outline-0 shadow-none focus:border-0 focus:outline-0 focus:shadow-none focus-visible:ring-0 overflow-y-auto resize-none text-pretty disabled:opacity-70 group-data-[status=loading]:hidden" />

      <div className="w-full px-2 py-2 text-right hidden group-data-[status=completed]:block">
        {buttons.map(({ id, children, variant, className }) => (
          <Button
            key={id}
            id={id}
            variant={variant}
            size="sm"
            className={cn('cursor-pointer ml-1.5', className)}
          >
            {children}
          </Button>
        ))}
      </div>
    </div>
  )
}

export type SuggestionBoxButton = {
  id: string
  children: ReactNode
  className?: string
  variant?: 'ghost' | 'default' | 'outline' | 'secondary' | 'destructive'
  onClick?: (e: Event, suggestionBox: SuggestionBoxWidget) => void
}

export class SuggestionBoxWidget implements ContentWidget {
  private editor: MonacoEditor
  private monaco: Monaco
  private node: HTMLDivElement = document.createElement('div')
  private position: Position | null = null
  private textarea: HTMLTextAreaElement
  allowEditorOverflow: boolean = true
  beforeReset: (() => void) | null = null

  constructor(
    editor: MonacoEditor,
    monaco: Monaco,
    buttons: SuggestionBoxButton[],
  ) {
    this.editor = editor
    this.monaco = monaco

    this.node.classList.add('group')
    this.node.innerHTML = renderToString(<SuggestionBox buttons={buttons} />)
    const textarea = this.node.querySelector('textarea')!
    const stopPropagation = (event: Event) => event.stopPropagation()
    textarea.addEventListener('wheel', stopPropagation, { passive: false })
    textarea.addEventListener('touchmove', stopPropagation, { passive: false })
    editor.onDidDispose(() => {
      textarea.removeEventListener('wheel', stopPropagation)
      textarea.removeEventListener('touchmove', stopPropagation)
    })
    this.textarea = textarea

    buttons.forEach(({ id, onClick }) => {
      const button = this.node.querySelector(`#${id}`)
      const handleClick = (e: Event) => {
        onClick?.(e, this)
        this.reset()
      }
      button?.addEventListener('click', handleClick)
      this.editor.onDidDispose(() =>
        button?.removeEventListener('click', handleClick),
      )
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
      preference: [isLastLine ? BELOW : EXACT],
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
    this.textarea.scrollTo({
      behavior: 'smooth',
      top: this.textarea.scrollHeight,
    })
  }

  setStatus(status: 'loading' | 'message' | 'completed' | 'error') {
    this.node.dataset.status = status

    if (status === 'error') {
      this.textarea.disabled = true
    }

    if (status === 'completed') {
      this.textarea.focus()
    }
  }

  reset() {
    this.beforeReset?.()
    this.beforeReset = null
    this.textarea.value = ''
    this.setPosition(null)
    this.setStatus('loading')
  }
}
