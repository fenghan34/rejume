import { UseChatHelpers } from '@ai-sdk/react'
import { Paperclip, Square, ArrowUp } from 'lucide-react'
import { memo, useEffect, useRef } from 'react'
import { cn } from '@/lib/utils'
import { Button } from './ui/button'
import { Textarea } from './ui/textarea'

function PureMessageInput({
  input,
  status,
  stop,
  handleInputChange,
  handleSubmit,
}: Pick<
  UseChatHelpers,
  'input' | 'status' | 'stop' | 'handleInputChange' | 'handleSubmit'
>) {
  const ref = useRef<HTMLTextAreaElement>(null)
  const isLoading = status === 'submitted' || status === 'streaming'

  useEffect(() => {
    if (ref.current) {
      ref.current.focus()
    }
  }, [input])

  return (
    <div className="flex justify-center px-8 pb-6 z-10">
      <form
        onSubmit={handleSubmit}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            handleSubmit(e)
          }
        }}
        className="mx-auto p-2 w-full max-w-3xl rounded-2xl shadow-sm focus-within:ring border"
      >
        <Textarea
          ref={ref}
          autoFocus
          value={input}
          onChange={handleInputChange}
          placeholder="Type your message..."
          className="ring-0 border-0 focus-visible:ring-0 shadow-none focus-visible:border-0 resize-none min-h-[3rem] max-h-[10rem] p-1 scrollbar-primary"
        />
        <div className="flex items-center justify-between">
          <Button variant="ghost" className="cursor-pointer size-8">
            <Paperclip />
          </Button>
          {isLoading ? (
            <Button
              disabled={!isLoading}
              onClick={stop}
              className={cn(
                'rounded-full size-8',
                isLoading && 'cursor-pointer',
              )}
            >
              <Square className="size-2 bg-background" />
            </Button>
          ) : (
            <Button
              type="submit"
              disabled={!input}
              className={cn('rounded-full size-8', input && 'cursor-pointer')}
            >
              <ArrowUp />
            </Button>
          )}
        </div>
      </form>
    </div>
  )
}

export const MessageInput = memo(PureMessageInput, (prev, next) => {
  if (prev.input !== next.input) return false
  if (prev.status !== next.status) return false
  return true
})
