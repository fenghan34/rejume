import { ScrollArea } from '@/components/ui/scroll-area'
import { useAppStore } from '@/providers/app'
import { NewResumeButton } from './new-resume-button'
import { ResumeListItem } from './resume-list-item'

export function ResumeList() {
  const list = useAppStore((state) => state.resumeList)

  return (
    <ScrollArea className="h-full @container">
      <div className="grid px-6 pt-6 pb-20 @lg:grid-cols-2 @3xl:grid-cols-3 @5xl:grid-cols-4 gap-x-6 gap-y-12">
        <>
          <NewResumeButton />

          {list.map((resume) => (
            <ResumeListItem
              key={resume.id}
              removable={list.length > 1}
              {...resume}
            />
          ))}
        </>
      </div>
    </ScrollArea>
  )
}
