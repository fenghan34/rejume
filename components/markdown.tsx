import type { ResumeSuggestion } from './resume-suggestions'
import React, { memo } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { generateUUID } from '@/lib/utils'
import { ResumeSuggestions } from './resume-suggestions'
import { Skeleton } from './ui/skeleton'

function parseSuggestions(content: string): ResumeSuggestion[] | null {
  try {
    const jsonMatch = content.trim().match(/^\[\s*\{[\s\S]*\}\s*\]$/)
    if (!jsonMatch) return null

    const jsonStr = jsonMatch[0]
    const suggestions = JSON.parse(jsonStr) as ResumeSuggestion[]

    if (!Array.isArray(suggestions)) return []

    return suggestions.map((suggestion) => ({
      id: suggestion.id ?? generateUUID(),
      section: suggestion.section ?? '',
      original: suggestion.original ?? '',
      suggested: suggestion.suggested ?? '',
      explanation: suggestion.explanation ?? '',
    }))
  } catch {
    console.error('Failed to parse suggestions:', content)
    return []
  }
}

function PureMarkdown({ children }: { children: string }) {
  return (
    <ReactMarkdown
      skipHtml
      remarkPlugins={[remarkGfm]}
      components={{
        pre: ({ children, node }) => {
          const child = node?.children[0]
          const isSuggestions =
            child?.type === 'element' &&
            Array.isArray(child.properties.className) &&
            child.properties.className.includes('language-json-suggestions')

          if (isSuggestions && child.children[0].type === 'text') {
            const suggestions = parseSuggestions(child.children[0].value)

            if (!suggestions) {
              return (
                <div className="space-y-4">
                  {Array.from({ length: 3 }).map((_, index) => (
                    <Skeleton key={index} className="w-full h-28" />
                  ))}
                </div>
              )
            }

            return <ResumeSuggestions suggestions={suggestions} />
          }

          return (
            <pre className="scrollbar-primary bg-accent text-accent-foreground py-4 border overflow-x-auto w-full">
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
