'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { ChevronDown } from 'lucide-react'
import Link from 'next/link'
import { useCallback, useState, useEffect } from 'react'
import { useHotkeys } from 'react-hotkeys-hook'
import { useReactToPrint } from 'react-to-print'
import { toast } from 'sonner'
import { updateResume } from '@/app/dashboard/actions'
import { ResumeModel } from '@/lib/db/schema'
import { MonacoEditor } from '@/lib/monaco/types'
import { cn, downloadMarkdown } from '@/lib/utils'
import { useWorkbenchContext } from '@/providers/workbench'
import { Button } from './ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover'
import { Tabs, TabsList, TabsTrigger } from './ui/tabs'
import { PREVIEW_CLASS } from './workbench'

export function Toolbar({
  editor,
  mode,
  handleModeChange,
}: {
  editor: MonacoEditor | null
  mode: string
  handleModeChange: (mode: string) => void
}) {
  const print = useReactToPrint({})
  const printHandler = useCallback(
    () => print(() => document.querySelector(`.${PREVIEW_CLASS}`)),
    [print],
  )

  useHotkeys('meta+p', printHandler, {
    preventDefault: true,
    enableOnFormTags: ['input', 'textarea', 'select'],
  })

  return (
    <div className={cn('flex items-center justify-end gap-2')}>
      <Tabs value={mode} onValueChange={handleModeChange}>
        <TabsList>
          <TabsTrigger value="editor" title="Editor">
            Editor
          </TabsTrigger>
          <TabsTrigger value="chat" title="Chat">
            Chat
          </TabsTrigger>
        </TabsList>
      </Tabs>

      <div>
        <PublishButton />

        <ImportButton />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              size="sm"
              variant="ghost"
              className="cursor-pointer gap-1"
              title="Export options"
            >
              Export <ChevronDown className="size-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            <DropdownMenuItem onClick={printHandler} title="Export as PDF">
              Export as PDF
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => downloadMarkdown(editor?.getValue() || '')}
              title="Export as Markdown"
            >
              Export as Markdown
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}

export function ImportButton() {
  const { updateResumeContent } = useWorkbenchContext()
  const importHandler = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]

      if (file) {
        toast.promise(
          async () => {
            let content = ''

            switch (file.type) {
              case 'text/markdown':
                content = await file.text()
                break
            }

            updateResumeContent(content)
          },
          {
            loading: `Importing from ${file.name}...`,
            success: `Imported successfully`,
            error: `Failed to import from ${file.name}. Please try again.`,
          },
        )
      }
    },
    [updateResumeContent],
  )

  return (
    <Button
      size="sm"
      variant="ghost"
      className="cursor-pointer"
      title="Import"
      asChild
    >
      <Label htmlFor="import">
        Import
        <Input
          id="import"
          type="file"
          accept="text/markdown"
          className="hidden"
          onChange={importHandler}
        />
      </Label>
    </Button>
  )
}

function PublishButton() {
  const { resume } = useWorkbenchContext()
  const queryClient = useQueryClient()
  const [publicUrl, setPublicUrl] = useState<string>('')

  const { isPending, mutateAsync } = useMutation({
    mutationFn: (isPublic: boolean) => updateResume(resume.id, { isPublic }),
    onSuccess: (_, isPublic) => {
      queryClient.setQueryData(['resumes', resume.id], (old: ResumeModel) => ({
        ...old,
        isPublic,
      }))
      queryClient.invalidateQueries({ queryKey: ['resumes', resume.id] })
    },
  })

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setPublicUrl(`${window.location.origin}/public/${resume.id}`)
    }
  }, [resume.id])

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(publicUrl)
      toast.success('Link copied!')
    } catch (error) {
      toast.error('Failed to copy link')
      console.error('Copy error:', error)
    }
  }

  const handlePublishToggle = useCallback(
    async (isPublic: boolean) => {
      toast.promise(() => mutateAsync(isPublic), {
        loading: 'Publish your resume...',
        success: isPublic ? 'Resume published!' : 'Resume unpublished.',
        error: 'Failed to publish resume',
      })
    },
    [mutateAsync],
  )

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          size="sm"
          variant="ghost"
          className="cursor-pointer"
          title="Share"
        >
          Publish
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="space-y-4">
          <div>
            <h4 className="font-medium">Publish</h4>
            <p className="text-sm text-muted-foreground">Publish to the web</p>
          </div>

          {resume.isPublic && (
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Input
                  value={publicUrl}
                  readOnly
                  className="text-xs h-7 bg-muted"
                />
                <Button
                  onClick={handleCopyLink}
                  size="sm"
                  className="cursor-pointer h-7 px-2"
                >
                  Copy
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Anyone with this link can view your resume
              </p>
            </div>
          )}

          {resume.isPublic ? (
            <div className="flex justify-between items-center gap-2">
              <Button
                size="sm"
                variant="outline"
                className="flex-1 cursor-pointer"
                onClick={() => handlePublishToggle(false)}
                disabled={isPending}
              >
                Unpublish
              </Button>

              <Button
                size="sm"
                variant="outline"
                className="flex-1 cursor-pointer"
                asChild
                disabled={isPending}
              >
                <Link target="_blank" href={publicUrl}>
                  View
                </Link>
              </Button>
            </div>
          ) : (
            <Button
              size="sm"
              className="w-full cursor-pointer mt-3"
              onClick={() => handlePublishToggle(true)}
              disabled={isPending}
            >
              Publish
            </Button>
          )}
        </div>
      </PopoverContent>
    </Popover>
  )
}
