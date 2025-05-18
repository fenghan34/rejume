'use client'

import type { WorkbenchSlice } from '@/stores/workbench-slice'
import { BotMessageSquare, Download, SquarePen } from 'lucide-react'
import { useParams, usePathname } from 'next/navigation'
import { useCallback } from 'react'
import { useHotkeys } from 'react-hotkeys-hook'
import { useReactToPrint } from 'react-to-print'
import { useAppStore } from '@/providers/app'
import { Button } from './ui/button'
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

  if (!pathname.startsWith('/resume') || !id) return null

  return (
    <>
      <Tabs
        value={sidebar}
        onValueChange={(value) =>
          setSidebar(value as WorkbenchSlice['sidebar'])
        }
      >
        <TabsList className="">
          <TabsTrigger value="editor" title="Editor(⌘1)">
            <SquarePen />
          </TabsTrigger>
          <TabsTrigger value="chat" title="Chat(⌘2)">
            <BotMessageSquare />
          </TabsTrigger>
        </TabsList>
      </Tabs>

      <Button
        variant="ghost"
        className="cursor-pointer size-8"
        title="Export PDF (⌘P)"
        onClick={printHandler}
      >
        <Download />
      </Button>
    </>
  )
}
