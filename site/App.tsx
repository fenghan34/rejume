import type { ImperativePanelHandle } from 'react-resizable-panels'
import type { EditorRef } from './components/editor/editor'
import type { PreviewerRef } from './components/editor/previewer'
import { Printer } from 'lucide-react'
import { useCallback, useLayoutEffect, useRef, useState } from 'react'
import { Editor } from './components/editor/editor'
import { Previewer } from './components/editor/previewer'
import { ModeToggle } from './components/theme/mode-toggle'
import { ThemeProvider } from './components/theme/theme-provider'
import { Button } from './components/ui/button'
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from './components/ui/resizable'
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
    const handler = () => {
      const bodyWidth = document.body.clientWidth
      const bodyHeight = document.body.clientHeight
      const margin = bodyWidth >= 1280 ? 24 : bodyWidth >= 1536 ? 40 : 0
      const leftPanelWidth = (bodyHeight + margin) * (A4_WIDTH / A4_HEIGHT)
      const size = (leftPanelWidth / bodyWidth) * 100

      leftPanelRef.current?.resize(size)
    }

    const observer = new ResizeObserver(handler)
    observer.observe(document.body)

    return () => {
      observer.disconnect()
    }
  }, [])

  return (
    <div className="h-screen bg-accent">
      <ThemeProvider defaultTheme="dark">
        <ResizablePanelGroup direction="horizontal">
          <ResizablePanel ref={leftPanelRef}>
            <div className="xl:m-6 2xl:m-10">
              <Previewer
                ref={previewerRef}
                markdown={markdown}
                onSelectionChange={handlePreviewerSelectionChange}
              />
            </div>
          </ResizablePanel>

          <ResizableHandle />

          <ResizablePanel>
            <>
              <div className="p-2 flex dark:bg-black">
                <Button
                  className="cursor-pointer"
                  variant="ghost"
                  onClick={() => previewerRef.current?.print()}
                >
                  <Printer />
                </Button>
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
            </>
          </ResizablePanel>
        </ResizablePanelGroup>
      </ThemeProvider>
    </div>
  )
}

export default App
