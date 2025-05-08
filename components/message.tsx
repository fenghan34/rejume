import { UIMessage } from 'ai'
import { cn } from '@/lib/utils'

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
              <p
                key={`${message.id}-${part.type}-${i}`}
                className={cn(
                  'rounded-xl px-3 py-1.5',
                  message.role === 'user'
                    ? 'bg-primary/10 text-primary max-w-[80%]'
                    : '',
                )}
              >
                {part.text}
              </p>
            )
        }
      })}
    </div>
  )
}
