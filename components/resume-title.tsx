'use client'

import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { useAppStore } from '@/providers/app'

export function ResumeTitle({
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

export function CurrentResumeTitle() {
  const { id } = useParams()
  const resumeId = useAppStore((state) => state.resume?.id)
  const title = useAppStore((state) => state.resume?.title)

  if (!resumeId || id !== resumeId || !title) return null

  return (
    <div className="w-60">
      <ResumeTitle
        value={title}
        className="py-1 text-accent-foreground/95 font-normal"
        onSave={() => {}}
      />
    </div>
  )
}
