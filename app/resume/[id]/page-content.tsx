'use client'

import { redirect } from 'next/navigation'
import { useEffect, useState } from 'react'
import { PreviewPanel } from '@/components/preview-panel'
import { ResizablePanelGroup, ResizableHandle } from '@/components/ui/resizable'
import { WorkBenchPanel } from '@/components/workbench-panel'
import { Resume } from '@/stores/resume-slice'

export const RESUME_PANEL_GROUP_ID = 'resume-panel-group'

export function ResumePageContent({ id }: { id: string }) {
  const [resume, setResume] = useState<Resume | null>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const storage = JSON.parse(localStorage.getItem('rejume-storage') || '{}')
    const foundResume = storage.state?.resumeList?.find(
      (r: Resume) => r.id === id,
    )

    if (foundResume) {
      setResume(foundResume)
      document.title = `${foundResume.title} - Rejume`
    }

    setMounted(true)
  }, [id])

  if (!mounted) return null

  if (!resume) {
    return redirect('/')
  }

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
