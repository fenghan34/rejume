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
                  'rounded-xl px-3 py-1.5',
                  message.role === 'user' &&
                    'bg-primary/10 text-primary max-w-[80%]',
                )}
              >
                <div className="prose prose-sm dark:prose-invert break-words">
                  <Markdown>{part.text}</Markdown>
                </div>
              </div>
            )
        }
      })}
    </div>
  )
}
