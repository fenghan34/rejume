import { dehydrate, HydrationBoundary } from '@tanstack/react-query'
import { Logo } from '@/components/logo'
import { ModeToggle } from '@/components/mode-toggle'
import { ResumeList } from '@/components/resume-list'
import { UserAvatar } from '@/components/user-avatar'
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
    <div className="flex flex-col h-screen">
      <header className="flex items-center justify-between px-6 h-14">
        <Logo />

        <div className="flex items-center gap-2">
          <ModeToggle />

          <UserAvatar />
        </div>
      </header>

      <main className="flex-1 overflow-hidden">
        <HydrationBoundary state={dehydrate(queryClient)}>
          <ResumeList />
        </HydrationBoundary>
      </main>
    </div>
  )
}
