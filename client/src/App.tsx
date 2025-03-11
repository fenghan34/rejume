import type { ImperativePanelHandle } from 'react-resizable-panels'
import type { EditorRef } from './components/editor/editor'
import type { PreviewerRef } from './components/editor/previewer'
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@/components/ui/resizable'
import { useCallback, useLayoutEffect, useRef, useState } from 'react'
import { Editor } from './components/editor/editor'
import { Previewer } from './components/editor/previewer'
import { ModeToggle } from './components/theme/mode-toggle'
import { ThemeProvider } from './components/theme/theme-provider'
import { A4_HEIGHT, A4_WIDTH } from './consts'
import { parsePositionAttribute } from './lib/utils'

const defaultMarkdown = localStorage.getItem('markdown') || ''

function App() {
  const editorRef = useRef<EditorRef>(null)
  const previewerRef = useRef<PreviewerRef>(null)
  const leftPanelRef = useRef<ImperativePanelHandle>(null)
  const [markdown, setMarkdown] = useState(defaultMarkdown)

  const handlePreviewerSelectionChange = useCallback(
    (selectedElement: HTMLElement) => {
      const sourceRange = parsePositionAttribute(selectedElement)
      if (sourceRange) {
        editorRef.current?.selectRange(sourceRange)
      }
      else {
        editorRef.current?.searchAndSelectFirstMatch(selectedElement.textContent!)
      }
    },
    [],
  )

  useLayoutEffect(() => {
    const bodyWidth = document.body.clientWidth
    const bodyHeight = document.body.clientHeight
    const margin = bodyWidth >= 1536 ? 80 : 40
    const leftPanelWidth = (bodyHeight + margin) * (A4_WIDTH / A4_HEIGHT)
    const size = (leftPanelWidth / bodyWidth) * 100

    leftPanelRef.current?.resize(size)
  }, [])

  return (
    <div className="h-screen bg-accent">
      <ThemeProvider defaultTheme="dark">
        <ResizablePanelGroup direction="horizontal">
          <ResizablePanel ref={leftPanelRef}>
            <div className="m-10 2xl:m-20">
              <Previewer
                className="shadow-xl"
                ref={previewerRef}
                markdown={markdown}
                onSelectionChange={handlePreviewerSelectionChange}
              />
            </div>
          </ResizablePanel>

          <ResizableHandle />

          <ResizablePanel>
            <div className="h-full dark:bg-black">
              <div className="p-2 flex flex-row-reverse">
                <ModeToggle />
              </div>
              <Editor
                className="rounded"
                ref={editorRef}
                value={markdown}
                onChange={(value) => {
                  setMarkdown(value || '')
                  localStorage.setItem('markdown', value || '')
                }}
              />
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </ThemeProvider>
    </div>
  )
}

export default App
