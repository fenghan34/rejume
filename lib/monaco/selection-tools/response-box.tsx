import type { MonacoEditor, ContentWidget, Monaco, Position } from '../types'
import { X } from 'lucide-react'
import { renderToString } from 'react-dom/server'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { cn } from '@/lib/utils'

type ResponseBoxButton = Parameters<typeof Button>[0] & {
  onClick: (this: ResponseBoxWidget, e: MouseEvent) => void
}

function ResponseBox({ buttons }: { buttons: ResponseBoxButton[] }) {
  return (
    <div className="relative w-3/4 max-w-xl mt-1 p-4 pr-6 bg-card outline shadow-xl rounded-md">
      <div className="space-y-1 animate-pulse hidden group-data-[status=loading]:block">
        <div className="h-2 bg-accent rounded w-4/5" />
        <div className="h-2 bg-accent rounded w-2/3" />
        <div className="h-2 bg-accent rounded w-1/2" />
      </div>

      <Button
        id="close"
        title="Close"
        variant="ghost"
        className="absolute top-1 right-1 size-6 cursor-pointer"
      >
        <X className="size-4" />
      </Button>

      <Textarea className="min-h-6 max-h-64 m-0 p-0 border-0 outline-0 shadow-none focus:border-0 focus:outline-0 focus:shadow-none focus-visible:ring-0 overflow-y-auto resize-none disabled:opacity-70 group-data-[status=loading]:hidden" />

      <div className="mt-4 hidden group-data-[status=completed]:block">
        {buttons.map(({ id, children, variant, size = 'sm', className }) => (
          <Button
            key={id}
            id={id}
            variant={variant}
            size={size}
            className={cn('cursor-pointer mr-1.5', className)}
          >
            {children}
          </Button>
        ))}
      </div>
    </div>
  )
}

export class ResponseBoxWidget implements ContentWidget {
  private editor: MonacoEditor
  private monaco: Monaco
  private node: HTMLDivElement = document.createElement('div')
  private position: Position | null = null
  private textarea: HTMLTextAreaElement
  allowEditorOverflow: boolean = true
  beforeClose?: () => void

  constructor(
    editor: MonacoEditor,
    monaco: Monaco,
    buttons: ResponseBoxButton[],
  ) {
    this.editor = editor
    this.monaco = monaco
    this.node.innerHTML = renderToString(<ResponseBox buttons={buttons} />)
    this.node.classList.add('group')
    this.textarea = this.node.querySelector('textarea')!

    const stopPropagation = (event: Event) => event.stopPropagation()
    this.textarea.addEventListener('wheel', stopPropagation, { passive: false })
    this.textarea.addEventListener('touchmove', stopPropagation, {
      passive: false,
    })
    this.editor.onDidDispose(() => {
      this.textarea.removeEventListener('wheel', stopPropagation)
      this.textarea.removeEventListener('touchmove', stopPropagation)
    })

    buttons.forEach(({ id, onClick }) => {
      const button = this.node.querySelector(`#${id}`) as HTMLButtonElement
      const handleClick = (e: MouseEvent) => {
        onClick?.apply(this, [e])
      }
      button?.addEventListener('click', handleClick)
      this.editor.onDidDispose(() =>
        button?.removeEventListener('click', handleClick),
      )
    })

    const close = () => {
      this.beforeClose?.()
      this.beforeClose = undefined
      this.setPosition(null)

      const selection = this.editor.getSelection()
      if (selection) {
        const { startLineNumber, startColumn } = selection
        this.editor.setSelection({
          startLineNumber,
          endLineNumber: startLineNumber,
          startColumn,
          endColumn: startColumn,
        })
      }
      this.editor.focus()
    }
    const closeButton = this.node.querySelector('#close')
    closeButton?.addEventListener('click', close)

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        close()
      }
    }
    window.addEventListener('keydown', handleKeyDown)

    this.editor.onDidDispose(() => {
      window.removeEventListener('keydown', handleKeyDown)
      closeButton?.removeEventListener('click', close)
    })
    this.editor.onDidLayoutChange((e) => {
      const { width } = e
      this.node.style.width = `${width}px`
    })
  }

  getId() {
    return 'selection.response.box.widget'
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

    if (status === 'loading') {
      this.textarea.disabled = true
    }

    if (status === 'error') {
      this.textarea.disabled = true
    }

    if (status === 'completed') {
      this.textarea.disabled = false
      this.textarea.focus()
    }
  }

  beforeRender() {
    const { width } = this.editor.getLayoutInfo()
    this.node.style.width = `${width}px`
    this.textarea.value = ''
    this.setStatus('loading')
    return null
  }
}
