import { X } from 'lucide-react'
import { useShallow } from 'zustand/react/shallow'
import { Button } from '@/components/ui/button'
import { useAutoScale } from '@/hooks/useAutoScale'
import { cn } from '@/lib/utils'
import { useAppStore } from '@/providers/app'
import { Resume } from '@/stores/resume-slice'
import { Preview } from '../preview'
import { EditableTitle } from './editable-title'

export function ResumeListItem({
  id,
  title,
  content,
  updatedTime,
  removable,
}: Resume & { removable: boolean }) {
  const [isCurrent, update, remove, set] = useAppStore(
    useShallow((state) => [
      state.resume.id === id,
      state.updateResume,
      state.removeResume,
      state.setResume,
    ]),
  )
  const autoScaleRef = useAutoScale()

  return (
    <div
      className={cn(
        'w-fit relative hover:scale-105 transition-transform duration-200 cursor-pointer group',
        isCurrent ? 'scale-105' : 'opacity-80 hover:opacity-100',
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
          className={cn(
            'w-full h-fit aspect-[calc(210/297)]',
            isCurrent && 'border',
          )}
          onClick={() => set(id)}
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
