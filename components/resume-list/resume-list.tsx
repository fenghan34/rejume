import { useEffect, useRef } from 'react'
import { useShallow } from 'zustand/react/shallow'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useAppStore } from '@/providers/app'
import { NewResumeButton } from './new-resume-button'
import { ResumeListItem } from './resume-list-item'

export const CURRENT_RESUME_CLASS = 'is-current'

export function ResumeList() {
  const listRef = useRef<HTMLDivElement>(null)
  const currentRef = useRef<HTMLDivElement>(null)
  const [list, current] = useAppStore(
    useShallow((state) => [state.resumeList, state.resume]),
  )

  useEffect(() => {
    if (!listRef.current || !currentRef.current) return

    listRef.current.scrollTo({
      top: currentRef.current.offsetTop - 30,
      behavior: 'smooth',
    })
  }, [])

  return (
    <ScrollArea className="h-full @container" viewportProps={{ ref: listRef }}>
      <div className="grid px-6 pt-6 pb-20 @lg:grid-cols-2 @3xl:grid-cols-3 @5xl:grid-cols-4 gap-x-6 gap-y-12">
        <NewResumeButton />

        {list.map((resume) => (
          <ResumeListItem
            key={resume.id}
            ref={resume.id === current.id ? currentRef : null}
            removable={list.length > 1}
            className={
              resume.id === current.id
                ? `scale-105 ${CURRENT_RESUME_CLASS}`
                : 'opacity-80 hover:opacity-100'
            }
            {...resume}
          />
        ))}
      </div>
    </ScrollArea>
  )
}
