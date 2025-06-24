import { dehydrate, HydrationBoundary } from '@tanstack/react-query'
import { notFound } from 'next/navigation'
import { cache } from 'react'
import { Workbench } from '@/components/workbench'
import { getResumeById } from '@/lib/db/queries'
import { getQueryClient } from '@/lib/query-client'

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
  const queryClient = getQueryClient()

  await queryClient.prefetchQuery({
    queryKey: ['resumes', id],
    queryFn: () => getResumeByIdFn(id),
  })

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Workbench id={id} />
    </HydrationBoundary>
  )
}
