import { NewResumeButton } from '@/components/new-resume-button'
import { ResumeCard } from '@/components/resume-card'
import { getResumeList } from '@/lib/db/queries'

export default async function ResumeListPage() {
  const list = await getResumeList()
  return (
    <div className="h-full @container flex gap-x-6 gap-y-12 py-6">
      <NewResumeButton />

      {list.map((resume) => (
        <ResumeCard {...resume} key={resume.id} />
      ))}
    </div>
  )
}
