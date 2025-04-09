'use client'

import type { EditorRef } from '@/components/editor/editor'
import type { PreviewerRef } from '@/components/editor/previewer'
import type { ImperativePanelHandle } from 'react-resizable-panels'
import dynamic from 'next/dynamic'
import { useCallback, useEffect, useRef } from 'react'
import { useShallow } from 'zustand/react/shallow'
import { Previewer } from '@/components/editor/previewer'
import { Toolbar } from '@/components/toolbar'
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@/components/ui/resizable'
import { A4_HEIGHT, A4_WIDTH } from '@/lib/constants'
import { parsePositionAttribute } from '@/lib/utils'
import { useAppStore } from '@/providers/app'

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

  return (
    <>
      <PageTitle />
      <div className="h-screen bg-accent">
        <ResizablePanelGroup direction="horizontal">
          <ResizablePanel ref={leftPanelRef}>
            <Previewer
              ref={previewerRef}
              onSelectionChange={handlePreviewerSelectionChange}
            />
          </ResizablePanel>

          <ResizableHandle />

          <ResizablePanel minSize={40}>
            <Toolbar onPrint={() => previewerRef.current?.print()} />
            <Editor ref={editorRef} />
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </>
  )
}

function PageTitle() {
  const title = useAppStore(useShallow((state) => state.resume.title))

  useEffect(() => {
    document.title = `Rejume - ${title}`
  }, [title])

  return null
}
