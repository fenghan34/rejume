import { Button } from '@/components/ui/button'
import { Sparkles } from 'lucide-react'
import { ReactNode } from 'react'

function ActionButton({ id, children }: { id: string, children: ReactNode }) {
  return (
    <Button
      id={id}
      size="sm"
      variant="ghost"
      className="cursor-pointer"
    >
      {children}
    </Button>
  )
}

export function ActionMenu() {
  return (
    <div className="p-0.5 mb-2 select-none bg-background border shadow-sm rounded-md flex items-center">
      <ActionButton id="improve-writing">
        <Sparkles />
        Improve writing
      </ActionButton>
    </div>
  )
}
