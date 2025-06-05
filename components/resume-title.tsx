'use client'

import { useParams } from 'next/navigation'
import {
  startTransition,
  useCallback,
  useEffect,
  useOptimistic,
  useState,
} from 'react'
import { toast } from 'sonner'
import { updateResume } from '@/app/dashboard/actions'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { useAppStore } from '@/providers/app'

const DEFAULT_TITLE = 'Untitled'

export function ResumeTitle({
  resumeId,
  title,
  className,
}: {
  resumeId: string
  title: string
  className?: string
}) {
  const [value, setValue] = useState(title)
  const [editing, setEditing] = useState(false)
  const [optimisticTitle, setOptimisticTitle] = useOptimistic<string, string>(
    title,
    (_, newTitle) => newTitle,
  )

  const save = useCallback(async () => {
    const v = value.trim() || DEFAULT_TITLE
    if (v === title) {
      setEditing(false)
      return
    }

    startTransition(async () => {
      setOptimisticTitle(v)
      setEditing(false)

      toast.promise(updateResume(resumeId, { title: v }), {
        error: 'Failed to update resume title, please try again.',
      })
    })
  }, [value, title, setOptimisticTitle, resumeId])

  useEffect(() => {
    setValue(title)
  }, [title])

  const commonClassName = 'w-full text-center text-sm font-medium rounded'

  if (!(editing || optimisticTitle.length === 0)) {
    return (
      <div
        title={optimisticTitle}
        className={cn(
          'px-3 cursor-text whitespace-nowrap overflow-hidden overflow-ellipsis hover:bg-input/50 transition-colors duration-300 ease-in-out',
          commonClassName,
          className,
        )}
        onClick={(e) => {
          e.stopPropagation()
          setEditing(true)
        }}
      >
        {optimisticTitle}
      </div>
    )
  }

  return (
    <Input
      name="resume-title"
      className={cn(
        'h-auto py-0 border-0 shadow-none focus-visible:ring-0 text-sm bg-input/50',
        commonClassName,
        className,
      )}
      autoFocus
      maxLength={30}
      value={value}
      onChange={(e) => setValue(e.target.value)}
      onClick={(e) => e.stopPropagation()}
      onKeyUp={(e) => {
        if (e.key === 'Enter') {
          save()
        }
      }}
      onBlur={save}
    />
  )
}

export function CurrentResumeTitle() {
  const { id } = useParams()
  const resumeId = useAppStore((state) => state.resume?.id)
  const title = useAppStore((state) => state.resume?.title)

  if (!resumeId || id !== resumeId || !title) return null

  return (
    <div className="w-60">
      <ResumeTitle
        resumeId={resumeId}
        title={title}
        className="py-1 text-accent-foreground/95 font-normal"
      />
    </div>
  )
}
