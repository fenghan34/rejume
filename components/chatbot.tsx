'use client'

import { useChat } from '@ai-sdk/react'
import { ArrowUp, Paperclip, Square } from 'lucide-react'
import { useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { cn } from '@/lib/utils'
import { Message } from './message'
import { Textarea } from './ui/textarea'

export function Chatbot({
  resourceId,
  threadId,
}: {
  resourceId: string
  threadId: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  const { messages, input, status, stop, handleInputChange, handleSubmit } =
    useChat({
      maxSteps: 5,
      experimental_prepareRequestBody: (request) => {
        const lastMessage =
          request.messages.length > 0
            ? request.messages[request.messages.length - 1]
            : null

        return {
          message: lastMessage,
          threadId,
          resourceId,
        }
      },
    })

  useEffect(() => {
    if (messages.length > 0) {
      ref.current?.scrollTo({
        top: ref.current?.scrollHeight,
      })
    }
  }, [messages])

  const isLoading = status === 'submitted' || status === 'streaming'

  return (
    <div className="bg-sidebar text-primary flex flex-col h-full">
      <ScrollArea className="flex-1 p-4" viewportProps={{ ref }}>
        <div className="space-y-4">
          {messages.map((message) => (
            <Message key={message.id} message={message} />
          ))}
        </div>
      </ScrollArea>

      <form
        onSubmit={handleSubmit}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            handleSubmit(e)
          }
        }}
        className="m-4 p-2 border rounded-2xl focus-within:ring"
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
