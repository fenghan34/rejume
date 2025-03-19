'use client'

import type { ImperativePanelHandle } from 'react-resizable-panels'
import type { EditorRef } from '@/components/editor/editor'
import type { PreviewerRef } from '@/components/editor/previewer'
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { Previewer } from '@/components/editor/previewer'
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@/components/ui/resizable'
import { A4_HEIGHT, A4_WIDTH } from '@/lib/constants'
import { parsePositionAttribute } from '@/lib/utils'
import { Toolbar } from '@/components/editor/toolbar'
import dynamic from 'next/dynamic'

const Editor = dynamic(() => import('@/components/editor/editor').then(mo => mo.Editor), { ssr: false })

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
      } else {
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
      previewerRef.current?.layout(margin)
    }

    const observer = new ResizeObserver(handler)
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
            ref={previewerRef}
            markdown={markdown}
            onSelectionChange={handlePreviewerSelectionChange}
          />
        </ResizablePanel>

        <ResizableHandle />

        <ResizablePanel>
          <>
            <Toolbar onPrint={() => previewerRef.current?.print()} />
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
    </div >
  )
}
