import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@/components/ui/resizable'
import { useState } from 'react'
import { Editor } from './components/editor/Editor'
import { Previewer } from './components/editor/Previewer'

const MIN_SIZE = 30

const defaultMarkdown = localStorage.getItem('markdown') || ''

function App() {
  const [markdown, setMarkdown] = useState(defaultMarkdown)
  return (
    <div className="h-screen p-10 bg-gray-200">
      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel minSize={MIN_SIZE}>
          <ResizablePanelGroup direction="vertical">
            <ResizablePanel minSize={MIN_SIZE}>
              <Editor
                className="m-2 overflow-hidden rounded-md"
                value={markdown}
                onChange={(value) => {
                  setMarkdown(value || '')
                  localStorage.setItem('markdown', value || '')
                }}
              />
            </ResizablePanel>

            <ResizableHandle withHandle />

            <ResizablePanel minSize={MIN_SIZE}>Chatbox</ResizablePanel>
          </ResizablePanelGroup>
        </ResizablePanel>

        <ResizableHandle withHandle />

        <ResizablePanel>
          <Previewer
            markdown={markdown}
            className="w-[210mm] bg-white aspect-[calc(210/297)] p-[15mm] overflow-hidden m-2 rounded"
          />
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  )
}

export default App
