import dynamic from 'next/dynamic'
import { useHotkeys } from 'react-hotkeys-hook'
import { useShallow } from 'zustand/react/shallow'
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from '@/components/ui/resizable'
import { useAppStore } from '@/providers/app'
import { Chatbot } from './chatbot/chatbot'
import { ResumeList } from './resume-list/resume-list'
import { Toolbar } from './toolbar/toolbar'

const Editor = dynamic(
  () => import('@/components/editor/editor').then(({ Editor }) => Editor),
  { ssr: false },
)

export function WorkBenchPanel() {
  const [subPanels, editor] = useAppStore(
    useShallow((state) => [state.workbenchSubPanels, state.editor]),
  )

  useHotkeys('meta+1', () => editor?.focus())

  return (
    <ResizablePanel minSize={30}>
      <Toolbar />

      <ResizablePanelGroup autoSaveId="workbench" direction="horizontal">
        {subPanels.includes('chatbot') && (
          <>
            <WorkBenchSubPanel id="chatbot" order={1}>
              <Chatbot />
            </WorkBenchSubPanel>
            <ResizableHandle />
          </>
        )}

        <ResizablePanel id="editor" order={2}>
          <Editor />
        </ResizablePanel>

        {subPanels.includes('resume-list') && (
          <>
            <ResizableHandle />
            <WorkBenchSubPanel id="resume-list" order={3}>
              <ResumeList />
            </WorkBenchSubPanel>
          </>
        )}
      </ResizablePanelGroup>
    </ResizablePanel>
  )
}

export type WorkBenchSubPanel = 'resume-list' | 'chatbot'

function WorkBenchSubPanel({
  id,
  children,
  ...rest
}: Omit<React.ComponentProps<typeof ResizablePanel>, 'onResize'> & {
  id: WorkBenchSubPanel
}) {
  const [subPanels, setSubPanels] = useAppStore(
    useShallow((state) => [
      state.workbenchSubPanels,
      state.setWorkbenchSubPanels,
    ]),
  )

  const visible = subPanels.includes(id)

  const handleResize = (size: number) => {
    if (size === 0 && visible) {
      setSubPanels(subPanels.filter((panel) => panel !== id))
    }
  }

  if (!visible) return null

  return (
    <ResizablePanel
      minSize={30}
      maxSize={70}
      collapsible
      {...rest}
      id={id}
      onResize={handleResize}
    >
      {children}
    </ResizablePanel>
  )
}
