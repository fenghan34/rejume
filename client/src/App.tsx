import type { EditorRef } from './components/editor/editor'
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@/components/ui/resizable'
import { useCallback, useRef, useState } from 'react'
import { Editor } from './components/editor/editor'
import { Previewer } from './components/editor/previewer'
import { ThemeProvider } from './components/theme/theme-provider'
import { parsePositionAttribute } from './lib/utils'

const MIN_SIZE = 30
const defaultMarkdown = localStorage.getItem('markdown') || ''

function App() {
  const editorRef = useRef<EditorRef>(null)
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
    <div className="h-screen p-4 bg-gray-200">
      <ThemeProvider defaultTheme="system" storageKey="theme">
        <ResizablePanelGroup direction="horizontal">
          <ResizablePanel minSize={MIN_SIZE}>
            <ResizablePanelGroup direction="vertical">
              <ResizablePanel>
                <Editor
                  className="overflow-hidden rounded-md"
                  ref={editorRef}
                  value={markdown}
                  onChange={(value) => {
                    setMarkdown(value || '')
                    localStorage.setItem('markdown', value || '')
                  }}
                />
              </ResizablePanel>

              <ResizableHandle withHandle />

              <ResizablePanel minSize={MIN_SIZE / 2}>Chatbox</ResizablePanel>
            </ResizablePanelGroup>
          </ResizablePanel>

          <ResizableHandle className="mx-2" withHandle />

          <ResizablePanel>
            <Previewer
              markdown={markdown}
              onSelectionChange={handlePreviewerSelectionChange}
            />
          </ResizablePanel>
        </ResizablePanelGroup>
      </ThemeProvider>
    </div>
  )
}

export default App
