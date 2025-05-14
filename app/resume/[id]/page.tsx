import { notFound } from 'next/navigation'
import { cache } from 'react'
import { getResumeById } from '@/lib/db/queries'
import { ResumeProvider } from '@/providers/resume'
import { ResumePageContent } from './page-content'

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

  return (
    <ResumeProvider value={resume}>
      <ResumePageContent />
    </ResumeProvider>
  )
}
