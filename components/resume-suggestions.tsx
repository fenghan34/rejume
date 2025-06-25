'use client'

import {
  Check,
  ChevronsUpDownIcon,
  Copy,
  Loader2,
  Sparkles,
} from 'lucide-react'
import React, { memo, useState } from 'react'
import { toast } from 'sonner'
import { updateResume } from '@/app/dashboard/actions'
import { useAppStore } from '@/providers/app'
import { Markdown } from './markdown'
import { Button } from './ui/button'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from './ui/collapsible'

export type ResumeSuggestion = {
  id: string
  section: string
  original: string
  suggested: string
  explanation: string
}

function PureResumeSuggestions({
  suggestions,
}: {
  suggestions: ResumeSuggestion[]
}) {
  return (
    <div className="space-y-4">
      {suggestions.map((suggestion) => (
        <SuggestionItem key={suggestion.id} suggestion={suggestion} />
      ))}
    </div>
  )
}

function SuggestionItem({ suggestion }: { suggestion: ResumeSuggestion }) {
  const [copied, setCopied] = useState(false)
  const resume = useAppStore((state) => state.resume)
  const [status, setStatus] = useState<
    'pending' | 'applied' | 'outdated' | 'applying'
  >(() => {
    if (resume?.content.includes(suggestion.suggested)) {
      return 'applied'
    }
    if (resume?.content.includes(suggestion.original)) {
      return 'pending'
    }
    return 'outdated'
  })
  const [open, setOpen] = useState(() => status === 'pending')

  const handleApplySuggestion = async () => {
    if (!resume) return

    setStatus('applying')

    const newContent = resume.content.replace(
      suggestion.original,
      suggestion.suggested,
    )

    try {
      await updateResume(resume.id, { content: newContent })
      setStatus('applied')
    } catch (error) {
      toast.error('Failed to apply suggestion, please try again.')
      console.error(error)
    }
  }

  const handleCopy = async () => {
    await navigator.clipboard.writeText(suggestion.suggested)
    setCopied(true)
    setTimeout(() => {
      setCopied(false)
    }, 2000)
  }

  return (
    <Collapsible
      key={suggestion.id}
      open={open}
      onOpenChange={setOpen}
      className="rounded-sm border overflow-hidden group"
    >
      <div className="flex items-center justify-between px-3 py-1.5 bg-primary/5 hover:bg-transparent transition-colors">
        <div className="inline-flex items-center gap-2">
          {status === 'applied' ? (
            <Check className="size-3" />
          ) : (
            <Sparkles className="size-3" />
          )}
          <span className="font-medium text-xs">{suggestion.section}</span>
        </div>

        <div className="flex items-center gap-0.5">
          <Button
            variant="ghost"
            size="icon"
            className="size-6 cursor-pointer opacity-0 transition-opacity group-hover:opacity-100"
            onClick={handleCopy}
          >
            {copied ? (
              <Check className="size-3" />
            ) : (
              <Copy className="size-3" />
            )}
          </Button>

          {status === 'pending' || status === 'applying' ? (
            <Button
              variant="ghost"
              size="icon"
              className="size-6 cursor-pointer text-xs w-auto p-1.5"
              disabled={status === 'applying'}
              onClick={handleApplySuggestion}
            >
              {status === 'applying' ? (
                <Loader2 className="size-3 animate-spin" />
              ) : (
                'Apply'
              )}
            </Button>
          ) : (
            <CollapsibleTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="size-6 cursor-pointer"
              >
                <ChevronsUpDownIcon className="size-3" />
              </Button>
            </CollapsibleTrigger>
          )}
        </div>
      </div>

      <CollapsibleContent className="m-3 prose-sm prose-headings:text-sm prose-headings:mt-0 prose-ul:pl-4 prose-ul:list-[circle] prose-li:my-0 prose-li:marker:text-inherit">
        <Markdown>{suggestion.suggested}</Markdown>
      </CollapsibleContent>
    </Collapsible>
  )
}

export const ResumeSuggestions = memo(PureResumeSuggestions)
ResumeSuggestions.displayName = 'MemoizedResumeSuggestions'
