import { NewResumeButton } from '@/components/new-resume-button'
import { ResumeCard } from '@/components/resume-card'
import { getResumeList } from '@/lib/db/queries'

export default async function ResumeListPage() {
  const list = await getResumeList()
  return (
    <div className="h-full overflow-y-auto scrollbar-primary flex flex-wrap gap-10 px-6 pb-6 pt-4">
      <NewResumeButton />

      {list.map((resume) => (
        <ResumeCard {...resume} key={resume.id} />
      ))}
    </div>
  )
}
