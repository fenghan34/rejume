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
    <div className="h-screen p-4 bg-gray-200">
      <ThemeProvider defaultTheme="system" storageKey="theme">
        <ResizablePanelGroup direction="horizontal">
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

          <ResizableHandle className="mx-2" withHandle />

          <ResizablePanel>
            <Previewer
              ref={previewerRef}
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
