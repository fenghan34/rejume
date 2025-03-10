import type { EditorRef } from './components/editor/editor'
import type { PreviewerRef } from './components/editor/previewer'
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@/components/ui/resizable'
import { useCallback, useRef, useState } from 'react'
import { Editor } from './components/editor/editor'
import { Previewer } from './components/editor/previewer'
import { ModeToggle } from './components/theme/mode-toggle'
import { ThemeProvider } from './components/theme/theme-provider'
import { parsePositionAttribute } from './lib/utils'

const defaultMarkdown = localStorage.getItem('markdown') || ''

function App() {
  const editorRef = useRef<EditorRef>(null)
  const previewerRef = useRef<PreviewerRef>(null)
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

  return (
    <div className="h-screen bg-accent">
      <ThemeProvider>
        {/* <ModeToggle /> */}
        <ResizablePanelGroup direction="horizontal">
          <ResizablePanel defaultSize={40}>
            <div className="">
              <Previewer
                ref={previewerRef}
                markdown={markdown}
                onSelectionChange={handlePreviewerSelectionChange}
              />
            </div>
          </ResizablePanel>

          <ResizableHandle withHandle />

          <ResizablePanel>
            <div className="h-full px-4 bg-white dark:bg-black">
              <div className="py-2">
                <ModeToggle />
              </div>
              <Editor
                className="overflow-hidden rounded-sm bg-accent"
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
