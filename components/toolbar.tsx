'use client'

import type { WorkbenchSlice } from '@/stores/workbench-slice'
import { ChevronDown } from 'lucide-react'
import { usePathname } from 'next/navigation'
import { ComponentProps, useCallback } from 'react'
import { useReactToPrint } from 'react-to-print'
import { toast } from 'sonner'
import { importFromPDF } from '@/app/dashboard/actions'
import exampleResume from '@/examples/en.md'
import { cn, downloadMarkdown } from '@/lib/utils'
import { useAppStore } from '@/providers/app'
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

export function Toolbar() {
  const pathname = usePathname()
  const sidebar = useAppStore((state) => state.sidebar)
  const editor = useAppStore((state) => state.editor)
  const setSidebar = useAppStore((state) => state.setSidebar)

  const print = useReactToPrint({})
  const printHandler = useCallback(
    () => print(() => document.querySelector(`.${PREVIEW_CLASS}`)),
    [print],
  )

  if (['/dashboard', '/'].includes(pathname)) return null

  return (
    <div className="flex items-center justify-end gap-2">
      <Tabs
        value={sidebar}
        onValueChange={(value) =>
          setSidebar(value as WorkbenchSlice['sidebar'])
        }
      >
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

export function ImportButton({
  className,
  children,
  ...rest
}: { resumeId?: string } & ComponentProps<typeof Button>) {
  const editor = useAppStore((state) => state.editor)
  const resumeId = useAppStore((state) => state.resume?.id)

  const importHandler = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]

      if (file) {
        toast.promise(
          async () => {
            let content = ''

            switch (file.type) {
              case 'application/pdf':
                content = await importFromPDF(file, exampleResume)
                break
              case 'text/markdown':
                content = await file.text()
                break
            }

            editor?.setValue(content)
          },
          {
            loading: `Importing from file ${file.name}`,
            success: `Imported successfully`,
            error: `Failed to import from file ${file.name}. Please try again.`,
          },
        )
      }
    },
    [editor],
  )

  if (!resumeId || !editor) return null

  return (
    <Button
      size="sm"
      variant="ghost"
      className={cn('cursor-pointer', className)}
      title="Import"
      asChild
      {...rest}
    >
      <Label htmlFor="import">
        {children || 'Import'}
        <Input
          id="import"
          type="file"
          accept="application/pdf, text/markdown"
          className="hidden"
          onChange={importHandler}
        />
      </Label>
    </Button>
  )
}
