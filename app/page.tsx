'use client'

import { useEffect } from 'react'
import { useShallow } from 'zustand/react/shallow'
import { PreviewPanel } from '@/components/preview-panel'
import { ResizableHandle, ResizablePanelGroup } from '@/components/ui/resizable'
import { WorkBenchPanel } from '@/components/workbench-panel'
import { useAppStore } from '@/providers/app'

export default function Home() {
  return (
    <>
      <PageTitle />
      <div className="h-screen bg-accent">
        <ResizablePanelGroup direction="horizontal">
          <PreviewPanel />
          <ResizableHandle />
          <WorkBenchPanel />
        </ResizablePanelGroup>
      </div>
    </>
  )
}

function PageTitle() {
  const title = useAppStore(useShallow((state) => state.resume.title))

  useEffect(() => {
    document.title = `${title} - Rejume`
  }, [title])

  return null
}
