import dynamic from 'next/dynamic'
import { useAppStore } from '@/providers/app'
import { ResumeList } from './resume-list/resume-list'
import { Toolbar } from './toolbar/toolbar'
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from './ui/resizable'

const Editor = dynamic(
  () => import('@/components/editor/editor').then(({ Editor }) => Editor),
  { ssr: false },
)

export function WorkBenchPanel() {
  const workbenchPanel = useAppStore((state) => state.workbenchPanel)

  return (
    <ResizablePanel minSize={30}>
      <Toolbar />

      <ResizablePanelGroup direction="horizontal">
        {workbenchPanel === 'editor' && (
          <ResizablePanel order={1}>
            <Editor />
          </ResizablePanel>
        )}

        <ResizableHandle />

        {workbenchPanel === 'resume-list' && (
          <ResizablePanel order={2}>
            <ResumeList />
          </ResizablePanel>
        )}
      </ResizablePanelGroup>
    </ResizablePanel>
  )
}
