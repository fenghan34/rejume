import { Plus } from 'lucide-react'
import { v4 as uuidv4 } from 'uuid'
import { Button } from '@/components/ui/button'
import exampleResumeContent from '@/examples/en.md'
import { useAppStore } from '@/providers/app'

export function NewResumeButton() {
  const createResume = useAppStore((state) => state.createResume)

  return (
    <Button
      title="Create new resume"
      variant="ghost"
      className={
        'w-60 h-auto aspect-[calc(210/297)] hover:scale-105 transition-transform duration-200 bg-background flex items-center justify-center rounded shadow-md border border-input text-muted-foreground cursor-pointer hover:bg-background'
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
