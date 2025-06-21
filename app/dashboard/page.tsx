import { NewResumeButton } from '@/components/new-resume-button'
import { ResumeCard } from '@/components/resume-card'
import { getSession } from '@/lib/auth/server'
import { getResumeList } from '@/lib/db/queries'

export default async function DashboardPage() {
  const session = await getSession()
  const list = await getResumeList(session!.user.id)

  return (
    <div className="h-full overflow-y-auto scrollbar-primary flex flex-wrap gap-10 p-6">
      <NewResumeButton />

      {list.map((resume) => (
        <ResumeCard {...resume} key={resume.id} />
      ))}
    </div>
  )
}
