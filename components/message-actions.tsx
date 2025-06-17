import type { Message } from 'ai'
import { Check, Copy } from 'lucide-react'
import { useState, memo } from 'react'
import { toast } from 'sonner'
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'
import { useAppStore } from '@/providers/app'
import { Button } from './ui/button'

function PureMessageActions({
  message,
  loading,
}: {
  message: Message
  loading: boolean
}) {
  const [copied, setCopied] = useState(false)
  const copiedMessageId = useAppStore((state) => state.copiedMessageId)
  const setCopiedMessageId = useAppStore((state) => state.setCopiedMessageId)

  const handleCopy = async () => {
    const textFromParts = message.parts
      ?.filter((part) => part.type === 'text')
      .map((part) => part.text)
      .join('\n')
      .trim()

    if (textFromParts) {
      await navigator.clipboard.writeText(textFromParts)
      setCopied(true)
      setCopiedMessageId(message.id)
      setTimeout(() => {
        setCopied(false)
      }, 2000)
    } else {
      toast.error('No text to copy')
    }
  }

  return (
    <div
      className={cn(
        'flex group-data-[role=user]/message:justify-end group-data-[role=assistant]/message:justify-start opacity-0 group-hover/message:opacity-100 transition-opacity duration-200 ease-in-out transform group-data-[role=user]/message:translate-x-1.5 group-data-[role=assistant]/message:-translate-x-1.5',
        {
          'opacity-100': copiedMessageId === message.id,
          '!opacity-0': loading,
          'group-last/message:opacity-100': message.role === 'assistant',
          'group-last/message:opacity-0': message.role === 'user',
        },
      )}
    >
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            className="size-8 cursor-pointer"
            onClick={handleCopy}
          >
            {copied ? <Check /> : <Copy />}
          </Button>
        </TooltipTrigger>
        <TooltipContent side="bottom">Copy</TooltipContent>
      </Tooltip>
    </div>
  )
}

export const MessageActions = memo(PureMessageActions, (prev, next) => {
  if (prev.message.id !== next.message.id) return false
  if (prev.loading !== next.loading) return false

  return true
})
