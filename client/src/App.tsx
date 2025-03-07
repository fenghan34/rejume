import type { IRange } from 'monaco-editor'
import type { EditorRef } from './components/editor/editor'
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

const MIN_SIZE = 30
const defaultMarkdown = localStorage.getItem('markdown') || ''

function App() {
  const editorRef = useRef<EditorRef>(null)
  const [markdown, setMarkdown] = useState(defaultMarkdown)

  const handlePreviewerSelectionChange = useCallback(
    (selectedElement: HTMLElement, range?: IRange) => {
      if (range) {
        editorRef.current?.selectRange(range)
      }
      else {
        editorRef.current?.searchAndSelectFirstMatch(selectedElement.textContent!)
      }
    },
    [],
  )

  return (
    <ThemeProvider defaultTheme="system" storageKey="theme">
      <ModeToggle />
      <div className="h-screen p-10 bg-gray-200">
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
      </div>
    </ThemeProvider>
  )
}

export default App
