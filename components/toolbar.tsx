'use client'

import { ChevronDown } from 'lucide-react'
import { useCallback } from 'react'
import { useHotkeys } from 'react-hotkeys-hook'
import { useReactToPrint } from 'react-to-print'
import { toast } from 'sonner'
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
