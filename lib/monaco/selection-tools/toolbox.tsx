import type { ContentWidget, Monaco, MonacoEditor, Position } from '../types'
import { renderToString } from 'react-dom/server'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

type ToolboxButton = Parameters<typeof Button>[0] & {
  onClick: (this: ToolboxWidget, e: MouseEvent) => void
}

function ToolBox({ buttons }: { buttons: ToolboxButton[] }) {
  return (
    <div className="p-0.5 mb-1 select-none bg-card border shadow-sm rounded-md flex items-center">
      {buttons.map(({ id, children, className, variant, size = 'sm' }) => (
        <Button
          key={id}
          id={id}
          size={size}
          variant={variant}
          className={cn('cursor-pointer', className)}
        >
          {children}
        </Button>
      ))}
    </div>
  )
}

export class ToolboxWidget implements ContentWidget {
  private editor: MonacoEditor
  private monaco: Monaco
  private node: HTMLDivElement = document.createElement('div')
  private position: Position | null = null
  allowEditorOverflow: boolean = true

  constructor(editor: MonacoEditor, monaco: Monaco, buttons: ToolboxButton[]) {
    this.editor = editor
    this.monaco = monaco
    this.node.innerHTML = renderToString(<ToolBox buttons={buttons} />)

    buttons.forEach(({ id, onClick }) => {
      const button = this.node.querySelector(`#${id}`)! as HTMLButtonElement
      const handleClick = (e: MouseEvent) => onClick?.apply(this, [e])
      button.addEventListener('click', handleClick)
      this.editor.onDidDispose(() =>
        button.removeEventListener('click', handleClick),
      )
    })
  }

  getId() {
    return 'selection.tool.bar.widget'
  }

  getDomNode() {
    return this.node
  }

  getPosition() {
    if (this.position?.lineNumber === 1) {
      return {
        position: this.position,
        preference: [this.monaco.editor.ContentWidgetPositionPreference.EXACT],
      }
    }

    return {
      position: this.position,
      preference: [this.monaco.editor.ContentWidgetPositionPreference.ABOVE],
    }
  }

  setPosition(position: Position | null) {
    this.position = position
    this.editor.layoutContentWidget(this)
  }
}
