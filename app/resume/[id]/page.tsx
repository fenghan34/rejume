import { notFound } from 'next/navigation'
import { cache } from 'react'
import { Workbench } from '@/components/workbench'
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
    <div className="h-full px-6 pb-6 pt-px">
      <Workbench resume={resume} chats={chats} />
    </div>
  )
}
