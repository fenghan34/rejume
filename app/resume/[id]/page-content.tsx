'use client'

import { PreviewPanel } from '@/components/preview-panel'
import { ResizablePanelGroup, ResizableHandle } from '@/components/ui/resizable'
import { WorkBenchPanel } from '@/components/workbench-panel'
import { RESUME_PANEL_GROUP_ID } from '@/lib/constants'

export function ResumePageContent() {
  return (
    <ResizablePanelGroup
      direction="horizontal"
      className="border rounded"
      id={RESUME_PANEL_GROUP_ID}
    >
      <PreviewPanel />
      <ResizableHandle />
      <WorkBenchPanel />
    </ResizablePanelGroup>
  )
}
