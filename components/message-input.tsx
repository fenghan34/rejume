import { UseChatHelpers } from '@ai-sdk/react'
import { Paperclip, Square, ArrowUp } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from './ui/button'
import { Textarea } from './ui/textarea'

export function MessageInput({
  input,
  status,
  stop,
  handleInputChange,
  handleSubmit,
}: Pick<
  UseChatHelpers,
  'input' | 'status' | 'stop' | 'handleInputChange' | 'handleSubmit'
>) {
  const isLoading = status === 'submitted' || status === 'streaming'

  return (
    <div className="flex justify-center p-8">
      <form
        onSubmit={handleSubmit}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            handleSubmit(e)
          }
        }}
        className="mx-auto p-2 w-full max-w-3xl border rounded-2xl shadow-sm focus-within:ring"
      >
        <Textarea
          autoFocus
          value={input}
          onChange={handleInputChange}
          placeholder="Type your message..."
          className="ring-0 border-0 focus-visible:ring-0 shadow-none focus-visible:border-0 resize-none min-h-[3rem] max-h-[10rem] p-1"
        />
        <div className="flex items-center justify-between">
          <Button variant="ghost" className="cursor-pointer size-6">
            <Paperclip />
          </Button>
          {isLoading ? (
            <Button
              disabled={!isLoading}
              onClick={stop}
              className={cn(
                'rounded-full size-6',
                isLoading && 'cursor-pointer',
              )}
            >
              <Square className="size-2 bg-background" />
            </Button>
          ) : (
            <Button
              type="submit"
              disabled={!input}
              className={cn('rounded-full size-6', input && 'cursor-pointer')}
            >
              <ArrowUp className="size-4" />
            </Button>
          )}
        </div>
      </form>
    </div>
  )
}
