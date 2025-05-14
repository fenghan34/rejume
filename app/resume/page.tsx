import { NewResumeButton } from '@/components/new-resume-button'
import { ResumeCard } from '@/components/resume-card'
import { getResumeList } from '@/lib/db/queries'

export default async function ResumeListPage() {
  const list = await getResumeList()
  return (
    <div className="flex flex-wrap justify-between gap-y-12 px-4 pt-2 pb-4">
      <NewResumeButton />

      {list.map((resume) => (
        <ResumeCard {...resume} key={resume.id} />
      ))}
    </div>
  )
}
