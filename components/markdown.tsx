import React, { memo } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

function PureMarkdown({ children }: { children: string }) {
  return (
    <ReactMarkdown
      skipHtml
      remarkPlugins={[remarkGfm]}
      components={{
        pre: ({ children }) => {
          return (
            <pre className="scrollbar-primary bg-accent text-accent-foreground py-4 border">
              {children}
            </pre>
          )
        },
      }}
    >
      {children}
    </ReactMarkdown>
  )
}

export const Markdown = memo(PureMarkdown, (prevProps, nextProps) => {
  return prevProps.children === nextProps.children
})
