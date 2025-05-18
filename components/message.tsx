import { UIMessage } from 'ai'
import React, { memo } from 'react'
import ReactMarkdown from 'react-markdown'
import { cn } from '@/lib/utils'

const Markdown = memo(ReactMarkdown, (prevProps, nextProps) => {
  return prevProps.children === nextProps.children
})

export function Message({ message }: { message: UIMessage }) {
  return (
    <div
      className={cn(
        'flex',
        message.role === 'user' ? 'justify-end' : 'justify-start',
      )}
    >
      {message.parts.map((part, i) => {
        switch (part.type) {
          case 'text':
            return (
              <div
                key={`${message.id}-${part.type}-${i}`}
                className={cn(
                  'prose prose-sm dark:prose-invert max-w-none break-words',
                  message.role === 'user' &&
                    'bg-black/10 dark:bg-white/10 max-w-[80%] rounded-2xl px-3 py-1',
                )}
              >
                <Markdown>{part.text}</Markdown>
              </div>
            )
        }
      })}
    </div>
  )
}
