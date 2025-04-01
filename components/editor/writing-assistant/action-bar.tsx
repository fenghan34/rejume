import type { ContentWidget, Monaco, IMonacoEditor, Position } from '../types'
import type { ReactNode } from 'react'
import { renderToString } from 'react-dom/server'
import { Button } from '@/components/ui/button'

export type ActionBarButton = {
  id: string
  title: ReactNode
  onClick?: (e: Event) => void
}

export class ActionBarWidget implements ContentWidget {
  private editor: IMonacoEditor
  private monaco: Monaco
  private node: HTMLDivElement = document.createElement('div')
  private position: Position | null = null
  allowEditorOverflow: boolean = true

  constructor(
    editor: IMonacoEditor,
    monaco: Monaco,
    buttons: ActionBarButton[],
  ) {
    this.editor = editor
    this.monaco = monaco
    this.node.innerHTML = renderToString(
      <div className="p-0.5 mb-1 select-none bg-card border shadow-sm rounded-md flex items-center">
        {buttons.map(({ id, title }) => (
          <Button
            key={id}
            id={id}
            size="sm"
            variant="ghost"
            className="cursor-pointer"
          >
            {title}
          </Button>
        ))}
      </div>,
    )

    buttons.forEach(({ id, onClick }) => {
      const button = this.node.querySelector(`#${id}`)
      const handleClick = (e: Event) => {
        this.setPosition(null)
        onClick?.(e)
      }
      button?.addEventListener('click', handleClick)
      this.editor.onDidDispose(() =>
        button?.removeEventListener('click', handleClick),
      )
    })
  }

  getId() {
    return 'action.bar.widget'
  }

  getDomNode() {
    return this.node
  }

  getPosition() {
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
