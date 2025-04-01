'use client'

import type { EditorRef } from '@/components/editor/editor'
import type { PreviewerRef } from '@/components/editor/previewer'
import type { ImperativePanelHandle } from 'react-resizable-panels'
import dynamic from 'next/dynamic'
import { useCallback, useEffect, useRef, useState } from 'react'
import { Previewer } from '@/components/editor/previewer'
import { Toolbar } from '@/components/editor/toolbar'
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@/components/ui/resizable'
import { A4_HEIGHT, A4_WIDTH } from '@/lib/constants'
import { parsePositionAttribute } from '@/lib/utils'

const Editor = dynamic(
  () => import('@/components/editor/editor').then((mo) => mo.Editor),
  { ssr: false },
)

function computeLeftPanelSize() {
  const xl = 1280
  const doubleXl = 1536
  const { clientWidth, clientHeight } = document.body
  const margin = clientWidth >= xl ? 16 : clientWidth > doubleXl ? 24 : 0
  const leftPanelWidth = (clientHeight + margin) * (A4_WIDTH / A4_HEIGHT)
  const size = (leftPanelWidth / clientWidth) * 100
  return size
}

export default function Home() {
  const editorRef = useRef<EditorRef>(null)
  const previewerRef = useRef<PreviewerRef>(null)
  const leftPanelRef = useRef<ImperativePanelHandle>(null)
  const [markdown, setMarkdown] = useState<string>()

  const handlePreviewerSelectionChange = useCallback(
    (selectedElement: HTMLElement) => {
      const range = parsePositionAttribute(selectedElement)
      if (range) {
        editorRef.current?.selectRange(range)
      }
    },
    [],
  )

  useEffect(() => {
    const observer = new ResizeObserver(() => {
      leftPanelRef.current?.resize(computeLeftPanelSize())
    })
    observer.observe(document.body)
    return () => {
      observer.disconnect()
    }
  }, [])

  useEffect(() => {
    setMarkdown(localStorage.getItem('markdown') || '')
  }, [])

  return (
    <div className="h-screen bg-accent">
      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel ref={leftPanelRef}>
          <Previewer
            className="xl:m-4 2xl:m-6"
            ref={previewerRef}
            markdown={markdown}
            onSelectionChange={handlePreviewerSelectionChange}
          />
        </ResizablePanel>

        <ResizableHandle />

        <ResizablePanel>
          <Toolbar onPrint={() => previewerRef.current?.print()} />
          <Editor
            ref={editorRef}
            value={markdown}
            onChange={(value) => {
              setMarkdown(value || '')
              localStorage.setItem('markdown', value || '')
            }}
          />
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  )
}
