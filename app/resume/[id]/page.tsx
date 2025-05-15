import { notFound } from 'next/navigation'
import { cache } from 'react'
import { ChatPanel } from '@/components/chat-panel'
import { Editor } from '@/components/client-editor'
import { PreviewPanel } from '@/components/preview-panel'
import { Toolbar } from '@/components/toolbar'
import {
  ResizablePanelGroup,
  ResizableHandle,
  ResizablePanel,
} from '@/components/ui/resizable'
import { RESUME_PANEL_GROUP_ID } from '@/lib/constants'
import { getChatsByResumeId, getResumeById } from '@/lib/db/queries'

type Props = {
  params: Promise<{ id: string }>
}

const getResumeByIdFn = cache(getResumeById)

export async function generateMetadata({ params }: Props) {
  const { id } = await params
  const resume = await getResumeByIdFn(id)
  if (!resume) return notFound()

  return {
    title: `${resume.name} - Rejume`,
  }
}

export default async function ResumePage({ params }: Props) {
  const { id } = await params
  const resume = await getResumeByIdFn(id)
  if (!resume) return notFound()
  const chats = await getChatsByResumeId(id)

  return (
    <ResizablePanelGroup
      direction="horizontal"
      className="border rounded"
      id={RESUME_PANEL_GROUP_ID}
    >
      <PreviewPanel />

      <ResizableHandle />

      <ResizablePanel minSize={30} className="flex flex-col">
        <Toolbar resume={resume} />

        <ResizablePanelGroup className="flex-1" direction="horizontal">
          <ResizablePanel id="editor" order={1}>
            <Editor resume={resume} />
          </ResizablePanel>

          <ChatPanel
            id="chatbot"
            order={2}
            resumeId={resume.id}
            chats={chats}
          />
        </ResizablePanelGroup>
      </ResizablePanel>
    </ResizablePanelGroup>
  )
}
