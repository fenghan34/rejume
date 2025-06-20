'use client'

import { Plus } from 'lucide-react'
import { createResume } from '@/app/dashboard/actions'
import { Button } from './ui/button'

export function NewResumeButton() {
  return (
    <Button
      title="New example resume"
      variant="ghost"
      className={
        'w-60 h-fit aspect-[calc(210/297)] hover:scale-105 transition-transform duration-200 ease-in-out bg-background dark:bg-background/60 flex items-center justify-center rounded shadow-md border border-input text-muted-foreground cursor-pointer hover:bg-background'
      }
      onClick={async () => {
        const { default: exampleResume } = await import('@/examples/en.md')

        await createResume({
          title: '',
          content: exampleResume,
        })
      }}
    >
      <Plus />
    </Button>
  )
}
