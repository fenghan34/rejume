'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import React, { memo, useEffect, useState } from 'react'
import { toast } from 'sonner'
import { updateResume } from '@/app/dashboard/actions'
import { Input } from '@/components/ui/input'
import { ResumeModel } from '@/lib/db/schema'
import { cn } from '@/lib/utils'
import { useWorkbenchContext } from '@/providers/workbench'
import { getResumeQueryKey } from './workbench'

function PureResumeTitle({
  value,
  className,
  onSave,
}: {
  value: string
  className?: string
  onSave: (value: string) => void
}) {
  const [input, setInput] = useState(value)
  const [editing, setEditing] = useState(value.length === 0)

  const save = () => {
    let v = input.trim()
    setEditing(false)

    if (v.length === 0) {
      v = 'Untitled'
      setInput(v)
    }

    if (v !== value) {
      onSave(v)
    }
  }

  useEffect(() => {
    setInput(value)
  }, [value])

  const commonClassName = 'w-full text-center text-sm font-medium rounded'

  if (!editing) {
    return (
      <div
        title={input}
        className={cn(
          'px-3 cursor-text truncate hover:bg-input/50 transition-colors duration-300 ease-in-out',
          commonClassName,
          className,
        )}
        onClick={(e) => {
          e.stopPropagation()
          setEditing(true)
        }}
      >
        {input}
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
      value={input}
      onChange={(e) => setInput(e.target.value)}
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

export const ResumeTitle = memo(PureResumeTitle)

export function CurrentResumeTitle() {
  const { resume } = useWorkbenchContext()
  const queryKey = getResumeQueryKey(resume.id)
  const queryClient = useQueryClient()

  const { mutate } = useMutation({
    mutationFn: (title: string) => updateResume(resume.id, { title }),
    onMutate: async (title) => {
      await queryClient.cancelQueries({ queryKey })

      const previousResume = queryClient.getQueryData(queryKey)
      queryClient.setQueryData(queryKey, (old: ResumeModel) => ({
        ...old,
        title: title,
      }))

      return { previousResume }
    },
    onError: (_, __, context) => {
      toast.error('Failed to update resume, please try again.')
      queryClient.setQueryData(queryKey, context!.previousResume)
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey })
      queryClient.invalidateQueries({ queryKey: ['resumes'] })
    },
  })

  return (
    <ResumeTitle
      value={resume.title}
      onSave={mutate}
      className="w-44 text-left"
    />
  )
}
