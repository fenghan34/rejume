import type { ChatModel } from '@/lib/db/schema'
import { SquarePen } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from './ui/button'
import { Tooltip, TooltipTrigger, TooltipContent } from './ui/tooltip'

export function ChatHeader({
  chat,
  setChat,
  children,
}: {
  chat: ChatModel | null
  setChat: (chat: ChatModel | null) => void
  children: React.ReactNode
}) {
  return (
    <div className="px-4 py-2 flex items-center justify-between">
      <div
        className={cn(
          'px-2 py-0.5 text-sm bg-accent/80 border rounded truncate max-w-1/2',
          {
            invisible: !chat,
          },
        )}
        title={chat?.title}
      >
        {chat?.title}
      </div>
      <div className="space-x-0.5">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="size-8 cursor-pointer"
              onClick={() => setChat(null)}
            >
              <SquarePen />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="bottom">New chat</TooltipContent>
        </Tooltip>

        {children}
      </div>
    </div>
  )
}
