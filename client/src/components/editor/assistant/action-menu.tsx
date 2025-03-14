import { Button } from '@/components/ui/button'
import { Sparkles } from 'lucide-react'

export function ActionMenu() {
  return (
    <div className="mb-2 select-none border shadow-sm bg-white rounded-md p-1 flex items-center">
      <Button
        className="cursor-pointer"
        size="sm"
        variant="ghost"
        id="improve-writing"
      >
        <Sparkles />
        Improve writing
      </Button>
    </div>
  )
}
