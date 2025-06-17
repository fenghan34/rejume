import { Trash2, History } from 'lucide-react'
import { useState } from 'react'
import { ChatModel } from '@/lib/db/schema'
import { cn } from '@/lib/utils'
import { Button } from './ui/button'
import { Popover, PopoverTrigger, PopoverContent } from './ui/popover'
import { Tooltip, TooltipTrigger, TooltipContent } from './ui/tooltip'

export function ChatHistory({
  chats,
  currentChat,
  onSelectChat,
  onDeleteChat,
}: {
  chats?: ChatModel[]
  currentChat: ChatModel | null
  onSelectChat: (chat: ChatModel) => void
  onDeleteChat: (chat: ChatModel) => void
}) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <Tooltip>
        <TooltipTrigger asChild>
          <PopoverTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="size-8 cursor-pointer"
            >
              <History />
            </Button>
          </PopoverTrigger>
        </TooltipTrigger>

        <TooltipContent side="bottom">Chat history</TooltipContent>
      </Tooltip>

      <PopoverContent
        side="bottom"
        align="end"
        sideOffset={10}
        className="w-80 p-2 text-xs"
      >
        {chats && chats.length > 0 ? (
          <div className="space-y-1">
            {chats.map((chat) => (
              <div
                key={chat.id}
                className={cn(
                  'w-full cursor-pointer hover:bg-accent transition-all rounded px-2 py-1 flex items-center justify-between group',
                  { 'bg-accent': chat.id === currentChat?.id },
                )}
                onClick={() => {
                  onSelectChat(chat)
                  setIsOpen(false)
                }}
              >
                <div className="truncate max-w-60" title={chat.title}>
                  {chat.title}
                </div>

                <Button
                  variant="ghost"
                  size="icon"
                  className={cn(
                    'size-4 cursor-pointer invisible group-hover:visible',
                    {
                      visible: chat.id === currentChat?.id,
                    },
                  )}
                  onClick={(e) => {
                    e.stopPropagation()
                    onDeleteChat(chat)
                    if (chats.length === 1) {
                      setIsOpen(false)
                    }
                  }}
                >
                  <Trash2 className="size-3" />
                </Button>
              </div>
            ))}
          </div>
        ) : (
          <div>No chats yet</div>
        )}
      </PopoverContent>
    </Popover>
  )
}
