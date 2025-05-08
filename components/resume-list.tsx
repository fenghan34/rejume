'use client'

import { Plus, X } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useRef } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { useShallow } from 'zustand/react/shallow'
import { Button } from '@/components/ui/button'
import exampleResumeContent from '@/examples/en.md'
import { useAutoScale } from '@/hooks/useAutoScale'
import { cn } from '@/lib/utils'
import { useAppStore } from '@/providers/app'
import { Resume } from '@/stores/resume-slice'
import { EditableTitle } from './editable-title'
import { Preview } from './preview'

const CURRENT_RESUME_CLASS = 'is-current'

export function ResumeList() {
  const listRef = useRef<HTMLDivElement>(null)
  const currentRef = useRef<HTMLDivElement>(null)
  const [list, current] = useAppStore(
    useShallow((state) => [state.resumeList, state.resume]),
  )

  return (
    <div ref={listRef} className="h-full @container flex gap-x-6 gap-y-12 py-6">
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
  )
}

function NewResumeButton() {
  const createResume = useAppStore((state) => state.createResume)

  return (
    <Button
      title="Create new resume"
      variant="ghost"
      className={
        'w-60 h-fit aspect-[calc(210/297)] hover:scale-105 transition-transform duration-200 bg-background flex items-center justify-center rounded shadow-md border border-input text-muted-foreground cursor-pointer hover:bg-background'
      }
      onClick={() =>
        createResume({
          id: uuidv4(),
          title: '',
          content: exampleResumeContent,
          createdTime: Date.now(),
          updatedTime: Date.now(),
        })
      }
    >
      <Plus />
    </Button>
  )
}

function ResumeListItem({
  id,
  title,
  content,
  updatedTime,
  removable,
  className,
  ref,
}: Resume & { removable: boolean; className?: string } & Pick<
    React.HTMLProps<HTMLDivElement>,
    'className' | 'ref'
  >) {
  const router = useRouter()
  const [update, remove, set] = useAppStore(
    useShallow((state) => [
      state.updateResume,
      state.removeResume,
      state.setResume,
    ]),
  )
  const autoScaleRef = useAutoScale()

  return (
    <div
      ref={ref}
      className={cn(
        'w-fit relative hover:scale-105 transition-transform duration-200 cursor-pointer group',
        className,
      )}
    >
      {removable && (
        <Button
          className="absolute top-0 right-0 z-10 cursor-pointer group-hover:visible invisible opacity-60 hover:opacity-100 hover:bg-inherit"
          variant="ghost"
          size="icon"
          onClick={() => remove(id)}
        >
          <X />
        </Button>
      )}

      <div className="w-60 flex flex-col items-center space-y-3">
        <div
          className={`w-full h-fit aspect-[calc(210/297)] group-[.${CURRENT_RESUME_CLASS}]:border`}
          onClick={() => {
            set(id)

            router.push(`/resume/${id}`)
          }}
        >
          <Preview
            ref={autoScaleRef}
            content={content}
            className="overflow-hidden pointer-events-none"
          />
        </div>

        <div className="text-center space-y-0.5">
          <EditableTitle
            value={title}
            onSave={(v) => {
              if (title !== v) {
                update(id, { title: v })
              }
            }}
          />
          <div
            suppressHydrationWarning
            className="text-xs text-muted-foreground"
          >
            {new Date(updatedTime).toLocaleString()}
          </div>
        </div>
      </div>
    </div>
  )
}
