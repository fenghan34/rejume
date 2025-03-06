import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@/components/ui/resizable'
import { IRange } from 'monaco-editor'
import { useCallback, useRef, useState } from 'react'
import { Editor, EditorRef } from './components/editor/Editor'
import { Previewer } from './components/editor/Previewer'

const MIN_SIZE = 30

const defaultMarkdown = localStorage.getItem('markdown') || ''

function App() {
  const editorRef = useRef<EditorRef>(null)
  const [markdown, setMarkdown] = useState(defaultMarkdown)

  const handlePreviewerSelectionChange = useCallback(
    (selectedElement: HTMLElement, range?: IRange) => {
      if (range) {
        editorRef.current?.selectRange(range)
      } else {
        editorRef.current?.searchAndSelectFirstMatch(selectedElement.innerText)
      }
    },
    []
  )

  return (
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
            className="w-[210mm] bg-white aspect-[calc(210/297)] p-[15mm] overflow-y-auto rounded font-nunito-sans"
          />
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  )
}

export default App
