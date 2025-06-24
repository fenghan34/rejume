import { dehydrate, HydrationBoundary } from '@tanstack/react-query'
import { ResumeList } from '@/components/resume-list'
import { getSession } from '@/lib/auth/server'
import { getResumeList } from '@/lib/db/queries'
import { getQueryClient } from '@/lib/query-client'

export default async function DashboardPage() {
  const session = await getSession()
  const queryClient = getQueryClient()

  await queryClient.prefetchQuery({
    queryKey: ['resumes'],
    queryFn: () => getResumeList(session!.user.id),
  })

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ResumeList />
    </HydrationBoundary>
  )
}
