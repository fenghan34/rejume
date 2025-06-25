import { notFound } from 'next/navigation'
import { cache } from 'react'
import { PublicResume } from '@/components/public-resume'
import { getResumeById } from '@/lib/db/queries'

type Props = {
  params: Promise<{ id: string }>
}

const getResumeByIdFn = cache(getResumeById)

export async function generateMetadata({ params }: Props) {
  const { id } = await params
  const resume = await getResumeByIdFn(id)
  if (!resume) return notFound()

  return {
    title: resume.title,
  }
}

export default async function ResumePage({ params }: Props) {
  const { id } = await params
  const resume = await getResumeByIdFn(id)
  if (!resume || !resume.isPublic) return notFound()

  return <PublicResume content={resume.content} />
}
