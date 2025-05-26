'use client'

import type { WorkbenchSlice } from '@/stores/workbench-slice'
import { useParams, usePathname } from 'next/navigation'
import { useCallback } from 'react'
import { useHotkeys } from 'react-hotkeys-hook'
import { useReactToPrint } from 'react-to-print'
import { toast } from 'sonner'
import { importFromPDF, updateResume } from '@/app/resume/actions'
import exampleResume from '@/examples/en.md'
import { useAppStore } from '@/providers/app'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Tabs, TabsList, TabsTrigger } from './ui/tabs'
import { PREVIEW_CLASS } from './workbench'

export function Toolbar() {
  const pathname = usePathname()
  const { id } = useParams()

  const sidebar = useAppStore((state) => state.sidebar)
  const setSidebar = useAppStore((state) => state.setSidebar)

  const print = useReactToPrint({})
  const printHandler = useCallback(
    () => print(() => document.querySelector(`.${PREVIEW_CLASS}`)),
    [print],
  )

  useHotkeys('meta+p, ctrl+p', printHandler, {
    preventDefault: true,
    enableOnFormTags: ['input', 'textarea', 'select'],
  })

  useHotkeys('meta+1, ctrl+1', () => setSidebar('editor'), {
    preventDefault: true,
    enableOnFormTags: ['input', 'textarea', 'select'],
  })

  useHotkeys('meta+2, ctrl+2', () => setSidebar('chat'), {
    preventDefault: true,
    enableOnFormTags: ['input', 'textarea', 'select'],
  })

  if (!pathname.startsWith('/resume') || typeof id !== 'string') return null

  return (
    <div className="flex items-center">
      <Tabs
        className="mr-2"
        value={sidebar}
        onValueChange={(value) =>
          setSidebar(value as WorkbenchSlice['sidebar'])
        }
      >
        <TabsList className="">
          <TabsTrigger value="editor" title="Editor(⌘1)">
            {/* <SquarePen /> */}
            Editor
          </TabsTrigger>
          <TabsTrigger value="chat" title="Chat(⌘2)">
            {/* <BotMessageSquare /> */}
            Chat
          </TabsTrigger>
        </TabsList>
      </Tabs>

      <Button
        size="sm"
        variant="ghost"
        title="Import from PDF"
        className="cursor-pointer"
        asChild
      >
        <Label htmlFor="pdf">
          Import
          <Input
            id="pdf"
            type="file"
            accept="application/pdf"
            className="hidden"
            onChange={async (e) => {
              const file = e.target.files?.[0]
              if (file) {
                toast.promise(
                  async () => {
                    const content = await importFromPDF(file, exampleResume)

                    if (!content.trim()) {
                      throw new Error('No content found in PDF')
                    }

                    await updateResume(id, {
                      content,
                    })
                  },
                  {
                    loading: `Importing from PDF`,
                    success: 'Imported successfully',
                    error: `Failed to import from PDF. Please try again.`,
                  },
                )
              }
            }}
          />
        </Label>
      </Button>

      <Button
        size="sm"
        variant="ghost"
        className="cursor-pointer"
        title="Export PDF (⌘P)"
        onClick={printHandler}
      >
        Export
      </Button>
    </div>
  )
}
